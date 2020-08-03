// TODO: host rules online

let rulesFile = {
	"rules": {
		"www.google.com" : {
			"body" : "border: 1px solid red",
			".container" : "background-color: blue"
		}
	}
};

let rules = rulesFile['rules'];

const hostName = window.location.hostName;


if (hostName in rules) {
	
}