let myMap;
let homeCountryCode;
// Loading the map at start up 
$(document).ready(function () {
 
  myMap = L.map('mapid').setView([51.505, -0.09], 5.5);
 
   // Tile layer for leaflet
   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
   {
       maxZoom: 18,
       attribution: 'Map data &copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors, ' +
           'Imagery © <a href=https://www.mapbox.com/>Mapbox</a>',
       id: 'mapbox/streets-v11',
       tileSize: 512,
       zoomOffset: -1
   }).addTo(myMap);   
  
  //  Selecting a country and creating a border around selected country
   $("#sel_country").empty();
   $.ajax({
       type: "GET",
       dataType: "json",
       url: "./libs/php/getCountries.php",
       success: function (data) {
           $.each(data, function (key, value) {
               $("#sel_country").append("<option value=" + value[1] + ">" + value[0] + "</option>");
           });
       }
   });  
 });

 let c=0;
 function applyCountryBorder(code) {
  //  console.log(code);
   jQuery
     .ajax({
       type: "GET",
       dataType: "json",
       url: "libs/php/getBorder.php",
       data: {
         countryCode: code
       }
     })
     .then(function(data) {
      //  console.log(data);
       
       var border = L.geoJSON(data, {
         color: "#04446b",
         weight: 4,
         opacity: 1,
         fillColor: '#04446b',
         fillOpacity: 0.3 
       });
       border.addTo(myMap);
  
       myMap.fitBounds(border.getBounds());
      //  console.log(c);
       c++;
     
     }).catch(function(err){
       console.log(err);
     });
   };

  //  Function for cluster markers
  var markers = L.markerClusterGroup();
``
  function cityPopulationMarker(city_data){
    var markerArr = [];

    for (var i = 0; i < city_data.length; i++) {
      var lat = city_data[i]['lat'];
      console.log(lat);
      var lng = city_data[i]['lng'];
      console.log(lng);
      var city = city_data[i]['name'];
      console.log(city);
      var population = city_data[i]['population'];
      console.log(population);
      var marker = L.marker([lat, lng]);
      var popup = 
          '<div id="markerPopup"><span class="markClustPopup">City: </span>' + city + '<hr/ >' +
            '<span class="markClustPopup">Population: </span>' + population + '</div>'
        marker.bindPopup(popup);
        markerArr.push(marker);
    }
    return markerArr;
}


$('#sel_country').change(function () {
  let countryName = $('#sel_country option:selected').text();
  let countryCode = $('#sel_country').val();
  
  applyCountryBorder(countryCode);   

  $.ajax({
      type: "GET",
      dataType: "json",
      url: "./libs/php/latAndLongAPI.php?country=" + countryName.replace(/ /g, ''),
      success: function (geo_data) {
        //  console.log(geo_data);
          lat = geo_data['data']['lat'];
          lng = geo_data['data']['lng'];
          
          // Function that binds a popup on the map to show country name
          getLocation(lat, lng, countryName);

          $('#currency').html(geo_data['currency']);
          $('#calling_code').html('+' + geo_data['calling']);
          $('#coord').html(geo_data['coord']['lat'] + ' ' + geo_data['coord']['lng']);
          $('#continent').html(geo_data['continent']);
          $('#country').html(geo_data['country']);
          $('#countryName').html(geo_data['country']);
  
          // CountryInfo API call
          $.ajax({
              type: 'GET',
              dataType: "json",
              url: "./libs/php/getCountryRect.php?country=" + countryCode,
              success: function (country_data) {
              //  console.log(country_data);
                  const currencyCode = country_data['data']['currencyCode'];
                  const north = country_data['data']['north'];
                  const south = country_data['data']['south'];
                  const east = country_data['data']['east'];
                  const west = country_data['data']['west'];

                //  console.log(currencyCode);
                //  console.log(north);
                //  console.log(south);
                //  console.log(east);
                //  console.log(west);

                  let flagCode = country_data['data']['countCode'];
                  flagCode = flagCode.toLowerCase();
                
                  $('#capital').html(country_data['data']['capital']);
                  $('#population').html(country_data['data']['population']);
                  $('#currencyExchange').html('1 ' + country_data['data']['currencyCode'] + ' will exchange for:');
                  $('#flag').html('<img src=https://flagcdn.com/w40/' + flagCode + '.png srcset=https://flagcdn.com/w40/' + flagCode + '.png 2x width="40">');

                  $.ajax({
                  type: 'GET',
                  dataType: "json",
                  url: "./libs/php/citiesAPI.php",
                  data: {
                    north: north,
                    south: south,
                    east: east,
                    west: west 
                  },
                    success: function (city_data) {
                      console.log(city_data);

                      if (city_data.status.name == "ok") {

                        // console.log(city_data['data'][0]['lat']);
                        // console.log(city_data['data'][0]['lng']);
                        // console.log(city_data['data'][0]['name']);
                        // console.log(city_data['data'][0]['population']);
                        var markers = L.markerClusterGroup();
                        markers.addLayers(cityPopulationMarker(city_data["data"]));
                        markers.addTo(myMap);

                      }

                  // console.log(currencyCode);
                  // Exchange API call
                  $.ajax({
                      type: 'GET',
                      dataType: "json",
                      url: "./libs/php/exchangeAPI.php",
                      data: {
                        currencyCode: currencyCode
                      },
                      success: function (exchange_data) {
                          // console.log(exchange_data);
                          let dollar = exchange_data['data']['exchangeUsd'];
                          let pound = exchange_data['data']['exchangeGbp'];
                          let euro = exchange_data['data']['exchangeEur'];

                          if (dollar < 0.01) {
                            dollar = dollar;
                          } else {
                            dollar = dollar.toFixed(2);
                          }
                          if (pound < 0.01) {
                            pound = pound;
                          } else {
                            pound = pound.toFixed(2);
                          }
                          if (euro < 0.01) {
                            euro = euro;
                          } else {
                            euro = euro.toFixed(2);
                          }

                          $('#usd').html('$ ' + dollar);
                          $('#gbp').html('£ ' + pound);
                          $('#eur').html('€ ' + euro);
                          
                      },
                    // Exchange API error function
                      error: function (jqXHR, textStatus, errorThrown) {
                          // your error code
                          console.log('in error')
                          console.log(errorThrown);
                          console.log(textStatus)
                          console.log(jqXHR)

                      }
                  });
                },
                  // Exchange API error function
                  error: function (jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log('in error')
                  console.log(errorThrown);
                  console.log(textStatus)
                  console.log(jqXHR)

              }
          });
      },
              // CountryInfo API error function
              error: function (jqXHR, textStatus, errorThrown) {
                  // your error code
                  console.log('in error')
                  console.log(errorThrown);
                  console.log(textStatus)
                  console.log(jqXHR)
              }
          });
      },
      error: function (jqXHR, textStatus, errorThrown) {
          // console.log(errorThrown);
      }
  })

  // Weather API call
  $.ajax({
      type: 'GET',
      dataType: "json",
      url: "./libs/php/weatherAPI.php?country=" + countryName.replace(/ /g, ''),
      success: function (weather_data) {
          // console.log(weather_data);
          $('#weather').html(weather_data['data']['temperature']);
        },
        // Weather API error function
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log('in error')
            console.log(errorThrown);
            console.log(textStatus)
            console.log(jqXHR)

        }
    });
    // Wikipedia API call
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: "./libs/php/wikipediaAPI.php?country=" + countryName.replace(/ /g, ''),
        success: function (wiki_data) {
          // console.log(wiki_data);
          $('#wikiUrl').html('<a href=https://' + (wiki_data["data"]["wikipediaURL"]) + '" target="_blank">Wikipedia Page</a>');
          $('#wiki').html(wiki_data['data']['wikipedia']);
        },
        // Wikipedia API error function
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log('in error')
            console.log(errorThrown);
            console.log(textStatus)
            console.log(jqXHR)

        }
    });
    // L.easyButton('<span class="telrec">&telrec;</span>', function () {
    //   $('.info').modal('show');;
    //   }).addTo(myMap)
    if ($(".telrec")[0]) {
    $('.info').modal('show');
  } else {
    L.easyButton('<span class="telrec">&telrec;</span>', function () {
      $('.info').modal('show');
    }).addTo(myMap)
    $('.info').modal('show');
  } 
                            
});

// countryName will not always have a value so assigning a default value which can be overwritten
function getLocation(lat, lng, countryName = 'Your home') {

  L.marker([lat, lng]).addTo(myMap)
  .bindPopup("<h6>You selected </br>" + countryName + ".</h6>").openPopup();
  
 }
  
 // Get current users location and update map to coordinates found
 $(document).ready(function () {
   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(locationSuccess, showError);
   } else {
       alert('Your browser does not support location data retrieval or the user declined access.');
   }
 });

 function triggerDropdownFromLocation(lat, lng){
    $.ajax({
    url: "libs/php/countryCodeAPI.php",
    type: 'GET',
    dataType: 'json',
    data: {
      lat: lat,
      lng: lng
    },
      success: function(result) {
        console.log(result);
        $("#sel_country").val(result["data"]["countryCode"].toUpperCase()).change();
      },
      error: function(jqXHR){
        console.log(jqXHR);
      }
    })
 };

  
 function locationSuccess(position) {
   console.log(position)
   var lat = position.coords.latitude;
   var lng = position.coords.longitude;
   getLocation(lat, lng);
   triggerDropdownFromLocation(lat, lng);
 }
  
 function showError(error) {
   switch (error.code) {
       case error.PERMISSION_DENIED:
           getLocation(51.5079, 0.0877, "London");
           break;
       case error.POSITION_UNAVAILABLE:
           getLocation(51.5079, 0.0877, "London");
           break;
       case error.TIMEOUT:
           getLocation(51.5079, 0.0877, "London");
           break;
       case error.UNKNOWN_ERROR:
           getLocation(51.5079, 0.0877, "London");
           break;
   }
 }
  
 // Preloader
 $(window).on('load', function () {
   $('#loading').hide();
 })
