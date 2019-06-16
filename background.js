console.log("It worked!! Background Script YAY PROGRESS");
chrome.runtime.onMessage.addListener(receiver);


var store;

checkInStorage();
function checkInStorage(){
	chrome.storage.local.get("web", function(result){
		if(result["web"] != undefined){
			console.log(result.web.length);
			store = result.web;
			chrome.webRequest.onBeforeRequest.addListener(function(detail){return {cancel: matchWebsite(detail.url, "refresh")};}, {urls: ["<all_urls>"]}, ["blocking"]);
		}
		else{
			chrome.storage.local.set({"web": []});
		}
	});
}

function receiver(message){
	console.log(message.website);
	
	chrome.storage.local.get("web", function (result){
		console.log(result.web);
		result["web"].push(message.website);
		store = result.web;
		if(store.length != 0){
			registerBlocker();
		}
		chrome.storage.local.set({"web": result.web});
	});
	
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

function registerBlocker(){
	chrome.webRequest.onBeforeRequest.addListener(function(result){return {cancel: matchWebsite(result.url)};}, {urls: ["<all_urls>"]}, ["blocking"]);
}
