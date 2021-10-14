<?php 
$curl = curl_init();
$countrylayer_api = "d8a3fa17f0ff4b0b05c7469ab7fb901f";
$countrylayer_url = "http://api.countrylayer.com/v2/all?access_key=";
curl_setopt_array($curl, array(
  CURLOPT_URL => $countrylayer_url . $countrylayer_api,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
?>