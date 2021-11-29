<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	// $url='api.openweathermap.org/data/2.5/forecast?q=' . $_REQUEST['country'] . '&appid=081a3abb2dcd1c8661e9e69d5ffe70a0&units=metric';
	$url='api.openweathermap.org/data/2.5/forecast?q=canada&appid=081a3abb2dcd1c8661e9e69d5ffe70a0&units=metric';

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

    // Current Day
  $output['data']['countryWeatherName'] = $decode['city']['name'];

    $output['data']['WeatherDescription'] = $decode['list'][0]['weather'][0]['description'];
    $output['data']['iconDayOne'] = $decode['list'][0]['weather'][0]['icon'];

    $output['data']['tempDayOne'] = $decode['list'][0]['main']['temp']."°C";
    $output['data']['feelsLikeDayOne'] = $decode['list'][0]['main']['feels_like']."°C";
    $output['data']['tempMinDayOne'] = $decode['list'][0]['main']['temp_min']."°C";
    $output['data']['tempMaxDayOne'] = $decode['list'][0]['main']['temp_max']."°C";

    $output['data']['windSpeed'] = $decode['list'][0]['wind']['speed']."km/h";


    // Day 2
    $output['data']['iconDayTwo'] = $decode['list'][1]['weather'][0]['icon'];
    $output['data']['tempMinDayTwo'] = $decode['list'][1]['main']['temp_min']."°C";
    $output['data']['tempMaxDayTwo'] = $decode['list'][1]['main']['temp_max']."°C";

    // Day 3
    $output['data']['iconDayThree'] = $decode['list'][2]['weather'][0]['icon'];
    $output['data']['tempMinDayThree'] = $decode['list'][2]['main']['temp_min']."°C";
    $output['data']['tempMaxDayThree'] = $decode['list'][2]['main']['temp_max']."°C";
      
	echo json_encode($output); 

?>
