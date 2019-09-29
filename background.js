
chrome.runtime.onMessage.addListener(receiver);


var store;

checkInStorage();
//chrome.webRequest.onBeforeRequest.removeListener(blockWeb);
function checkInStorage(){
	chrome.storage.local.get(null, function(result){
		if(result["web"] != undefined){
			console.log(result.web.length);
			store = result.web;
			chrome.webRequest.onBeforeRequest.addListener(blockWeb, {urls: ["<all_urls>"]}, ["blocking"]);
		}
		else{
			chrome.storage.local.set({"web": {}});
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
			let tempString = message.website;
			result.web[tempString] = message.website;
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

function parseUrl(url){
		var temp = url.includes("https") ? url.replace("https://", ""):url.replace("http://", "");
		var i = temp.indexOf("/");
		temp = temp.substring(0,i);
		return temp;
		
}

//check to see if website is in list of blocked websites
function matchWebsite(detail){
	
	/*
	for(i = 0; i < store.length; i++){
		if(detail.indexOf(store[i]) > -1){
			return true;
		}
	}*/
	const url = parseUrl(detail);
	/*
	for(const x in store){
		if(detail.indexOf(x) > -1){
			console.log("Checking: " + detail);
			return true;
		}
	}*/
	if(url in store)
		return true;
	
	
	
	return false;
}

function blockWeb(result){
	return {cancel: matchWebsite(result.url)};
}

function registerBlocker(){
	chrome.webRequest.onBeforeRequest.addListener(blockWeb, {urls: ["<all_urls>"]}, ["blocking"]);
}
