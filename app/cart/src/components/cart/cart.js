import React, { Component } from 'react';
import './cart.scss'
import Header from '../header/header.js';
import Item from '../item/item.js';
import CartSummary from '../cart-summary/cart-summary.js';
import DeliveryAddress from '../delivery-address/delevery-address.js';
import add from '../../assets/images/add.png';
import genuinityLogo from '../../assets/images/Shield_icon.png';
import clockLogo from '../../assets/images/Time.png';
import { Redirect, Link } from 'react-router-dom';
import { generalConfig } from '../config'
declare var $: any;

class Cart extends Component {
	_webSiteLink = "#/cart";
	_currentCart = null;
	constructor(props) {
		super(props);
		this.state = {
			site_mode: generalConfig.site_mode,
			pickupPoint: generalConfig.pickupPoint,
			approxDeliveryTime: generalConfig.preparationTime,
			cartData: {},
			fetchCartComplete: false,
			fetchCartFailed: false,
			fetchCartFailureMsg: '',
			cartEmpty: false
		}
		this.fetchCart();
	}

	componentDidMount() {
		this.fetchCart();
		$('#view-cart-btn').on('click', () => {
			console.log("view cart click event fired");
			this.setState({ cartData: {}, fetchCartComplete: false, cartEmpty: false })
			this.fetchCart();
		});

		$('#cart-address-change-trigger').on('click', () => {
			console.log("address change event fired");
			this.setState({ cartData: {}, fetchCartComplete: false, cartEmpty: false })
			this.fetchCart();
		});
		// window.checkPushNotificationPermissions();
	}

	getItems() {
		let items = this.state.cartData.cart.items.map((item) =>
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
					<div className="">
						<div className="cart-container visible">
							{this.getDeliveryAddressSection()}

							<div className="cart-heading p-15 pt-0 pb-0">
								<h1 className="font-weight-bold d-block mobile-header mb-4 text-muted">Your cart</h1>
							</div>

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
								<hr className="sep"></hr>
							</div>

							<div className="p-15">
								<label className="cart-summary-label font-weight-medium">Bill Details</label>
								<CartSummary
									summary={this.state.cartData.cart.summary}
									couponDetails={this.state.cartData.cart.applied_coupon}
								/>
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
								<button className="btn btn-primary btn-arrow-icon w-100 p-15 rounded-0 text-left position-relative h5 ft6 mb-0 d-flex align-items-center justify-content-between text-uppercase overflow-hidden" onClick={(e) => this.handleCheckout(e)} data-address="1EmY0FQBuNLKrNKq9jSE" data-id="16ZywalSNVRPLwmwAmLR" disabled={this.disableCheckoutButton()}>
									<span className="zindex-1">Proceed to Checkout</span>
									<i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
								</button>
							</div>
						</div>
					</div>
			}
		}

		return (
			<div className="">
				<Header />
				{cartContainer}
			</div>
		);
	}

	getDeliveryAddressSection() {
		let deliveryaddress = '';
		let deliveryAddr = "";
		let mapLink = ""
		if (this.state.cartData.cart.shipping_address.hasOwnProperty('address')) {
			if(this.state.cartData.cart.shipping_address.address)
			deliveryAddr = this.state.cartData.cart.shipping_address.address + ', '
		}
		if (this.state.cartData.cart.shipping_address.hasOwnProperty('landmark')) {
			if(this.state.cartData.cart.shipping_address.landmark)
			deliveryAddr = deliveryAddr + this.state.cartData.cart.shipping_address.landmark 
		}

		if(this.state.cartData.cart.shipping_address.lat_long) {
			let  latLong = this.state.cartData.cart.shipping_address.lat_long.join()
			mapLink = "https://www.google.com/maps/?q="+ latLong;
		}
		if(this.state.site_mode == 'kiosk'){
			deliveryaddress = <div className="delivery-address-container p-15">
				<div className="address-details list-text-block p-15 mb-0">
					<div className="address-details-inner font-weight-light">
						<span className="font-weight-semibold">Pick up from </span>
						<span id="cart-delivery-address">{this.state.pickupPoint}</span>
					</div>
				</div>
			</div>
		} else {
			deliveryaddress = <div>
				<DeliveryAddress mapLink={mapLink} deliveryAddress={deliveryAddr} deliveryArea={this.state.cartData.cart.shipping_address.formatted_address} addressType="area"/>
			</div>
		}
		return deliveryaddress
	}

	disableCheckoutButton() {
		if (this.state.cartData && this.state.cartData.cart && this.state.cartData.cart.items.length) {
			let disable = false;
			for (const item of this.state.cartData.cart.items) {
				if (!item.deliverable || !item.availability) {
					disable = true;
					break;

				}
			}
			return disable;
		}
		return true;
	}

	handleCheckout(e) {
		window.getUserDetails().then(async (user_details) => {
			console.log("user_details ==>", user_details);
			if (!user_details || !user_details.phone || !user_details.verified) {
				this.props.history.push('/cart/login');
			}
			else {
				if (this.state.site_mode == 'kiosk') {
					let cart_id = window.readFromLocalStorage(generalConfig.site_mode + '-cart_id-' + generalConfig.businessId);
					if (cart_id) {
						window.addCartLoader();
						window.assignAddressToCart(null, true)
							.then((res) => {
								if (res.success) {
									this.props.history.push({ pathname: '/cart/cart-summary', state: { order_obj: res.cart } });
								} else {
									window.removeCartLoader();
									if (res.code == 'PAYMENT_DONE') {
										this.props.history.push('/cart');
									}
								}
							}).catch(err => {
								console.log(err);
							})
					}
				} else {
					const cartId = window.readFromLocalStorage(generalConfig.site_mode + '-cart_id-' + generalConfig.businessId)
					if (cartId) {
						const cart = await window.getCartByID(cartId)
						if (cart != null) {
							if (cart.shipping_address) {
								if (cart.shipping_address.landmark && cart.shipping_address.name && cart.shipping_address.email) {
									window.addCartLoader();
									window.assignAddressToCart(null, true)
										.then((res) => {
											if (res.success) {
												this.props.history.push({ pathname: '/cart/cart-summary', state: { order_obj: res.cart, approx_delivery_time: generalConfig.preparationTime } });
											} else {
												window.removeCartLoader();
												if (res.code == 'PAYMENT_DONE') {
													this.props.history.push('/cart');
												}
												this.props.history.push('/cart/select-address');
											}
										}).catch(err => {
											window.removeCartLoader();
											this.props.history.push('/cart/select-address');
										})
								} else {
									this.props.history.push('/cart/select-address');
									return;
									if (window.userDetails) {
										window.addCartLoader()
										if (window.userDetails.hasOwnProperty('default_address_id')) {
											const address_id = window.userDetails.default_address_id
											if (address_id) {
												const deliverable = await this.isAddressDeliverable(address_id)
												if (deliverable) {
													console.log("rsrrrr");
													try {

														const res = await window.assignAddressToCart(address_id)

														if (res.success) {
															window.removeCartLoader();
															this.props.history.push({ pathname: '/cart/cart-summary', state: { order_obj: res.cart, approx_delivery_time: generalConfig.preparationTime } });
														} else {
															console.log(" no success assignAddressToCart");
															window.removeCartLoader();
															this.props.history.push('/cart/select-address');
														}

													} catch (error) {
														console.log("error in assignAddressToCart");
														window.removeCartLoader();
														this.props.history.push('/cart/select-address');
													}

												} else {
													console.log("not isAddressDeliverable");
													window.removeCartLoader();

													this.props.history.push('/cart/select-address');
												}
											} else {
												console.log("on address id");
												window.removeCartLoader();
												this.props.history.push('/cart/select-address');
											}
										} else {
											console.log("no default_address_id");
											window.removeCartLoader();
											this.props.history.push('/cart/select-address');
										}
									} else {
										console.log("no userDetails");
										window.removeCartLoader();
										this.props.history.push('/cart/select-address');
									}
								}
							} else {
								console.log("no shipping_address");
								window.removeCartLoader();
								this.props.history.push('/cart/select-address');
							}
						} else {
							console.log("no cart");
							window.removeCartLoader();
							this.props.history.push('/cart/select-address');
						}
					} else {
						console.log("no cart id");
						window.removeCartLoader();
						this.props.history.push('/cart/select-address');
					}
				}
			}
		})
	}

	isAddressDeliverable = (address_id) => {
		let address = window.userAddresses.filter((address) => { return address.id == address_id; })[0];
		if (address) {
			console.log(address);

			return window.getCurrentStockLocation().then(locations => {
				if (!locations.length) {
					this.displayError("Something went wrong...")
					return false;
				}
				let deliverable = window.findDeliverableLocation(locations, address.lat_long)

				return !!deliverable
			})
		} else {
			return false
		}
	}

	closeCart() {
		document.querySelector(".cart-wrapper").classList.remove('active');
		let url = window.location.href.split("#")[0];
		window.history.replaceState({ cart: false }, 'cart', url);
		window.removeBackDrop();
	}

	async fetchCart() {
		window.addCartLoader();
		console.log("inside fetch cart");
		// let tempdata = {
		// 	"success": true,
		// 	"cart": {
		// 	  "business_id": "zq6Rzdvcx0UrULwzeSEr",
		// 	  "cart_count": 2,
		// 	  "created_at": 1591779823445,
		// 	  "items": [
		// 		{
		// 		  "variant_id": "1CG6P1slxnr9TSNnPzvZ-bowl",
		// 		  "attributes": {
		// 			"title": "Orange Barley Bowl (Tofu)",
		// 			"images": {
		// 			  "1x": "https://greengrainbowl.com/wp-content/themes/ajency-portfolio/images/products/OBB-Tofu_1x.jpg"
		// 			},
		// 			"size": "bowl",
		// 			"price_mrp": 230,
		// 			"price_final": 1,
		// 			"discount_per": 0
		// 		  },
		// 		  "availability": true,
		// 		  "quantity": 2,
		// 		  "timestamp": 1591781637462,
		// 		  "deliverable": true,
		// 		  "product_id": "1CG6P1slxnr9TSNnPzvZ"
		// 		}
		// 	  ],
		// 	  "mobile_number": "",
		// 	  "order_mode": "online",
		// 	  "order_type": "cart",
		// 	  "shipping_address": {
		// 		"formatted_address": "Panjim Bus Stand, Bus Stand,, Patto Centre, Panaji, Goa 403001, India",
		// 		"lat_long": [
		// 		  15.4952312,
		// 		  73.836518
		// 		]
		// 	  },
		// 	  "stock_location_id": "8vwd1rQRGiw0iQeMdlU0",
		// 	  "summary": {
		// 		"cart_discount": 0,
		// 		"mrp_total": 460,
		// 		"sale_price_total": 2,
		// 		"shipping_fee": 1,
		// 		"you_pay": 3
		// 	  },
		// 	  "user_id": "mWOyzNP1bUP6efaSRaffM3lbUzD2",
		// 	  "verified": false
		// 	},
		// 	"coupon_applied": null,
		// 	"coupons": []
		//   };
		//   this.setState({cartData : tempdata, fetchCartComplete : true});
		let cart_id = window.readFromLocalStorage(generalConfig.site_mode + '-cart_id-' + generalConfig.businessId);
		if (cart_id) {
			try {
				let cart_data = await window.fetchCart(cart_id);
				console.log("cart_data ==>", cart_data);
				if (!cart_data.cart.items.length) {
					window.removeCartLoader();
					this.setState({ cartEmpty: true, fetchCartComplete: true });
				} else {
					window.removeCartLoader();
					this.setState({ cartData: cart_data, fetchCartComplete: true });
				}
			}
			catch (error) {
				window.removeCartLoader();
				this.setState({ fetchCartFailureMsg: error.message, fetchCartComplete: true })
				console.log("error in fetch cart ==>", error);
			}
		}
		else {
			console.log("inside else")
			setTimeout(() => {
				window.removeCartLoader();
				this.setState({ cartEmpty: true, fetchCartComplete: true });
			}, 100)
		}
	}

	removeItem(variant_id) {
		console.log("remove item ==>", variant_id);
		let cart_data = this.state.cartData;
		cart_data.cart.items = cart_data.cart.items.filter(item => item.variant_id != variant_id);
		if (!cart_data.cart.items.length)
			this.setState({ cartEmpty: true });
		this.setState({ cartData: cart_data });
	}

	updateSummary(summary) {
		let cart_data = this.state.cartData;
		cart_data.cart.summary = summary;
		this.setState({ cartData: cart_data });
	}
}

export default Cart;