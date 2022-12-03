
// to see the extensions log messages, load the extension, inspect it in the debug panel
console.log("JAVE loading background");

var blocked=false;
var timerId=0;

function forceBlock() {
    console.log("JAVE timer block ");
    blocked=true;

    browser.browserAction.setIcon({path: "icons/bookmark-it.png"});
}

let unblockCounter=0; //should be in local storage i guess
function forceUnblock() {
    console.log("JAVE  unblock ");
    blocked=false;
    browser.browserAction.setIcon({path: "icons/border-48.png"});    
    timerId=setTimeout(forceBlock, 1000*60*10); //block automatically after 10 minutes. i suppose there should be only 1 timer
    //check timerid, if set, cancel timer, then start the new one
    unblockCounter=unblockCounter+1;
}



//////////////////////////////////////////////////////////////////////////////////////////////
// blockedPattern management
let blockedPattern="dn.se|svd.se|nytimes|manga|penny|smbc|warhammer|tube|dailykos|blacklibrary";
// when extension is installed, initialize the blocked pattern
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    blockedPattern: blockedPattern
  });
});


//initially i had this, but it didnt seem to work with the polyfill
// // Get the stored blockedPattern
// browser.storage.local.get(data => {
//     if (data.blockedPattern) {
//         blockedPattern= data.blockedPattern;
//   }
// });

//but this worked with the polyfill
function updateBlockedPattern(data){
    if (data.blockedPattern) {
        blockedPattern= data.blockedPattern;
    }
}
browser.storage.local.get().then(updateBlockedPattern, onError);



// Listen for changes in the blocked pattern
browser.storage.onChanged.addListener(changeData => {
  blockedPattern = changeData.blockedPattern.newValue;
});
// end blockedPattern management
//////////////////////////////////////////////////////////////////////////////////////////////


function handleBeforeNavigate(navDetails) {
    console.log("JAVE handleBeforeNavigate "+blocked + " " + navDetails.url);
    if (!blocked) return;
    //example of distractive urls i want to block
    var re = RegExp (blockedPattern);
    if (navDetails.frameId == 0) {
        if(re.test(navDetails.url)){
            console.log("JAVE blockeing this url");
            browser.tabs.update(navDetails.tabId, {url:"no.html"});
        }
    }
}


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

function updateFirstTab(tabs) {
    var updating = browser.tabs.update(tabs[0].id, {
        active: true
        //    url: "https://developer.mozilla.org"
    });
    updating.then(onUpdated, onError);
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

function onError(error) {
  console.log(`Error: ${error}`);
}


// start in blocked state
forceBlock();
