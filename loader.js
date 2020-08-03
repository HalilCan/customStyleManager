
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