var dataIsloaded=false;
var package_inner=[];
var loadPendingRequest= function (){
	console.log('Getting new requests');
	pushOut(
			/*data*/
			{	
				uid : localStorage.getItem('uid'),
				action: 'pending_SP_Request'
			},
			/*successfuntion*/
			function(json_r){
				r=JSON.parse(json_r);
				console.log('received pending requests');
				console.log(r.results);
				try{
					if(r.resBool){
						revoU=r.userid;
					//	localStorage.setItem('mpr',JSON.stringify(r.results));
					//	setTimeout(loadPendingRequest(), 3000);
						processNewData(r.results);
						if(r.counted>0){
							var notificationCallbackOnClose =myApp.addNotification({
																title: 'You have '+r.counted+' New Cover requests',
																subtitle: 'Review the requests',
																message: 'H.....',
																media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
																onClose: function () {
																	//myApp.alert('now view message');
																}
															});
						}
					}else{
						console.log(r.errText);
					}
					
				}catch(e){
					console.log(e);
					console.log('caught:processing of pending request results failed');
				}
				
			},
			/*failure function*/
			function(e){
				console.log('pending request failed');
				console.log(e);
				
			}
			);
	
}


var processNewData=function(newData){
	try{
	//newData=localStorage.getItem('mpr');
	//now that we are here we check if we hav processed data before.
	console.log((newData));
		
		$.each(newData, function(i,v){
			//i is the package id
			console.log(v.pck.package_name);
			//return;
			
			var packageName=v.pck.package_name;
			var packageCount=v.count;
			var orderby=v.orderby;
			package_inner[packageName]=v.csumm;
			if(v.pck.color=='') v.pck.color='purple';
				if(dataIsloaded){
			//update the titles
			
				}else{
			//create a dynamic page
			var dyn='<li class="swipeout pcklist" data-unread="'+packageCount+'" data-sorter="'+orderby+'" mypackage="'+packageName+'">'+
					'  <div class="swipeout-content item-content ">'+
					'	<div class="item-media"><i class="fa fa-'+v.pck.icon+'" style="color:'+v.pck.color+'"></i></div>'+
					'	<div class="item-inner">'+packageName+'</div>'+
					
					'	<div class="item-after"><span class="badge env" style="margin-right:8px">'+packageCount+'</span></div>'+
					'  </div>'+
					'  <div class="swipeout-actions-right">'+
					'	<a href="#" class="action1 orange">Clear</a>'+
					
					'  </div>'+
					'</li>';
			$('#listActions').append(dyn);
			sortUnorderedList("listActions");
			
				}
		});
		
		$('.pcklist').on('click', function(e){
			//hide listActions
			console.log("go out");
			$('#listActions').toggle();
			
			//display the dynamic email list;
			$('#listActionsDetails').html("");
			console.log($(this).attr('mypackage'));
			$(package_inner[$(this).attr('mypackage')]).each(
				function(x,y){
					
					var nextDyn='<li class="swipeout " cs_id="'+y.cover_summ_id+'">'+
					'  <a href="#" class="swipeout-content item-link item-content">'+
					'	<div class="item-inner">'+
					'	  <div class="item-title-row">'+
					'		<div class="item-title">'+y.cover_name+'</div>'+
					'		<div class="item-after"><time class="timeago" datetime="'+y.timeago+'">'+y.last_update_on+'</time></div>'+
					'	  </div>'+
					'	  <div class="item-subtitle">'+y.name+'</div>'+
					'	  <div class="item-text" id="text'+y.cover_summ_id+'"></div>'+
					'	</div>'+
					'  </a>'+
					'  <div class="swipeout-actions-left">'+
					'	<a href="#" class="dontlike red swipeout-delete swipeout-overswipe" cs_id="'+y.cover_summ_id+'">Reject</a>'+
					
					'  </div>'+
					'  <div class="swipeout-actions-right">'+
					'	<a href="#" class="readmore fb" cs_id="'+y.cover_summ_id+'">View</a>'+
					'	<a href="#" class="ilike green swipeout-overswipe" cs_id="'+y.cover_summ_id+'">Accept</a>'+
					
					'  </div>'+
					'</li>';
					console.log('appended');
					$('#listActionsDetails').append(nextDyn);
					pushOut(
					{action: "tinyDetails", summ_id : y.cover_summ_id},
					function(r){
						r=JSON.parse(r);
						//console.log(r.results);
						$('#text'+r.summ_id).html(r.results);
						//console.log('#text'+r.summ_id);
					},
					function(e){
						console.log(e);
					}
					);
				}
			);//end of each list of covers requested
			$("time.timeago").timeago();
					$('#listActionsDetails').show();
			
			//action items for reject and accept
					//reject
					$('.dontlike').on('click', function () {
						  console.log('Item removed'+$(this).attr('cs_id'));
						  //send a reject to server
						  sendResponse($(this).attr('cs_id'),'reject');
					}); 
					
					$('.ilike').on('click', function (e) {
						  console.log('Item opened on: '+$(this).attr('cs_id'));
						  //send an accept to server
						  sendResponse($(this).attr('cs_id'),'accept');
						  //open the details page
						  openDetails($(this).attr('cs_id'))
						  
					}); 
					
					$('.readmore').on('click', function(d){
						console.log('viewed'+$(this).attr('cs_id'));
						 //send an accept to server
						 sendResponse($(this).attr('cs_id'),'viewed');
						  //open the details page
						  openDetails($(this).attr('cs_id'));
							
					});
					
		});//end of pcklist click event
	
	
	//dataIsloaded now
	dataIsloaded=false; //change to true
	}catch(e){
		console.log(e);
	}
	
}


sortUnorderedList=function (att) {
var items = $('#'+att).find('li');

items.sort(function(a, b){
    return +$(a).data('sorter') - +$(b).data('sorter');
});

items.sort(function(a, b){
    return +$(b).data('unread') - +$(a).data('unread');
});
   // items.reverse();
   $('#'+att).html("");
   $('#'+att).append(items);


}

sendResponse=function(that,response){
	pushOut(
	{action:'sp_response',cs_id:that,sp_r:response, uid:localStorage.getItem('revoU'),offer:localStorage.getItem('offer')},
	function(s){
		console.log('success');
		localStorage.removeItem('offer')
	},
	function(f){
		console.log('failed');
	}
	)
}

openDetails=function(cs_id){
	
	pushOut(
	{action:'showDet',id:cs_id, revoU:localStorage.getItem('revoU')},
	function(s){
		var letable='';
		var sum_id = '';
		console.log('success');
		console.log(JSON.parse(s));
		s=JSON.parse(s);
		var InsuredValue=0;
		var premiumformatted=0;
		var premium=0
		$.each(s.results, function(r,t){
			sum_id=t.cover_summ_id;
			if(t.swo_name!='' && t.swo_name !=null){
				//user swo_name
				value=t.swo_name;
			}else{
				//user real value
				value=redeemValue(t.wv_value,t.dt_value);
			}
			if(t.write_title=='Estimated Value'){ 
				console.log("insuranceVal="+value);
				InsuredValue=value;
				value=formatNumber(value);
				premium=parseFloat((s.tarrif/100)*InsuredValue);
				localStorage.setItem('offer',premium);
				premiumformatted=formatNumber(premium);
				}
			letable=letable+'<tr><td>'+t.write_title +'</td><td>'+value+'</td></tr>';
		});
		var mypopup='<div class="popup popup-services">'+
			'<div class="content-block">'+
			  '<h1>Quotation Request</h1>'+
			  '<p class="buttons-row">'+
				  '<a href="#" class="button close-popup red reject" cs_id="'+sum_id+'">Skip</a>'+
				  '<a href="#" class="button green acceptance" cs_id="'+sum_id+'">Send Quote</a>'+
				  
				'</p>'+
			  '<table>'+letable+'</table>'+
			  '<div><small style="color: #9C27B0;font-weight: bolder;">Premium Rate:'+s.tarrif+'%</small><div>'+
			  '<div><h3>Annual Premium:'+premiumformatted+'</h3></div>'+
			'</div>'+
		  '</div>';
		
		$('#poper').html(mypopup);
		myApp.popup('.popup-services');
		$$('.reject').on('click', function () {
			sendResponse($(this).attr('cs_id'),'rejected');
		});
		$$('.acceptance').on('click', function () {
			
				myApp.alert('Your have offered  "' + premiumformatted + '/-". Thankyou');
				myApp.closeModal('.popup-services');
				//save offer.
				sendResponse($(this).attr('cs_id'),'accept');
			
			
		});
		
		
	},
	function(f){
		console.log('failed');
	}
	)
	
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

///initialise
loadPendingRequest();


