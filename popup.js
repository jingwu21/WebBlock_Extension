$(document).ready(function(){
	//must use storage
	var blockList = [];
	chrome.storage.local.set({"signal": "On"});
	$("#selectWeb").on("click", function (){
		var searchLength = document.getElementsByName("searchWeb").length;
		var searchValue = document.getElementsByName("searchWeb")[searchLength - 1].value;
		if(searchValue.length != 0){
			blockList.push(searchValue);
		}
		
		chrome.runtime.sendMessage({website: blockList[blockList.length - 1]});
		
	});
	
	$("#switchButton").on("click", function(event){
		
		var buttonVal = document.getElementById("switchButton").innerHTML;
		
		if(buttonVal == "On"){
			chrome.storage.local.set({"signal": "Off"});
			
		}
		else{
			chrome.storage.local.set({"signal": "On"});
			
		}
		chrome.storage.local.get("signal", function(result){
			document.getElementById("switchButton").innerHTML = result.signal;
		});
		buttonVal = document.getElementById("switchButton").innerHTML;
		chrome.runtime.sendMessage({signal: buttonVal});
		
	});
});