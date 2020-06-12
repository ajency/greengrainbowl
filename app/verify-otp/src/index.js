'use strict';
const e = React.createElement;

const logo = "https://greengrainbowl.com/assets/images/cart-images/app-logo.png";


class verifyOtp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apiEndPoint : process.env.REACT_APP_API_END_PT,
			phoneNumber : '',
			otp : '',
			confirmationResult : '',
			disableButtons : false,
			errorMessage : '',
			showOtpLoader : false,
			otpErrorMsg : '',
			showCapta : true,
			siteMode: process.env.REACT_APP_SITE_MODE,
			businessId: process.env.REACT_APP_BUSINESS_ID,
			hide_skip_otp:false
		}
	}

	render() {
		const {hide_skip_otp} =this.state
		return (
			<div className="slide-in flex-slide-in" id="otp">
			  <div className="slide-in-header header-container d-flex align-items-center">
			      <div className="app-name d-flex align-items-center">					
				  	<img src={logo} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
			      </div>
			      <div className="app-chekout text-green">
				  	<i class="sprite sprite-checkout"></i>
			          Secure <br/>Checkout
			      </div>
			      <h3 className="app-close bg-primary m-0 text-white btn-pay m-0" onClick={() => this.hideVerifyOtpSlider()}>
			          <span aria-hidden="true"><i class="sprite sprite-remove"></i></span>
			      </h3>
			  </div>
			  <div className="slide-in-content">
			      <h3 className="h1 ft6">Verify Mobile</h3>
			      <h4 className="font-weight-light mt-4 pb-4">
			        Enter the 6 digit code sent to the number 
			      </h4>
				  <h4 className="ft6 mb-3">{this.state.phoneNumber}</h4>
			      <div className="mb-1 pt-4">
			       	<input className="w-100 p-3 border-green h5 ft6 rounded-0 plceholder-text" type="tel" placeholder="Enter OTP" onChange={e => {this.setOtp(e.target.value)}} value={this.state.otp} maxLength={6}/>
			      </div>
			      <h6 className="mb-2 pb-3">Didn't receive the code? <a href="javascript:void(0)" className="text-underline" onClick={()=>{this.resendOtpCode()}}>Resend</a></h6>
				  <div className="btn-wrapper pt-4">
			        {this.getOtpButtons()}
			      </div>
				  {!hide_skip_otp && <h5 class="mt-3 text-center">Don't wish to login? <a class="text-green d-inline-block cursor-pointer text-underline" onClick={() => this.skipOtp()}>Skip</a></h5>}

			      {this.displayOtpErrorMsg()}
			  </div>
			  
			  {this.getCaptaContainer()}
			</div>
		);
	}

	getCaptaContainer(){
		if(this.state.showCapta){
			return(<div className="d-none" id='sign-in-button-capta'></div>)
		}
		else{
			return (null);
		}
	}

	getOtpButtons(){
		if(this.state.showOtpLoader){
			return (<div className="btn-icon">
						<i className="fas fa-circle-notch fa-spin fa-lg"></i>
					</div>
			);
		}

		return (
			 <div className="btn-inner-wrap">
	        	<button type="button" className="btn-reset btn-arrow-icon text-white border-green bg-primary p-3 text-left h5 ft6 mb-0 rounded-0 w-100 d-flex align-items-center justify-content-between" onClick={()=>{this.verifyOtp()}}><span className="zindex-1">Verify OTP</span>
				<i className="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
				</button>
	          	
	        </div>
		);
	}

	displayOtpErrorMsg(){
		if(this.state.otpErrorMsg){
			return  <div className="alert-danger">{this.state.otpErrorMsg}</div>
		}
	}

	setOtp(value){
		this.setState({otpErrorMsg : ''});
		this.setState({otp : value});
	}

	updateUserDetails(idToken){
		let body = {
			phone : this.state.phoneNumber
		}
		let headers = {
			Authorization : 'Bearer '+ idToken
		}
		let url = this.state.apiEndPoint + "/user/update-user-details";
		axios.post(url, body, {headers :  headers })
			.then((res) => {
				console.log("update user details response ==>", res);
			})
			.catch((error)=>{
				console.log("error in update user details ==>", error);
			})
	}

	verifyOtp(){
		if(this.state.otp.length < 6 || this.state.otp.length > 6) {
			console.log("invalid otp ==>")
            this.setState({ otpErrorMsg: "Please enter valid 6 digit verification code"});
            return false;   
		}
		console.log("Verifying otp")
		window.addCartLoader();
		this.setState({showOtpLoader : true , disableButtons : true, otpErrorMsg : ''});
		this.state.confirmationResult.confirm(this.state.otp)
			.then((res) =>{
				res.user.getIdToken().then((idToken) => {
					window.createCartForVerifiedUser(window.readFromLocalStorage(this.state.siteMode+'-cart_id-'+this.state.businessId));
					window.writeInLocalStorage(this.state.siteMode+'-cart_id-'+this.state.businessId , window.brewCartId(this.state.siteMode, this.state.businessId));
		            this.updateUserDetails(idToken);
		            this.fetchAddresses();
		        });
			})
			.catch((error)=>{
				window.removeCartLoader();
				let msg = error.message ? error.message : error;
				this.setState({showOtpLoader : false, disableButtons : false, otpErrorMsg : msg});
				console.log("error in otp verification ==>", error);
			})
	}

	fetchAddresses(){
		try{
			window.getAddresses().then((res)=>{
				this.closeSignInSlider();
				this.hideVerifyOtpSlider();
		      	window.updateAddresses(res);
		      	window.removeCartLoader();
			})
		}
		catch(error){
			this.closeSignInSlider();
			this.hideVerifyOtpSlider();
	      	window.updateAddresses([]);
	      	window.removeCartLoader();
		}
	}

	hideVerifyOtpSlider(){
		document.querySelector('#otp').classList.remove('visible');
	}

	closeSignInSlider(){
		document.querySelector('#phone_number').classList.remove('visible');
	}

	resendOtpCode(){
        this.setState({ otp: '' });
        this.setState({ otpErrorMsg: '' });
		this.setState({showCapta : true}, ()=>{
			console.log("inside verify otp code");
			window.addCartLoader();
			let phone_number = "+91" + this.state.phoneNumber;
			if(window.recaptchaVerifier)
				window.recaptchaVerifier.clear();
			window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button-capta', {
			  'size': 'invisible',
			  'callback': function (response) {
		        // reCAPTCHA solved, allow signInWithPhoneNumber.
		      }
			});

			firebase.auth().signInWithPhoneNumber(phone_number, window.recaptchaVerifier)
			    .then( (confirmationResult) => {
			    	window.removeCartLoader();
			    	console.log("SMS sent.");
			      	this.setState({confirmationResult : confirmationResult, showCapta : false});
			    }).catch( (error) => {
			    	window.removeCartLoader();
			    	let msg = error.message ? error.message : error;
			      	this.setState({ disableButtons : false, otpErrorMsg : msg, showCapta : false});
			    });
		});
	}

	skipOtp(){
		this.closeSignInSlider();
		this.hideVerifyOtpSlider();
	}

	showGpsSlider(){
		window.showGpsModalPrompt(true);
	}

}

let otpContainer = document.querySelector('#react-verify-otp-container');
const otpModalComponent = ReactDOM.render(e(verifyOtp), otpContainer);

window.showOTPSlider = (data) => {
	console.log("check show otp modal==>")
	otpModalComponent.setState({phoneNumber : '', otp : '', confirmationResult : '', disableButtons : false,  errorMessage : '', showOtpLoader : false, otpErrorMsg : ''})
	document.querySelector('#otp').classList.add('visible');
}

window.updateOtpSLider = (confirmationResult, phone_number, hide_skip_otp) => {
	otpModalComponent.setState({phoneNumber : phone_number,  confirmationResult : confirmationResult,hide_skip_otp:hide_skip_otp })
}
