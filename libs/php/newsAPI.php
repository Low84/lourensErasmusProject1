<?php

  ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	$url='https://newsapi.org/v2/everything?q=' . $_REQUEST['country'] . '&from=' . $_REQUEST['date'] . '&sortBy=publishedAt&apiKey=1db34c3409484d1d9f170e2fac3e7986';

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
  $output['data']['titleOne'] = $decode['articles'][3]['title'];
  $output['data']['descriptionOne'] = $decode['articles'][3]['description'];
  $output['data']['urlOne'] = $decode['articles'][3]['url'];
  $output['data']['titleTwo'] = $decode['articles'][1]['title'];
  $output['data']['descriptionTwo'] = $decode['articles'][1]['description'];
  $output['data']['urlTwo'] = $decode['articles'][1]['url'];
  $output['data']['titleThree'] = $decode['articles'][2]['title'];
  $output['data']['descriptionThree'] = $decode['articles'][2]['description'];
  $output['data']['urlThree'] = $decode['articles'][2]['url'];


 
	echo json_encode($output); 

?>