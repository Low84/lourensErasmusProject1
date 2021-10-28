        $(document).ready(function () {
            $("#sel_country").empty();
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "libs/php/getCountries.php",
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
            $.ajax({
                type: "GET",
                dataType: "json",
                url: "libs/php/latAndLongAPI.php?country=" + countryName,
                success: function (geo_data) {
                    console.log(geo_data);
                    lat = geo_data['data']['lat'];
                    lng = geo_data['data']['lng']
                    getLocation(lat, lng, countryName);

                    // CountryInfo API call
                    $.ajax({
                        type: 'GET',
                        url: "libs/php/countryInfoAPI.php?country=" + countryCode,
                        success: function (country_data) {
                            country_data = $.parseJSON(country_data)

                            // Weather API call
                            $.ajax({
                                type: 'GET',
                                url: "libs/php/weatherAPI.php?country=" + countryName,
                                success: function (weather_data) {
                                  weather_data = $.parseJSON(weather_data)
                                  // Wikipedia API call
                                  $.ajax({
                                      type: 'GET',
                                      url: "libs/php/wikipediaAPI.php?country=" + countryName,
                                      success: function (wiki_data) {
                                          wiki_data = $.parseJSON(wiki_data)
                                          CountryInfo(geo_data, country_data, weather_data, wiki_data) 

                                      },
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
                                    // your error code
                                    console.log('in error')
                                    console.log(errorThrown);
                                    console.log(textStatus)
                                    console.log(jqXHR)

                                }
                            });

                        },
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
        function CountryInfo(geo_data, country_data, weather_data, wiki_data) {
            $('#currency').html(geo_data['currency']);
            $('#calling_code').html(geo_data['calling']);
            $('#coord').html(geo_data['coord']['lat'] + ' ' + geo_data['coord']['lng']);
            $('#continent').html(geo_data['continent']);
            $('#country').html(geo_data['country']);
            $('#flag').html(geo_data['flag']);
            // From countryInfoAPI
            $('#capital').html(country_data['data']['capital']);
            $('#population').html(country_data['data']['population']);
            // From weatherAPI
            $('#weather').html(weather_data['data']['temperature'] + '°C');
            // From wikipediaAPI
            $('#wikiUrl').html(wiki_data['data']['wikipediaURL']);
            $('#wiki').html(wiki_data['data']['wikipedia']);


            $('.info').modal('show');

        }

        // countryName will not always have a value so assigning a default value which can be overwritten
        function getLocation(lat, lng, countryName = 'Your home') {
            var container = L.DomUtil.get('mapid'); if (container != null) { container._leaflet_id = null; }
            mymap = L.map('mapid').setView([lat, lng], 5);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
                {
                    maxZoom: 18,
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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

        // Get current users location and update map to coordinates found
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