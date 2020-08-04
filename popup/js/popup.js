// TODO: refresh on active tab change

const __debugMode = 1;

/// PRODUCTION GLOBALS AND CONSTANTS ///

let cssText = "";
let ruleObjects;

let textBox = document.getElementById("popup-textarea");
let applyButton = document.getElementById("apply-button");
let resetButton = document.getElementById("reset-button");

let hostnameFound = 0;
let hostname;

let tab;
let tabUrl;

let cssWasInserted = 0;
let insertedCss = "";


if (__debugMode) {
  console.log("ALIVE");
}

////////////////////////////////////////



/// STORAGE INTEGRATION ///

function populateStorage() {
  if (__debugMode) {
    console.log(`populateStorage() BEGIN`);
  }

  let defaultRulesObj = {
    "www.google.com" : {
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
    }
  };

  let defaultRulesText = JSON.stringify(defaultRulesObj);

  localStorage.setItem('rules', defaultRulesText);

  if (__debugMode) {
    console.log(`populateStorage() END`); 
  }

  // localStorage.setItem('bgcolor', document.getElementById('bgcolor').value);
  // localStorage.setItem('font', document.getElementById('font').value);
  // localStorage.setItem('image', document.getElementById('image').value);
}


function getStorageRules() {
  if (__debugMode) {
    console.log(`getStorageRules() BEGIN`); 
  }

  ruleObjects = JSON.parse(localStorage.getItem('rules'));

  return ruleObjects;
}


function getHostnameRules(hostname) {
  if (__debugMode) {
    console.log(`getHostnameRules(${hostname}) BEGIN`); 
  }
  
  let tempRuleObject = JSON.parse(localStorage.getItem('rules'));
  if (__debugMode) {
    console.log(`tempRuleObject in getHostnameRules:`);
    console.log(tempRuleObject);
  }

  if (hostname in tempRuleObject) {
  if (__debugMode) {
    console.log(`${hostname} found in tempRuleObject:`);
    console.log(tempRuleObject[hostname]);
  }
    return tempRuleObject[hostname];
  } else {
    return `${hostname} NOT FOUND in tempRuleObject`;
  }
}


if (__debugMode) {
  console.log(`---storageTest---`); 
}
if(!localStorage.getItem('rules')) {
  populateStorage();
}
if (__debugMode) {
  console.log(`getting from storage`);
  console.log(`JSON.parse(localStorage.getItem('rules')) = `);
}

getStorageRules();
if (__debugMode) {
  console.log(ruleObjects);
  console.log(`getHostnameRules("www.google.com") =`);
  console.log(getHostnameRules("www.google.com"));
  console.log(`-------`); 
}

///////////////////////////



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

let ruleObjectsToCssString = (ruleObjects, hostname) => {
  if (hostnameFound == 0) {
    return "";
  }

  let cssString = "";

  let hostObject = ruleObjects[hostname];
  let ruleContent = hostObject["content"];
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
  if (ruleObjects == undefined) {
    getStorageRules();
  }

  cssText = ruleObjectsToCssString(ruleObjects, hostname);
  
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

    if (hostname in ruleObjects) {
      hostnameFound = 1;
    }

    listenForClicks();

  })

}

//////////////////////////////////

window.onload = getTabUrl;