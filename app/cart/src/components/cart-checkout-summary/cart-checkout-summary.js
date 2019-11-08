import React, {Component} from 'react';
import './cart-checkout-summary.scss';
import axios from 'axios';
import '../cart/cart.scss';
import Header from '../header/header.js';
import Item from '../item/item.js';
import DeliveryAddress from '../delivery-address/delevery-address.js';
import add from '../../assets/images/add.png';
import genuinityLogo from '../../assets/images/Genuien.png';
import clockLogo from '../../assets/images/Time.png';
import Payments from '../payment-gateway/payments'
import CartSummary from '../cart-summary/cart-summary';
import {generalConfig} from "../config";



class CartCheckoutSummary extends Component {
    _webSiteLink = "#/cart";
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            dataLoading: true,
            orderSummary:{},
			fetchCartComplete : false,
			fetchCartFailed : false,
			fetchCartFailureMsg : '',
			cartEmpty : false
        }
    }

	componentWillMount() {
		this._isMounted = true
	}
    componentDidMount() {
        if(this._isMounted) {
			if(this.props.location.state) {
				this.setState({orderSummary: this.props.location.state.order_obj})
				this.setState({dataLoading:false, fetchCartComplete:true})
				window.removeCartLoader();
			} else {
				console.log(this.props.match.params);
				let url = generalConfig.apiEndPoint+ '/anonymous/cart/create-order'
				axios.post(url, {cart_id:this.props.match.params.cart_id, fetchDraft:true})
				.then((res) => {
					if(res.data.code =='PAYMENT_DONE') {
						window.removeFromLocalStorage('cart_id')
						window.location = this._webSiteLink
					}
					this.setState({orderSummary: res.data.cart, dataLoading:false, fetchCartComplete:true})
					window.removeCartLoader();
				}).catch(err => {
					console.log(err)
					window.removeCartLoader();
					this.setState({dataLoading:false})
					
				})
			}
        }

	}
	
	componentWillUnmount() {
        this._isMounted = false
	}

    getItems(){
		let items = this.state.orderSummary.items.map((item)=>
			<Item key={item.variant_id} item={item} removeItem={(variant_id) => this.removeItem(variant_id)} updateSummary={(summary) => this.updateSummary(summary)}/>
		);
		return items;
	}
	
	render() {
		let cartContainer;
		if(!this.state.fetchCartComplete)
			cartContainer = <div className="text-center mt-5 p-15"> <h4 className="font-weight-meidum m-0">  </h4>  </div>
		else {
			if(this.state.cartEmpty){
				cartContainer = <div className="text-center mt-5 p-15 "> <h4 className=""> Your cart is Empty. Add something from the menu </h4> 
				<div className="btn-wrapper mt-3">
						<div className="btn-inner-wrap">
							<button onClick={()=> this.closeCart()} type="button" className="btn-reset text-white border-green bg-primary p-3 text-center h5 ft6 mb-0 rounded-0" >Browse Our Cuisine</button>
						</div>
					</div>
				</div>
			}
			else if (this.state.fetchCartFailed){
				cartContainer = <div className="text-center mt-5"> <h4> {this.state.fetchCartFailureMsg} </h4>  </div>
			}
			else {
				cartContainer = 
					<div>
                        <div className="cart-heading p-15 pt-0 pb-0">
							<h1 className="font-weight-bold d-block mobile-header mb-4 text-muted">Your cart summary</h1>
						</div>
						<div>
							<DeliveryAddress showSummaryContent={true} address={this.state.orderSummary.shipping_address.formatted_address} delivery_time={this.state.orderSummary.approx_delivery_time}/>
                            
                        </div>

						

						<div className="p-15 pt-0">
							{this.getItems()}
						</div>

						{/* <div className="apply-coupon-bar">
							<div className="coupon-label">
								Apply Coupon   >
							</div>
						</div> */}

						<div className="p-15 pt-2 pb-2 bg-off-green-1 mb-1 d-flex justify-content-between">
							<div className="text-black font-weight-medium">
								Estimated Time:
							</div>
							<div className="w-50 text-align-right font-weight-medium">
								<img src={clockLogo} alt="Estimated time" title="Estimated time" className="d-inline-block vertical-align-middle mr-1"/> 
								<span className="d-inline-block vertical-align-middle text-black font-weight-medium">30 mins</span>
							</div>
						</div>

						<div className="p-15">
							<label className="cart-summary-label font-weight-medium">Bill Details</label>
							<CartSummary summary={this.state.orderSummary.summary}/>
						</div>						

						<div className="p-15 pt-0">
							<div className="bottom-bar">								
								<div className="genuinity text-align-center">
									<img src={genuinityLogo} className="mr-1" alt="100% Secure Payments" title="100% Secure Payments" className="d-inline-block vertical-align-middle" width="20"/>
									<span className="d-inline-block vertical-align-middle ml-1 font-size-15">Genuine products. 100% Secure payments.</span>
								</div>
							</div>
						</div>

						<div className="p-15 pt-0 pb-0">
							<div className="secure-checkout fixed-bottom visible bg-white p-15">
								<Payments pgname="razorpay" pgconfig={{pgtype:"standard", classes:"btn btn-primary btn-arrow w-100 p-15 rounded-0 text-left position-relative h5 ft6 mb-0"}} order={{id:this.state.orderSummary.order_id, amount: this.state.orderSummary.summary.you_pay}}  user_details={{user_details:this.state.orderSummary.user_details}}/>
							</div>
						</div>
					</div>
			}
		}

		return (
			<div className="cart-container visible">
				<Header/>
				{cartContainer}
			</div>
		);
	}

	closeCart(){
		document.querySelector(".cart-wrapper").classList.remove('active');
		let url = window.location.href.split("#")[0];
		window.history.replaceState({cart : false}, 'cart', url);
		window.removeBackDrop();
	}


	removeItem(variant_id){
		console.log("remove item ==>", variant_id);
		let cart_data = this.state.orderSummary;
		cart_data.cart.items = cart_data.cart.items.filter(item => item.variant_id != variant_id);
		if(!cart_data.cart.items.length)
			this.setState({cartEmpty : true});
		this.setState({orderSummary : cart_data});
	}

	updateSummary(summary){
		let cart_data = this.state.orderSummary;
		cart_data.cart.summary = summary;
		this.setState({orderSummary : cart_data});
	}


}

export default CartCheckoutSummary