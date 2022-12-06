import "./browser-polyfill.js";

// to see the extensions log messages, load the extension, inspect it in the debug panel
console.log("JAVE loading background");

console.log("hello")

//general notes:
// - this was converted from mv2 and polyfill, to be both ff and chrome, but that didnt turn out so well so far, so in the mv3 theres some chrome stuff
// - having to manage state in storage.local, with promises, is super inconvenient, as compared to the mv2 model


function forceBlock() {
    console.log("JAVE timer block ");
    browser.storage.local.set({blocked: true});
    chrome.action.setIcon({path: "icons/befriad.png"});
}

chrome.alarms.onAlarm.addListener(() => {
    forceBlock;
});


async function forceUnblock() {
    console.log("JAVE  unblock ");
    browser.storage.local.set({blocked: false});
    chrome.action.setIcon({path: "icons/faengslad.png"});    
    console.log("JAVE setting up timer to forceBlock ");
    chrome.alarms.create({ delayInMinutes: 10 }); //alarm api rather than timer
    
    let unblockCounter=(await chrome.storage.local.get())["unblockCounter"] +1;
    browser.storage.local.set({unblockCounter: unblockCounter});
}



//////////////////////////////////////////////////////////////////////////////////////////////
// when extension is installed, initialize the blocked pattern, and others
browser.runtime.onInstalled.addListener(details => {
    browser.storage.local.set({
        //example of distractive urls i want to block
        blockedPattern: "dn.se|svd.se|nytimes|manga|penny|smbc|warhammer|tube|dailykos|blacklibrary",
        blocked: true,
        unblockCounter: 0
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////


// this is the function that actually does anything, it blocks access to urls that match blockedPattern
async function handleBeforeNavigate(navDetails) {
    let blocked=(await chrome.storage.local.get())["blocked"]
    console.log("JAVE handleBeforeNavigate "+blocked + " " + navDetails.url);
    if (!blocked) return;
    let blockedPattern=(await chrome.storage.local.get())["blockedPattern"]
    var re = RegExp (blockedPattern);
    if (navDetails.frameId == 0) {
        if(re.test(navDetails.url)){
            console.log("JAVE blockeing this url");
            browser.tabs.update(navDetails.tabId, {url:"no.html"});
        }
    }
}

//and this is just registering the listener for navigation events
browser.webNavigation.onBeforeNavigate.addListener(handleBeforeNavigate);


function logTabs(tabs) {
    console.log(tabs)
}


function onShown() {
    console.log(`Shown`);
}

function onError(error) {
    console.log(`Error: ${error}`);
}



function onUpdated(tab) {
    console.log(`Updated tab: ${tab.id}`);
}



//receive message from popup.js, see other half there
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage


function handleMessage(request, sender, sendResponse) {
    console.log("background: Message from the content/popup script: " +
                request.greeting +" "+sender+" "+sendResponse);
    switch(request.id){
    case "block":
        forceBlock();
        break;
    case "unblock":
        forceUnblock();
        break;
    case "prefs":
        let openingPage = browser.runtime.openOptionsPage()
        openingpage.then(onOpened, onError);

        break;
    }
    //toggleBlock();    
    sendResponse({response: "Response from background script", unblockCounter : unblockCounter});
}

browser.runtime.onMessage.addListener(handleMessage);

function onOpened() {
  console.log(`Options page opened`);
}


// start in blocked state
forceBlock();
