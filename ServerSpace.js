var onload = () => {
    MainFrame();
}

function MainFrame() {
    let sPage = "";
    sPage += "<div id='Feedback' class='Frame'></div>";
    sPage += "<button class='button' onClick='FindData()'>Refresh &#8635</button>";
    sPage += "<div id='Toast' class='Toast'></div>";
    document.getElementById('Main').innerHTML = sPage;
    FindData();
}

function FindData() {
    postFileFromServer('ServerSpace.php', "", DataCallback);
    function DataCallback(data) {
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
            display += "<br>Average system load<br>";
            display += FormatSysLoad(objServerData.SystemLoad);

            document.getElementById('Feedback').innerHTML = display;
            Toast("Successful refresh!");
        }
        else
            document.getElementById('Feedback').innerHTML = 'Failed';
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

function FormatSysLoad(jsonSysLoadAverages) {
    let aSysLoadAves = JSON.parse(jsonSysLoadAverages);
    let nOne, nFive, nFifteen;
    nOne = aSysLoadAves[0]/4*100;
    nFive = aSysLoadAves[1]/4*100;
    nFifteen = aSysLoadAves[2]/4*100;
    let sSysLoad = "1 min: " + nOne.toFixed(2) + "%<br> 5 mins: " + nFive.toFixed(2) + "%<br> 15 mins: " + nFifteen.toFixed(2) + "%";
    return sSysLoad;
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
