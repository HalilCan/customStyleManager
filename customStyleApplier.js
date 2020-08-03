// TODO: host rules online

const __debugMode = 1;

let rulesFile = {
	"rules": {
		"www.google.com" : {
			"content": {
				"body" : "border: 5px solid red",
				".hp" : "background-color: blue",
				"#searchform" : "background-color: black"
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


let rules = rulesFile["rules"];

const hostname = window.location.hostname;
if (__debugMode) {
// 	console.log(`window.location:`);
// 	console.log(window.location);
	console.log(`hostname: ${hostname}`);
}

if (hostname in rules) {
	if (__debugMode) {
		console.log(`${hostname} found in rules`);
	}
	// I  am considering making a more granular process on a 
	// per-element basis, but that would take more time and browsers 
	// manage additional CSS rules well anyway. (or even with 
	// individual rule-pieces, but a similar argument applies)

	let style = document.createElement("customStylesheet");
	document.head.appendChild(style);
	let sheet = style.sheet;

	let cssString = "";

	for ([key, rule] in rules) {
		cssString += `${key} {\n 
			${rule}\n
		}\n\n`;
	}

	if (__debugMode) {
		console.log(`expanded new css rules: ${cssString}`);
		console.log(`sheet before: ${sheet}`);
	}

	sheet += cssString;

	if (__debugMode) {
		console.log(`sheet after: ${sheet}`);
	}
}