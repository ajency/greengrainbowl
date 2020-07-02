import React, { Component } from 'react';
import './cart-checkout-summary.scss';
import axios from 'axios';
import '../cart/cart.scss';
import Header from '../header/header.js';
import Item from '../item/item.js';
import DeliveryAddress from '../delivery-address/delevery-address.js';
import add from '../../assets/images/add.png';
import genuinityLogo from '../../assets/images/Shield_icon.png';
import clockLogo from '../../assets/images/Time.png';
import Payments from '../payment-gateway/payments'
import CartSummary from '../cart-summary/cart-summary';
import { generalConfig } from "../config";
import logo from '../../assets/images/app-logo.png';



class CartCheckoutSummary extends Component {
	_webSiteLink = "#/cart";
	_isMounted = false;
	constructor(props) {
		super(props);
		this.checkNameExists = this.checkNameExists.bind(this);
		this.state = {
			site_mode: generalConfig.site_mode,
			pickupPoint: generalConfig.pickupPoint,
			dataLoading: true,
			orderSummary: {},
			fetchCartComplete: false,
			fetchCartFailed: false,
			fetchCartFailureMsg: '',
			cartEmpty: false,
			approxDeliveryTime: generalConfig.preparationTime,
			shippingAddress: '',
			accountName: '',
			accountEmail: '',
			errors: {
				name: '',
				email: '',
				accountInfo: ''
			},
			amount: 0,
		}
	}

	componentWillMount() {
		this._isMounted = true
	}
	componentDidMount() {
		if (this._isMounted) {
			let shipping_address_extra = ''

			console.log(this.props)
			if (this.props.location.state) {
				let cart = this.props.location.state.order_obj
				console.log("inside location state =>>", this.props.location.state)
				this.setState({ orderSummary: this.props.location.state.order_obj })

				if (cart.shipping_address.hasOwnProperty('address')) {
					shipping_address_extra = cart.shipping_address.address + ', '
				}
				if (cart.shipping_address.hasOwnProperty('landmark')) {
					shipping_address_extra = shipping_address_extra + cart.shipping_address.landmark + ', '
				}
				shipping_address_extra = shipping_address_extra + cart.shipping_address.formatted_address
				this.setState({ shippingAddress: shipping_address_extra })
				this.setState({ dataLoading: false, fetchCartComplete: true })
				window.removeCartLoader();
			} else {
				window.assignAddressToCart(null, true)
					.then((res) => {
						console.log(res)
						if (res.code == 'PAYMENT_DONE') {
							// window.removeFromLocalStorage('cart_id')
							this.props.history.push('/cart');
						}
						this.setState({ orderSummary: res.cart, dataLoading: false, fetchCartComplete: true });
						if (res.cart.shipping_address.hasOwnProperty('address')) {
							shipping_address_extra = res.cart.shipping_address.address + ', '
						}
						if (res.cart.shipping_address.hasOwnProperty('landmark')) {
							shipping_address_extra = shipping_address_extra + res.cart.shipping_address.landmark + ', '
						}
						shipping_address_extra = shipping_address_extra + res.cart.shipping_address.formatted_address
						this.setState({ shippingAddress: shipping_address_extra })
						window.removeCartLoader();
					}).catch(err => {
						console.log(err)
						window.removeCartLoader();
						this.setState({ dataLoading: false })

					})
			}
		}

	}

	componentWillUnmount() {
		this._isMounted = false
	}

	getItems() {
		let items = this.state.orderSummary.items.map((item) =>
			<Item key={item.variant_id} item={item} removeItem={(variant_id) => this.removeItem(variant_id)} updateSummary={(summary) => this.updateSummary(summary)} />
		);
		return items;
	}

	render() {
		let cartContainer;
		if (!this.state.fetchCartComplete)
			cartContainer = <div className="text-center mt-5 p-15"> <h4 className="font-weight-meidum m-0">  </h4>  </div>
		else {
			if (this.state.cartEmpty) {
				cartContainer = <div className="text-center mt-5 p-15 "> <h4 className=""> Your cart is Empty. Add something from the menu </h4>
					<div className="btn-wrapper mt-3">
						<div className="btn-inner-wrap">
							<button onClick={() => this.closeCart()} type="button" className="btn-reset text-white border-green bg-primary p-3 text-center h5 ft6 mb-0 rounded-0" >Browse Our Cuisine</button>
						</div>
					</div>
				</div>
			}
			else if (this.state.fetchCartFailed) {
				cartContainer = <div className="text-center mt-5"> <h4> {this.state.fetchCartFailureMsg} </h4>  </div>
			}
			else {
				cartContainer =
					<div>
						<div className="cart-container visible">
							<div className="cart-heading p-15 pt-0 pb-0">
								<h1 className="font-weight-bold d-block mobile-header mb-4 text-muted pt-3">Your cart summary</h1>
							</div>
							{this.getDeliveryAddressSection()}

							<div className="p-15 pt-0">
								{this.getItems()}
							</div>

							{/* <div className="apply-coupon-bar">
							<div className="coupon-label">
								Apply Coupon   >
							</div>
						</div> */}

							{/* <div className="p-15 pt-2 pb-2 bg-off-green-1 mb-1 d-flex justify-content-between">
							<div className="text-black font-weight-medium">
								Estimated Time:
							</div>
							<div className="w-50 text-align-right font-weight-medium">
								<img src={clockLogo} alt="Estimated time" title="Estimated time" className="d-inline-block vertical-align-middle mr-1"/> 
								<span className="d-inline-block vertical-align-middle text-black font-weight-medium">{this.state.approxDeliveryTime}</span>
							</div>
						</div> */}

							<div className="p-15 pt-0 pb-0">
								<hr className="sep m-0"></hr>
							</div>

							<div className="p-15">
								<label className="cart-summary-label font-weight-medium">Billing Details</label>
								<CartSummary summary={this.state.orderSummary.summary} />
							</div>

							<div className="p-15 pt-0">
								<div className="bottom-bar">
									<div className="genuinity text-align-center">
										<span className="d-inline-block vertical-align-middle ml-0 mt-2 font-size-15"><img src={genuinityLogo} className="mr-1" alt="100% Secure Payments" title="100% Secure Payments" className="" width="20" /> We go to great lengths to work with fresh and quality ingredients. Hours of hard work in the kitchen to bring to your doorstep these healthy bowls. We can’t wait for you to try them!</span>
									</div>
								</div>
							</div>
						</div>
						<div className="p-15 pt-0 pb-0">
							<div className="secure-checkout fixed-bottom visible bg-white p-15">
								<Payments checkNameExists={this.checkNameExists} pgname="razorpay" pgconfig={{ pgtype: "standard", classes: "btn btn-primary btn-arrow w-100 p-15 rounded-0 text-left position-relative h5 ft6 mb-0" }} order={{ id: window.readFromLocalStorage(generalConfig.site_mode + '-cart_id-' + generalConfig.businessId), amount: this.state.amount }} user_details={{ user_details: this.state.orderSummary.user_details }} />
							</div>
						</div>
					</div>
			}
		}

		return (
			<div>
				<Header />
				{cartContainer}
			</div>
		);
	}

	getDeliveryAddressSection() {
		let deliveryaddress = '';
		if (this.state.site_mode == 'kiosk') {
			deliveryaddress = <div className="delivery-address-container p-15">
				<div className="address-details list-text-block p-15 mb-0">
					<div className="address-details-inner font-weight-light">
						<span className="font-weight-semibold">Pick up from </span>
						<span id="cart-delivery-address">{this.state.pickupPoint}</span>
					</div>
					{this.showUserDetailsFields()}
				</div>
				<div className="alert-danger mt-3">
					{this.state.errors.accountInfo.length > 0 && <span className='error text-error p-15 mt-0'>{this.state.errors.accountInfo}</span>}
				</div>
			</div>
		} else {
			deliveryaddress = <div>
				<DeliveryAddress showSummaryContent={true} address={this.state.shippingAddress} userDetails={this.state.orderSummary.shipping_address} navigateToAddress={() => this.navigateToAddress()} addressType={"location"} />
			</div>
		}
		return deliveryaddress
	}

	showUserDetailsFields() {
		if (this.state.orderSummary.shipping_address.name) {
			return (
				<div>
					<div className="address-details-inner font-weight-light mt-3 pt-3 border-grey-top">
						<div className="">
							<span className="text-green font-weight-semibold">Name: </span>
							<span id="cart-delivery-address"> {this.state.orderSummary.shipping_address.name} </span>
						</div>
						<div className="">
							<span className="text-green font-weight-semibold">Email ID: </span>
							<span id="cart-delivery-address"> {this.state.orderSummary.shipping_address.email} </span>
						</div>
						<div className="">
							<span className="text-green font-weight-semibold">Mobile No: </span>
							<span id="cart-delivery-address"> {this.state.orderSummary.shipping_address.phone} </span>
						</div>
					</div>
				</div>
			);
		} else {
			let errors = this.state.errors;
			return (
				<div>
					<div className="address-details-inner font-weight-light mt-3 pt-3 border-grey-top">
						<div className="">
							<span className="text-green font-weight-semibold">Name: </span>
							<span id="cart-delivery-address"> {'<Not provided>'} </span>
						</div>
						<div className="">
							<span className="text-green font-weight-semibold">Email ID: </span>
							<span id="cart-delivery-address"> {'<Not provided>'} </span>
						</div>
						<div className="">
							<span className="text-green font-weight-semibold">Mobile No: </span>
							<span id="cart-delivery-address"> {this.state.orderSummary.shipping_address.phone} </span>
						</div>
					</div>

					<div className="font-weight-semibold font-size-16 text-primary cursor-pointer mt-2"><i class="fas fa-pencil-alt number-edit cursor-pointer" onClick={() => this.toggleAccountPopUp('show')}></i></div>



					{/* <div className="custom-modal user-details" id="cart-checkout-summary-user-details">
						<div className="custom-modal-content p-15 width-calc">
							<button type="button" class="btn-reset close-modal top-5" onClick={() => this.toggleAccountPopUp('hide')}><i class="fas fa-times text-silver"></i></button>
							<h5 className="ft6 mb-4 h2">Account details</h5>
							<label className="d-block mb-3 font-size-16">
								<span className='error text-error'>*</span>Full Name
								<input type="text" name="name" className="d-block w-100 rounded-0 input-bottom" onChange={(e) => {this.setState({accountName:e.target.value}); this.handleChange(e)}} required/>
								{errors.name.length > 0 &&  <span className='error text-error'>{errors.name}</span>}
							</label>

							<label className="d-block mb-3 font-size-16">
								<span className='error text-error'>*</span>Email
								<input type="email" name="email" className="d-block w-100 rounded-0 input-bottom" onChange={(e) => {this.setState({accountEmail:e.target.value}); this.handleChange(e)}} required/>
								{errors.email.length > 0 &&  <span className='error text-error'>{errors.email}</span>}
							</label>

							<button type="button" class="btn-reset btn-continue btn-arrow-icon font-size-15 text-capitalize p-15 bg-primary text-white text-left w-100 position-relative d-flex align-items-center justify-content-between" onClick={() => this.saveAccountInfo()}>
								<span class="zindex-1">Save</span>
								<i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
							</button>
						</div>
		            </div> */}

					<div className="slide-in flex-slide-in" id="account_details">
						<div className="slide-in-header header-container d-flex align-items-center">
							<div className="app-name d-flex align-items-center">
								<img src={logo} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl" />
							</div>
							<div className="app-chekout text-green">
								<i class="sprite sprite-checkout"></i>
								Secure <br />Checkout
							</div>
							<h3 className="app-close bg-primary m-0 text-white btn-pay m-0" onClick={() => this.toggleAccountPopUp('hide')}>
								<span aria-hidden="true"><i class="sprite sprite-remove"></i></span>
							</h3>
						</div>
						<div className="slide-in-content">
							<div className="spacer-2101"></div>
							<div className="position-relative title-wrap pl-0">
								<h3 className="h1 ft6">Account details</h3>
							</div>

							<label className="d-block mb-3 font-size-16 mb-3 pt-4 pb-2">
								<input type="text" name="name" className="w-100 p-3 border-green h5 ft6 rounded-0 plceholder-text" placeholder="Full Name" onChange={(e) => { this.setState({ accountName: e.target.value }); this.handleChange(e) }} required />
								{errors.name.length > 0 && <span className='error text-error mt-0'>{errors.name}</span>}
							</label>

							<label className="d-block mb-3 font-size-16 mb-3 pt-4 pb-2">
								<input type="email" name="email" className="w-100 p-3 border-green h5 ft6 rounded-0 plceholder-text" placeholder="Email" onChange={(e) => { this.setState({ accountEmail: e.target.value }); this.handleChange(e) }} required />
								{errors.email.length > 0 && <span className='error text-error mt-0'>{errors.email}</span>}
							</label>

							<div className="pt-4">
								<button type="button" class="btn-reset btn-continue btn-arrow-icon ft6 text-uppercase p-15 bg-primary text-white text-left w-100 position-relative d-flex align-items-center justify-content-between" onClick={() => this.saveAccountInfo()}>
									<span class="zindex-1">Save</span>
								</button>
							</div>

						</div>
					</div>

				</div>
			);
		}
	}

	toggleAccountPopUp(action) {
		if (action == 'show') {
			document.querySelector('#account_details').classList.add('visible');
		} else {
			document.querySelector('#account_details').classList.remove('visible');
		}
	}

	handleChange = (e) => {
		let { name, value } = e.target;
		let errors = this.state.errors;
		switch (name) {
			case "name":
				errors.name = value.length > 1 ? '' : 'required';
				break;
			case "email":
				if (value.length < 1) {
					errors.email = 'required'
				} else if (!window.validEmailRegex.test(value)) {
					errors.email = "Please enter valid email";
				} else {
					errors.email = ''
				}
				break;
			default:
				break;
		}
	}

	saveAccountInfo() {
		window.addCartLoader()
		let errors = this.state.errors;
		let error = false
		if (this.state.accountName.length < 1) {
			errors.name = "required";
			error = true;
		}
		if (this.state.accountEmail.length < 1) {
			errors.email = "required"
			error = true;
		} else if (!window.validEmailRegex.test(this.state.accountEmail)) {
			errors.email = "Please enter valid email";
			error = true;
		}
		if (error) {
			window.removeCartLoader();
			this.setState({ "errors": errors });
			return false;
		}

		let data = {
			name: this.state.accountName,
			email: this.state.accountEmail,
			phone: this.state.orderSummary.shipping_address.phone,
		}
		window.addUserDetails(data, window.readFromLocalStorage(generalConfig.site_mode + '-cart_id-' + generalConfig.businessId)).then(user => {
			window.removeCartLoader();
			this.toggleAccountPopUp('hide');
			let orderSummary = this.state.orderSummary;
			orderSummary.shipping_address.name = user.name;
			orderSummary.shipping_address.email = user.email;
			orderSummary.user_details.name = user.name;
			orderSummary.user_details.email = user.email;
			orderSummary.user_details.phone = user.phone;
			errors.accountInfo = '';
			this.setState({ "errors": errors });
			this.setState({ orderSummary: orderSummary });
		}).catch(err => {
			console.log(err)
		})
	}

	closeCart() {
		document.querySelector(".cart-wrapper").classList.remove('active');
		let url = window.location.href.split("#")[0];
		window.history.replaceState({ cart: false }, 'cart', url);
		window.removeBackDrop();
	}

	navigateToAddress() {
		this.props.history.push('/cart/select-address');
	}

	removeItem(variant_id) {
		console.log("remove item ==>", variant_id);
		let cart_data = this.state.orderSummary;
		cart_data.items = cart_data.items.filter(item => item.variant_id != variant_id);
		if (!cart_data.items.length)
			this.setState({ cartEmpty: true });
		this.setState({ orderSummary: cart_data });
	}

	updateSummary(summary) {
		let cart_data = this.state.orderSummary;
		cart_data.summary = summary;
		this.setState({ orderSummary: cart_data });
	}

	checkNameExists() {
		if (this.state.orderSummary.shipping_address.name) {
			return true;
		} else {
			let errors = this.state.errors;
			errors.accountInfo = 'Please enter account details';
			this.setState({ "errors": errors });
			return false;
		}
	}


}

export default CartCheckoutSummary