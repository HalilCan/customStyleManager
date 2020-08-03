// TODO: host rules online

const __debugMode = 1;

let rulesFile = {
	"ruleObjects": {
		"www.google.com" : {
			"content": {
				"body" : "border: 5px solid red;",
				".hp" : "background-color: blue;",
				"#searchform" : "background-color: black;"
			},
			"information": {
				"author": "",
				"creationDate": "",
				"updateDate": "",
				"votes": "0"
			}
		}
	}
}

let applyStyle = () => {
	let ruleObjects = rulesFile["ruleObjects"];

	const hostname = window.location.hostname;
	if (__debugMode) {
	// 	console.log(`window.location:`);
	// 	console.log(window.location);
		console.log(`hostname: ${hostname}`);
	}

	if (hostname in ruleObjects) {
		if (__debugMode) {
			console.log(`${hostname} found in ruleObjects`);
		}
		// I  am considering making a more granular process on a 
		// per-element basis, but that would take more time and browsers 
		// manage additional CSS rules well anyway. (or even with 
		// individual rule-pieces, but a similar argument applies)

		let style = document.createElement("customStylesheet");
		style.type = "text/css";

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


				cssString += `${key} {\n 
					${ruleText}\n
				}\n\n`;
	    	}
		}

		style.appendChild(document.createTextNode(cssString));
		document.head.appendChild(style);
	}	
}

window.onload = applyStyle;


