/* chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    insertDictionaryScript();
});

chrome.tabs.onCreated.addListener(function(tab) {         
   insertDictionaryScript();
}); *//* 

var func = function(){
    alert("Success!");
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.msg == "startFunc") func();
    }
);

chrome.tabs.onActivated.addListener(function(activeInfo){
  tabId = activeInfo.tabId

  chrome.tabs.sendMessage(tabId, {text: "are_you_there_content_script?"}, function(msg) {
    msg = msg || {};
    if (msg.status != 'yes') {
      chrome.tabs.insertCSS(tabId, {file: "search_product.css"});
     
    }
  });
});

console.log("ping");
 */

