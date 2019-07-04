console.log("It worked!! Background Script YAY PROGRESS");
chrome.runtime.onMessage.addListener(receiver);


var store;

checkInStorage();
chrome.webRequest.onBeforeRequest.removeListener(blockWeb);
function checkInStorage(){
	chrome.storage.local.get(null, function(result){
		if(result["web"] != undefined){
			console.log(result.web.length);
			store = result.web;
			chrome.webRequest.onBeforeRequest.addListener(blockWeb, {urls: ["<all_urls>"]}, ["blocking"]);
		}
		else{
			chrome.storage.local.set({"web": []});
		}
		
		if(result["signal"] != undefined){
			chrome.storage.local.get("signal", function(result){
				if(result["signal"] == "Off"){
					chrome.webRequest.onBeforeRequest.removeListener(blockWeb);
				}
				console.log("from popjs: " + result.signal);
			});
		}
	
		
	});
	
}

function receiver(message){
	console.log("web " + message.website);
	console.log(message.signal);
	
	if(message.signal == "Off"){
		chrome.webRequest.onBeforeRequest.removeListener(blockWeb);
		chrome.storage.local.set({"signal": "Off"});
		console.log("Off from message " + message.signal);
		
	}
	else if(message.signal == "On"){
		chrome.storage.local.set({"signal": "On" });
		console.log("On from message signal");
		registerBlocker();
		
	}
	else{
		chrome.storage.local.get("web", function (result){
			console.log(result.web);
			result["web"].push(message.website);
			store = result.web;
			if(store.length != 0){
				registerBlocker();
			}
			console.log(store);
			chrome.storage.local.set({"web": result.web});
		});
	}
}

//debugging to see if websites are added to blocked list
function printWebsites(){
	
	chrome.storage.local.get(null, function(result){
		console.log(result);
	});	
}

//check to see if website is in list of blocked websites
function matchWebsite(detail){
	var i;
	for(i = 0; i < store.length; i++){
		if(detail.indexOf(store[i]) > -1){
			return true;
		}
	}
	return false;
}

function blockWeb(result){
	return {cancel: matchWebsite(result.url)};
}

function registerBlocker(){
	chrome.webRequest.onBeforeRequest.addListener(blockWeb, {urls: ["<all_urls>"]}, ["blocking"]);
}
