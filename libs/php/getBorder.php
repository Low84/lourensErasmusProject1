<?php
 
$string = file_get_contents("../data/countryBorders.geo.json");
$json = json_decode($string, true);
$features = $json['features'];
// echo '<pre>' . print_r($json, true) . '</pre>';
 
$country_code = $_GET['countryCode'];
// echo '<pre>' . print_r($country_code) . '</pre>';
 
$output_geom = "";
for($i=0;$i<sizeof($features);$i++){
    $feature = $features[$i];
    if($feature["properties"]["iso_a2"] == $country_code){
        $output_geom = $feature['geometry'];
    }
}
echo(json_encode($output_geom));
