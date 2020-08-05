// TODO: host rules online

const __debugMode = 0;
const styleSheetId = "userStyleSheet-CSM";

let loadOnloadFired = 0;


const hostname = window.location.hostname;
if (hostname == "") {
	hostname = window.location.href;
	hostnameFound = 1;
}

if (__debugMode) {
 	console.log(`window.location:`);
 	console.log(window.location);
	console.log(`hostname:: ${hostname}`);
}


/// SYNC STORAGE PROOF OF CONCEPT //

if (__debugMode) {
	let storageTest = browser.storage.sync.set({
		'color': 'black'
	})

	storageTest.then((err) => {
		if (!err) {
			let storageItem = browser.storage.sync.get('color');
			storageItem.then((res) => {
				console.log(res)
				console.log(`Managed color is: ${res.color}`);
			});
			storageItem.error((err) => {
				console.log(`storageItem error`);
				console.log(err);
			})
		} else {
			console.log(`storageTest error:`);
			console.log(err);
		}
	})	
}

///////////////////////////////////

function getHostnameRules(hostname, callback) {
	browser.storage.sync.get(hostname)
	.then((result) => callback(result));
}


function applyCssString (cssString) {
	let previousSheet = document.getElementById(styleSheetId);
	if (previousSheet) {
		previousSheet.disabled = true;
		previousSheet.parentNode.removeChild(previousSheet);	
	}

	let newStyleSheet = document.createElement("style");
	newStyleSheet.type = "text/css";
	newStyleSheet.id = styleSheetId;
	newStyleSheet.appendChild(document.createTextNode(cssString));
	document.head.appendChild(newStyleSheet);

	if (__debugMode) {
		console.log(`---applyCssString---`);
		console.log(`newStyleSheet:`);
		console.log(newStyleSheet);	
		console.log(`---------------`);	
	}
};


function ruleContentToCssStringOne (ruleContent) {
  if (__debugMode) {
    console.log(`ruleContentToCssStringOne(`);
    console.log(ruleContent);
    console.log(`-------`);
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


      tempCssString += `${key} {\n${ruleText}\n}\n`;
      }
  }

  return tempCssString;
};

///////////////

let checkAndApplyStyles = () => {
	loadOnloadFired = 1;

  	let defaultKey = 'www.google.com';
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
    let defaultRuleString = JSON.stringify(defaultRules);

	if (__debugMode) {
		console.log(`${hostname} == www.google.com`);
		console.log(hostname == 'www.google.com');
	}

	browser.storage.sync.get(hostname)
	.then(hostRules => {
		if(!hostRules || !hostRules[hostname]) {
			if (__debugMode) {
				console.log(`${hostname} not found in browser.storage.local rules`); 
			} 
		} else {
			if (__debugMode) {
				console.log(`${hostname} rules were found in browser.storage.local rules`); 
				console.log(`hostRules:`);
				console.log(hostRules);
				console.log(`JSON.parse(hostRules[hostname])`);
				console.log(JSON.parse(hostRules[hostname]));
			}
			let tempRuleObject = JSON.parse(hostRules[hostname]);
			let cssString = ruleContentToCssStringOne(tempRuleObject['content']);
			let cssApplyResult = applyCssString(cssString);
		}
	});

}

/*
Stackoverflow notes on why non-default variable-name keys suck:
	It's 2016, and Chrome (and Firefox, and Edge - everyone using Chrome extension model) support ES6 Computed Property Names.
	With that, the task becomes simpler:

	var storage = chrome.storage.local;
	var v1 = 'k1';

	storage.set({
	  [v1]: 's1' // Will evaluate v1 as property name
	});
	
	storage.get(v1, function(result) {
	    console.log(v1, result);
	});
THANKS ES6 I HATE THIS
*/

///////// RULE SYNC //////////////////


function saveRulesAsync(newHostname, ruleString, callback) {
  let tempHostname = newHostname.toString().valueOf();

  if (__debugMode) {
    console.log(`saveRulesAsync() BEGIN WITH ARGS:`);
    console.log(tempHostname);
    console.log(ruleString);
    console.log(callback);
    console.log(`-----------`)
  }

  let setRulePromise = browser.storage.sync.set({
    [tempHostname]: ruleString
  });

  setRulePromise.then((err) => {
    if (err) {
		console.log(`error in setRulePromise > err`);
		console.log(err);
    } else {
    	if (__debugMode) {
      		console.log(`saveRulesAsync > setRulePromise success.`);
    	}
      callback();
    }
  })
}


//////////////////////////////////////



//// MESSAGE LISTENER ////////////////

browser.runtime.onMessage.addListener((message) => {
	if (message.command === "saveRules") {
	  saveRulesAsync(message.hostname, message.ruleString, 
	  	(() => {
	  		if (__debugMode) {
	  			console.log(`saveRulesAsync DONE`);	  			
	  		}
	  	})
	  	);
	}
	if (message.command === "insertCss") {
		applyCssString(message.cssString);
	}
});

///////////////////////////////////////


// window.onload = checkAndApplyStyles;

window.addEventListener('load', function (){
	if(__debugMode) {
		console.log(`window.load event fired!`);
	}
	if (loadOnloadFired == 0) {
    	checkAndApplyStyles();		
	}
});

window.attachEvent('onload', function (){
	if(__debugMode) {
		console.log(`window.onload event fired!`);
	}
	if (loadOnloadFired == 0) {
    	checkAndApplyStyles();		
	}
});

if (loadOnloadFired == 0) {
	//which will probably be true at this stage
    checkAndApplyStyles();
}
