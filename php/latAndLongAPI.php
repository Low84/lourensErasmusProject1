<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	$country = $_GET['country'];

	$executionStartTime = microtime(true);
	$url='https://api.opencagedata.com/geocode/v1/json?q='. $country .'&key=e629dbaaefe94793afde8b17b2947ad8';

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
	$output['data'] = $decode['results'][0]['geometry'];

	echo json_encode($output); 

?>
