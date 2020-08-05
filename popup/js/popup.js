// TODO: refresh on active tab change

const __debugMode = 0;

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

// function populateStorage() {
//   if (__debugMode) {
//     console.log(`populateStorage() BEGIN`);
//   }

//   let defaultKey = "www.google.com";
//   let defaultRules = {
//       "content": {
//         "body" : "background-color: black; color: white;",
//         ".hp" : "background-color: blue; border: 1px solid yellow;",
//         "#searchform" : "background-color: red;"
//       },
//       "information": {
//         "author": "",
//         "creationDate": "",
//         "updateDate": "",
//         "votes": "0"
//       }
//     };

// if (!browser.storage.local.get(defaultKey)) {
//     let defaultRulesText = JSON.stringify(defaultRules);

//     browser.storage.local.set({
//       defaultKey: defaultRulesText
//     });

//     console.log(browser.storage.local.get(defaultKey));
//   }

//   if (__debugMode) {
//     console.log(`populateStorage() END`); 
//   }

//   // browser.storage.local.set('bgcolor', document.getElementById('bgcolor').value);
//   // browser.storage.local.set('font', document.getElementById('font').value);
//   // browser.storage.local.set('image', document.getElementById('image').value);
// }


function saveRulesAsync(hostname, ruleString, callback) {
  if (__debugMode) {
    console.log(`saveRulesAsync() BEGIN WITH ARGS:`);
    console.log(hostname);
    console.log(ruleString);
    console.log(callback);
    console.log(`-----------`)
  }


  let setRulePromise = browser.storage.local.set({
    hostname: ruleString
  });

  setRulePromise.then((err) => {
    if (err) {
      console.log(`error in setRulePromise > err`);
      console.log(err);
    } else {
      console.log(`saveRulesAsync > setRulePromise success.`);
      callback();
    }
  })
}

function setRules(activeTab, hostname, cssText, callback) {
  hostname = hostname.toString();


  let cssObject = cssTextToRules(cssText);
  if (__debugMode) {
    console.log(`cssObject in setRules:`);
    console.log(cssObject); 
  }

  let tempStorageObject;
  let currentDate = printDate();

  let getHostnamePromise = browser.storage.local.get(hostname);

  getHostnamePromise.then((res) => {
    if (__debugMode) {
      console.log(`setRules > getHostnamePromise > res`);
      console.log(res);
    }

    if (!res[hostname]) {
      if (__debugMode) {
        console.log(`${hostname} NOT found in browser.storage.local in setRules`);
      }

      tempStorageObject = {
        "content": cssObject,
        "information": {
          "author": author,
          "creationDate": currentDate,
          "updateDate": currentDate,
          "votes": "0"
        }
      }

      let ruleString = JSON.stringify(tempStorageObject);

      browser.tabs.sendMessage(activeTab.id, {
        command: "saveRules",
        hostname: hostname,
        ruleString: ruleString
      });

      // saveRulesAsync(hostname, ruleString, callback);
      //TODO: handle async
    } else {

      if (__debugMode) {
        console.log(`${hostname} was found in browser.storage.local in setRules`);
        console.log(`existing ${hostname} rules:`);
        console.log(JSON.parse(res[hostname]));
      }

      //TODO: check if this fits
      tempStorageObject = JSON.parse(res[hostname]);

      tempStorageObject.content = cssObject;
      tempStorageObject.information.author = author;
      tempStorageObject.information.updateDate = currentDate;

      let ruleString = JSON.stringify(tempStorageObject);

      browser.tabs.sendMessage(activeTab.id, {
        command: "saveRules",
        hostname: hostname,
        ruleString: ruleString
      });

      // saveRulesAsync(hostname, ruleString, callback);
      //TODO: handle async
    }
  });
}

// function getRules(hostname) {
//   if (__debugMode) {
//     console.log(`getRules(${hostname}) BEGIN`); 
//   }
  
//   if(!browser.storage.local.get(hostname)) {
//     return "";
//   }

//   let tempRuleObject = JSON.parse(browser.storage.local.get(hostname));
//   if (__debugMode) {
//     console.log(`tempRuleObject in getRules:`);
//     console.log(tempRuleObject);
//   }

//   ruleObject = tempRuleObject;
//   return tempRuleObject;
// }

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

setText("Oops. You should not be seeing this. Try reopening the window.");

//////////////////////////



/// JSON OBJECT TO CSS STRING CONVERTER ///

function ruleContentToCssString (ruleContent) {
  if (__debugMode) {
    console.log(`ruleContentToCssString(`);
    console.log(ruleContent);
    console.log(`-------`);

  }

  if (hostnameFound == 0) {
    return "";
  }

  let tempCssString = "";

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


      tempCssString += `${key} {${ruleText}}\n\n`;
      }
  }

  return tempCssString;
};


/// CSS PARSING (INTO VALID OBJECTS) ///

function isValidSelectorChar(code) {
  return  ((code > 47 && code < 58) || // numeric (0-9)
          (code > 64 && code < 91) || // upper alpha (A-Z)
          (code > 96 && code < 123) || // lower alpha (a-z)
          (code == 46) || (code == 35) || // . 46, # 35 
          (code == 95) || (code == 45)); // _ and -
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

  let newlineAdded = 0;

  for (let i = 0 ; i < styleContent.length; i ++) {
    ch = styleContent.charCodeAt(i);
    if ((ch == 10 || ch == 13) && inPara == 1) {
      if (newlineAdded == 0) {
        tempValue += '\n';
        newlineAdded = 1;
        continue;
      } else {
        continue;
      }
    } else {
      newlineAdded = 0;
    }

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

////////////////////////////////////////



/// POPUP-TAB (ACTIVE) CSS INSERTION AND DELETION ///

let insertCss = (cssString) => {
  if (__debugMode) {
    console.log(`insertCss(`);
    console.log(cssString);
  }
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
  if (insertedCss != "") {
    browser.tabs.removeCss({code: insertedCss}).then(() => {
      insertedCss = "";
    }); 
  }
}

//////////////////////////////////////////////////////



////// ASYNC FUNCTION SERIES BEGIN ///////

let listenForClicks = () => {
  if (__debugMode) {
    console.log(`listenForClicks BEGIN`);
    console.log(ruleObject);
  }

  cssText = ruleContentToCssString(ruleObject['content']);

  if (__debugMode) {
    console.log(`listenForClicks > cssText`);
    console.log(cssText);
  }
  
  if (cssText == "") {
    if (__debugMode) {
      console.log(`custom rules for ${hostname} not found`);
      console.log(ruleObject);
      // setText(JSON.stringify(ruleObject));
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
      applyRules();      
    } else if (targetId == "reset-button") {
      // TODO: timer-based color fade reset button for "undo functionality"
      setText(cssText);
    }
  })
};

function applyRules() {
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

    if (cssWasInserted) {
      removeCss(insertedCss);
      //TODO I changed removeCss to use global insertedCss!
    }

    let newText = getText();

    insertCss(newText);
    setRules(activeTab, hostname, newText, (res) => { 
      if (__debugMode) {
        console.log(`applyRules > setRules > saveRulesAsync callback ended:`);
      }
    });
  });
}

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

    let getHostnamePromise = browser.storage.local.get(hostname);

    getHostnamePromise.then((res) => {
      if (__debugMode) {
        console.log(`getHostnamePromise.then =>`);
        console.log(res);
      }

      if (res && res[hostname]) {
        //TODO: check this
        hostnameFound = 1;
      }

      // if (__debugMode) {
      //   console.log(`---storageTest---`); 
      // }
      // if(!browser.storage.local.get('www.google.com')) {
      //   if (__debugMode) {
      //     console.log(`www.google.com not found in browser.storage.local rules`); 
      //   }
      //   populateStorage();
      // } else {
      //   if (__debugMode) {
      //     console.log(`www.google.com WAS found in browser.storage.local rules`); 
      //     console.log(JSON.parse(browser.storage.local.get(`www.google.com`)));
      //   }
      // }

      if(!res[hostname]) {
        if (__debugMode) {
          console.log(`${hostname} not found in browser.storage.local rules`); 
        } 
        // TODO?
      } else {
        if (__debugMode) {
          console.log(`${hostname} WAS found in browser.storage.local rules`); 
          console.log(hostname);
          console.log(JSON.parse(res[hostname]));
          // setText(browser.storage.local.get(hostname));
        }
        ruleObject = JSON.parse(res[hostname]);
      }

      listenForClicks();
    })
  })

}

//////////////////////////////////

window.onload = getTabUrl;