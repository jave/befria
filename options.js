
function storeSettings() {

    function getBlockedpattern() {
        const blockedPattern = document.querySelector("#block-pattern");
        return blockedPattern.value;
    }


    const blockedPattern = getBlockedpattern();
    console.log("block pattern:" + blockedPattern);
    alert("block pattern:" + blockedPattern);
    browser.storage.local.set({
        blockedPattern,
    });
}


/*
  Update the options UI with the settings values retrieved from storage,
  or the default settings if the stored settings are empty.
*/
function updateUI(restoredSettings) {
    const blockedpatternInput = document.querySelector("#block-pattern");
    blockedpatternInput.value = restoredSettings.blockedPattern;


}


function onError(e) {
  console.error(e);
}

/*
On opening the options page, fetch stored settings and update the UI with them.
*/
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(updateUI, onError);



// save functionality
// refer save-button in optopns.html
const saveButton = document.querySelector("#save-button");
saveButton.addEventListener("click", storeSettings);
