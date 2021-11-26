<?php
 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
 
    $executionStartTime = microtime(true);
 
    $url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=' . $_REQUEST['countryCode'] . '&username=lo84';
 
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL,$url);
 
    $result=curl_exec($ch);
 
    curl_close($ch);
 
    $decode = json_decode($result, true);   
 
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['data']['east'] = $decode['geonames'][0]['east'];
    $output['data']['west'] = $decode['geonames'][0]['west'];
    $output['data']['north'] = $decode['geonames'][0]['north'];
    $output['data']['south'] = $decode['geonames'][0]['south'];
    $output['data']['currencyCode'] = $decode['geonames'][0]['currencyCode'];
    $output['data']['countCode'] = $decode['geonames'][0]['countryCode'];
    $output['data']['population'] = $decode['geonames'][0]['population'];
    $output['data']['capital'] = $decode['geonames'][0]['capital'];

    echo json_encode($output); 
 
?>
