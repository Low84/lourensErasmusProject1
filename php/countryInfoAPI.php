<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
  $country = $_GET['country'];

	$executionStartTime = microtime(true);

	$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=en&country=' . $country . '&username=lo84';

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
	$output['data']['capital'] = $decode['geonames'][0]['capital'];
  
	echo json_encode($output); 

?>