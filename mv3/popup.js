console.log("JAVE popup ");

browser.storage.onChanged.addListener(changeData => {
    console.log("storage onchanged popup");
    // //update counter when storage changes
    // if(changeData.unblockCounter){    document.getElementById('blockedCounter').innerHTML =  changeData.unblockCounter.newValue;}
    // if(changeData.blocked) {
    //     if (changeData.blocked.newValue==true)
    //     { document.getElementById('popupicon').src = "icons/befriad.png" ;}
    //     else { document.getElementById('popupicon').src = "icons/faengslad.png" ;}

    // }
    updateUi();

});

//update ui when the popup loads

async function updateUi(){
    document.getElementById('blockedCounter').innerHTML =  (await chrome.storage.local.get())["unblockCounter"];
    if ((await chrome.storage.local.get())["blocked"]==true)
        { document.getElementById('popupicon').src = "icons/befriad.png" ;}
        else { document.getElementById('popupicon').src = "icons/faengslad.png" ;}

}

updateUi();


// send a msg to the bg script
function handleResponse(message) {
    console.log(`popup: Message from the background script:  ${message.response}   ${message.unblockCounter}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(id) {
  var sending = browser.runtime.sendMessage({
      greeting: "Greeting from the popup script",
      id: id
  });
  sending.then(handleResponse, handleError);  
}

//event handler for the popup
document.addEventListener("click", (e) => {
    console.log("JAVE popup event handler");

    notifyBackgroundPage(e.target.id);
    e.preventDefault();
});


