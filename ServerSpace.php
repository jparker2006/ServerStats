<?php

echo ServerData();

function ServerData() {
    $objServerData = new StdClass();
    $objServerData->sFreeSpace = strval(round(disk_free_space ("/")/1000000000, 3));
    $objServerData->sServerUpTime = @file_get_contents('/proc/uptime');
    date_default_timezone_set('America/Los_Angeles');
    $objServerData->sFullDateToday = date("Y-m-d");
    $objServerData->sDayOfWeek = date("l");
    $objServerData->sTimeRightNow = date("h:i:sa");
    $objServerData->sTempOfServer = exec("cat /sys/class/thermal/thermal_zone0/temp");
    $objServerData->SystemLoad = json_encode(sys_getloadavg());
    return json_encode($objServerData);
}

?>
