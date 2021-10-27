<!-- API KEY 0fed8361e9c5489a8d3133151211310  -->

<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
  $country = $_GET['country'];

	$executionStartTime = microtime(true);

	$url='api.openweathermap.org/data/2.5/weather?q=' . $country . '&appid=081a3abb2dcd1c8661e9e69d5ffe70a0&units=metric';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['data']['temperature'] = $decode['main']['temp'];



	echo json_encode($output); 

?>
