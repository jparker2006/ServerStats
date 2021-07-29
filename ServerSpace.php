<?php

$jsonServerData = $_POST['ServerData'];

if ($jsonServerData)
  $sFeedback = ServerData($jsonServerData);

echo $sFeedback;

function ServerData($jsonServerData) {
    $objServerData = json_decode($jsonServerData);
    $objServerData->sFreeSpace = strval(round(disk_free_space ("/")/1000000000, 3));
    $objServerData->sServerUpTime = @file_get_contents('/proc/uptime');
    date_default_timezone_set('America/Los_Angeles');
    $objServerData->sFullDateToday = date("Y-m-d");
    $objServerData->sDayOfWeek = date("l");
    $objServerData->sTimeRightNow = date("h:i:sa");
    $objServerData->sTempOfServer = exec("cat /sys/class/thermal/thermal_zone0/temp", $sCpuTemp);
    return json_encode($objServerData);
}

?>
