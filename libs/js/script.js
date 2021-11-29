let myMap;
let border;
let markers;


// Loading the map at start up 
$(document).ready(function () {
 
  myMap = L.map('mapid').setView([51.505, -0.09], 5.5);
 
   // Tile layer for leaflet
   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
   {
       maxZoom: 18,
       attribution: 'Map data &copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors, ' +
           'Imagery © <a href=https://www.mapbox.com/>Mapbox</a></div>' ,
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

// Icon for map
// const cityIcon = L.icon({
//   iconUrl: './libs/images/location.png',
//   shadowUrl: './libs/images/markers_shadow.png',

//   iconSize:     [64, 64], // size of the icon
//   shadowSize:   [64, 64], // size of the shadow
//   iconAnchor:   [32, 70], // point of the icon which will correspond to marker's location 
//   shadowAnchor: [34, 72],  // the same for the shadow
//   popupAnchor:  [100, 150] // point from which the popup should open relative to the iconAnchor
// })

// var redMarker = L.ExtraMarkers.icon({
//   icon: '<i class="fa fa-map-marker fa-4x"></i>',
//   markerColor: 'red',
//   shape: 'square',
//   prefix: 'fa'
// });

 let c=0;
 function applyCountryBorder(code) {
   console.log(code);
  if(border) {
    border.clearLayers();
  }
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
       console.log(data);

       border = L.geoJSON(data, {
         color: "#04446b",
         weight: 4,
         opacity: 1,
         fillColor: '#04446b',
         fillOpacity: 0.3 
       });
       border.addTo(myMap);
  
       myMap.fitBounds(border.getBounds());
       console.log(c);
       c++;
     
     }).catch(function(err){
       console.log(err);
     });
   };

  // Function for cluster markers
  markers = L.markerClusterGroup();                  

  function cityPopulationMarker(city_data){
    var markerArr = [];
    var weather;

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
            '<span class="markClustPopup">Population: </span>' + population + '</span></div>'
        marker.bindPopup(popup);
        markerArr.push(marker);
    }
    return markerArr;
}




$('#sel_country').change(function () {
  let countryName = $('#sel_country option:selected').text();
  let countryCode = $('#sel_country').val();
  console.log(countryName);
  console.log(countryCode);
  applyCountryBorder(countryCode);   
  let date = new Date()
  let day = date.getDate();
  let month = date.getMonth()+1;
  let year = date.getFullYear();
  let fullDate = `${year}-${month}-${day}.`;

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "libs/php/latAndLongAPI.php",
    data: {
      country: encodeURI(countryName)
    },

      success: function (geo_data) {
          console.log(geo_data);

          lat = geo_data['data']['lat'];
          lng = geo_data['data']['lng'];
          
          // Function that binds a popup on the map to show country name
         
          getLocation(lat, lng, countryName);

          $('#currency').html(geo_data['currency']);
          $('#calling_code').html('+' + geo_data['calling']);
          $('#continent').html(geo_data['continent']);
          $('#country').html(geo_data['country']);
          $('#countryName').html(geo_data['country']);
  
          // CountryInfo API call
          $.ajax({
              type: 'GET',
              dataType: "json",
              url: "./libs/php/getCountryRect.php",
              data: {
                countryCode: countryCode
              },

                success: function (country_data) {
                console.log(country_data);
                    const currencyCode = country_data['data']['currencyCode'];
                    const north = country_data['data']['north'];
                    const south = country_data['data']['south'];
                    const east = country_data['data']['east'];
                    const west = country_data['data']['west'];

                    console.log(currencyCode);
                    console.log(north);
                    console.log(south);
                    console.log(east);
                    console.log(west);

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
                        // console.log(city_data);

                        if (city_data.status.name == "ok") {

                          console.log(city_data['data'][0]['lat']);
                          console.log(city_data['data'][0]['lng']);
                          console.log(city_data['data'][0]['name']);
                          console.log(city_data['data'][0]['population']);
                          if(markers){
                            markers.clearLayers();
                          }
                          
                          markers = L.markerClusterGroup();                  
                          markers.addLayers(cityPopulationMarker(city_data["data"]));
                          markers.addTo(myMap);

                        }

                        // Exchange API call
                        $.ajax({
                          type: 'GET',
                          dataType: "json",
                          url: "./libs/php/exchangeAPI.php",
                          data: {
                            currencyCode: currencyCode
                          },

                          success: function (exchange_data) {
                            console.log(exchange_data);
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
      url: "./libs/php/weatherAPI.php",
      data:{
        country: encodeURI(countryName)
      },

      success: function (weather_data) {
          // var today = new Date();
          // var dd = String(today.getDate()).padStart(2, '0');
          // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          // var yyyy = today.getFullYear();

          // switch(mm) {
          //   case mm === '1':
          //     mm = 'Jan';
          //     break;
          //   case mm === '2':
          //     mm = 'Feb';
          //     break;
          //   case mm === '3':
          //     mm = 'Mar';
          //     break;
          //   case mm === '4':
          //     mm = 'Apr';
          //     break;
          //   case mm === '5':
          //     mm = 'May';
          //     break;
          //   case mm === '6':
          //     mm = 'Jun';
          //     break;
          //   case mm === '7':
          //     mm = 'Jul';
          //     break;
          //   case mm === '8':
          //     mm = 'Aug';
          //     break;
          //   case mm === '9':
          //     mm = 'Sep';
          //     break;
          //   case mm === '10':
          //     mm = 'Oct';
          //     break;
          //   case mm === '11':
          //     mm = 'Nov';
          //     break;
          //   case mm === '12':
          //     mm = 'Dec';
          //     break;
          // }

          // if(dd === '01' || dd === '21') {
          //   dd = dd + 'st of ';
          // } else if (dd === '02' || '22') {
          //   dd = dd +'nd of ';
          // } else if (dd === '03' || dd === '23') {
          //   dd = dd + 'rd of ';
          // } else

          // today = mm + '/' + dd + '/' + yyyy;

          console.log(weather_data);
          $('#weather').html(weather_data['data']['tempDayOne']);
          $('#countryWeatherName').html(weather_data['data']['countryWeatherName']);

          let iconDayOne = $('#iconDayOne').html(weather_data['data']['iconDayOne']);
          $('#iconDayOne').html('<img src=http://openweathermap.org/img/wn/' + iconDayOne + '@2x.png');

          $('#tempMaxDayOne').html(weather_data['data']['tempMaxDayOne']);
          $('#WeatherDescription').html(weather_data['data']['WeatherDescription']);
          $('#tempMinDayOne').html(weather_data['data']['tempMinDayOne']);
          $('#feelsLikeDayOne').html(weather_data['data']['feelsLikeDayOne']);

          let iconDayTwo = $('#iconDayTwo').html(weather_data['data']['iconDayTwo']);
          $('#iconDayOne').html('<img src=http://openweathermap.org/img/wn/' + iconDayTwo + '@2x.png');
          
          $('#tempMaxDayTwo').html(weather_data['data']['tempMaxDayTwo']);

          let iconDayThree = $('#iconDayThree').html(weather_data['data']['iconDayThree']);
          $('#iconDayOne').html('<img src=http://openweathermap.org/img/wn/' + iconDayThree + '@2x.png');

          $('#iconDayThree').html(weather_data['data']['iconDayThree']);
          $('#tempMaxDayThree').html(weather_data['data']['tempMaxDayThree']);
          $('#tempMinDayTwo').html(weather_data['data']['tempMinDayTwo']);
          $('#tempMinDayThree').html(weather_data['data']['tempMinDayThree']);
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
    console.log(countryName);
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: "./libs/php/wikipediaAPI.php",
        data:{
          country: encodeURI(countryName)
        },
        success: function (wiki_data) {
          console.log(wiki_data);
          console.log(wiki_data["data"]["wikipediaURL"]);
          $('#wikiUrl').html('<a href=https://' + (wiki_data["data"]["wikipediaURL"]) + ' target="_blank">Wikipedia Page</a>');
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
    // News API call
    $.ajax({
      type: 'GET',
      dataType: "json",
      url: "./libs/php/newsAPI.php",
      data:{
        country: encodeURI(countryName),
        date: fullDate
      },

      success: function (news_data) {        
          console.log(news_data);

          $('#titleOne').html(news_data['data']['titleOne']);
          $('#descriptionOne').html(news_data['data']['descriptionOne']);
          $('#urlOne').html('Read more ' + '<a href=https://' + (news_data["data"]["urlOne"]) + ' target="_blank">Wikipedia Page</a>');

          $('#titleTwo').html(news_data['data']['titleTwo']);
          $('#descriptionTwo').html(news_data['data']['descriptionTwo']);
          $('#urlTwo').html('Read more ' + '<a href=https://' + (news_data["data"]["urlTwo"]) + ' target="_blank">Wikipedia Page</a>');

          $('#titleThree').html(news_data['data']['titleThree']);
          $('#descriptionThree').html(news_data['data']['descriptionThree']);
          $('#urlThree').html('Read more ' + '<a href=https://' + (news_data["data"]["urlThree"]) + ' target="_blank">Wikipedia Page</a>');

        },
        // News API error function
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log('in error')
            console.log(errorThrown);
            console.log(textStatus)
            console.log(jqXHR)

        }
      });

      // Covid API call
      $.ajax({
        type: 'GET',
        dataType: "json",
        url: "./libs/php/covidAPI.php",
        data:{
          countryCode: countryCode
        },

        success: function (covid_data) {
            console.log(covid_data);

            $('#cases').html(covid_data['data']['cases']);
            $('#active').html(covid_data['data']['active']);
            $('#recovered').html(covid_data['data']['recovered']);
            $('#deaths').html(covid_data['data']['deaths']);
            $('#tests').html(covid_data['data']['tests']);

          },
          // Covid API error function
          error: function (jqXHR, textStatus, errorThrown) {
              // your error code
              console.log('in error')
              console.log(errorThrown);
              console.log(textStatus)
              console.log(jqXHR)

          }
      });

    if ($(".telrec")[0]) {
      $('.info').modal('show');
    } else {
      L.easyButton('<span class="telrec">&telrec;</span>', function () {
        $('.info').modal('show');
      }).addTo(myMap);
    $('.info').modal('show');
    } 

    if ($(".&curren")[0]) {
      $('.weather').modal('show');
    } else {
      L.easyButton('<span class="&curren"&curren;</span>', function () {
        $('.weather').modal('show');
      }).addTo(myMap);
    $('.weather').modal('show');
    }

    if ($(".&equiv")[0]) {
      $('.news').modal('show');
    } else {
      L.easyButton('<span class="&equiv">&&equiv;</span>', function () {
        $('.news').modal('show');
      }).addTo(myMap);
    $('.news').modal('show');
    } 

    if ($(".&midast")[0]) {
      $('.covid').modal('show');
    } else {
      L.easyButton('<span class="&midast">&midast;</span>', function () {
        $('.covid').modal('show');
      }).addTo(myMap);
    $('.covid').modal('show');
    } 
                            
});

// countryName will not always have a value so assigning a default value which can be overwritten
function getLocation(lat, lng, countryName = 'Your home') {
  
  // L.marker([lat, lng], {icon: countryIcon}).addTo(myMap)
  // .bindPopup("<h6>You selected </br>" + countryName + ".</h6>").openPopup();
  
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
        $("#sel_country").val(result["data"]["countryCode"].trim().toUpperCase()).change();
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

