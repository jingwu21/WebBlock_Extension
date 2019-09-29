$(document).ready(function(){
	//must use storage
	var blockList = [];
	
	function parseUrl(url){
		var temp = url.includes("https") ? url.replace("https://", ""):url.replace("http://", "");
		var i = temp.indexOf("/");
		temp = temp.substring(0,i);
		return temp;
		
	}
	
	$("#selectWeb").on("click", function (){
		var searchLength = document.getElementsByName("searchWeb").length;
		var searchValue = document.getElementsByName("searchWeb")[searchLength - 1].value;
		if(searchValue.length != 0){
			blockList.push(parseUrl(searchValue));
			chrome.runtime.sendMessage({website: blockList[blockList.length - 1]});
		}
		
		
		
	});
	
	chrome.storage.local.get("signal", function(result){
			if(result.signal != undefined){
				document.getElementById("switchButton").innerHTML = result.signal;
			}
			else{
				document.getElementById("switchButton").innerHTML = "On";
				chrome.storage.local.set({"signal": "On"});
				
			}
	});
	
	$("#switchButton").on("click", function(event){
		
		var buttonVal = document.getElementById("switchButton").innerHTML;
		var state = {};
		if(buttonVal == "On"){
			
			
			state.signal = "Off";
		}
		else{
			
			state.signal = "On";
		}
		
		document.getElementById("switchButton").innerHTML = state.signal;
		
		
		chrome.runtime.sendMessage({signal: state.signal});
		
	});
});