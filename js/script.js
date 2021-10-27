// $('#btnRun').click(function() {
// console.log("Win")
//   $.ajax({
//     url: "./php/weatherAPI.php?country=" + countryName,
//     type: 'POST',
//     dataType: 'json',
//     // data: {
//     //   country: $('#sel_country option:selected').text()
//     // },
//     success: function(result) {

//       console.log(JSON.stringify(result));

//       if (result.status.name == "ok") {

//         $('#capital').html(result['location']['name']);
//         $('#curWeather').html(result['current']['temp_c']);
        
//       }
    
//     },
//     error: function(jqXHR, textStatus, errorThrown) {
//       // your error code
//       console.log(jqXHR);
//     }
//   }); 

// });




$('#btnRun').click(function() {

  $.ajax({
    url: "./php/countryInfoAPI.php?country=" + countryName,
    type: 'POST',
    dataType: 'json',
    data: {
      country: $('#selCountry').val()
    },
    success: function(result) {

      console.log(JSON.stringify(result));

      if (result.status.name == "ok") {

        $('#txtCapital').html(result['data'][0]['capital']);
        $('#txtLanguages').html(result['data'][0]['languages']);
        $('#txtPopulation').html(result['data'][0]['population']);

      }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(jqXHR);

    }
  }); 

});



































// let lat;
// let long;
// const successfulLookup = position => {
//   const { latitude, longitude } = position.coords;
//   fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=e629dbaaefe94793afde8b17b2947ad8`)
//     .then(response => response.json())
//     .then(console.log);

//     // console.log(latitude);
//     // console.log(longitude);
//   lat = latitude;
//   long = longitude;
  
//   var mymap = L.map('mapid').setView([lat, long], 14);

//   L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
//     maxZoom: 18,
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
//       'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1
//   }).addTo(mymap);

//   L.marker([lat, long]).addTo(mymap)
//     .bindPopup("<b>Hello!</b><br />This is your current location.").openPopup();

//   L.circle([lat, long], 500, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5
//   }).addTo(mymap).bindPopup("I am a circle.");

//   L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
//   ]).addTo(mymap).bindPopup("I am a polygon.");


//   var popup = L.popup();

//   function onMapClick(e) {
//     popup
//       .setLatLng(e.latlng)
//       .setContent("You clicked the map at " + e.latlng.toString())
//       .openOn(mymap);
//   }

//   mymap.on('click', onMapClick);
//   } 

//   window.navigator.geolocation
//   .getCurrentPosition(successfulLookup, console.log);










