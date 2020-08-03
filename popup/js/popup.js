const __debugMode = 1;

let cssText = "";
let rulesFile = rules;
let ruleObjects = rulesFile["ruleObjects"];

let textBox = document.getElementById("popup-textarea");
let applyButton = document.getElementById("apply-button");
let resetButton = document.getElementById("reset-button");

let hostnameFound = 0;
let hostname;

let tab;
let tabUrl;

if (__debugMode) {
  console.log("ALIVE");
}


let setText = (newText) => {
  if (__debugMode) {
    console.log(`---setText---`);
    console.log(newText);
    console.log(`--------`); 
  }

  textBox.value = newText;
}


setText("1111");


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


let applyCssString = (cssString) => {
  let newStyleSheet = document.createElement("style");
  newStyleSheet.type = "text/css";
  newStyleSheet.appendChild(document.createTextNode(cssString));
  document.head.appendChild(newStyleSheet);


  if (__debugMode) {
    console.log(`---applyCssString---`);
    console.log(`newStyleSheet:`);
    console.log(newStyleSheet); 
    console.log(`---------------`); 
  }
};


let parseCss = (styleContent) => {
  let doc = document.implementation.createHTMLDocument(""),
  styleElement = document.createElement("style");

  styleElement.textContent = styleContent;
  // the style will only be parsed once it is added to a document
  doc.body.appendChild(styleElement);

  let cssRules = styleElement.sheet.cssRules;

  if (__debugMode) {
    console.log("parsed CSS rules:");
    console.log(cssRules);
    console.log(cssRules[0]);
    console.log(cssRules[0].cssText);
  }

  // doc.body.removeChild(styleElement);
  return cssRulesToText(cssRules);
};


let cssRulesToText = (cssRules) => {
  let string = "";
  for (let i = 0; i < cssRules.length; i ++) {
    string += cssRules[i].cssText;
    string += `\n\n`;
  }
  if(__debugMode) {
    console.log(`---cssRulesToText---`);
    console.log(cssRules);
    console.log(string);
    console.log(`---------`);
  }
  return string;
};


let cssTextToRules = (styleContent) => {
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




let listenForClicks = () => {
  cssText = ruleObjectsToCssString(ruleObjects, hostname);
  
  if(cssText == "") {
    setText(`${hostname} not found in rules`);
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
      setText(targetId);
    } else if (targetId == "reset-button") {
      setText = cssText;
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


window.onload = getTabUrl;
