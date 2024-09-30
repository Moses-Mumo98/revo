var PasscodeChecked=false;
var IRAmember=0;
var RevoCodeDemandStep=10;
var LocationStep=7;
var termsStep=8;
var namestep=5;
var laststep=12;
$('.list-block li').hide();
$('#chosenOther').html(localStorage.getItem('chosenOther'));
//#check the current step inregistration
var goTo=localStorage.getItem('NextStep');
//#check the current registration type between corporate and individual
var regsele=localStorage.getItem('regsele');
//#set the GUI to read NEXT
$('#gonextlabel').html('NEXT&nbsp;');
console.log("goTo is "+goTo);
//# initialise the registration step to step number 1
if(goTo<1 || goTo==null){  goTo=1;}


//functions
//save and go function will consolidate the full registration form and send on ajax to backend
saveandgo= function(type){
	$("#regType").val(type);
	//#push via AJAX
	pushOut(
			$("#regForm").serialize(),
			function(r){
				r=JSON.parse(r);
				console.log('saveandgo successful');
				try{
					if(r.resBool){
						revoU=r.userid;
						localStorage.setItem('revoU',revoU);
						localStorage.setItem('revoT',r.clienttype);
						localStorage.setItem('revoN',r.clientname);
						if(r.clienttype=='client'){
							mainView.router.loadPage('profile3.html');
						}else{
							mainView.router.loadPage('home_dashboard.html');
						}
						
					}else{
						console.log(r.errText);
						myApp.alert("There was a problem with registration, "+r.errText+". Please await our communication");
						registerSteps(8);
					}
					
				}catch(e){
					console.log(e);
					console.log('processing of request results failed');
					myApp.alert('Something went wrong , try again later please');
				}
				
			},
			
			function(e){
				console.log('saveandgo failed');
				console.log(e);
				
			}
			);
	
	
}

//function to confirmed the enterd password as  the correct password
checkOnlinePass=function (){
					
					console.log('run online pass confirmer retrun boolean');
					
					pushOut( 
						{
							action:'passconfirm',
							passphone: $('#phone').val(),
							passpushed : $('#passcode').val()
						},
						
						function(results){
							results=JSON.parse(results);
							console.log('checkOnlinePass succeded');
							try{
								if(results.resBool==true){
									PasscodeChecked=true;
								}else{
									PasscodeChecked=false;
								}
							}catch(e){
								console.log(e);
								console.log('processing of request results failed');
								myApp.alert('Something went wrong , try again later please');
							}
						},
						
						function(err){
							console.log('checkOnlinePass failed');
							console.log(err);
						}
					);
					/*  */
					return true;
				}
//function to send SMS
sendSMS=function(callback){
				//run ajax and on success run callback
					console.log('run online SMS parser return boolean');
					p=$('#phone').val();
					$('#gonext').addClass('hidden');
					pushOut( 
						{
							action:'sendS',
							phonen : p
						},
						
						function(results){
							results=JSON.parse(results);
							console.log('sendSMS succeded');
							try{
								if(results.resBool==true){
									console.log("SMS sent");
									callback();
									$('#gorefresh').addClass('hidden');
									$('#gonext').removeClass('hidden');
									
								}else{
									console.log("SMS not sent" + results.errText);
									myApp.alert('We are unable to send confirmation SMS as at now. Please try later');
									$('#gorefresh').removeClass('hidden');
								}
							}catch(e){
								console.log(e);
								console.log('processing of request results failed');
								myApp.alert('Something went wrong , try again later please');
								$('#gorefresh').removeClass('hidden');
							}
						},
						
						function(err){
							console.log('sendSMS failed');
							console.log(err);
							$('#gorefresh').removeClass('hidden');
						}
					);
					
				
				
		}
//attempt to auto read ama	
readSMS=function(){
	var SMSread=false; //commented since I have not yet added a library to read SMS
			//run smsplugin
					console.log('run SMS read plugin');
					if(SMSread){
						console.log('autofeed passcode');
						checkOnlinePass();
					}
		}	

registerSteps= function(step){
	console.log(step);
	
	//sanitise
	if(step!=1 ){
		//determine what was /was supposed to be the previous step
		pstep=step-1;
		//check that the previous step was filled in fine
		sanitise(pstep);
	}else{
		console.log('step 1');
		$('.step'+step).addClass('introtext');
		$('.step'+step).show();
		$('.step_in'+step).show();
		console.log("use plugin to auto populate phonenumber");
	}
	
	
}

sanitise= function (step){
	console.log('sanitising' +step );
	var moveOn=false;
	var currentStep=parseInt(step+1);
	var stepper=1;
	//check that it was not a refresh
	if(currentStep!=localStorage.getItem('NextStep')){
		switch(step){//saving and satisfying data sent
			case 1:
			//check phone validity
				phone = $('#phone').val();
				if(phone.length >9 && phone.length< 14) { 
				  moveOn=true;
				} else {
				  myApp.alert("Please recheck that Phone");
				} 
			
			break;
			
			case 2:
			//check passcode validity
				if(PasscodeChecked==false){ //if passcode has not yet been confirmed by these codes
					var code=$('#passcode').val();
					if(code.length>3){
						moveOn=checkOnlinePass();
					}else{
						myApp.alert("Please Enter the full code");	
					}
				}else{
					moveOn=true;
				}
			break;
			
			case 3:
				//yes or No for IRA regiatration
				//If not IRA skip one step
				IRAmember=$('input[name=IRA]:checked').val();
				localStorage.setItem('regsele','company');
				console.log('IRAMEMBER'+ IRAmember);
				if(IRAmember==1){
					regsele=localStorage.getItem('regsele')
				}else{
					localStorage.setItem('regsele',localStorage.getItem('chosenOther'));
					currentStep++;//skip choose IRA membership question
				}
				
				moveOn=true; 
				
			break;
			
			case 4:// user has just chosen if they are IRA or not
				if(IRAmember!=0){
					//check if the member has already registered
					moveOn=false; //reset
					var theirAKI=$('#aki').val();
					if(theirAKI.length>=3) { 
					//check if this number has been registered
					asyncStatus=false;
					pushOut(
						{
							action	: "check_aki",
							t		: theirAKI
						},
						
						function(success){
							success=JSON.parse(success);
							console.log(success.resBool);
							if(success.resBool==true){
								console.log("demanding for revo");
								//ask for passcode
								currentStep=RevoCodeDemandStep;
								console.log("demanding for revo"+currentStep);
								$('input[name=is_branch]').val(1);
							}else{
								console.log("move on as if nothing happened");
							//move on as if nothing happened
							}
							
						},
						
						function (failure){
							console.log(failure);
							console.log("issue with verifying AKI");
						}
					);
					  moveOn=true;
					} else {
					  myApp.alert("So you have no IRA number?");
					}				
				moveOn=true;
				stepper=1;
				}else{
					myApp.alert("You must share your IRA Number)");
					moveOn=false;
						//client will enter an ID Number Validate it here
					}		
				
			break;
			
			case 5:
				//fullname
				//check phone validity
				fname = $('#fname').val();
				if(fname.length >3 /* && regsele!="company" */) { 
				  moveOn=true;
				} else {
				  myApp.alert("You must have a very short name :)");
				} 
				
			break;
			
			case 6:
				//Email
				//check emal validity
				var theirEmail = $('#email').val();
				if(isEmail(theirEmail)) { 
				  moveOn=true;
				} else {
				  myApp.alert("I cannot accept that kind of Email");
				} 
				
			break;
			
			case 7:  //LocationStep
			//User has entered their location
			$('input[name=geoname]').val(geoname);
			$('input[name=lat]').val(posLat);
			$('input[name=lang]').val(posLong);
				  moveOn=true;
			break;
			
			case 8:
			
			 moveOn=true;
			 
			break;
			
			case 9:
			
			 //exit compiler will never get here
			 
			break;
			
			case 10:
			//ask for this companies Revocode
			//RevoCodeDemandStep is here
			
			pushOut(
						{
							action	: "check_aki",
							t		: $('#aki').val(),
							v		: $('#RevoCode').val()
						},
						
						function(success){
							if(success.resBool=='true'){
								//ask for passcode
								currentStep=namestep;
							}else{
							//move on as in nothing happened
							currentStep=step;
							}
							
						},
						
						function (failure){
							console.log(failure);
							console.log("issue with LocationStep revocode to be true");
						}
					);
			
			 moveOn=true;
			 
			break;
			
		}//end switch
	}else{//goto=step
	console.log('Skipped sanitisation of'+step )
		moveOn=true;
	}
	//moveOn=true;
	if(moveOn){
		console.log('moving on to '+currentStep);
		$('#gonext').show();
		switch(currentStep){ // preparatory scripts to registration steps
			case 2:
				//send sms
				console.log('open ajax and send SMS with passcode');
				smsSent=sendSMS(readSMS);
				console.log('start listening to sms coming in and compare online');
			break;
			
			case 5:
			console.log('prepping 5'+ regsele);
			$('#namePrefix').html(regsele);
				
			break;
			
			case 8:
				$('#gonextlabel').html('Yes, I accept&nbsp;');
				
			break;
			
			case 9:
				//run save ajax and load home page.
				console.log('savign at step 9');
				$('#gonext').hide();
				saveandgo(1);
				currentStep=12;
			break;
			
		}
		localStorage.setItem('NextStep',currentStep);
		console.log("goto changed to Step "+localStorage.getItem('NextStep'));
		
		//remove classs
		$('.step'+step).removeClass('introtext');
		if(currentStep!='7'){
			$('.step'+currentStep).addClass('introtext');	
		}
		$('.step'+currentStep+'_hidden').css('margin-top','2%');	
		
		//hide 
		$('.step'+currentStep).fadeIn(500,'linear',$('.step'+step).hide());
		$('.step_in'+currentStep).fadeIn(500,'linear');
		$('#gonext').attr('step',parseInt(currentStep+stepper));
		if(currentStep>3 && currentStep<7){ $('#nonext').fadeIn(3000);}
		
		//return
	}
	
}

$('#gonext').on('click', function(){
	console.log('moving Next');
	registerSteps($(this).attr('step'));
});

$('#nonext').on('click', function(){
	console.log('stalling registration');
	//run save ajax and load home page.
	saveandgo(2);
});


console.log(parseInt(goTo)+ '=='+ parseInt(laststep))
if(parseInt(goTo)==parseInt(laststep)){
	console.log(goTo);
	//there was an issue during registration attempt again.
	localStorage.setItem('NextStep',termsStep);
	console.log(localStorage.getItem('NextStep'));
	registerSteps(termsStep);
}else{
	console.log("starting register");
	registerSteps(goTo);
}
// LISTENERS

if(test){
		$('#destroy').on('click', function(ev){
			console.log('refreshing');
			localStorage.setItem('NextStep',3);
			mainView.router.refreshPage();
		});
}

$('#gorefresh').on('click', function(ev){
			console.log('resending sms');
			mainView.router.refreshPage();
});

/* $('input[name=Iam]').on('change select', function(e){
	
	openSmartSele($(this));
	
}); */

$('.othersOpt').on('click', function(e){
	console.log('attempting to open smarrt sel');
	openSmartSele($(this));
	
});


$('#interType').on('change', function(e){
	var newer=$( "#interType option:selected" );
	localStorage.setItem('chosenOther',newer.val());
	regsele=newer.val();
	$('input[role=selectorV]').val(newer.val());
	$('#chosenOther').html(' ('+ newer.val()+ ')');
	console.log($('input[role=selectorV]').val());
});
