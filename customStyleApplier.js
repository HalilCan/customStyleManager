// TODO: host rules online
// TODO: about:home -like pages don't trigger for some reason. I blame manifest.json.

const __debugMode = 0;

/*
let rulesFile = {
	"ruleObjects": {
		"www.google.com" : {
			"content": {
				"body" : "border: 5px solid red;",
				".hp" : "background-color: yellow;",
				"#searchform" : "background-color: black;"
			},
			"information": {
				"author": "",
				"creationDate": "",
				"updateDate": "",
				"votes": "0"
			}
		},
		"about:home" : {
			"content": {
				"body" : "background-color: red;"
			},
			"information": {
				"author": "",
				"creationDate": "",
				"updateDate": "",
				"votes": "0"
			}
		}
	}
};
*/

let rulesFile = rules;

let ruleObjects = rulesFile["ruleObjects"];

const hostname = window.location.hostname;
if (hostname == "") {
	hostname = window.location.href;
}

if (__debugMode) {
// 	console.log(`window.location:`);
// 	console.log(window.location);
	console.log(`hostname: ${hostname}`);
}

let checkLoaded = () => {
	return document.readyState === "complete" || document.readyState === "interactive";
}

let loadRuleFile = () => {
	if (__debugMode) {
		console.log(`loadRuleFile begin`);
	}

	//will async cause problems?
	let ruleUrl = browser.extension.getURL(RULE_PATH);

	if (__debugMode) {
		console.log(`ruleUrl:`);
		console.log(ruleUrl);
	}

	let jsonElement = document.createElement("script");
	jsonElement.type = "text/javascript";
	jsonElement.src = ruleUrl;
	document.body.appendChild(jsonElement);

	if (__debugMode) {
		console.log(`jsonElement:`);
		console.log(jsonElement);
	}
	/*
	fetch(ruleUrl)
	.then(response => response.json())
	.then(json => {
		console.log(`loaded file:`);
		console.log(json);
		rulesFile = json;
	})
	*/
	rulesFile = JSON.parse(rules)[rules];
	//this is in fact just using another js file as a json carrier. Might fix later. Heh.
	if (__debugMode) {
		console.log(`loaded rulesFile:`);
		console.log(rulesFile);
	}
}
// loadRuleFile();

if (hostname in ruleObjects) {
	if (__debugMode) {
		console.log(`${hostname} found in ruleObjects`);
	}
	// I  am considering making a more granular process on a 
	// per-element basis, but that would take more time and browsers 
	// manage additional CSS rules well anyway. (or even with 
	// individual rule-pieces, but a similar argument applies)

	let newStyleSheet = document.createElement("style");
	newStyleSheet.type = "text/css";

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

	newStyleSheet.appendChild(document.createTextNode(cssString));
	 // newStyleSheet.innerText = cssString;
	document.head.appendChild(newStyleSheet);

	if (__debugMode) {
		console.log(`\nfinal style:`);
		console.log(newStyleSheet);		
	}
}	
