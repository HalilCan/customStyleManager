// verbose variant
function logTabs(tabs) {
    let tab = tabs[0]; // Safe to assume there will only be one result
    console.log(tab.url);
}

browser.tabs.query({currentWindow: true, active: true}).then(logTabs, console.error);

// or the short variant
browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0]; // Safe to assume there will only be one result
    console.log(tab.url);
}, console.error) 