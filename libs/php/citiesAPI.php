<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
  $north = $_GET['north'];
  $south = $_GET['south'];
  $east = $_GET['east'];
  $west = $_GET['west'];


	$executionStartTime = microtime(true);

	$url='http://api.geonames.org/citiesJSON?north=' . $north . '&south=' . $south . '&east=' . $east . '&west=' . $west . '&lang=de&username=lo84';

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
	$output['data']['lat'] = $decode['geonames']['lat'];
  $output['data']['lng'] = $decode['geonames']['lng'];
  $output['data']['capName'] = $decode['geonames']['name'];
 


  
	echo json_encode($output); 

?>
