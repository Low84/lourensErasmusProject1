<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
  	// $north = $_GET['north'];
  	// $south = $_GET['south'];
  	// $east = $_GET['east'];
  	// $west = $_GET['west'];


	$executionStartTime = microtime(true);

	$url='http://api.geonames.org/citiesJSON?north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&lang=en&username=lo84';

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
  	$output['data'] = $decode['geonames'];

	// $output['data']['lat'] = $decode['geonames']['lat'];
  	// $output['data']['lng'] = $decode['geonames']['lng'];
  	// $output['data']['capName'] = $decode['geonames']['name'];
  	// $output['data']['population'] = $decode['geonames']['population'];
 
 
	echo json_encode($output); 

?>
