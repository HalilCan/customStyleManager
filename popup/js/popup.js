// TODO: refresh on active tab change

const __debugMode = 1;

/// PRODUCTION GLOBALS AND CONSTANTS ///

let cssText = "";
let ruleObject = {};

let textBox = document.getElementById("popup-textarea");
let applyButton = document.getElementById("apply-button");
let resetButton = document.getElementById("reset-button");

let hostnameFound = 0;
let hostname;

let tab;
let tabUrl;

let cssWasInserted = 0;
let insertedCss = "";

let author = "taltavaran";


if (__debugMode) {
  console.log("ALIVE");
}

////////////////////////////////////////



/// STORAGE INTEGRATION ///

function populateStorage() {
  if (__debugMode) {
    console.log(`populateStorage() BEGIN`);
  }

  let defaultKey = "www.google.com";
  let defaultRules = {
      "content": {
        "body" : "background-color: black; color: white;",
        ".hp" : "background-color: blue; border: 1px solid yellow;",
        "#searchform" : "background-color: red;"
      },
      "information": {
        "author": "",
        "creationDate": "",
        "updateDate": "",
        "votes": "0"
      }
    };

  let defaultRulesText = JSON.stringify(defaultRules);

  localStorage.setItem(defaultKey, defaultRulesText);

  if (__debugMode) {
    console.log(`populateStorage() END`); 
  }

  // localStorage.setItem('bgcolor', document.getElementById('bgcolor').value);
  // localStorage.setItem('font', document.getElementById('font').value);
  // localStorage.setItem('image', document.getElementById('image').value);
}


function setRules(hostname, cssText) {
  let cssObject = cssTextToRules(cssText);
  console.log(`cssObject in setRules:`);
  console.log(cssObject);

  let tempStorageObject;
  let currentDate = printDate();


  if (!localStorage.getItem(hostname)) {
    tempStorageObject = {
      "content": cssObject,
      "information": {
        "author": author,
        "creationDate": currentDate,
        "updateDate": currentDate,
        "votes": "0"
      }
    }

    localStorage.setItem(hostname, JSON.stringify(tempStorageObject));
  } else {
    tempStorageObject = JSON.parse(localStorage.getItem(hostname));

    tempStorageObject.content = cssObject;
    tempStorageObject.information.author = author;
    tempStorageObject.information.updateDate = currentDate;

    localStorage.setItem(hostname, JSON.stringify(tempStorageObject));
  }
}

function getRules(hostname) {
  if (__debugMode) {
    console.log(`getRules(${hostname}) BEGIN`); 
  }
  
  if(!localStorage.getItem(hostname)) {
    return "";
  }

  let tempRuleObject = JSON.parse(localStorage.getItem(hostname));
  if (__debugMode) {
    console.log(`tempRuleObject in getRules:`);
    console.log(tempRuleObject);
  }

  ruleObject = tempRuleObject;
  return tempRuleObject;
}

///////////////////////////



/// DATE FUNCTION ///

function printDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();

  return mm + '/' + dd + '/' + yyyy;
}

/////////////////////



/// TEXTBOX INTERACTION ///


let setText = (newText) => {
  if (__debugMode) {
    console.log(`---setText---`);
    console.log(newText);
    console.log(`--------`); 
  }

  textBox.value = newText;
}

let getText = () => {
  return textBox.value;
}

setText("Oops. You should not be seeing this.");

//////////////////////////



/// JSON OBJECT TO CSS STRING CONVERTER ///

function ruleContentToCssString (ruleObject) {
  if (hostnameFound == 0) {
    return "";
  }

  let tempCssString = "";

  let ruleContent = ruleObject["content"];
  if (__debugMode) {
    console.log(`ruleContent:`);
    console.log(ruleContent);
  }

  for (key in ruleContent) {
    //The nested if makes sure that you don't enumerate over properties in the prototype chain of the object (which is the behaviour you almost certainly want). You must use
    if (Object.prototype.hasOwnProperty.call(ruleContent, key)) {
      let ruleText = ruleContent[key];
      if (__debugMode) {
        console.log("ruleText:");
        console.log(key, ruleText);
      }


      tempCssString += `${key} {\n${ruleText}\n}\n\n`;
      }
  }

  return tempCssString;
};

function isValidSelectorChar(code) {
  return  ((code > 47 && code < 58) || // numeric (0-9)
          (code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123) || // lower alpha (a-z)
          (code == 46) || (code == 35)); // . 46, # 35 
}

function isOpeningBrace(charcode) {
  // { 123  
  return (charcode == 123);
}

function isClosingBrace(charcode) {
  // } 125   
  return (charcode == 125);
}

function cssTextToRules(styleContent) {
  if (__debugMode) {
    console.log(`cssTextToRules(${styleContent})`);
  }

  let tempObj = {};

  let inPara = 0; //just accept everything in "paragraph"
  let inSelector = 0;

  let tempKey = "";
  let tempValue = "";
  let ch;

  for (let i = 0 ; i < styleContent.length; i ++) {
    ch = styleContent.charCodeAt(i);

    if(inPara == 0 && inSelector == 0) {
      if (isValidSelectorChar(ch)) {
        inPara = 0;
        inSelector = 1;
        tempKey += String.fromCharCode(ch);
        continue;
      }
    } else if (inPara == 0 && inSelector == 1) {
      if (isValidSelectorChar(ch)) {
        tempKey += String.fromCharCode(ch);
      } else if (isOpeningBrace(ch)) {
        inPara = 1;
        inSelector = 0;
        continue;
      } else {
        inPara = 1;
        inSelector = 0;        
        //TODO: What would this scenario look like?
      }
      continue;
    } else if (inPara == 1 && inSelector == 0) {
      if (isOpeningBrace(ch) || isClosingBrace(ch)) {
        if (isClosingBrace(ch)) {
          inPara = 0;
          inSelector = 0;
          tempObj[tempKey] = tempValue;

          tempKey = "";
          tempValue = "";
          continue;
        } else {
          continue;
        }
      }
      tempValue += String.fromCharCode(ch);
      continue;
    }
  }

  if (__debugMode) {
    console.log(`cssTextToRules result:`);
    console.log(tempObj);
    console.log(JSON.stringify(tempObj));
    console.log(`---------------------`);
  }
  return tempObj;
};

////////////////////////////////////////



/// POPUP-TAB (ACTIVE) CSS INSERTION AND DELETION ///

let insertCss = (cssString) => {
  browser.tabs.insertCSS({code: cssString}).then(() => {
    insertedCss = cssString;
    // let url = beastNameToURL(e.target.textContent);
    // browser.tabs.sendMessage(tabs[0].id, {
    //   command: "beastify",
    //   beastURL: url
    // });
  });
}

let removeCss = (cssString) => {
  browser.tabs.removeCss({code: cssString}).then(() => {
    insertedCss = "";
  });
}

//////////////////////////////////////////////////////



////// ASYNC FUNCTION SERIES BEGIN ///////

let listenForClicks = () => {
  if (cssText == "") {
    // TODO
  } else {
    ruleObject = JSON.parse(cssText);    
  }

  cssText = ruleContentToCssString(ruleObject);
  
  if (cssText == "") {
    if (__debugMode) {
      console.log(`custom rules for ${hostname} not found`);
      console.log(ruleObject);
      setText(JSON.stringify(ruleObject));
    } else {
      setText(`${hostname}: There are no custom rules for this page.`); 
    }
  } else {
    setText(cssText); 
  }

  document.addEventListener("click", (e) => {
    if (__debugMode) {
      console.log(e);
      console.log(e.target.id); 
    }

    let targetId = e.target.id;

    if (targetId == "apply-button") {

      if (cssWasInserted) {
        removeCss(insertedCss);
      }

      let newText = getText();

      insertCss(newText);
      setRules(hostname, newText);
      // TODO: timer-based color fade reset button for "undo functionality"
    } else if (targetId == "reset-button") {
      setText(cssText);
    }
  })
};


function getTabUrl() {
  browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    activeTab = tabs[0]; // Safe to assume there will only be one result
    
    if (__debugMode) {
      console.log(`activeTab.url:`);
      console.log(activeTab.url);      
    }

    return activeTab;
  }, console.error)
  .then((activeTab) => {
    tab = activeTab;
    tabUrl = new URL(activeTab.url);
    hostname = tabUrl.hostname;

    if (__debugMode) {
      console.log(`activeTab`);
      console.log(activeTab);
    }
    if (__debugMode) {
      console.log(`hostname: ${hostname}`);
    }

    if (localStorage.getItem(hostname)) {
      hostnameFound = 1;
    }

    if (__debugMode) {
      console.log(`---storageTest---`); 
    }
    if(!localStorage.getItem('www.google.com')) {
      if (__debugMode) {
        console.log(`www.google.com not found in localStorage rules`); 
      }
      populateStorage();
    } else {
      if (__debugMode) {
        console.log(`www.google.com WAS found in localStorage rules`); 
        console.log(JSON.parse(localStorage.getItem(`www.google.com`)));
      }
    }
    if(!localStorage.getItem(hostname)) {
      if (__debugMode) {
        console.log(`${hostname} not found in localStorage rules`); 
      } 
      // TODO?
    } else {
      if (__debugMode) {
        console.log(`${hostname} WAS found in localStorage rules`); 
        console.log(JSON.parse(localStorage.getItem(hostname)));
        setText(localStorage.getItem(hostname));
      }
      cssText = localStorage.getItem(hostname);
    }

    listenForClicks();

  })

}

//////////////////////////////////

window.onload = getTabUrl;