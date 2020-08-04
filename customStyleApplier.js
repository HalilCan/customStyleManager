// TODO: host rules online
// TODO: about:home -like pages don't trigger for some reason. I blame manifest.json.
// TODO: switch localStorage -> storage.sync


const __debugMode = 1;

let rulesFile = rules;

let ruleObjects = rulesFile["ruleObjects"];

const hostname = window.location.hostname;
if (hostname == "") {
	hostname = window.location.href;
}

if (__debugMode) {
 	console.log(`window.location:`);
 	console.log(window.location);
	console.log(`hostname: ${hostname}`);
}


///

if(!localStorage.getItem('www.google.com')) {
	populateStorage();
}

// setStyles();

function populateStorage() {
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

	// localStorage.setItem('bgcolor', document.getElementById('bgcolor').value);
	// localStorage.setItem('font', document.getElementById('font').value);
	// localStorage.setItem('image', document.getElementById('image').value);
}

function getHostnameRules(hostname) {
	return localStorage.getItem(hostname);
}

function setStyles() {
	// var currentColor = localStorage.getItem('bgcolor');
	// var currentFont = localStorage.getItem('font');
	// var currentImage = localStorage.getItem('image');

	// document.getElementById('bgcolor').value = currentColor;
	// document.getElementById('font').value = currentFont;
	// document.getElementById('image').value = currentImage;

	// htmlElem.style.backgroundColor = '#' + currentColor;
	// pElem.style.fontFamily = currentFont;
	// imgElem.setAttribute('src', currentImage);


}

////







let checkLoaded = () => {
	return document.readyState === "complete" || document.readyState === "interactive";
};

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