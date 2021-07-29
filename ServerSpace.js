"use strict";

var onload = () => {
    MainFunction();
}

function MainFunction() {
    var sPage = "";
    sPage += "<div class='RoundedBox' style='text-align: center'>";
    sPage += "<img style='width: 6%;' src='Images/servers.png'><br><br>";

    sPage += "<div id='Feedback' class='SmallText'></div><br>";
    sPage += "<button class='button' onClick='FindData()'>Refresh &#8635</button>";
    sPage += "</div>";
    sPage += "<div id='Toast' class='Toast'></div>";
    document.getElementById('Main').innerHTML = sPage;
    FindData();
}

function FindData() {
    Toast("Successful refresh!");
    var objServerData = {};
    objServerData.sFreeSpace = "";
    objServerData.sServerUpTime = ""
    objServerData.sFullDateToday = "";
    objServerData.sDayOfWeek = "";
    objServerData.sTimeRightNow = "";
    objServerData.sTempOfServer = "";
    postFileFromServer('ServerSpace.php', "ServerData=" + JSON.stringify(objServerData), DataCallack);
    function DataCallack(data) {
        if (data) {
            objServerData = JSON.parse(data);

            let display = "";
            display += objServerData.sFreeSpace + " GB free<br>";
            display += "Server has been up for " + FormatUptime(objServerData.sServerUpTime) + "<br>";
            display += objServerData.sDayOfWeek + " ";
            display += objServerData.sFullDateToday + " ";
            display += objServerData.sTimeRightNow + "<br>";
            let sTempInCelcius = Number(objServerData.sTempOfServer)/1000;
            display += "CPU Temp: ";
            display += sTempInCelcius.toFixed(1) + " c / ";
            display += CelToFah(sTempInCelcius) + " f";

            document.getElementById('Feedback').innerHTML = display;
        }
        else {
            document.getElementById('Feedback').innerHTML = 'Failed';
        }
    }
}

function Toast(sMess) {
	document.getElementById('Toast').innerHTML = "<div class='ToastMsg'>"+sMess+"</div>";
	setTimeout(function(){ document.getElementById('Toast').innerHTML = ''; }, 5000);
}

function CelToFah(nDegreesCelcius) {
    const nDegreesFah = (9/5) * nDegreesCelcius + 32;
    return nDegreesFah.toFixed(1);
}

function FormatUptime(sUptimeRaw) {
	var num = parseFloat(sUptimeRaw);
    var secs = Math.floor(num % 60);
    num = Math.floor(num/60);
    var mins  = Math.floor(num % 60);
    num = Math.floor(num/60);
    var hours  = Math.floor(num % 24);
    num = Math.floor(num/24);
    var days = num;
    var sMins = "" + mins;
    var sUptime = "";

    if (1 == days)
        sUptime = days + " day, ";
    else if (1 < days)
        sUptime = days + " days, ";

    sUptime += hours + ":" + sMins.padStart(2,'0');
    return sUptime;
}

function postFileFromServer(url, sData, doneCallback) {
	var xhr;
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handleStateChange;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(sData);
	function handleStateChange() {
		if (xhr.readyState === 4) {
			doneCallback(xhr.status == 200 ? xhr.responseText : null);
		}
	}
}
