$('#app_owner_name').html(localStorage.getItem('revoN'));
var nextpopper='';
var premium=[];
var sp_id_carrier=[];
var netPremium=[];
var riderTotal=[];
var riders=[];
var rider_premium=[];
var workwith;
//get summary of user covers
pushOut(
	{
		action:'refreshSumm',
		uid:localStorage.getItem('revoU')
	
	},
	//success
	function(r){
		//console.log(r);
		r=JSON.parse(r);
		
		$('#act').html(numeral(r.upd[0].act).format('0a'));
		$('#exr').html(numeral(r.upd[0].exr).format('0a'));
		$('#exd').html(numeral(r.upd[0].exd).format('0a'));
	}
	,
	
	function (e){
		console.log(e);
	}
	
)
	
//get listing of request
var $rblock='';
var asblock='';
var pablock='';
pushOut(
	{
		action:'requestSumm',
		uid:localStorage.getItem('revoU')
	
	},
	//success
	function(r){
		console.log("this is where we are");
		r = JSON.parse(r);
		var asblock = "";
		var $rblock = "";
		var pablock = "";
	
		$(r.upd).each(function(index, x){
			console.log('att');
			
			if(x.status > 2){ //has status greater than 2
				asblock += '<li><a href="#" class="item-link item-content">'+
							'  <div class="item-media" style="font-size: 3em;">'+(x.insurer_name != null ? x.insurer_name.slice(0, 1) : 'R' )+'</div>'+
							'  <div class="item-inner">'+
							'    <div class="item-title-row">'+
							'      <div class="item-title" style="color:#000">'+x.cover_name+'</div>'+
							'      <div class="item-after" style="color:#000"><small>'+(x.insurer_name != null ? x.insurer_name : 'Revo' )+'</small></div>'+
							'    </div>'+
							'    <div class="item-subtitle" style="color:#000">'+numeral(x.SA).format('0.00a')+'</div>'+
							'    <div class="item-text">'+
							'        <div class="row no-gutter" style="color:#6d6a6a">'+
							'        <div class="col-20"><i class="fa fa-calendar"></i>&nbsp;'+(x.end_date != null ? x.end_date : '1Yr' )+'</div>'+
							'        <div class="col-36">'+
							'            <i class="fa fa-minus-circle"></i>&nbsp;<time class="timeago" datetime="'+x.timeago+'">'+x.last_update_on+'</time>'+
							'        </div>'+
							'        <div class="col-20">'+
							'            <i class="fa fa-pen"></i>&nbsp;0.00'+
							'        </div>'+
							'            <div class="col-2"><i class="fa fa-sync color-green"></i></div>'+
							'            <div class="col-2"><i class="fa fa-trash color-red delete-icon" data-id="'+x.cover_summ_id+'"></i></div>'+
							'        </div>'+
							'    </div>'+
							'  </div>'+
							'</a></li>';
			} else {
				$rblock += ' <li class="content-block mylist" cs_id="'+x.cover_summ_id+'" style="padding:0px;" >';
				$rblock += ' <a href="#" class="item-link item-content">';
				$rblock += '   <div class="item-media">';
				$rblock += '                <p><i class="fas color-blue fa-check-double"></i>&nbsp;'+numeral(x.VW).format('0a')+'<br>';
				$rblock += '                <i class="fa  color-deeppurple fa-reply"></i>&nbsp;'+numeral(x.OK).format('0a')+'</p>';
				$rblock += '    </div>';
				$rblock += '   <div class="item-inner">';
				$rblock += '     <div class="item-title-row" >';
				$rblock += '       <div class="item-title" style="color:#000">'+x.cover_name+'</div>';
				$rblock += '       <div class="item-after" style="color:#000"><small>#'+x.cover_summ_id+'</small></div>';
				$rblock += '     </div>';
				$rblock += '     <div class="item-subtitle" style="color:#000">Assured: '+numeral(x.SA).format('0.00a')+'</div>';
				$rblock += '     <div class="item-text row" style="-webkit-box-orient: horizontal;">';
				$rblock += '         <div class="col-70" style="border:0px solid red">';
				$rblock += '             <div class="row no-gutter" style="color:#6d6a6a">';
				$rblock += '                 <div class="col-100"><i class="fa fa-clock"></i>&nbsp;<time class="timeago" datetime="'+x.timeago+'">'+x.last_update_on+'</time></div>';
				$rblock += '             </div>    ';
				$rblock += '         </div>';
				$rblock += '         <div class="col-30" style="border:0px solid red; padding-right:26px">';
				$rblock += '             <div style="display: flex; justify-content: flex-end; gap: 10px;">';
				$rblock += '                 <i class="fa fa-edit color-brown" style="font-size: 18px;"></i>';
				$rblock += '                 <i class="fa fa-trash color-brown delete-icon" style="font-size: 18px;" data-id="'+x.cover_summ_id+'"></i>';
				$rblock += '             </div>';
				
				$rblock += '         </div>';
				
				$rblock += '     </div>';
				$rblock += '   </div>';
				$rblock += '   </a></li>';
			}
		});
	
		$('#requestBlock').html($rblock);
		$('#activeList').html(asblock);
		$("time.timeago").timeago();
		$('.mylist').on('click', function(e){
			openSelfDetails($(this).attr('cs_id'));
		});
		$(document).on('click', '.delete-icon', function(e) {
			e.preventDefault();
			var coverSummId = $(this).data('id');
	
			// SweetAlert confirmation dialog
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
				if (result.isConfirmed) {
					// AJAX call to the API endpoint
					var settings = {
						"url": "https://ajabconsulting.com/revo/scenes/api.php",
						"method": "POST",
						"timeout": 0,
						"headers": {
							"Content-Type": "application/x-www-form-urlencoded",
							"Cookie": "PHPSESSID=nnuu0kvl1p6ccugh1k9n11b6h4"
						},
						"data": {
							"request": "1",
							"id": coverSummId // Send the cover_summ_id to the API
						}
					};
					
					$.ajax(settings).done(function(response) {
						// Show success message with SweetAlert
						Swal.fire(
							'Deleted!',
							'Your item has been deleted.',
							'success'
						);
						// Optionally, remove the deleted item from the DOM
						$('li[cs_id="'+coverSummId+'"]').remove();
					}).fail(function(jqXHR, textStatus) {
						// Show error message with SweetAlert
						Swal.fire(
							'Failed!',
							'There was an issue deleting your item. Please try again.',
							'error'
						);
					});
				}
			});
		});
	
		// Load payments
		$(r.pa).each(function(index, x){
			pablock += '<li class="swipeout">'+
						'  <div class="swipeout-content"><a href="#" class="item-link item-content">'+
						'    <div class="item-inner">'+
						'      <div class="item-title-row">'+
						'        <div class="item-title"style="color:#000">'+x.pa_mno+' - NA345GH90</div>'+
						'        <div class="item-after"style="color:#000">'+x.pa_v_transactioncurrency+''+x.pa_v_transactionAmount+'/-</div>'+
						'      </div>'+
						'      <div class="item-subtitle"style="color:#000">'+x.pa_tcreate_date+'</div>'+
						'      <div class="item-text"style="color:#000">'+x.pa_msisdn+'</div>'+
						'    </div>'+
						'    </a></div>'+
						'  <div class="swipeout-actions-left" style="color:#000"><a href="#" class="bg-green swipeout-overswipe demo-reply">Reply</a><a href="#" class="demo-forward bg-blue">Forward</a></div>'+
'  <div class="swipeout-actions-right" style="color:#000"><a href="#" class="demo-actions">More</a><a href="#" class="demo-mark bg-orange">Mark</a><a href="#" data-confirm="Are you sure you want to delete this item?" class="swipeout-delete swipeout-overswipe delete-icon" data-id="'+x.pa_mno+'">Delete</a></div>'+
						'</li>';
		});
	
		$('#payList').html(pablock);
		$("time.timeago").timeago();
	
		// Event delegation for delete icons
		$(document).on('click', '.delete-icon', function(e){
			e.preventDefault();
			var id = $(this).data('id');
			// Handle the delete action here, e.g., send an AJAX request to delete the item with the given id
			console.log("Delete clicked item with id:", id);
		});
	}
	
	,
	
	function (e){
		console.log(e);
	}
	
	);
	
	
	
	
openSelfDetails=function(cs_id){
	
	pushOut(
	{action:'showDet',id:cs_id, selfCheck:1,revoU:localStorage.getItem('revoU')},
	function(s){
		
		outthere=s;
		var letable='';
		var sum_id = '';
		var next_sum_id = '';
		console.log('success');
		console.log(JSON.parse(s));
		s=JSON.parse(s);
	
		var premiumformatted=0;
		
		
		//get all premiums per service provider sent  backnfrom server
		InsuredValue=s.evalue;
		var p=0;
		var sp_id_carrier=[];
		$.each(s.myT, function(spid,sp_array){//go through each available tarrif for this requests
		
				var thisPremium=parseFloat((sp_array['cpr_rate']/100)*s.evalue);//an spp will idealy have only one tarriff active			
				if(sp_array['sp_id']==null)sp_array['sp_id']=0;
				sp_id						=	sp_array['sp_id'];
				console.log(sp_id);
				netPremium["'"+sp_id+"'"]	=	[];
				riders["'"+sp_id+"'"]		=	'';
				riderTotal["'"+sp_id+"'"]	= 	0;
				premium["'"+sp_id+"'"]=[];
				
				
				console.log(sp_id);
				premium_heads=[];
				premium_heads={
								'cpr_rate'		: 	sp_array['cpr_rate'],
								'gross_premium'	:	thisPremium,	
								'sp_tariff_name':	sp_array['sp_tariff_name'],
								'sp_id'			:	sp_id,
								'riders'		:	'',
								'riderTotal'	:	0
							}
				premium[p]= premium_heads; 
				sp_id_carrier[p]=sp_id;
				p++;
				//console.log(premium["'"+sp_id+"'"]);
				//console.log(premium);
				localStorage.setItem('offer_'+sp_id,thisPremium);
		});
		
		
		//go through all variables of this covers and list to viewer
		
		$.each(s.results, function(r,t){
			console.log(t);
			var rider_rate=[];
			var rider_rate_type=[];
			var rider_premium=[];
			var display_rate='';
		
			sum_id=t.cover_summ_id;
			
			if(t.swo_name!='' && t.swo_name !=null){
				//user swo_name is the display name
				value=t.swo_name;
			}else{
				//user display value has to be gotten from a list
				value=redeemValue(t.wv_value,t.dt_value);
			}
			if(t.write_title=='Estimated Value'){ 
				console.log("insuranceVal="+value);
				InsuredValue=value;
				value=formatNumber(value);
				//premium=parseFloat((s.tarrif[0]/100)*InsuredValue);//an spp will idealy have only one tarriff active
				//localStorage.setItem('offer',premium);
				//premiumformatted=formatNumber(premium);
				}
			//create GUI	
			letable=letable+'<tr><td>'+t.write_title +'</td><td>'+value+'</td></tr>';
			
			//check for riders for this variable 
			
			if(t.rider_tarrifs_count>0){			//if there is a rider tarrif for this variable table t
				//go through each available tarrif for this requests
				$.each(s.myT, function(myT_index,sp_array){  //for each tarrif
						
						
						rider_premium	= 0;
						console.log("looping trough tarrifs");
						console.log(sp_array);
						
					
					if(t.rider_tarrifs[sp_array['cpr_sp_id']]>0 && t.rider_tarrifs[sp_array['cpr_sp_id']]!=''){
							//identify the number of riders from this particular tarrif service provider for this variable
						console.log('this is the number of sub tarrifs for '+sp_array['cpr_sp_id']);
						console.log(t.rider_tarrifs[sp_array['cpr_sp_id']]);
						
						sp_id			=	sp_array['cpr_sp_id'];
						workwith=t;
						if(sp_array['cpr_sp_id']==''){
							sp_array['cpr_sp_id']=sp_id=0;
							
							rider_rate		=	t.rider_rates[sp_id].cpr_rate;
							rider_rate_type	=	t.rider_rates[sp_id].cpr_rate_type;
						}else{
							
							rider_rate		=	t.rider_rates[sp_id].cpr_rate;
							rider_rate_type	=	t.rider_rates[sp_id].cpr_rate_type;
						}
						premiumIndex	=	sp_id_carrier.indexOf(sp_array['cpr_sp_id']);
						console.log("premiumIndex id "+premiumIndex+" for "+sp_array['cpr_sp_id']);
						console.log(sp_id_carrier);
						console.log(" Found supplier  "+sp_array['cpr_sp_id']+" with rider tarrif" );
						console.log(rider_rate +' '+ rider_rate_type);
						
						switch(rider_rate_type){
							case '1':
							console.log(rider_rate +' 1 '+ rider_rate_type);
								//rate of flat_feee
								rider_premium=rider_rate;
								display_rate=rider_rate;
							break
							case '2':
							console.log(rider_rate +' 2 '+ rider_rate_type);
								//rate of value
								rider_premium=s.evalue*(rider_rate/100);
								display_rate=(rider_rate)+'%<sup>V</sup>';
							break
							case '3':
							console.log(rider_rate +' 3 '+ rider_rate_type);
								//rate of premium
								rider_premium=(s.evalue*s.tarrif[localStorage.getItem('revoU')]/100)*(rider_rate/100);
								display_rate=(rider_rate)+'%<sup>P</sup>';
							break
						}
						//rider_premium["'"+sp_id+"'"]=rider_premium;
						premium[premiumIndex].riders +='<div class="row">'+
															'<div class="col-20"><i class="fa "></i></div>'+
															'<div class="col-50">'+
																'<span>'+
																	t.swo_name+' ('+display_rate+') '+
																'</span>'+
															'</div>'+
															'<div class="col-30 text-right"> '
																+formatNumber(rider_premium)+
															'</div>'+
														'</div>';
														console.log("rider Total Mark" + premium[premiumIndex].riderTotal+' +'+parseFloat(rider_premium));
						premium[premiumIndex].riderTotal+=parseFloat(rider_premium);
						console.log("rider Total pad" + premium[premiumIndex].riderTotal);
					}else{
					//do nothing	
					}
				
				});
				 netPremium["'"+sp_id+"'"]=formatNumber(
									parseFloat(
										parseFloat(riderTotal["'"+sp_id+"'"]) + parseFloat(premium["'"+sp_id+"'"])
								));
				
			}//end //if there is a rider tarrif for this variable table t
			
		});
		
		//go through premiums avaialble
		var mypopupWheel='';
		console.log(premium);
		$.each(premium, function(d,sp_offer){
			console.log("'"+sp_offer['sp_id']+"'");
			console.log(sp_offer.riderTotal);
			sp_offer['sp_tariff_name']
			netPremium=parseFloat(
									parseFloat(sp_offer['gross_premium'])
									+	
									parseFloat(sp_offer.riderTotal)
								);
			formatted_premium=formatNumber(sp_offer['gross_premium']);
			formatted_net_premium=formatNumber(netPremium);
			hidePremium='';
			if(s.evalue>0){ rate_disp='<h1>'+sp_offer['cpr_rate']+'%</h1>' }else{ rate_disp ='<h1>3<sup>rd</sup>P<h1>'; hidePremium='hidden'}
				
			mypopupWheel+=
						'<div class="acceptance drawafter" cs_id="'+cs_id+'" sp_id="'+sp_offer['sp_id']+'" id="offer_'+sp_offer['sp_id']+'" pr="'+sp_offer.sp_tariff_name+'" np="'+formatted_net_premium+'">'+
							'<div class="row"><div class="col-70">'+sp_offer.sp_tariff_name+'</div><div class="col-30" style="opacity:.4"><i class="fa fa-users" ></i> '+Math.floor(Math.random() * 10)+' </div></div>'+
							'<div class="row no-gutter">'+
								'<div class="col-20">'+
									rate_disp+
								'</div>'+
								'<div class="col-80">'+
									'<div class="row no-gutter '+hidePremium+'">'+
										'<div class="col-50">Gross Premium</div>'+
										'<div class="col-50 text-right">'+formatted_premium+'</div>'+
									'</div>'+
									sp_offer.riders+
									'<div class="row no-gutter">'+
										'<div class="col-50">Net Premium</div>'+
										'<div class="col-50 text-right">'+formatted_net_premium+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
		});
		
		
		var mypopup='<div class="popup popup-services">'+
			'<div class="content-block">'+
				 '<h4><div class="row">'+
					'<div class="col-80">Quotation Request</div>'+
					'<div  class="col-20">'+
						'<a href="#" class="button gohome">'+
							'<i class="fa fa-home"></i>'+
						'</a>'+
					'</div>'+
				'</h4>'+
			  '<p class="buttons-row">'/*+
					(
					  (!calledFromSteps)? 
					  '<a href="#" class="button close-popup reject" cs_id="'+sum_id+'"><i class="fa fa-chevron-left"></i>&nbsp;</a>'
					  : 
					  
					  ''
					)*/+				  
					'<a href="#offs" class="tab-link button active">Offers</a>'+
					'<a href="#reqs" class="tab-link button">Request</a>'/*+
					
					(
					  (!calledFromSteps)? 
					  '<a href="#" class="button  moveNext" >Next&nbsp;<i class="fa fa-chevron-right"></i></a>'
					  : 
					  
					  ''
					)*/+	
				  
				  
				'</p>'+
				'<div class="tabs-animated-wrap">'+
					'<div class="tabs">'+
						  '<div id="offs" class="tab  active">'+
							mypopupWheel+
						  '</div>'+
						  '<div id="reqs" class="tab  ">'+
							'<table>'+letable+'</table>'+
						  '</div>'+
					'</div>'+
				'</div>'+
		  '</div>';
		// add to DOM	
		
		$('#poper').html(mypopup);
		myApp.popup('.popup-services');
				$('.gohome').unbind("click").bind('click', function(e){
					console.log('going home');
					if(calledFromSteps){
						mainView.router.refreshPage();
						
					}else{
						myApp.closeModal();
					}
				});
		 //reset
		
		//initilaise DOM listeners
	
		$$('.reject').on('click', function () {
			sendResponse($(this).attr('cs_id'),'rejected');
		});
		
		$$('.moveNext').on('click', function () {
			if(nextpopper!=''){
			$('#'+nextpopper).click();
			}
		});
		
		$('.acceptance').unbind("click").bind('click', function () {
			
				//Initialise, open popUp and listen to actions
				offerActions($(this));
				
				//myApp.closeModal('.popup-services');
				//save offer.
				//sendResponse($(this).attr('cs_id'),'accept');
			
			
		});
		
		
	},
	function(f){
		console.log('failed');
	}
	)
	
}

var verify_pay= function(pa_id){
	
 pushOut(	{
				action:'pay_verify',
				pa_id : pa_id
			},
			verify_success,
			verify_error
		);
}
//end of verify ajax
//verify success

var verify_success = function(result) {
	console.log(result);
	workwith=result=JSON.parse(result);
	myApp.hidePreloader();
	if(result.result=='100'){
		//pay was success
		console.log('paid');
		 
		   myApp.showPreloader('Successfully Paid');
			setTimeout(function () {
				
						myApp.hidePreloader();
						//close Modal and show payments
							myApp.showTab('#payments');
							myApp.closeModal('.popup-services');

						
					}, 2000);
	}else{
		//not yet paid
		   myApp.showPreloader(result.reason);
		if(result.try_again==1){
			
		
			verify_pay(result.pa_id);
		}else{
			setTimeout(function () {
				
						myApp.hidePreloader();
						
						
					}, 3000);
			
		}
	}


}

//end of verify success

//verify error

var verify_error = function(result) {
	workwith=result;
	console.log(result);
	myApp.alert("Error Conencting");
			 setTimeout(function () {
						
						myApp.hidePreloader();
						//close Modal and show payments
							;

						
					}, 200000);
		
}

var sendResponse=function(that,response,pay_now){
	pushOut(
	{   action:'sp_response',
		dpo				:pay_now,
		cs_id			:that,
		sp_r			:response,
		uid				:localStorage.getItem('revoU'),
		client_choice	:localStorage.getItem('accepted_sp_id'),
		offer			:localStorage.getItem('offer'),
		agent			:$("[name='agentSelected']:checked").val()
		
	},
	function(s){
		workwith=s;
		s=JSON.parse(s);
		if(pay_now){
			console.log("check for pay");
			 myApp.showPreloader('Please complete payment');
			 pay_id=s.resBill.TransToken;
			 verify_pay(pay_id);
			 
		}else{
			console.log('success');
			myApp.alert("Your insurance quote shall remain active for only 24 hours")
		}
		localStorage.removeItem('offer')
	},
	function(f){
		console.log('failed');
	}
	)
}

var offerActions = function(offer){
	localStorage.setItem('offer',x);
	localStorage.setItem('accepted_sp_id',offer.attr('sp_id'));
	console.log('askign for agents around me');
	var x=offer.attr('cs_id');
	
	var agent_success= function(r){ 
		r=JSON.parse(r)	
		console.log(r);
		 var list='';
		$.each(r['agents'], function(h,l){
			console.log(h);
					list=list+'<li class="item-content">'+
						'	  <div class="item-media"><img src="https://loremflickr.com/g/320/240/kenya,lady/all" width="44" alt=""/></div>'+
						'	  <div class="item-inner">'+
						'		<div class="item-title-row">'+
						'		  <div class="item-title">'+l.name+', '+l.distance+'Km Away&nbsp;&nbsp;&nbsp;&nbsp;</div>'+
						'		</div>'+
						'		<div class="item-subtitle">'+l.is_branch+'</div>'+
						'	  </div>'+
						'	<input type="radio" name="agentSelected" value="'+l.u_id+'" class="agentSelector"/>'+
						'	</li>';
						
		});
		var buttons1 = [
			{
				text: '<div class="list-block media-list" style="width:95%">'+
						'  <ul>'
						+list+
						'</ul></div>',
				label: true
			},{
				text: '<p>Accept KES'+offer.attr('np')+'/- From '+offer.attr('pr')+'?</p>',
				label: true
			},
			{
				text: 'Accept & Pay Now',
				bold: true,
				color: 'purple',
				onClick : function(e){
					
					//myApp.alert(x)
					sendResponse(x,'accept',true);
					//start payment window
				}
			},
			{
				text: 'Accept & Pay Later',
				color: 'black',
				onClick : function(e){
					
					sendResponse(x,'accept',false);
					//myApp.popup('.popup-services',false, false);
				}
			}
		];
		var buttons2 = [
			{
				text: 'Cancel',
				color: 'red'
				
			}
		];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	}//end of agentsuccess
	
	var agent_failure = function(c){
		console.log(c);
		
	}
	
	pushOut(
			{
				action	: 'agentsAround',
				lat		: posLat,
				lang	: posLong
			},
			agent_success,
			agent_failure
			);
	//setTimeout(function (e){myApp.popup('.popup-services',false, false);},900);
}


redeemValue=function(a,b){
	
	switch(b){
		case 'bool':
			if(a.toLowerCase=='y' || a==1){
				return '<i class="fa fa-check" style="color:green">';
			}else{
				return '<i class="fa fa-close" style="color:red">';
			}
		break;
		
		case 'sel':
			return a;
		break;
		case 'pwd':
		
			if(a!=''){
				return "set";
			}else{
				return "not set";
			}
		break;
		case 'img':
			if(a!=''){
				return "<img class='paramImg' src='"+a+"'>";
			}else{
				return "not set";
			}
		break;
		default:
		 /*case 'text':
		case 'opt':
		case 'sel':
		case 'date':
		case 'datetime':
		case 'sel':
		case 'datetime':   
		case 'daterange ': 
		case 'number ':    
		case 'month':     
		case 'check':*/
		return a;
		 
		break;
      
	}
	
}






	

	




