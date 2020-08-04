// const __debugMode = 1;

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

	return JSON.parse(localStorage.getItem('rules'));
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

let tempStorageRules = getStorageRules();
if (__debugMode) {
	console.log(tempStorageRules);
	console.log(`getHostnameRules("www.google.com") =`);
	console.log(getHostnameRules("www.google.com"));
	console.log(`-------`);	
}