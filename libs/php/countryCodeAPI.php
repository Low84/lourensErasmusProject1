<?php
  // 'http://api.geonames.org/countryCode?lat=47.03&lng=10.2&username=lo84'
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url=  'http://api.geonames.org/countryCode?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=lo84';

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
  $output['data']['countryCode'] = $result;
 
	echo json_encode($output); 

?>
