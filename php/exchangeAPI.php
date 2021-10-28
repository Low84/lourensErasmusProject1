<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
  $country = $_GET['country'];

	$executionStartTime = microtime(true);

	$url='https://v6.exchangerate-api.com/v6/93790965e545e00b206ee6e8/latest/USD';

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
	$output['data']['exchangeUsd'] = $decode['rates']['USD'];
  $output['data']['exchangeGbp'] = $decode['rates']['GBP'];
  $output['data']['exchangeEur'] = $decode['rates']['EUR'];


	echo json_encode($output); 

?>
