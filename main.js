window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "UA-130701452-1");

var lastUpdtTime;
var d;
var alertDone = false;
var lowestTemp;
var highestTemp;
var lowestTempTime;
var highestTempTime;
var timeCorection = 0;
var refreshIntervalId;
var options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  timezone: "ITC",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  var hDisplay = h + " hrs. ";
  var mDisplay = m + " min. ";
  var sDisplay = s + " sec.";
  return hDisplay + mDisplay + sDisplay;
}

$(document).ready(function () {
  var randomPic = Math.floor(Math.random() * 5);
  var imageUrl;
  if (randomPic == 0) {
    imageUrl =
      "https://dl.dropboxusercontent.com/s/617diqol9mnutmm/backWeatherDark.jpg";
  }
  if (randomPic == 1) {
    imageUrl =
      "https://dl.dropboxusercontent.com/s/l1nsxpf8kehyvh0/backWeatherDark1.jpg";
  }
  if (randomPic == 2) {
    imageUrl =
      "https://dl.dropboxusercontent.com/s/gcjotfzusrdf7eg/backWeatherDark2.jpg";
  }
  if (randomPic == 3) {
    imageUrl =
      "https://dl.dropboxusercontent.com/s/9dxie7a6v5ti4yk/backWeatherDark3.jpg";
  }
  if (randomPic == 4) {
    imageUrl =
      "https://dl.dropboxusercontent.com/s/lqsy6fbbmsfusgu/backWeatherDark4.jpg";
  }
  console.log("Pic N: " + randomPic);
  $(".background-image").css("background-image", 'url("' + imageUrl + '")');
  // don't cache
  $.ajaxSetup({ cache: false });
  getUpdates();
  // check for new updates
  refreshIntervalId = setInterval("getUpdates()", 60000);
  setInterval("liveTimerUpdtFun()", 1000);
  loadAdditionalStuff();
  //$.get('http://logurl.com/pageMetrics');
});

function loadAdditionalStuff() {
  // timeCorrection
  $.getJSON("http://worldclockapi.com/api/json/utc/now", function (data) {
    var nowFromServr = new Date(data.currentFileTime / 10000 - 11644473600000);
    timeCorection = nowFromServr - new Date().getTime();
    timeCorection = timeCorection + 200;
    console.log("timeCorectionValue: " + timeCorection);
  });

  $.getJSON(
    "https://api.thingspeak.com/channels/2365838/fields/2?days=2",
    function (data) {
      $.each(data.feeds, function (index, item) {
        if (lowestTemp == null || highestTemp == null) {
          lowestTemp = parseFloat(item.field2);
          highestTemp = parseFloat(item.field2);
          highestTempTime = new Date(item.created_at);
          lowestTempTime = new Date(item.created_at);
        }
        if (parseFloat(item.field2) >= highestTemp) {
          highestTemp = parseFloat(item.field2);
          highestTempTime = new Date(item.created_at);
        }
        if (parseFloat(item.field2) <= lowestTemp) {
          lowestTemp = parseFloat(item.field2);
          lowestTempTime = new Date(item.created_at);
        }
      });
    }
  );

  $.getJSON(
    "https://api.sunrise-sunset.org/json?lat=50.3071&lng=31.4643&formatted=0",
    function (data) {
      if (data.status == "OK") {
        var sunrise = new Date(data.results.sunrise);
        var sunset = new Date(data.results.sunset);
        var sunInfoStr = "";
        var optionsFormat = {
          hour: "numeric",
          minute: "numeric",
          // second: 'numeric'
        };
        sunInfoStr += "Sunrise ";
        sunInfoStr += sunrise.toLocaleString("en-GB", optionsFormat);
        sunInfoStr += ", ";
        sunInfoStr += "Sunset ";
        sunInfoStr += sunset.toLocaleString("en-GB", optionsFormat);
        sunInfoStr += " <br> ";
        sunInfoStr += "Day length in Ahmedabad: ";
        sunInfoStr += secondsToHms(data.results.day_length);
        sunInfoStr += " <hr>";
        $("#sunInfo").html(sunInfoStr);
      }
    }
  );
}

function getUpdates() {
  // get the data with a webservice call
  $("#entry_id").css("color", "#f44b4b");
  $.getJSON(
    "https://api.thingspeak.com/channels/2365838/feeds/last",
    function (data) {
      // if the field1 has data update the page
      d = new Date(data.created_at);

      $("#created_at")
        .html(d.toLocaleString("en-GB", options))
        .css("fontSize", 15);
      $("#entry_id").html(data.entry_id).css("fontSize", 15);
      if (data.field2 != null) {
        $("#field2").html(data.field2).css("fontSize", 15);
      } else {
        $("#field2").html("OFFLINE").css("fontSize", 15);
      }
      if (data.field7 != null) {
        $("#field7").html(data.field7).css("fontSize", 15);
      } else {
        $("#field7").html("OFFLINE").css("fontSize", 15);
      }
      $("#entry_id").css("color", "white");
      // add color if success
      $("#field2").css("color", "#40ef8c");
      $("#field7").css("color", "#40ef8c");
      $("#field2").css("fontSize", 20);
      $("#field7").css("fontSize", 20);
      // update highLow with the last value
      if (highestTemp != null && lowestTemp != null) {
        if (parseFloat(data.field2) >= highestTemp) {
          highestTemp = parseFloat(data.field2);
          highestTempTime = new Date(data.created_at);
        }
        if (parseFloat(data.field2) <= lowestTemp) {
          lowestTemp = parseFloat(data.field2);
          lowestTempTime = new Date(data.created_at);
        }
      }

      lastUpdtTime = new Date().getTime();
    }
  ).fail(function () {
    $("#entry_id").html("Error receiving data").css("fontSize", 15);
    $("#entry_id").css("color", "#f44b4b");
  });
}

function liveTimerUpdtFun() {
  // browser request time past
  if (lastUpdtTime != null) {
    var timepass = (new Date().getTime() - lastUpdtTime) / 1000;
    $("#UpdtIn")
      .html("Browser request: " + Math.round(timepass) + " Sec ago")
      .css("fontSize", 15);
    $("#UpdtIn").css("color", "#40ef8c");
    // data freshness warning
    var Freshness = (new Date().getTime() + timeCorection - d) / 1000;
    if (alertDone == false && Freshness > 4600) {
      alert(
        "Data received " +
          Math.round(Freshness) +
          " Sec ago. Data is old, something wrong, try reloading the page"
      );
      alertDone = true;
    }
    // data freshness info
    if (Freshness <= timepass) {
      $("#IsDataFresh").html("Measured: about 1 min ago").css("fontSize", 15);
    } else {
      $("#IsDataFresh")
        .html("Measured: " + Math.round(Freshness) + " Sec ago")
        .css("fontSize", 15);
    }
    $("#IsDataFresh").css("color", "#40b7ef");
  }

  // smart schedule update, to get freshest data
  if (Freshness > 61.0 && Freshness < 61.999) {
    console.log("Smart scheduled requst: ok");
    clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval("getUpdates()", 60000);
    getUpdates();
  }

  // highLow
  if (lowestTemp != null && highestTemp != null) {
    $("#highestTemp").html(highestTemp).css("fontSize", 16);
    $("#lowestTemp").html(lowestTemp).css("fontSize", 16);
    $("#highestTemp").css("color", "#40ef8c");
    $("#lowestTemp").css("color", "#40ef8c");
    $("#highestTemp").css("fontSize", 22);
    $("#lowestTemp").css("fontSize", 22);
    $("#highestTempTime")
      .html(highestTempTime.toLocaleString("en-GB", options))
      .css("fontSize", 16);
    $("#lowestTempTime")
      .html(lowestTempTime.toLocaleString("en-GB", options))
      .css("fontSize", 16);

    // time now report
    if (timeCorection != 0) {
      var optionsTime = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };

      var realTimeDate = new Date();
      realTimeDate.setSeconds(realTimeDate.getSeconds() + timeCorection / 1000);
      var timeMsg = "";

      // how bad the error? worth showing?
      if (timeCorection > 800 || timeCorection < -800) {
        if (timeCorection > 0) {
          timeMsg =
            " | Your watch is: " +
            (timeCorection / 1000).toFixed(1) +
            " sec behind";
        } else {
          timeMsg =
            " | Your watch is: " +
            (timeCorection / 1000).toFixed(1).substr(1) +
            " sec ahead.";
        }
      }

      $("#clockInfo")
        .html(
          "Now: " +
            realTimeDate.toLocaleString("en-GB", optionsTime) +
            timeMsg +
            "<hr>"
        )
        .css("fontSize", 15);
      $("#clockInfo").attr("title", "Using time zone of your device.");
    }
  }
}
