var test=true;
var isSP_app=false;
var onPhone=true;
var asyncStatus=true;
var revoU;
var backend= onPhone ? 'https://ajabconsulting.com/revo/scenes/' : '../scenes/';	
var calledFromSteps=true;

// Init App
var myApp = new Framework7({
    modalTitle: "Revo",
    // Enable Material theme
    material: true,
});



openSmartSele=function (thisOne){
	
	if(thisOne.attr('role')=='selector'){
		console.log('true');
		myApp.smartSelectOpen('.'+thisOne.attr('smart'));
	}
}



// Expose Internal DOM library
var $$ = Dom7;

// Add main view
var mainView = myApp.addView('.view-main', {
});

	console.log("loading Index page...");
	$(document).ready(function(){
	
		$.getScript( "js/index_i.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading Index was performed." );
			detailMap();
			});
		
	});


// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
	
		myApp.showIndicator();
	
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

// Initialisers
myApp.onPageInit('register', function (page) {
    console.log("loading register page...");
	$(document).ready(function(){
		try {
			$.getScript( "js/register.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading register was performed." );
		});
		}
		catch(e){
			console.log(e);
		}
	});
});
myApp.onPageInit('dashboard', function (page) {
    console.log("loading dashboard page...");
	$(document).ready(function(){
		try {
		 $.getScript( "js/sp_dashboard.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading dashboard was performed." );
		}); 
		}
		catch(e){
			console.log(e);
		}
	});
});
myApp.onPageInit('spregister', function (page) {
    console.log("loading service provider register page...");
	$(document).ready(function(){
		try {
			$.getScript( "js/spregister.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading service provider register was performed." );
			
		});
			$.getScript( "js/geoloc.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading geolocation provider register was performed." );
			detailMap();
		});
		}
		catch(e){
			console.log(e);
		}
	});
});
myApp.onPageInit('stepprocessor', function (page) {
    console.log("loading stepprocessor page...");
	$(document).ready(function(){
		try {
			$.getScript( "js/stepprocessor.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading stepprocessor was performed." );
		});
		}
		catch(e){
			console.log(e);
		}
	});
});
myApp.onPageInit('requests', function (page) {
    console.log("loading requests page...");
	$(document).ready(function(){
		try {
			$.getScript( "js/requests.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading requests was performed." );
		});
		}
		catch(e){
			console.log(e);
		}
	});
});


myApp.onPageInit('profile3', function (page) {
    console.log("loading profile3 page...");
	$(document).ready(function(){
		try {
			$.getScript( "js/profile3.js", function( data, textStatus, jqxhr ) {
			console.log( "Loading profile3 was performed." );
		});
		}
		catch(e){
			console.log(e);
		}
	});
});


pushOut= function(dataOut,successIn,failIn,preload=true){
console.log("preload global is set to "+preload);
//add lat and lang to data out

console.log("This is dataout",dataOut);
 $$.ajax({
				url		:	backend,
				global	:	preload,
				method	:	'POST',
				dataType:	'JSON',
				data 	:	dataOut, // post data || get data,
				error	: 	failIn,
				success	: 	successIn,
				async	:   asyncStatus
 });
asyncStatus=true;
}	

isEmail=function (email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

formatNumber=function(nStr){
	 nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
