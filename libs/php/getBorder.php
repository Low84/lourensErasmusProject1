<?php

$string = file_get_contents("../data/countryBorders.geo.json");
$json = json_decode($string);
$geometry = $json->features;

$country_code = $_GET['country_code'];

$output_geom = "";
for($i=0;$i<sizeof($geometry);$i++){
    $geometry = $geometry[$i];
    if($geometry["properties"]["iso_a2"] == $country_code){
        $output_geom = $geometry->geometry;
    }
}
echo(json_encode($output_geom));