stopanddie=false;
$("#kmr_s").on('input', function() {
  $("#kmr").html(parseInt(this.value));
 });
 
 $('.othersOpt').on('click', function(e){
	console.log('attempting to open smarrt sel');
	openSmartSele($(this));
	
});

function init(){
	//populate policy list
	console.log("initialising stuff");
	$('.form1').removeClass('hidden');
	popPackagesdata={
		action:'popPackages'
		
	}
	popPackagesSuccess= function(r){
		//console.log(r);
		try{
		r=JSON.parse(r);
		$('#package').html(r.options);
		}catch(e){
			console.log(e);
		}
		
	}
	
	popPackagesFail=function(e){
		console.log(e);
		myApp.alert("No Insurance packages are available right now");
	}
	
	pushOut(popPackagesdata,popPackagesSuccess,popPackagesFail,preload=true);
	
	//listng of inurance type
	popdata={
		action:'popPack'
		
	}
	
	/*-----------------------------------------------*/
	policySuccess= function(r){
		//console.log(r);
		try{
		r=JSON.parse(r);
		$('#policyType').html(r.options);
		$('.form2').removeClass('hidden');
		//$('.form1').addClass('hidden');
		}catch(e){
			console.log(e);
		}
		
	}
	
	policyFail=function(e){
		console.log(e);
		myApp.alert("No policy are available right now");
	}
	
	$(document).ready(function(r){
		$('#package').on('change', function(ch){
			popdata['my_ins_type']=$("#package").val();
			$('#selPack').html(" "+$("#package").find(':selected').text()+" ");
			pushOut(popdata,policySuccess,policyFail,preload=true);
		});
	});
	
	//populate insurance list
	insdata={
		action:'inslist'
		
	}
	insSuccess= function(r){
		console.log(r);
		r=JSON.parse(r);
		$('#compType').html('<option value="0">ALL</option>'+r.options);
		
	}
	
	insFail=function(e){
		console.log(e);
		myApp.alert("No Insurance Companies are available right now");
	}
	
	//pushOut(insdata,insSuccess,insFail,preload=true);
	//will come in later versions
	
	//watchout for change
	$('#compType').on('change', function(e){
		
		console.log(e);
		var val=$( "#compType option:selected" ).text();
		$('#mycompany').html(val);
			
	});
	
	$('#contact').on('submit', function(e){
		console.log("attempting to save");
		e.preventDefault();
		
	$("#latContact").val(posLat);
	$("#longContact").val(posLong);
	rqdata=$("#contact").serialize();
	
	rqSuccess= function(r){
		
		try{
			//console.log(r);
		r=JSON.parse(r)
		//console.log(r);
		//roptions=r.options;
		//console.log(roptions);
		rform=r.theForm;
		//console.log(rform);
		localStorage.removeItem('dynaForm');
		localStorage.removeItem('NextProcessStep');
		var ins='<div class="row" style="margin-top: 22%;">';
			ins+='<div data-progress="10" class="progressbar color-white col-80" ></div>';
			ins+='<div class="col-20" ><small id="stepNumber"></small></div>';
			ins+='</div>';
			ins+='<ul class="stepUL">';
			
		console.log("array is "+rform.length);
		localStorage.setItem("allsteps",rform.length);
		$.each(rform, function(e,f){
			localStorage.setItem('steppingfor',f.cover_summ_id);
			console.log(f);
			ins+='<input type="hidden" name="step[]" value="'+f.write_id+'"><input type="hidden" name="summ_id'+f.write_id+'" value="'+f.cover_summ_id+'">';
			ins+='<li class="step'+f.write_step_no+'">';
			
			ins+='<div class="item-content stepContent"><h3>'+f.write_desc+'</h3></div>';
			try{
			
			console.log("This are db values",f.dt_value);
			
			switch(f.dt_value){//bool text pwd img opt sel
				case 'bool':
					ins+='<div class=""><small>'+f.write_title+'</small></div>';
					ins+='<div class="">'
					ins+='<ul>';
					ins+='<li class="step_in'+f.write_step_no+'">';
					ins+='<label class="label-radio item-inner">';
					ins+='<input type="radio" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'"  value="1" > ';
					ins+='<div class="item-media">';
					ins+='<i class="icon icon-form-radio"></i>';
					ins+='</div>';
					ins+='<div class="item-inner" style="display:flex">';
					ins+='<div class="item-title">YES</div>';
					ins+='</div>';
					ins+='</label>';
					ins+='</li>';
					
					ins+='<li class="step_in'+f.write_step_no+'">';
					ins+='<label class="label-radio item-inner">';
					ins+='<input type="radio" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'" id="wite_value'+f.write_id+'" value="0" checked> ';
					ins+='<div class="item-media">';
					ins+='<i class="icon icon-form-radio"></i>';
					ins+='</div>';
					ins+='<div class="item-inner" style="display:flex">';
					ins+='<div class="item-title">NO</div>';
					ins+='</div>';
					ins+='</label>';
					ins+='</li>';
					ins+='</ul></div>';
				
				break;
				case 'text':
					ins+='<div class="item-content stepContent">';
					ins+='<div class="item-inner">';
					ins+='<div class="item-title  label"><small>'+f.write_title+'</small></div>'
					ins+='<div class="item-input">';
					ins+='<input  type="text" value="" placeholder="'+f.write_sample_val+'" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'">'
					ins+='</div>';
					ins+='</div>';
					ins+='</div>';
				break;
				
				case 'exitlink':
					ins+='<div class="item-content stepContent">';
					ins+='<div class="item-inner">';
					ins+='<div class="item-input">';
					ins+='<a href="'+f.write_sample_val+'" exitLink="1" class="stepper'+f.write_step_no+' button" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'"><small>'+f.write_title+'</small></a>'
					ins+='</div>';
					ins+='</div>';
					ins+='</div>';
					
				break;
				
				case 'pwd':
					ins+='<div class="item-content stepContent">';
					ins+='<div class="item-inner">';
					ins+='<div class="item-title  label"><small>'+f.write_title+'</small></div>'
					ins+='<div class="item-input">';
					ins+='<input  type="password" value="" placeholder="'+f.write_sample_val+'" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'">'
					ins+='</div>';
					ins+='</div>';
					ins+='</div>';
				break;
				case 'img':
				
				break;
				case 'opt':
					//choose from options
					ins+='<div class=""><small>'+f.write_title+'</small></div>';
					ins+='<div class="">'
					ins+='<ul>';
					if($.isArray(f.options)){
						opti=1
						$.each(f.options, function(o,g){
							//if(opti==1) chck='checked';
							opti++
						ins+='<li class="step_in'+f.write_step_no+'">';
						ins+='<label class="label-radio item-inner">';
						ins+='<input type="radio" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'"  value="'+g.key_to_show+'" > ';
						ins+='<div class="item-media">';
						ins+='<i class="icon icon-form-radio"></i>';
						ins+='</div>';
						ins+='<div class="item-inner" style="display:flex">';
						ins+='<div class="item-title">'+g.val_to_show+'</div>';
						ins+='</div>';
						ins+='</label>';
						ins+='</li>';
					
						
						});
					}
					ins+='</ul></div>';
				break;
				case 'check':
					//choose from options
					ins+='<div class=""><small>'+f.write_title+'</small></div>';
					ins+='<div class="">'
					ins+='<ul>';
					if($.isArray(f.options)){
						
						$.each(f.options, function(o,g){
							
						ins+='<li class="step_in'+f.write_step_no+'">';
						ins+='<label class="label-checkbox item-inner">';
						ins+='<input type="checkbox" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'[]" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'" value="'+g.key_to_show+'" > ';
						ins+='<div class="item-media">';
						ins+='<i class="icon icon-form-checkbox"></i>';
						ins+='</div>';
						ins+='<div class="item-inner" style="display:flex">';
						ins+='<div class="item-title">'+g.val_to_show+'</div>';
						ins+='</div>';
						ins+='</label>';
						ins+='</li>';
					
						
						});
					}
					ins+='</ul></div>';
				break;
				
				case 'sel':
				console.log("sel");
					ins+='<a href="#" class="item-link smart-select others-select" data-back-on-select="true" data-searchbar="true" data-searchbar-placeholder="'+f.write_title+'">';
					ins+='<select class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'">';
					if($.isArray(f.options)){
						console.log('array');
						$.each(f.options, function(g,o){
							ins+='<option value="'+o.key_to_show+'"> '+o.val_to_show+'</option>';
						
						});
					}
					ins+='</select>';
					ins+='<div class="item-content stepContent">';
					ins+='	  <div class="item-inner">';
					ins+='		<label class="item-title floating-label"><small>'+f.write_title+'</small></label>';
					ins+='		 <div class="item-after">Select..</div>';
					ins+='	</div>';
					ins+='	</div>';
					ins+='		</a>';
				
					default:
						ins+='<div class="item-content stepContent">';
							ins+='<div class="item-inner">';
								ins+='<div class="item-title label"><small>'+f.write_title+'</small></div>';
								ins+='<div class="item-input">';
					
								var currentYear = new Date().getFullYear();
								if (f.dt_value === 'month') {
									// If dt_value is 'month', set the max attribute to the current year
									ins+='<input type="month" value="" max="'+currentYear+'-12" placeholder="'+f.write_sample_val+'" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'">';
								} else {
									ins+='<input type="'+f.dt_value+'" value="" placeholder="'+f.write_sample_val+'" class="stepper'+f.write_step_no+'" name="write_value'+f.write_id+'" a_sibling="'+f.activating_sibling+'" a_sibling_condition="'+f.activating_sibling_value+'">';
								}
					
								ins+='</div>';
							ins+='</div>';
						ins+='</div>';
						break;
					
			}
			
			
			}catch(e){
			console.log(e);
			}
			
			ins+='</li>';
		});
		localStorage.setItem('dynaForm',ins);
		}catch(e){
		console.log(e);
		}
		mainView.router.loadPage('steProcessor.html');
		
	}
	
	rqFail=function(e){
		console.log(e);
		myApp.alert("Please try later");
	}
		pushOut(rqdata,rqSuccess,rqFail,preload=true);
		return false;
	});
	$('#rquid').val(localStorage.getItem('revoU'));
}

init();
