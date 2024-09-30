var check2=false;
var currentStep=0;
var leadingStep=0;
var lStep=[];
var backwards=false;

var goTo=localStorage.getItem('NextProcessStep');

$('#stepNav').show();
$('#nextStepLabel').html('NEXT&nbsp;');
console.log("goTo is "+goTo);
if(goTo<1 || goTo==null){  goTo=1;}



//functions


saverequest= function(type){
	
	pushOut(
			$("#reqform").serialize(),
			
			function(r){
				r=JSON.parse(r);
				console.log(r);
				console.log('saverequest successful');
				try{
					if(r.resBool){
						myApp.addNotification({
								message: 'You request has been received'
							});
						//if(localStorage.getItem('regsele')=='client'){
							//list all offers for this 
							calledFromSteps=true;
							openSelfDetails(localStorage.getItem('steppingfor'));
							//mainView.router.loadPage('profile3.html');
						/* }else{
							mainView.router.loadPage('home_dashboard.html');
						} */
						
					}else{
						console.log(r.errText);
						myApp.alert("There was a problem with policy request, Please await our communication");
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


processSteps= function(step){
	console.log(step);
	currentStep=step;
	//sanitise
	if(step!=1 && backwards!=true){
		console.log(step );
		pstep=step-1;
		sanitisestep(pstep);
	}else{
		console.log('step '+step);
		if(backwards){
			leadingStep=lStep[currentStep]-1;
			$('.step'+step).removeClass('introtext_color');
			$('.step'+step).hide();
		}
		$('.step'+step).addClass('introtext_color');
		$('.step'+step).show();
		$('.step_in'+step).show();
		console.log("use plugin to auto populate phonenumber");
	}
	
	
}

var activateStep = function(step){
	
	var exitLink	=	$(".stepper"+step).attr('exitLink');
	if(exitLink==1){
		$('#stepNav').hide();
	}else{
		$('#stepNav').show();
	}
	
	var sibling		=	$(".stepper"+step).attr('a_sibling');
	
	var expected_sibling_value	=	$(".stepper"+step).attr('a_sibling_condition');
	
	var theSibling=$("[name='write_value"+sibling+"']");
	
	var sibling_value	=	theSibling.val(); //initilaise just incase
	
	switch(theSibling.prop('type')){
		case 'radio':
			sibling_value	=	$("[name='write_value"+sibling+"']:checked").val();
		break;
		
		case 'checkbox':
			sibling_value	=	$("[name='write_value"+sibling+"']:checked").val();
		break;
		
		default:
			sibling_value	=	theSibling.val();
		break;
		
	}
	
	console.log("sibling is "+sibling+" expected to be " +expected_sibling_value+ " and was " +sibling_value);
	
	if(sibling =='' || sibling ==null || sibling =='null' || typeof sibling === "undefined" ){
		
		return true;
		
	}else{
		if(sibling_value != expected_sibling_value){
			return false;
		}else{
			return true;
		}
	}
	
}

sanitisestep=function(pstep){
	
		localStorage.setItem('NextProcessStep',currentStep);
		console.log("goto changed to "+localStorage.getItem('NextProcessStep'));
		//remove classs
			$('.step'+pstep).removeClass('introtext_color');
			$('.step'+pstep).hide();
			
			if(activateStep(currentStep)){
				leadingStep++;
				lStep[currentStep]=leadingStep;
				$('.step'+currentStep).addClass('introtext_color');	
				$('.step'+currentStep+'_hidden').css('margin-top','2%');	
				//hide 
				$('.step'+currentStep).fadeIn(500,'linear');
				$('.step_in'+currentStep).fadeIn(500,'linear');
				
			}else{
				currentStep=currentStep+1;
				$('#stepNumber').html(currentStep +' of '+localStorage.getItem('allsteps'));
				pstep++;
				sanitisestep(pstep);
				return true;
			}
			
		if(pstep==(localStorage.getItem('allsteps'))){
			//finished save and go now
			localStorage.setItem('NextProcessStep',0);
			$('#nextStepLabel').html('sending request');
			saverequest();
			
		}else{
			//continue
			$('#gonextstep').attr('step',(parseInt(currentStep) + 1));
			$('#goprevstep').attr('step',(lStep[currentStep]));
		}
		
	
}

$('#goprevstep').on('click', function(){
	console.log('moving previous'+$(this).attr('step'));
	var step		= 	parseInt($(this).attr('step'));
	var finalStep	=	parseInt(localStorage.getItem('allsteps'));
	backwards=true;
	
	if(step>0){
		
		console.log("allowed to go back");
		
		processSteps(step);
		backwards=false;
		var pc =parseInt((step/localStorage.getItem('allsteps'))*100);
		
		console.log(pc);
		
		$('#stepNumber').html(step +' of '+localStorage.getItem('allsteps'));
		
		myApp.showProgressbar('.progressbar', pc, 'pink') ;
	}else{
		mainView.router.loadPage('profile3.html');
		console.log("denied to process");
	}
	
	
	
});

$('#gonextstep').on('click', function(){
	
	console.log('moving Next'+$(this).attr('step'));
	
	var step		= 	parseInt($(this).attr('step'));
	var finalStep	=	parseInt(localStorage.getItem('allsteps'));
	
	console.log('moving Next'+$(this).attr('step')+localStorage.getItem('allsteps'));
	
	console.log(finalStep>=step);
	
	if(parseInt(finalStep+1)>=step){
		
		console.log("allowed to process");
		
		processSteps(step);
		
		var pc =parseInt((step/localStorage.getItem('allsteps'))*100);
		
		console.log(pc);
		
		$('#stepNumber').html(step +' of '+localStorage.getItem('allsteps'));
		
		myApp.showProgressbar('.progressbar', pc, 'pink') ;
	}else{
		console.log("denied to process");
	}
	
});



$('#dynaForm').html(localStorage.getItem('dynaForm'));
$('.list-block li').hide();

processSteps(goTo);

// LISTENERS
