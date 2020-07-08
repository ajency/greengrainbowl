import React, { Component } from 'react';
import Header from '../header/header.js';
import {generalConfig} from '../config';
import axios from 'axios';
import './verify-mobile.scss'

class VerifyMobile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            site_mode : generalConfig.site_mode,
            phoneNumber: '',
            otp: '',
            confirmationResult: '',
            errorMessage: '',
            showCapta: true,
            showOtpScreen: false,
            businessId: generalConfig.businessId,
            hide_skip_otp:false
        }
    }

    componentDidMount() {
        console.log("check state ==>", this.props.location, this.props.history)
        this.setState({ phoneNumber: this.props.location.state.phoneNumber , hide_skip_otp:this.props.location.state.hide_skip_otp });
        this.signInWithPhoneNumber();
    }

    render() {
        return (
            <div className="address-container visible d-flex justify-content-between flex-column">
                <Header />
                {this.getUIContent()}
            </div>
        );
    }

    getUIContent() {
        const {hide_skip_otp}=this.state;
        if (!this.state.showOtpScreen) {
            return (
                <div className="d-flex flex-column p-15 pb-0">
                    <h3 className="mt-4 h1 ft6">Verify mobile</h3>
                    <h4 className="font-weight-light mt-4 pb-4">Sending OTP...</h4>
                    {/*<h4 className="font-weight-light mt-4 pb-4">Looks like you already have account with an saved address. Sign in with OTP for faster checkout.</h4>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-primary btn-inverted btn-arrow-icon p-15 rounded-0 text-left position-relative h5 ft6 mb-0 w-48 d-flex align-items-center justify-content-between" onClick={() => { this.skipLogin() }}><span className="zindex-1">Cancel</span> <i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i></button>
                        <button className="btn btn-primary btn-arrow-icon p-15 rounded-0 text-left position-relative h5 ft6 mb-0 w-48 d-flex align-items-center justify-content-between" onClick={() => { this.signInWithPhoneNumber() }}><span className="zindex-1">Sign in</span> <i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i></button>
                    </div>*/}
                </div>
            )
        }
        else {
            return (
                <div>
                    <div className="slide-in-content">
                        <div className="position-relative title-wrap pl-0">
                            {/* <button className="btn btn-reset btn-back p-0"><i class="fa fa-arrow-left font-size-20" aria-hidden="true"></i></button> */}
                            <h3 className="h1 ft6">Verify Mobile</h3>
                        </div>
                        <h4 className="font-weight-light mt-4 pb-4">
                            Enter the 6 digit code sent to the number
                        </h4>
                        <h4 className="ft6 mb-3">{this.state.phoneNumber}</h4>
                        <div className="mb-1 pt-4">
                            <input className="w-100 p-3 border-green h5 ft6 rounded-0 plceholder-text" type="tel" placeholder="Enter OTP" onChange={e => { this.setOtp(e.target.value) }} value={this.state.otp} maxLength={6}/>
                        </div>
                        <h6 className="mb-2 pb-3">Didn't receive the code? <a href="javascript:void(0)" className="text-underline" onClick={() => { this.resendOtpCode() }}>Resend</a></h6>
                        <div className="btn-wrapper pt-4">
                            <div className="btn-inner-wrap">
                                <button type="button" className="btn-reset btn-arrow-icon text-white border-green bg-primary p-3 text-left h5 ft6 mb-0 rounded-0 w-100 d-flex align-items-center justify-content-between text-capitalize" onClick={() => { this.verifyOtp() }}>
                                    <span className="zindex-1">Verify OTP</span>
                                    <i className="text-white fa fa-arrow-right" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                        {!hide_skip_otp && <h5 class="mt-3 text-center">Don't wish to login? <a class="text-green d-inline-block cursor-pointer text-underline" onClick={() => this.skipLogin()}>Skip</a></h5>}

                        {this.displayOtpErrorMsg()}
                    </div>

                    {this.getCaptaContainer()}
                </div>
            )
        }
    }

    getCaptaContainer() {
        if (this.state.showCapta) {
            return (<div className="d-none" id='recaptcha-container'></div>)
        }
        else {
            return (null);
        }
    }

    displayOtpErrorMsg() {
        if (this.state.otpErrorMsg) {
            return <div className="alert-danger p-15">{this.state.otpErrorMsg}</div>
        }
    }

    skipLogin() {
        try {
            window.firebase.auth().currentUser.getIdToken().then((idToken)=>{
                window.addCartLoader();
                this.updateUserDetailsFromSkipOtp(idToken)
            })
        } catch (error) {
            window.removeCartLoader();
            this.setState({ errorMessage: error.message, showCapta: false });
        }
        
    }

    setOtp(value) {
        this.setState({ otpErrorMsg: '' });
        this.setState({ otp: value });
    }

    signInWithPhoneNumber() {
        window.addCartLoader();
        this.setState({ showCapta: true, showOtpScreen: true }, () => {
            let phone_number = "+91" + this.state.phoneNumber;
            if (window.recaptchaVerifier)
                window.recaptchaVerifier.clear();
            window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': function (response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });

            window.firebase.auth().signInWithPhoneNumber(phone_number, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    window.removeCartLoader();
                    console.log("SMS sent.");
                    this.setState({ confirmationResult: confirmationResult, showCapta: false });
                }).catch((error) => {
                    window.removeCartLoader();
                    console.log("Error :  SMS not sent", error);
                    this.setState({ errorMessage: error.message, showCapta: false });
                });
        });
    }

    verifyOtp() {
        window.addCartLoader()
        console.log("this.state.otp ==>", this.state.otp);
        this.setState({ otpErrorMsg: '' });
        
        if(this.state.otp.length < 6 || this.state.otp.length > 6) {
            console.log("invalid otp");
            window.removeCartLoader()
            
            this.setState({ otpErrorMsg: "Please enter valid 6 digit verification code"});
            return false;   
        }
        console.log("verifing otp");

        this.state.confirmationResult.confirm(this.state.otp)
            .then((resuser) => {
                resuser.user.getIdToken().then(async (idToken) => {
                    let cart_id = window.brewCartId(this.state.site_mode,this.state.businessId);
                    window.createCartForVerifiedUser(window.readFromLocalStorage(this.state.site_mode+'-cart_id-'+this.state.businessId), this.state.site_mode,this.state.businessId);
                    window.writeInLocalStorage(this.state.site_mode+'-cart_id-'+this.state.businessId, cart_id);
                    window.updateSavedAddressUI()
                    await this.updateUserDetails(idToken);
                    if(this.state.site_mode == 'kiosk'){
                        if(cart_id) {
                            window.addCartLoader();
                            window.assignAddressToCart(null, true, this.state.phoneNumber)
                            .then((res) => {
                                if(res.success) {
                                    window.removeCartLoader()
                                    this.props.history.replace({pathname:'/cart/cart-summary', state:{order_obj:res.cart}});
                                } else {
                                    window.removeCartLoader();
                                    if(res.code =='PAYMENT_DONE') {
                                        this.props.history.replace('/cart');
                                    }
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    } else {
                        if(window.userDetails){
                            window.addCartLoader()
                            if(window.userDetails.hasOwnProperty('default_address_id')) {
                                const address_id =  window.userDetails.default_address_id
                                if(address_id) {
                                    const deliverable = await this.isAddressDeliverable(address_id)
                                    if (deliverable) {
                                        console.log("rsrrrr");
                                        try {
                                        
                                            const res =	await window.assignAddressToCart(address_id)
                                        
                                            if(res.success) {
                                                window.removeCartLoader();
                                                this.props.history.replace({pathname:'/cart/cart-summary', state:{order_obj:res.cart,approx_delivery_time:generalConfig.preparationTime}});
                                            } else {
                                                console.log(" no success assignAddressToCart");
                                                window.removeCartLoader();
                                                this.props.history.replace('/cart/select-address');	
                                            }
                                
                                        } catch (error) {
                                            console.log("error in assignAddressToCart");
                                                window.removeCartLoader();
                                                this.props.history.replace('/cart/select-address');	
                                        }
                                        
                                    } else {
                                        console.log("not isAddressDeliverable");
                                        window.removeCartLoader();

                                        this.props.history.replace('/cart/select-address');
                                    }
                                } else {
                                        console.log("on address id");
                                        window.removeCartLoader();
                                        this.props.history.replace('/cart/select-address');
                                }
                            } else {
                                console.log("no default_address_id");
                                                window.removeCartLoader();
                                                this.props.history.replace('/cart/select-address');
                            }
                        } else {
                            console.log("no userDetails");
                            window.removeCartLoader();
                            this.props.history.replace('/cart/select-address');
                        }
                    }
                });
            })
            .catch((error) => {
                window.removeCartLoader();
                let msg = error.message ? error.message : error;
                this.setState({ otpErrorMsg: msg });
                console.log("error in otp verification ==>", error);
            })
    }

    isAddressDeliverable=(address_id)=> {
        let address = window.userAddresses.filter((address) => { return address.id == address_id;})[0];
		if(address){
			console.log(address);
			
			return window.getCurrentStockLocation().then(locations => {
				if(!locations.length) {
					this.displayError("Something went wrong...")
					return false;
				}
				let deliverable =  window.findDeliverableLocation(locations,address.lat_long)
			
				return !!deliverable
			})
		} else {
			return false
		}
    }

    resendOtpCode() {
        this.setState({ otp: '' });
        this.setState({ otpErrorMsg: '' });
        this.setState({ showCapta: true }, () => {
            console.log("inside verify otp code");
            window.addCartLoader();
            let phone_number = "+91" + this.state.phoneNumber;
            if (window.recaptchaVerifier)
                window.recaptchaVerifier.clear();
            window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': function (response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });

            window.firebase.auth().signInWithPhoneNumber(phone_number, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    window.removeCartLoader();
                    console.log("SMS sent.");
                    this.setState({ confirmationResult: confirmationResult, showCapta: false });
                }).catch((error) => {
                    window.removeCartLoader();
                    let msg = error.message ? error.message : error;
                    this.setState({ otpErrorMsg: msg, showCapta: false });
                });
        });
    }

    async updateUserDetails(idToken){
		let body = {
			phone : this.state.phoneNumber
		}
		let headers = {
			Authorization : 'Bearer '+ idToken
		}
        let url = generalConfig.apiEndPoint + "/user/update-user-details";
        try {
            const res = await axios.post(url, body, {headers :  headers })
            return 
        } catch (error) {
            return 
        }
			
	}
    updateUserDetailsFromSkipOtp(idToken){
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
                    let cart_id =  window.readFromLocalStorage(this.state.site_mode+'-cart_id-'+this.state.businessId);
                    if(cart_id) {
                        window.assignAddressToCart(null, true, this.state.phoneNumber)
                        .then((res) => {
                            if(res.success) {
                                window.removeCartLoader();
                                this.props.history.replace({pathname:'/cart/cart-summary', state:{order_obj:res.cart}});
                            } else {
                                window.removeCartLoader();
                                if(res.code =='PAYMENT_DONE') {
                                    this.props.history.replace('/cart');
                                }
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                } else {
                    window.removeCartLoader();
                    this.props.history.replace('/cart/select-address');
                }
			})
			.catch((error)=>{
				console.log("error in update user details ==>", error);
				window.removeCartLoader();
			})
	}

}

export default VerifyMobile;