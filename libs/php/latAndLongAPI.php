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
	$output['coord'] = $decode['results'][0]['annotations']['DMS'];
	$output['calling'] = $decode['results'][0]['annotations']['callingcode'];
	$output['currency'] = $decode['results'][0]['annotations']['currency']['name'];
	$output['flag'] = $decode['results'][0]['annotations']['flag'];
	$output['continent'] = $decode['results'][0]['components']['continent'];
	$output['country'] = $decode['results'][0]['components']['country'];

	

	echo json_encode($output); 

?>
