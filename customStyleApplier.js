// TODO: host rules online
// TODO: about:home -like pages don't trigger for some reason. I blame manifest.json.
// TODO: switch browser.storage.local -> browser.storage.local


const __debugMode = 0;

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


let storageTest = browser.storage.local.set({
	'color': 'black'
})

storageTest.then((err) => {
	if (!err) {
		let storageItem = browser.storage.local.get('color');
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

///////////////////////////////////



///




function getHostnameRules(hostname, callback) {
	browser.storage.local.get(hostname)
	.then((result) => callback(result));
}


let checkLoaded = () => {
	return document.readyState === "complete" || document.readyState === "interactive";
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

// if (hostname in ruleObjects) {
// 	if (__debugMode) {
// 		console.log(`${hostname} found in ruleObjects`);
// 	}
// 	// I  am considering making a more granular process on a 
// 	// per-element basis, but that would take more time and browsers 
// 	// manage additional CSS rules well anyway. (or even with 
// 	// individual rule-pieces, but a similar argument applies)

// 	let cssString = ruleObjectsToCssString(ruleObjects, hostname);
// 	let cssApplyResult = applyCssString(cssString);
// }

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

   //  let checkDefaultPromise = browser.storage.local.get(defaultKey);

   //  checkDefaultPromise.then((res) => {
   //  	if (!res[defaultKey]) {
			// browser.storage.local.set({
			// 	defaultKey: defaultRuleString
			// }).then((setError) => {
			// 	if (setError) {
			// 		console.log(`debug Google sync.set failed:`);
			// 		console.log(setResult);	
			// 	} else {
			// 		console.log(`debug Google sync.set succeeded with rules:`);
			// 		console.log(defaultRuleString);
			// 	}

			// 	// if (__debugMode) {
			// 	// 	console.log(`---checkAndApplyStyles BEGIN---`);
			// 	// 	if (browser) {
			// 	// 		console.log(`browser:`);
			// 	// 		console.log(browser);			
			// 	// 	}
			// 	// 	console.log("browser.storage:");
			// 	// 	console.log(browser.storage);
			// 	// 	console.log(`browser.storage.local.get(${hostname})`);
			// 	// 	browser.storage.local.get(hostname)
			// 	// 	.then((result) => {
			// 	// 		console.log(`.get result (toString and object): `)
			// 	// 		console.log(result.toString());
			// 	// 		console.log(JSON.stringify(result));
			// 	// 		console.log(result);
			// 	// 		console.log(`------------`)
			// 	// 	})
			// 	// }

			// 	if (__debugMode) {
			// 		console.log(`${hostname} == www.google.com`);
			// 		console.log(hostname == 'www.google.com');
			// 	}

			// 	browser.storage.local.get(hostname)
			// 	.then(hostRules => {
			// 		if(!hostRules) {
			// 			if (__debugMode) {
			// 				console.log(`${hostname} not found in browser.storage.local rules`); 
			// 			} 
			// 			// TODO?
			// 		} else {
			// 			if (__debugMode) {
			// 				console.log(`${hostname} rules were found in browser.storage.local rules`); 
			// 				console.log(`hostRules:`);
			// 				console.log(hostRules);
			// 				console.log(`JSON.parse(hostRules[hostname])`);
			// 				console.log(JSON.parse(hostRules[hostname]));
			// 				// setText(browser.storage.local.get(hostname));
			// 			}
			// 			//TODO: JSON.parse causes problems with get results.
			// 			let tempRuleObject = JSON.parse(hostRules[hostname]);
			// 			let cssString = ruleContentToCssStringOne(tempRuleObject['content']);
			// 			let cssApplyResult = applyCssString(cssString);
			// 		}
			// 	});
			// });

   //  	} else {
			// if (__debugMode) {
			// 		console.log(`${hostname} == www.google.com`);
			// 		console.log(hostname == 'www.google.com');
			// 	}

			// 	browser.storage.local.get(hostname)
			// 	.then(hostRules => {
			// 		if(!hostRules) {
			// 			if (__debugMode) {
			// 				console.log(`${hostname} not found in browser.storage.local rules`); 
			// 			} 
			// 			// TODO?
			// 		} else {
			// 			if (__debugMode) {
			// 				console.log(`${hostname} rules were found in browser.storage.local rules`); 
			// 				console.log(`hostRules:`);
			// 				console.log(hostRules);
			// 				console.log(`JSON.parse(hostRules[hostname])`);
			// 				console.log(JSON.parse(hostRules[hostname]));
			// 				// setText(browser.storage.local.get(hostname));
			// 			}
			// 			//TODO: JSON.parse causes problems with get results.
			// 			let tempRuleObject = JSON.parse(hostRules[hostname]);
			// 			let cssString = ruleContentToCssStringOne(tempRuleObject['content']);
			// 			let cssApplyResult = applyCssString(cssString);
			// 		}
			// 	});
   //  	}
   //  })

	if (__debugMode) {
		console.log(`${hostname} == www.google.com`);
		console.log(hostname == 'www.google.com');
	}

	browser.storage.local.get(hostname)
	.then(hostRules => {
		if(!hostRules || !hostRules[hostname]) {
			if (__debugMode) {
				console.log(`${hostname} not found in browser.storage.local rules`); 
			} 
			// TODO?
		} else {
			if (__debugMode) {
				console.log(`${hostname} rules were found in browser.storage.local rules`); 
				console.log(`hostRules:`);
				console.log(hostRules);
				console.log(`JSON.parse(hostRules[hostname])`);
				console.log(JSON.parse(hostRules[hostname]));
				// setText(browser.storage.local.get(hostname));
			}
			//TODO: JSON.parse causes problems with get results.
			let tempRuleObject = JSON.parse(hostRules[hostname]);
			let cssString = ruleContentToCssStringOne(tempRuleObject['content']);
			let cssApplyResult = applyCssString(cssString);
		}
	});

	// if(!browser.storage.local.get(hostname)) {
	// 	if (__debugMode) {
	// 		console.log(`${hostname} not found in browser.storage.local rules`); 
	// 		console.log(browser.storage.local);
	// 	} 
	// 	// TODO?
	// } else {
	// 	if (__debugMode) {
	// 		console.log(`${hostname} WAS found in browser.storage.local rules`); 
	// 		console.log(JSON.parse(browser.storage.local.get(hostname)));
	// 		// setText(browser.storage.local.get(hostname));
	// 	}
	// 	let tempRuleObject = JSON.parse(browser.storage.local.get(hostname));
	// 	let cssString = ruleContentToCssStringOne(tempRuleObject['content']);
	// 	let cssApplyResult = applyCssString(cssString);
	// }

}

/*

19

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

  //TODO global hostname as opposed to passed hostname

  let setRulePromise = browser.storage.local.set({
    [tempHostname]: ruleString
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


//////////////////////////////////////



//// MESSAGE LISTENERS ////////////////

browser.runtime.onMessage.addListener((message) => {
	if (message.command === "saveRules") {
	  saveRulesAsync(message.hostname, message.ruleString, 
	  	(() => {console.log(`saveRulesAsync DONE`);})
	  	);
	}
});

///////////////////////////////////////


window.onload = checkAndApplyStyles;


