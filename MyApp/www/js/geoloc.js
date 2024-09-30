//PUBLIC
var placeSearch, autocomplete, myDestMarker = 0;
var mapDivID = 'map';
var myLatlng, address,myCurrentMarker;
var mycountry='KE';
var markerautocomplete,posLat,posLong,geoname;

var contentString ='';/* '<div class="list-block media-list">' +
					  '<div class="item-inner">' +
						'<div class="item-title-row">' +
							'<div class="item-title" id="popAdd"></div>' +
						'</div>' +
						'<div class="item-subtitle">Type/Drag pointer to change</div>' +
						'<div class="item-text">' +
							'<input style="z-index:24000" type="hidden" name="destcords" placeholder="Branch Location" readonly="readonly" id="map-home-cords"/>' +
							'<input type="text" name="destination" placeholder="Branch Location" id="home-map-auto" style="font-size:15px; border-bottom:1px solid #d1caca; color:#000" />' +
						'</div>' +
					  '</div>' +
					'</div>'; */


var onGeoError = function (error)
{
  if (error.code == 3)
  {
    alert("please turn on your location settings");
  }
  else
  {
    alert("Having problem getting your location" +
      "Message: " + error.message + "\n");
  }

}

var getGeoOptions = function ()
{
  var enableHighAccuracy = true;
  var maximumAge = 1500;
  var timeout = 60000;

  return {
    maximumAge: maximumAge,
    timeout: timeout,
    enableHighAccuracy: enableHighAccuracy
  }
}


function distanceBetween(origin, desti, service, callback)
{
  service.getDistanceMatrix(
  {
    origins: [origin],
    destinations: [desti],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: false
  }, function (response, status)
  {
    if (status !== 'OK')
    {
      alert('Error was: ' + status);
    }
    else
    {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;

      //deleteMarkers(markersArray);
      var distance = 0;
      var results = response.rows[0].elements;
      console.log(results);
      distance = results[0].distance.value / 1000;
      duration = 'Distance: ' + distance + '<br>Duration: ' + results[0].duration.text + '<br> ';
      if (callback != '')
      {
        $$.post(backend + 'en.php',
        {
          d: distance,
          password: authToken
        }, function (data)
        {
          $$(callback).html(duration + data);
          data = JSON.parse(data);
          feeO = data.price;
          console.log('tempData Load was performed' + data.price);
          durformat = results[0].duration.text;
          durformat = durformat.replace(" hours", "H");
          durformat = durformat.replace(" mins", "m");
          var distnenos = '<div style="text-align:center"><span class="disnenos small"><i class="fa fa-map-marker"></i>' + distance + 'Kms</span>';
			  distnenos += '<span class="disnenos" style="color:#000"><i class="fa fa-dot-circle-o"></i>' + data.price + '/-</span>';
			  distnenos += '<span class="disnenos small"><i class="fa fa-clock-o"></i>' + durformat + '</span></div>';
			  $("#distnenos").html(distnenos);
        });
      }

      return distance;


    }
  });

}

function detailMap()
{
var tilesloaded=false;
  var onGeoSuccess = function (position)
  {
    // alert('s');
    //$('#snitch').prepend("located you...<br>");
    posLat = position.coords.latitude;
    posLong = position.coords.longitude;
	
    console.log('detail' + posLat + ',' + posLong);
	
    getAddress(posLat, posLong, "x");
	
    myLatlng = new google.maps.LatLng(posLat, posLong);
	console.log("mylatlng " + myLatlng);
	
    var mapOptions = {
      zoom: 10,
      maxZoom: 15,
      center: myLatlng,
      mapTypeId: 'roadmap'
    };
	var mapDiv=document.getElementById(mapDivID);
    if (typeof(mapDiv) != 'undefined' && mapDiv != null){
		mapDiv.style.zIndex = "100";
		mapDiv.style.height = "250px";
		

		//google API
		map = new google.maps.Map(mapDiv, mapOptions);
		//--var trafficLayer = new google.maps.TrafficLayer();
		//--service = new google.maps.DistanceMatrixService();
		bounds = new google.maps.LatLngBounds();

		//initialise
		bounds.extend(myLatlng);
		//--trafficLayer.setMap(map);

		//current position marker	
		//$('#snitch').prepend("gathering your position point...<br>");				
		myCurrentMarker = new google.maps.Marker(
		{
		  position: myLatlng,
		  map: map,
		  draggable: true,
		  title: 'Pick Up Point '
		});

		//listening to dragging of current position
		google.maps.event.addListener(myCurrentMarker, 'dragend', function (ev)
		{
		  myLatlng = myCurrentMarker.getPosition();
		  
		  //calculate new distance
		 /*  
		  if (distance)
		  {
			  console.log(distance);
		   //-- fillInAddress();
			//console.log("attempt");
		  } */
		  //var myLatLong_s = myLatlng.split(",");
		  console.log(ev.latLng.lat() + ", " + ev.latLng.lng());
		  //console.log(myLatlng.lat());
		  myLatlng=ev.latLng;
		  newHome = getAddress(ev.latLng.lat(), ev.latLng.lat(), "popAdd,derivedAddress");
		  console.log(newHome);
		  bounds.extend(myLatlng);
		  map.setCenter(myLatlng);
		});

		//change map when phone size changes
		google.maps.event.addListener(mapDiv, 'resize', function ()
		{
		  console.log('resized');
		  bounds.extend(myLatlng);
		  map.setCenter(myLatlng);
		});
		
		directionsDisplay = new google.maps.DirectionsRenderer(
		{
		  polylineOptions:
		  {
			strokeColor: "#9f2eb3",
			strokeWeight: 5
		  },
		  suppressMarkers: true
		});
		
		directionsService = new google.maps.DirectionsService;
		directionsDisplay.setMap(map);
		directionsDisplay.setOptions(
		{
		  suppressMarkers: true
		});
		
		map.fitBounds(bounds);
		map.panToBounds(bounds);
		//map.maxZoom(15);
		//$('#snitch').prepend("loading google map...<br>");
		$("#map").show();

		console.log("starting to load");
		//var partsOfStr = address.split(',');
		//$('#popAdd').html(partsOfSt[0] + partsOfSt[1]);
		//$("#mapwait").hide();
		

		map.addListener('tilesloaded', function ()
		{
		  //$('#snitch').prepend("map loaded...<br>");
		  console.log("tiles loaded");
		  $('.pac-container').css("z-index","9000");
		  if(!tilesloaded){
		 var infowindow = new google.maps.InfoWindow(
								{
								  content: contentString
								});
														
		infowindow.open(map, myCurrentMarker);
		
		  markerautocomplete = new google.maps.places.Autocomplete((document.getElementById("map-auto")));
		  
		  markerautocomplete.setComponentRestrictions({'country': mycountry});
		  $$('body').on(
			'touchstart',
			'.pac-container',
			function (e)
			{
			  console.log('touchstart on marker');
			  e.stopImmediatePropagation();
			}
		  );
		  console.log("imarker auto ready");
		  markerautocomplete.addListener('place_changed', changeHomeAddress);
		  tilesloaded=true;
		  }else{
			  
		  }
		});
	}
	console.log("loaded map");
	//initAutocomplete();
	 geoSucceded=true;
	 
  }

  var onGeoError = function (error)
  {
    console.log("failed");
	console.error(error);
	checkDiagnostics();
    //$('#snitch').prepend("I cannot locate you, retrying...<br>");
   //retrial++;
    //detailMap();
  }
  navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, getGeoOptions());
  
};




function initAutocomplete()
{
	return true;
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete((document.getElementById('xmap-auto')));
   console.log('starting autocomplete');
   console.log(autocomplete);
   console.log($('#map-auto'));
  $$('body').on('touchstart', '.pac-container', function (e)
  {
    console.log('touchstart');
    e.stopImmediatePropagation();
  });
  console.log("auto ready");
  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  //alert()
  autocomplete.addListener('place_changed', fillInAddress);
  //alert()
}

function fillInAddress()
{
  // Get the place details from the autocomplete object.
  //alert('f');
  //disable savemode
  console.log("place changed");
  $('input[type=submit]', this).attr('disabled', 'disabled');
  $('form').bind('submit', function (e)
  {
    e.preventDefault();
  });
  //analyse input
  var place = autocomplete.getPlace();
  var cords = place.geometry.location;
  console.log("fill addr cords : " + cords);
  console.log("fill addr place : " + place);
  $('#map-auto-cords').val(cords);
  //check if marker exists

  if (myDestMarker == 0)
  {
    myDestMarker = new google.maps.Marker(
    {
      position: cords,
      map: map,
      draggable: false,
      title: 'Drop Off Up Point '
    });
  }
  else
  {
    myDestMarker.setPosition(cords);
  }

  var contentString2 = '<b>Parcel will go here</b>';
  var infowindow2 = new google.maps.InfoWindow(
  {
    content: contentString2
  });
  map.setCenter(cords);
  infowindow2.open(map, myDestMarker);
  bounds.extend(myDestMarker.getPosition());
  map.fitBounds(bounds);
  map.panToBounds(bounds);

  var origin = myLatlng;
  console.log(origin);
  desti = cords;
  console.log(cords);
  var service = new google.maps.DistanceMatrixService();


  var request = {
    origin: origin,
    destination: desti,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  directionsDisplay.setMap(map);
  directionsService.route(request, function (response, status)
  {
    if (status == 'OK')
    {
      directionsDisplay.setDirections(response);
    }
  });

  distance = distanceBetween(origin, desti, service, '.tempData');

  //enable submit
  $('input[type=submit]', this).removeAttr('disabled', 'disabled');
  $('form').unbind('submit');


}

function distcallback()
{
  $$.post(backend + 'en.php',
  {
    d: distance,
    password: authToken
  }, function (data)
  {
    $$('.tempData').html(data);
    console.log('tempData Load was performed');
  });
}

function onRequestSuccess(success)
{
  console.log("Successfully requested accuracy: " + success.message);
}

function onRequestFailure(error)
{
  console.error("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
  if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED)
  {
    if (window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?"))
    {
      cordova.plugins.diagnostic.switchToLocationSettings();
    }
  }
}

var noteUp = 0;

function checkDiagnostics()
{

  if (cordova.plugins.diagnostic !== null && typeof cordova.plugins.diagnostic === 'object')
  {
    console.log('stepin Event: ');
    cordova.plugins.diagnostic.isLocationAvailable(
      function (available)
      { //onSuccess
        if (!available && noteUp == 0)
        {
          noteUp = 1;
          myApp.addNotification(
          {
            title: 'LocationSettings',
            message: 'Unable to read your Location, Please turn on Location.',
            button:
            {
              text: 'Enable',
              color: 'red'
            },
            onClose: function ()
            {
              /*check again iflocation is avaialble*/
              cordova.plugins.diagnostic.isLocationAvailable(
                function (available) //Onsuccess
                {
                  /*if still not available open settings*/
                  if (!available) cordova.plugins.diagnostic.switchToLocationSettings();
                },
                function (error)
                { //onError of second check
                  console.log('diagnostic error ');
                }
              );
              noteUp = 0;
            } //end of onclose notification action
          }); //end of notification

        } //end if not availalbe on 1st check
        //fire a listener
        checkLocationStateChanges();
        console.log('location set as ' + (available ? 'on' : 'off'));
      }, /*end function of first location check success run*/

      function (error)
      { //process error on 1st location check
        console.log('diagnostic error ');
      }
    );
  }
  else
  {
    console.log('Diagnostic plugin must be missing');
  }

}

function checkLocationStateChanges()
{
  cordova.plugins.diagnostic.registerLocationStateChangeHandler(function (state)
  {
    console.log("Location state changed to: " + state);
    myApp.closeNotification(".notification-item");
    checkDiagnostics();
  }, function (error)
  {
    console.error("Error registering for location state changes: " + error);
  });
}


function getAddress(latitude, longitude, id)
{
	posLat=latitude;
	posLong=longitude;
	
  var lat =  latitude; //pass latitude value..
  var lng = longitude; //pass longitude value..
  console.log('add for ' + lat + ',' + lng);
  var jsonurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyB0UIJUw6AWGyC4p6kk0-Bgft0VveASxow&sensor=true";
  //console.log(jsonurl);
  $.getJSON(jsonurl, function (json)
  {
	  console.log(json);
    //result contains json
    //request.done(function( msg ) {
		
    
    if (json.status != 'ZERO_RESULTS')
    {
		var lastelem=json.results[0].address_components.length - 1;
		console.log(lastelem);
	mycountry=json.results[0].address_components[lastelem].short_name;
		console.log(markerautocomplete);
		if(mycountry!='' && markerautocomplete===null){
			markerautocomplete.setComponentRestrictions({'country': mycountry});
		}
      address = json.results[0].formatted_address;
	  if(address.indexOf("Unnamed") >= 0){
		address = json.results[1].formatted_address;
	  }
    }
    else
    {
      address = latitude+", "+longitude;
    }
    console.log("sum" + address);
	geoname=address;
    var brokenAddr = address.split(',');
	var brokenId= id.split(',');
   brokenId.forEach(function(id){
	   if (id != "x")
    {
      $('#' + id).html(brokenAddr[0] + brokenAddr[1]);
    }
   });
   $('#map-auto').val(brokenAddr[0] + brokenAddr[1]);
    var brokenAddr = address.split(',');
     //contentString= brokenAddr[0] + brokenAddr[1];
	
  });
  return address;

}

function changeHomeAddress()
{
  var homeplace = markerautocomplete.getPlace();
  console.log(homeplace);
  var homecords = homeplace.geometry.location;
  console.log("marker addr cords" + homecords);
  console.log("marker addr place" + homeplace);
  //$('#home-auto-cords').val(homecords);
  myLatlng = homecords;
  console.log(posLat + ',' + posLong);
  posLat = myLatlng.lat();
  posLong = myLatlng.lng();
  console.log(posLat + ',' + posLong)
  myCurrentMarker.setPosition(myLatlng);
  getAddress(posLat, posLong, "popAdd,derivedAddress");
  //getAddress(posLat, posLong, "derivedAddress");
  bounds.extend(myLatlng);
  map.fitBounds(bounds);
  map.panToBounds(bounds);
  map.setCenter(myLatlng);
}