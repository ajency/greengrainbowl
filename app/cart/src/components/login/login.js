import React, { Component } from 'react';
import Header from '../header/header.js';
import './login.scss'
import axios from 'axios';
import {generalConfig} from '../config'

class LogIn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			site_mode : generalConfig.site_mode,
			number_text : (generalConfig.site_mode == 'kiosk') ? 'Please enter your number' : 'Your delivery and payment details will be associated with this number',
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
			<div className="slide-in flex-slide-in visible">
			  <Header/>
			  <div className="slide-in-content">
			      <div className="spacer-2101"></div>
			      <div className="position-relative title-wrap pl-0">
					{/* <button className="btn btn-reset btn-back p-0"><i class="fa fa-arrow-left font-size-20" aria-hidden="true"></i></button> */}
					<h3 className="h1 ft6">Mobile Number</h3>
			      </div>
			      <h4 className="font-weight-light mt-4 pb-4">
				  	{this.state.number_text}
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
		return (<div className="btn-inner-wrap">
		          <button type="button" className="btn-reset btn-arrow-icon text-white border-green bg-primary p-3 text-left h5 ft6 mb-0 rounded-0 w-100 position-relative d-flex align-items-center justify-content-between text-capitalize" onClick={()=> this.signInWithPhoneNumber()}>
					  <span className="zindex-1">Submit</span> <i className="text-white fa fa-arrow-right" aria-hidden="true"></i></button>		          
		        </div>
		);
	}

	displaySignInErrorMsg(){
		if(this.state.errorMessage){
			return  <div className="alert-danger">{this.state.errorMessage}</div>
		}
	}

	setUserMobile(value){
		this.setState({errorMessage:""})
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


	signInWithPhoneNumber(){
		const regex = /^[0-9]*$/;
		const results = this.state.phoneNumber.match(regex);
		if(!results) {
			this.setState({errorMessage: 'Please enter valid 10 digit mobile number.'})
			return false;
		}
		if(this.state.phoneNumber.length < 10) {
			this.setState({errorMessage:"Please enter valid 10 digit mobile number."})
			return false;
		}
		window.addCartLoader();
		let url = generalConfig.apiEndPoint + "/check-user-exist";
		let body = {
			phone_number : this.state.phoneNumber
		}
		axios.get(url, {params : body})
			.then((res) => {
				if(res.data.success){
					this.props.history.push({pathname : '/cart/verify-mobile', state : {phoneNumber : this.state.phoneNumber, hide_skip_otp:true}});
					window.removeCartLoader();
				}
				else{
					window.firebase.auth().currentUser.getIdToken().then((idToken)=>{
						this.updateUserDetails(idToken)
					})
				}
			})
			.catch((error)=>{
				let msg = error.message ? error.message : error;
				this.setState({errorMessage : error.message});
				window.removeCartLoader();
			})
	}

	updateUserDetails(idToken){
		let body = {
			phone : this.state.phoneNumber
		}
		let headers = {
			Authorization : 'Bearer '+ idToken
		}
		let url = generalConfig.apiEndPoint + "/user/update-user-details";
		axios.post(url, body, {headers :  headers })
			.then((resuser) => {
				console.log("update user details response ==>", resuser);
				if(this.state.site_mode == 'kiosk'){
					let cart_id =  window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId);
			        if(cart_id) {
			            window.assignAddressToCart(null, true, this.state.phoneNumber)
			            .then((res) => {
			                if(res.success) {
			                    window.removeCartLoader();
			                    this.props.history.push({pathname:'/cart/cart-summary', state:{order_obj:res.cart}});
			                } else {
			                    window.removeCartLoader();
			                    if(res.code =='PAYMENT_DONE') {
			                        this.props.history.push('/cart');
			                    }
			                }
			            }).catch(err => {
			                console.log(err);
			            })
			        }
				} else {
					window.removeCartLoader();
					this.props.history.push('/cart/select-address');
				}
			})
			.catch((error)=>{
				console.log("error in update user details ==>", error);
				window.removeCartLoader();
			})
	}

}

export default LogIn;
