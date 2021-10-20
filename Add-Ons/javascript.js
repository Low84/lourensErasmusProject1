
  $(document).on('change', '#countryList', function(){
   var country_id = $(this).val();
   if(country_id != '')
   {
    load_json_data('state', country_id);
   }
   else
   {
    $('#state').html('<option value="">Select state</option>');
    $('#city').html('<option value="">Select city</option>');
   }
  });
  $(document).on('change', '#state', function(){
   var state_id = $(this).val();
   if(state_id != '')
   {
    load_json_data('city', state_id);
   }
   else
   {
    $('#city').html('<option value="">Select city</option>');
   }
  });
 });

  
  // Country Info API
  $('#countrySelect').click(function() {

    $.ajax({
      url: "./php/countryInfoAPI.php",
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#selCountry').val()
      },
      success: function(result) {

        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

          $('#txtContinent').html(result['data'][0]['continent']);
          $('#txtCapital').html(result['data'][0]['capital']);
          $('#txtLanguages').html(result['data'][0]['languages']);
          $('#txtPopulation').html(result['data'][0]['population']);
          $('#txtCountryCode').html(result['data'][0]['countryCode']);
          // Also has options for west north east south coordinates
        }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);

      }
    }); 

  });
  
  // Wikipedia api script
  $('#countrySelect').click(function() {

		$.ajax({
			url: "./php/wikipediaAPI.php",
			type: 'POST',
			dataType: 'json',
			data: {
				country: $('#country').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#title').html(result['data'][0]['title']);
					$('#summary').html(result['data'][0]['summary']);
					$('#feature').html(result['data'][0]['feature']);
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
        console.log(jqXHR);
			}
		}); 
	
	});

  // Current Weather API
  $('#countrySelect').click(function() {

    $.ajax({
      url: "./php/weatherAPI.php",
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#selCountry').val()
      },
      success: function(result) {

        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

          $('#tempC').html(result['data'][0]['temp_c']);
          $('#tempF').html(result['data'][0]['temp_f']);
          $('#feelsLikeC').html(result['data'][0]['feelslike_c']);
          $('#feelsLikeF').html(result['data'][0]['feelslike_f']);
        }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);

      }
    }); 

  });

  // Current exchange rate API
  $('#countrySelect').click(function() {

    $.ajax({
      url: "./php/exchangeAPI.php",
      type: 'POST',
      dataType: 'json',
      data: {
        country: $('#selCountry').val()
      },
      success: function(result) {

        console.log(JSON.stringify(result));

        if (result.status.name == "ok") {

          $('#gbp').html(result['data'][0]['GBP']);
          $('#usd').html(result['data'][0]['USD']);
          $('#eur').html(result['data'][0]['EUR']);
        }
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // your error code
        console.log(jqXHR);

      }
    }); 

  });