const __debugMode = 0;

let ruleText = "";
let rulesFile = "empty";
let ruleObjects = "empty";
let defaultRuleFile = rules;

let textBox = document.getElementById("popup-textarea");
let applyButton = document.getElementById("apply-button");
let resetButton = document.getElementById("reset-button");

if (__debugMode) {
  console.log("ALIVE");
}

textBox.value = "111";

let setText = (newText) => {
  if (__debugMode) {
    console.log(`---setText---`);
    console.log(newText);
    console.log(`--------`); 
  }

  console.log(defaultRuleFile);

  textBox.value = newText;
}

let loadRules = (e) => {
  if (__debugMode) {
    console.log(`---loadRules---`);
    console.log(e);
    console.log(`--------`); 
  }
  /*  
  if (hostname in ruleObjects) {
    if (__debugMode) {
      console.log(`${hostname} found in ruleObjects`);
    }
    // I  am considering making a more granular process on a 
    // per-element basis, but that would take more time and browsers 
    // manage additional CSS rules well anyway. (or even with 
    // individual rule-pieces, but a similar argument applies)

    let cssString = ruleObjectsToCssString(ruleObjects, hostname);
    let cssApplyResult = applyCssString(cssString);
  }
  */
  
  setText("123");
}


let listenForClicks = () => {
  document.addEventListener("click", (e) => {
    if (__debugMode) {
      console.log(e);
      console.log(e.target.id); 
    }

    let targetId = e.target.id;

    if (targetId == "apply-button") {
      setText(targetId);
    } else if (targetId == "reset-button") {
      setText(targetId + "2323");
    }
  })
};

window.onload = listenForClicks;


/*

const hostname = window.location.hostname;
if (hostname == "") {
  hostname = window.location.href;
}

if (__debugMode) {
  console.log(`window.location:`);
  console.log(window.location);
  console.log(`hostname: ${hostname}`);
}

let setText = (newText) => {
  textBox.value = newText;
  alert("1");
}

let ruleObjectsToCssString = (ruleObjects, hostname) => {
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

let loadRules = () => {
  rulesFile = rules;
  ruleObjects = rulesFile["ruleObjects"];
  /*  
  if (hostname in ruleObjects) {
    if (__debugMode) {
      console.log(`${hostname} found in ruleObjects`);
    }
    // I  am considering making a more granular process on a 
    // per-element basis, but that would take more time and browsers 
    // manage additional CSS rules well anyway. (or even with 
    // individual rule-pieces, but a similar argument applies)

    let cssString = ruleObjectsToCssString(ruleObjects, hostname);
    let cssApplyResult = applyCssString(cssString);
  }
  */
  /*
  let cssString = ruleObjectsToCssString(ruleObjects, hostname);

  setText(cssString);

  textBox.content = 
  console.log(`popup loadRules:`);
  console.log(rulesFile);
}

let resetTextBox = (e) => {

}

let applyTextBox = (e) => {

}

window.onload = loadRules;



/*
    function beastify(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        let url = beastNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "beastify",
          beastURL: url
        });
      });
    }
*/
    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
     /*
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    */