$(document).ready(function () {

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

$('#sel_country').change(function () {
  let countryName = $('#sel_country option:selected').text();
  let countryCode = $('#sel_country').val();
  let currencyCode;
  $.ajax({
      type: "GET",
      dataType: "json",
      url: "./libs/php/latAndLongAPI.php?country=" + countryName.replace(/ /g, ''),
      success: function (geo_data) {
          console.log(geo_data);
          lat = geo_data['data']['lat'];
          lng = geo_data['data']['lng']
          getLocation(lat, lng, countryName);

          // CountryInfo API call
          $.ajax({
              type: 'GET',
              url: "./libs/php/countryInfoAPI.php?country=" + countryCode,
              success: function (country_data) {
                  country_data = $.parseJSON(country_data)
                  currencyCode = country_data['data']['currencyCode'];
                  console.log(currencyCode)

                  // Exchange API call
                  $.ajax({
                      type: 'GET',
                      url: "./libs/php/exchangeAPI.php?currencyCode=" + currencyCode,
                      success: function (exchange_data) {
                          exchange_data = $.parseJSON(exchange_data)
                          console.log(exchange_data['data']['exchangeUsd']);
                          console.log(exchange_data['data']['exchangeGbp']);
                          console.log(exchange_data['data']['exchangeEur']);

                          // Weather API call
                          $.ajax({
                              type: 'GET',
                              url: "./libs/php/weatherAPI.php?country=" + countryName.replace(/ /g, ''),
                              success: function (weather_data) {
                                  weather_data = $.parseJSON(weather_data)
                                  // Wikipedia API call
                                  $.ajax({
                                      type: 'GET',
                                      url: "./libs/php/wikipediaAPI.php?country=" + countryName.replace(/ /g, ''),
                                      success: function (wiki_data) {
                                          wiki_data = $.parseJSON(wiki_data)
                                          CountryInfo(geo_data, country_data, exchange_data, weather_data, wiki_data)

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
});

// Temp location for the modal trigger, ideally this should be moved to another function which will call the api's to get
// the oountries info
function CountryInfo(geo_data, country_data, exchange_data, weather_data, wiki_data) {
  $('#currency').html(geo_data['currency']);
  $('#calling_code').html('+' + geo_data['calling']);
  $('#coord').html(geo_data['coord']['lat'] + ' ' + geo_data['coord']['lng']);
  $('#continent').html(geo_data['continent']);
  $('#country').html(geo_data['country']);
  $('#countryName').html(geo_data['country']);

  // From countryInfoAPI
  let flagCode = country_data['data']['countCode'];
  flagCode = flagCode.toLowerCase();

  $('#capital').html(country_data['data']['capital']);
  $('#population').html(country_data['data']['population']);
  $('#currencyExchange').html('1 ' + country_data['data']['currencyCode'] + ' will exchange for:');
  $('#flag').html('<img src="https://flagcdn.com/w40/' + flagCode + '.png" srcset="https://flagcdn.com/w40/' + flagCode + '.png 2x" width="40">');


  // From exchangeAPI
  let dollar = exchange_data['data']['exchangeUsd'];
  let pound = exchange_data['data']['exchangeGbp'];
  let euro = exchange_data['data']['exchangeEur'];
  dollar = dollar.toFixed(2);
  pound = pound.toFixed(2);
  euro = euro.toFixed(2);
  $('#usd').html('$ ' + dollar);
  $('#gbp').html('£ ' + pound);
  $('#eur').html('€ ' + euro);

  // From weatherAPI
  $('#weather').html(weather_data['data']['temperature'] + '°C');

  // From wikipediaAPI
  $('#wikiUrl').html('<a href="https://' + (wiki_data["data"]["wikipediaURL"]) + '" target="_blank">Wikipedia Page</a>');
  $('#wiki').html(wiki_data['data']['wikipedia']);

  // Modal
  $('.info').modal('show');

}

// countryName will not always have a value so assigning a default value which can be overwritten
function getLocation(lat, lng, countryName = 'Your home') {
  var container = L.DomUtil.get('mapid'); if (container != null) { container._leaflet_id = null; }
  myMap = L.map('mapid').setView([lat, lng], 5.5);

  applyCountryBorder(myMap, countryName);

  function applyCountryBorder(myMap, countryName) {
    jQuery
      .ajax({
        type: "GET",
        dataType: "json",
        url:
          "https://nominatim.openstreetmap.org/search?country=" +
          countryName.trim() +
          "&polygon_geojson=1&format=json"
      })
      .then(function(data) {
        
        L.geoJSON(data[0].geojson, {
          color: "#04446b",
          weight: 4,
          opacity: 1,
          fillColor: '#04446b',
          fillOpacity: 0.3 
        }).addTo(myMap);
      
      });
    }
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
              'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1
      }).addTo(myMap);

  L.marker([lat, lng]).addTo(myMap)
      .bindPopup("<h6>You selected </br>" + countryName + ".</h6>").openPopup();
  
      // clustermarkers code

      var myURL = jQuery('script[src$="script.js"]')
        .attr('src')
        .replace('script.js', '')

      var myIcon = L.icon({
        iconUrl: myURL + '../images/pin24.png',
        iconRetinaUrl: myURL + '../images/pin48.png',
        iconSize: [29, 24],
        iconAnchor: [9, 21],
        popupAnchor: [0, -14],
      })

      var markerClusters = L.markerClusterGroup()

      for (var i = 0; i < markers.length; ++i) {
        var popup =
          '<div id="markerPopup"><b>' + markers[i].name + '</b>' +
          '<hr/>' +
          markers[i].city +
          '<br/><b>IATA/FAA:</b> ' +
          markers[i].iata_faa +
          '<br/><b>ICAO:</b> ' +
          markers[i].icao +
          '<br/><b>Altitude:</b> ' +
          Math.round(markers[i].alt * 0.3048) +
          ' m' +
          '<br/><b>Timezone:</b> ' +
          markers[i].tz + '</div>'

        var m = L.marker([markers[i].lat, markers[i].lng], {
          icon: myIcon,
        }).bindPopup(popup)

        markerClusters.addLayer(m)
      }

      myMap.addLayer(markerClusters)

      // end of clustermarkers code

  // Adds a circle to clicked area
  L.circle([lat, lng], 500, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
  }).addTo(myMap);


  // Adds a popup with clicked coordinates
  // var popup = L.popup();

  // function onMapClick(e) {
  //     popup
  //         .setLatLng(e.latlng)
  //         .setContent("You clicked the map at " + e.latlng.toString())
  //         .openOn(myMap);
  // }
  // myMap.on('click', onMapClick);

}

// Get current users location and update map to coordinates found
$(document).ready(function () {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationSuccess, showError);
  } else {
      alert('Your browser does not support location data retrieval or the user declined access.');
  }
});

function locationSuccess(position) {
  console.log(position)
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  getLocation(lat, lng)
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
