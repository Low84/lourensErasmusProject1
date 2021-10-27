<!-- App ID 93790965e545e00b206ee6e8 -->

<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
  $country = $_GET['country'];

	$executionStartTime = microtime(true);

	$url='https://openexchangerates.org/api/latest.json?app_id=834dd82e246e4c0ca57eed9b68a0001b&prettyprint=0';

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
	$output['data']['exchange'] = $decode['rates'];
	

	echo json_encode($output); 

?>
