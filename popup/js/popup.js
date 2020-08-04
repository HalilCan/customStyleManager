// TODO: refresh on active tab change

const __debugMode = 1;

/// PRODUCTION GLOBALS AND CONSTANTS ///

let cssText = "";
let ruleObject;

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
        "body" : "background-color: black; color: white'",
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

    localStorage.setItem(hostname, tempStorageObject);
  } else {
    tempStorageObject = JSON.parse(localStorage.getItem(hostname));
    
    tempStorageObject.content = cssObject;
    tempStorageObject.information.author = author;
    tempStorageObject.information.updateDate = currentDate;

    localStorage.setItem(hostname, tempStorageObject);
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


if (__debugMode) {
  console.log(`---storageTest---`); 
}
if(!localStorage.getItem('www.google.com')) {
  populateStorage();
}
if (__debugMode) {
  console.log(`getting from storage`);
  console.log(`JSON.parse(localStorage.getItem('rules')) = `);
}


if (__debugMode) {
  console.log(ruleObjects);
  console.log(`getRules("www.google.com") =`);
  console.log(getRules("www.google.com"));
  console.log(`-------`); 
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

  let cssString = "";

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


      cssString += `${key} {\n${ruleText}\n}\n\n`;
      }
  }

  return cssString;
};

function cssTextToRules(styleContent) {
  let doc = document.implementation.createHTMLDocument(""),
  styleElement = document.createElement("style");

  styleElement.textContent = styleContent;
  // the style will only be parsed once it is added to a document
  doc.body.appendChild(styleElement);

  let cssRules = styleElement.sheet.cssRules;

  if (__debugMode) {
    console.log(`---cssTextToRules---`);
    console.log(styleContent);
    console.log(cssRules);
    console.log(`--------------`)
  }

  // doc.body.removeChild(styleElement);
  return cssRules;

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
  if (ruleObject == undefined) {
    let
  }

  cssText = ruleContentToCssString(ruleObject);
  
  if(cssText == "") {
    setText(`${hostname}: There are no custom rules for this page.`);
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

    listenForClicks();

  })

}

//////////////////////////////////

window.onload = getTabUrl;