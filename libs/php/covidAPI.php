<?php
 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
 
    $executionStartTime = microtime(true);
    $url='https://corona.lmao.ninja/v2/countries/' . $_REQUEST['countryCode'] . '?yesterday&strict&query';;
 
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
    $output['data']['deaths'] = number_format($decode['deaths']);
    $output['data']['recovered'] = number_format($decode['recovered']);
    $output['data']['cases'] = number_format($decode['cases']);
    $output['data']['active'] = number_format($decode['active']);
    $output['data']['tests'] = number_format($decode['tests']);

    echo json_encode($output); 
 
?>
