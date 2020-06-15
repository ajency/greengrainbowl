'use strict';
const e = React.createElement;

import axios from 'axios';

const logo = "https://greengrainbowl.com/assets/images/cart-images/app-logo.png";

class signInModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			phoneNumber : '',
			otp : '',
			confirmationResult : '',
			disableButtons : false,
			showSignInLoader : false,
			errorMessage : '',
			showCapta : true
		}
	}

	render() {
		return (
			<div className="slide-in flex-slide-in" id="phone_number">
			  <div className="slide-in-header header-container d-flex align-items-center">
			      <div className="app-name d-flex align-items-center">					
				  	<img src={logo} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
			      </div>
			      <div className="app-chekout text-green">
				 	 <i class="sprite sprite-checkout"></i>
			          Secure <br/>Checkout
			      </div>
			      <h3 className="app-close bg-primary m-0 text-white btn-pay m-0" onClick={() => this.closeSignInSlider()} disabled={this.state.disableButtons}>
			          <span aria-hidden="true"><i class="sprite sprite-remove"></i></span>
			      </h3>
			  </div>
			  <div className="slide-in-content">
			      <div className="spacer-2101"></div>
				  <div className="position-relative title-wrap pl-0">
					{/* <button className="btn btn-reset btn-back p-0"><i class="fa fa-arrow-left font-size-20" aria-hidden="true"></i></button> */}
					<h3 className="h1 ft6">Mobile Number</h3>
			      </div>
				  <h4 className="font-weight-light mt-4 pb-4">
				  	Your Shipping and payment details will be associated with this number
			      </h4>
			      <div className="mb-3 pt-4 pb-2">
			        <input className="w-100 p-3 border-green h5 ft6 rounded-0 plceholder-text" placeholder="10 digit mobile number" type="tel" onKeyDown={e => {this.validateMobile(e)}} onChange={e => {this.setUserMobile(e.target.value)}} value={this.state.phoneNumber} maxLength="10"/> <br/>
			      </div>
			      <div className="btn-wrapper pt-4">
			      		{this.getSignInButtons()}
			      </div>
				  {/* <h5 class="mt-3 text-center">Don't wish to login? <a class="text-green d-inline-block cursor-pointer" href="#">Skip.</a></h5> */}
			      {this.displaySignInErrorMsg()}
			  </div>
			  {this.getCaptaContainer()}
			
			</div>

		);
	}

	getCaptaContainer(){
		if(this.state.showCapta){
			return(<div className="d-none" id='sign-in-button'></div>)
		}
		else{
			return (null);
		}
	}

	getSignInButtons(){
		// if(this.state.showSignInLoader){
		// 	return (
		// 		<div className="btn-icon">
		// 				<i className="fas fa-circle-notch fa-spin fa-lg"></i>
		// 		</div>
		// 	);
		// }
		return (<div className="btn-inner-wrap">
		          <button type="button" className="btn-reset btn-arrow-icon text-white border-green bg-primary p-3 text-left h5 ft6 mb-0 rounded-0 w-100 d-flex align-items-center justify-content-between" onClick={()=> this.signInWithPhoneNumber()}><span className="zindex-1">Submit</span> <i className="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i></button>
		        </div>
		);
	}

	displaySignInErrorMsg(){
		if(this.state.errorMessage){
			return  <div className="alert-danger">{this.state.errorMessage}</div>
		}
	}

	setUserMobile(value){
		this.setState({errorMessage: ''})
		this.setState({phoneNumber : value});
	}

	validateMobile(e){
	    let key = e.key;
	    let keyList = ["1","2","3","4","5","6","7","8","9","0"];
	    if (key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Backspace' && (!keyList.includes(key) || e.target.value.length >9 )) {
	        if (e.preventDefault) 
	        	e.preventDefault(); //normal browsers
	        e.returnValue = false; //IE
	    }
	}

	modalClosed(){
		window.modal_closed = true;
	}

	signInWithPhoneNumber(){
		const regex = /^[0-9]*$/;
		const results = this.state.phoneNumber.match(regex);
		if(!results) {
			this.setState({errorMessage: 'Please enter valid 10 digit mobile number.'})
			return false;
		}
		if(this.state.phoneNumber.length < 10) {
			this.setState({errorMessage: 'Please enter valid 10 digit mobile number'})
			return false;
		}
		window.addCartLoader();
		this.setState({disableButtons : true, showSignInLoader : true, showCapta : true}, () => {
			let phone_number = "+91" + this.state.phoneNumber;
			if(window.recaptchaVerifier)
				window.recaptchaVerifier.clear();
			window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
			  'size': 'invisible',
			  'callback': function (response) {
		        // reCAPTCHA solved, allow signInWithPhoneNumber.
		      }
			});

			firebase.auth().signInWithPhoneNumber(phone_number, window.recaptchaVerifier)
			    .then( (confirmationResult) => {
					console.log("SMS sent.");
					window.addCartLoader();
					let url =  "https://asia-east2-project-ggb.cloudfunctions.net/api/rest/v1/check-user-exist";
					let body = {
						phone_number : this.state.phoneNumber
					}
					axios.get(url, {params : body})
						.then((res) => {
							if(res.data.success){
								window.removeCartLoader();
								this.setState({confirmationResult : confirmationResult, showCapta : false});
								this.showOtpSlider(confirmationResult, this.state.phoneNumber, true) 
							} else {
								window.removeCartLoader();

								this.setState({confirmationResult : confirmationResult, showCapta : false});
								this.showOtpSlider(confirmationResult, this.state.phoneNumber) 
							}
						}).catch((e) => {
							window.removeCartLoader();

							this.setState({confirmationResult : confirmationResult, showCapta : false});
							// this.closeSignInSlider() // TODO : function to hide this popup 
							this.showOtpSlider(confirmationResult, this.state.phoneNumber)   // TODO : Show the otp in slider // pass confirmation-result and mobile number to otp component
						})
			    }).catch( (error) => {
			    	window.removeCartLoader();
					  console.log("Error :  SMS not sent", error);
					  if(error.message =="TOO_SHORT") {
						error.message = "Please enter valid 10 digit mobile number."
					  }
			      	this.setState({errorMessage : error.message, disableButtons : false, showSignInLoader : false, showCapta : false});
			    });
		});
		
	}

	closeSignInSlider(){
		document.querySelector('#phone_number').classList.remove('visible');
	}

	showOtpSlider(confirmationResult, phone_number, hide_skip_otp){
		window.showOTPSlider(true);
		window.updateOtpSLider(confirmationResult, phone_number, hide_skip_otp);
	}

}

let domContainer = document.querySelector('#react-sign-in-container');
const signInModalComponent = ReactDOM.render(e(signInModal), domContainer);


window.showSignInModal = (data) => {
	signInModalComponent.setState({phoneNumber : '', otp : '', confirmationResult : '', disableButtons : false, showSignInLoader : false, errorMessage : '', showOtpLoader : false, otpErrorMsg : ''})
	document.querySelector('#phone_number').classList.add('visible');
}
