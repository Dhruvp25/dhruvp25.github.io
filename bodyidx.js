var lastUpdtTime;
	var d;
	var alertDone = false;
$(document).ready(function() {
	getUpdates();
	// check for new updates
	setInterval('getUpdates()',60000);
	setInterval('liveTimerUpdtFun()',1000);
});
function getUpdates() {
	// get the data with a webservice call
	$("#entry_id").css('color', '#f44b4b');
	$.getJSON('https://api.thingspeak.com/channels/2365838/feeds/last', function(data) {
			// if the field1 has data update the page
			d = new Date(data.created_at);
	$("#created_at").html(d.toDateString() + " " + d.toLocaleTimeString()).css("fontSize", 15);
	$("#entry_id").html(data.entry_id).css("fontSize", 15);
	if (data.field1!=null){
    $("#field1").html(data.field1).css("fontSize", 15);
	}
	else{
	$("#field1").html("OFFLINE").css("fontSize", 15);	
	}
	if (data.field2!=null){
    $("#field2").html(data.field2).css("fontSize", 15);
	}
	else{
	$("#field2").html("OFFLINE").css("fontSize", 15);	
	}
	if (data.field3!=null){
    $("#field3").html(data.field3).css("fontSize", 15);
	}
	else{
	$("#field3").html("OFFLINE").css("fontSize", 15);	
	}
	if (data.field4!=null){
    $("#field4").html(data.field4).css("fontSize", 15);
	}
	else{
	$("#field4").html("OFFLINE").css("fontSize", 15);	
	}
	if (data.field5!=null){
    $("#field5").html(data.field5).css("fontSize", 15);
	}
	else{
	$("#field5").html("OFFLINE").css("fontSize", 15);	
	}
	$("#entry_id").css('color', 'white');

lastUpdtTime = (new Date()).getTime();
	}).fail(function() { 
		$("#entry_id").html("Error while retrieving information!").css("fontSize", 15);
		$("#entry_id").css('color', '#f44b4b');
		});
}
function liveTimerUpdtFun() {
	// browser request time past
	if(lastUpdtTime!=null){
	var timepass = ((new Date().getTime() - lastUpdtTime)/1000);
	$("#UpdtIn").html("Last request: " + Math.round(timepass)+ " Sec ago").css("fontSize", 15);
	$("#UpdtIn").css('color', '#40ef8c');
     // data freshness warning
     var Freshness = ((new Date().getTime()-d)/1000);
	 if(alertDone==false && Freshness>4600){
	 alert('The data '+ Math.round(Freshness) + 'Sec old. SmartHome is probably offline!');
	 alertDone=true;
	 }
	 // data freshness info
	 if(Freshness<=timepass){
	 $("#IsDataFresh").html("Last data upload: less than 1 min ago").css("fontSize", 15);
	 }else{
     $("#IsDataFresh").html("Last data upload: " + Math.round(Freshness) + " Sec ago").css("fontSize", 15);
	 }
	 $("#IsDataFresh").css('color', '#40b7ef');
	}
}