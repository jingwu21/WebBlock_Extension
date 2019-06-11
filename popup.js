$(document).ready(function(){
	//must use storage
	var blockList = [];
	$("#selectWeb").on("click", function (){
		var searchLength = document.getElementsByName("searchWeb").length;
		var searchValue = document.getElementsByName("searchWeb")[searchLength - 1].value;
		if(searchValue.length != 0){
			blockList.push(searchValue);
		}
		
		chrome.runtime.sendMessage({website: blockList[blockList.length - 1]});
		
	});
	$("#switchButton").on("click", function(){
		var buttonVal = document.getElementById("switchButton").value;
		chrome.runtime.sendMessage({website: buttonVal});
		if(buttonVal == "On"){
			document.getElementById("switchButton").innerHTML = "Off";
		}
		else{
			document.getElementById("switchButton").innerHTML = "On";
		}
	});
});