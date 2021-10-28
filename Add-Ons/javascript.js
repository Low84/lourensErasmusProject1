$(document).ready(function () {
  $("#sel_country").empty();
  $.ajax({
      type: "GET",
      dataType: "json",
      url: "./php/getCountries.php",
      success: function (data) {
          $.each(data, function (key, value) {
              $("#sel_country").append("<option value=" + value[1] + ">" + value[0] + "</option>");
          });
      }
  });
 
  $('#sel_country').change(function () {
  let countryName = $('#sel_country option:selected').text();
  $.ajax({
      type: "GET",
      dataType: "json",
      url: "./php/latAndLongAPI.php?country=" + countryName,
      success: function (data) {
          console.log(data);
          lat = data['data']['lat'];
          lng = data['data']['lng']
          getLocation(lat, lng, countryName);
          CountryInfo(data)
 
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
      }
 
  })
 
});
 
// Temp location for the modal trigger, ideally this should be moved to another function which will call the api's to get
// the oountries info
function CountryInfo(data) {
  $('#currency').html(data['currency']);
  $('#calling_code').html(data['calling']);
  $('#coord').html(data['coord']['lat'] + ' ' + data['coord']['lng']);
  $('#continent').html(data['continent']);
  $('#country').html(data['country']);
  $('#flag').html(data['flag']);
 
  $('.info').modal('show');
 
}
 
$('#btnRun').click(function () {
  let countryCode = $('#sel_country').val();
  console.log(countryCode);
  $.ajax({
      type: 'GET',
      url: "./php/countryInfoAPI.php?country=" + countryCode,
      success: function (data) {
 
          console.log(data);
 
          // if (result.status.name == "ok") {
 
              // $('#txtCapital').html(result['data'][0]['capital']);
          //     $('#txtLanguages').html(result['data'][0]['languages']);
          //     $('#txtPopulation').html(result['data'][0]['population']);
 
          // }
 
      },
      error: function (jqXHR, textStatus, errorThrown) {
          // your error code
          console.log('in error')
          console.log(errorThrown);
          console.log(textStatus)
          console.log(jqXHR)
 
      }
  });
 
  let countryName = $('#sel_country option:selected').text();
  console.log(countryName);
  $.ajax({
      type: 'GET',
      url: "./php/wikipediaAPI.php?country=" + countryName,
      dataType: "json",
      success: function (data) {
 
          console.log(data);
          console.log(data["data"]["wikipedia"]["wikipediaUrl"]);
          $('#wikiUrl').html(`<a href=https://${data[data"]["wikipedia"]["wikipediaUrl"]}" target="_blank">Click here to see more</a>`);
 
          // if (result.status.name == "ok") {
 
              // $('#txtCapital').html(result['data'][0]['capital']);
          //     $('#txtLanguages').html(result['data'][0]['languages']);
          //     $('#txtPopulation').html(result['data'][0]['population']);
 
          // }
 
      },
      error: function (jqXHR, textStatus, errorThrown) {
          // your error code
          console.log('in error')
          console.log(errorThrown);
          console.log(textStatus)
          console.log(jqXHR)
 
      }
  });
 
  countryName = $('#sel_country option:selected').text();
  console.log(countryName);
  $.ajax({
      type: 'GET',
      url: "./php/weatherAPI.php?country=" + countryName,
      success: function (data) {
 
          console.log(data);
 
          // if (result.status.name == "ok") {
 
              // $('#txtCapital').html(result['data'][0]['capital']);
          //     $('#txtLanguages').html(result['data'][0]['languages']);
          //     $('#txtPopulation').html(result['data'][0]['population']);
 
          // }
 
      },
      error: function (jqXHR, textStatus, errorThrown) {
          // your error code
          console.log('in error')
          console.log(errorThrown);
          console.log(textStatus)
          console.log(jqXHR)
 
      }
  });
 
});
 
// countryName will not always have a value so assigning a default value which can be overwritten
function getLocation(lat, lng, countryName = 'Your home') {
  var container = L.DomUtil.get('mapid'); if (container != null) { container._leaflet_id = null; }
  mymap = L.map('mapid').setView([lat, lng], 5);
 
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      {
          maxZoom: 18,
          attribution: 'Map data &copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors, ' +
              'Imagery © <a href=https://www.mapbox.com/>Mapbox</a>',
          id: 'mapbox/streets-v11',
          tileSize: 512,
          zoomOffset: -1
      }).addTo(mymap);
 
  L.marker([lat, lng]).addTo(mymap)
      .bindPopup("<h6>Hello!</h6><br />You selected " + countryName).openPopup();
 
  // Adds a circle to clicked area
  L.circle([lat, lng], 500, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
  }).addTo(mymap);
 
  // Adds a popup with clicked coordinates
  var popup = L.popup();
 
  function onMapClick(e) {
      popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(mymap);
  }
  mymap.on('click', onMapClick);
}
 
$(document).ready(function () {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(locationSuccess);
  } else {
      alert('Your browser does not support location data retrieval or the user declined access.');
  }
});
 
function locationSuccess(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  getLocation(lat, lng)
 
}
 
});
