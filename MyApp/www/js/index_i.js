checkRegister=function (){
	console.log("am home");
	//1. check if this guy is registered
	revoU= localStorage.getItem('revoU');
	
	if(revoU!=null){
		console.log('user not Null');
		if(revoU.length>3){
			
			mainView.router.loadPage('profile3.html');
		}else{
			console.log('length too short');
		}
	}else{
		
		console.log('registerUseer');
		mainView.router.loadPage('register.html');
		
	}

}

 $(document).ready(function() {
     $("time.timeago").timeago();
   });

checkRegister();



