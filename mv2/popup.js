console.log("JAVE popup ");


// send a msg to the bg script
function handleResponse(message) {
    console.log(`popup: Message from the background script:  ${message.response}   ${message.unblockCounter}`);
    //alert(`unblock:  ${message.response} ${messsage.unblockCounter}`);
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
    // if (e.target.id === "toggleblock") {
    //     notifyBackgroundPage(e);
    // }

    
    e.preventDefault();
});

