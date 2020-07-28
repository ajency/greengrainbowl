import React, { Component } from 'react';
import Header from '../header/header.js';
import {Link} from 'react-router-dom';
import {generalConfig} from '../config'
const DAYS = { "monday": "Monday", "tuesday": "Tuesday", "wednesday": "Wednesday", "thursday": "Thursday", "friday": 'Friday', 'saturday': "Saturday", "sunday": "Sunday" };
const SLOTS = { "lunch": "Lunch", "dinner": "Dinner" };

class OrderDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pickupPoint : generalConfig.pickupPoint,
            errorOnPage:  false,
            loadingError: false,
            loader:true,
            addressLabel:'',
            shippingAddress:'',
            orderSummary:''
        }
    }

    componentDidMount() {
        let unsubscribeOnAuthStateChanged = window.firebase.auth().onAuthStateChanged((user) => {
            this.getOrderDetails()
            unsubscribeOnAuthStateChanged();
        })
    }

    getOrderDetails() {
        if(this.props.match.params.order_id) {
        window.addCartLoader();

            window.orderDetails(this.props.match.params.order_id)
            .then((res) => {
                console.log("fetching summary ==>", res);
                
                if(!res.success) {
                    window.displayError(res.msg);
                    this.setState({"loadingError": true})
                    window.removeCartLoader();
                } else {
                    if(res.pending) {
                        this.getOrderDetails()
                        this.setState({"loader": true})
                        window.addCartLoader();
    
                    } else {
                        window.removeCartLoader();
                        this.setState({orderSummary: res})
                        if(res.order_data.order_mode == 'kiosk') {
                            this.setState({addressLabel: "Pick up from: "})
                            this.setState({shippingAddress: " "+this.state.pickupPoint})
                        } else {
                            let shipping_address='';
                            if (res.order_data.shipping_address.address) {
                                shipping_address = res.order_data.shipping_address.address+', '
                            }

                            if(res.order_data.shipping_address.landmark) {
                                shipping_address = shipping_address + res.order_data.shipping_address.landmark+', '
                            }
                            shipping_address = shipping_address + res.order_data.shipping_address.formatted_address;
                            this.setState({addressLabel: "Deliver to: "})
                            this.setState({shippingAddress: shipping_address})
                        }


                        this.setState({"loader": false})
                        this.setState({"loadingError": false})
                    }
                } 
                console.log("fetched summary",this.state.orderSummary)
            }).catch(err => {
                this.setState({"loader": false})
                this.setState({"loadingError": true})
                window.removeCartLoader();
                console.log(err)
            }) 

        } 
    }

    render() {
        return (
            <div className="cart-container visible order-details">
                <Header/>
                {this.state.loader ? '':this.getOrderDetailsMarkup()}
            </div>
        );
    } 
    
    
    getOrderDetailsMarkup = () => {
        if(this.state.loadingError) {
            return (
                <div className="">
                    Something went wrong...
                </div>
            );
        } else {
            let order_data = this.state.orderSummary.order_data;
            if(order_data.status == "failed") {
                return this.getFailedMarkup()
            } else {
                return (
                    <div className="">
                        <div class="cart-heading p-15 pt-0 pb-0">
                            <h1 class="font-weight-bold d-block mobile-header mb-4 text-muted pt-3">Order details</h1>
                        </div>
                        <div className="p-15 pt-0">
                            <span className="font-weight-semibold">Order no:</span> {order_data.order_no}
                        </div>
                        <div className="order-status p-15 pt-2 pb-2 bg-off-green-1 mb-1">
                            <div className="d-flex align-items-center">
                                <i class="far fa-check-circle font-size-20 text-primary"></i>
                                <span className="d-inline-block ml-2">Order Placed</span>
                            </div>
                        </div>
                        <div>
                            <div className="delivery-address-container p-15">
                                <div className="address-details list-text-block p-15 mb-0">
                                    <div className="address-details-inner font-weight-light">
                                        <span className="font-weight-semibold">{this.state.addressLabel}</span>
                                        <span id="cart-delivery-address">{this.state.shippingAddress}</span>
                                    </div>
                                    <div>
                                        <div className="address-details-inner font-weight-light mt-3 pt-3 border-grey-top">
                                            <div className="">
                                                <span className="text-green font-weight-semibold">Name: </span>
                                                <span id="cart-delivery-address"> {order_data.shipping_address.name} </span>
                                            </div>
                                            <div className="">
                                                <span className="text-green font-weight-semibold">Email ID: </span>
                                                <span id="cart-delivery-address">  {order_data.shipping_address.email} </span>
                                            </div>
                                            <div className="">
                                                <span className="text-green font-weight-semibold">Mobile No: </span>
                                                <span id="cart-delivery-address">  {order_data.shipping_address.phone} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        
                        <div class="p-15">
                            {this.getItems()}
                        </div>
        
                        <div className="p-15">
                            <label className="cart-summary-label font-weight-medium">Payment information</label>
                            <div className="summary-item">
                                <div>
                                    <label className="font-weight-light">Payment mode</label>
                                </div>
                                {this.getPaymentMode()}
                            </div>
                        </div>
                        <div className="p-15">
                            <label className="cart-summary-label font-weight-medium">Billing Details</label>
                            {this.getSummary()}
                        </div>
                        <div className="p-15">
                            * Please note: For any queries feel free to reach us out at <a className="text-underline" href="https://api.whatsapp.com/send?phone=+917770004258">7770004528</a>
                        </div>
                    </div>
                );
            }
          
        }
       
    }

    getItems = () =>{
        let items =   this.state.orderSummary.order_data.items.map((item) => {
            const extraContent  = item.day? ` | ${DAYS[item.day]} | ${SLOTS[item.slot]}`:''
            return  <div class="item-container flex-column">
            <div class="d-flex mb-4">
                <div class="product-cartimage d-inline-block"><img class="border-radius-rounded" alt="" title="" height="50" width="50" src={item.attributes.image}/></div>
                <div class="product-details d-inline-block">
                    <div class="product-title-c font-weight-light">{item.attributes.title}</div>
                    <div class="d-flex justify-content-between">
                        <div class="product-size-c text-capitalize">Size: {item.attributes.size} | Qty: {item.quantity}{extraContent}</div>
                        <div class="d-flex align-items-center">
                            <div class="product-price font-weight-light text-right pl-3">₹{item.attributes.price_final}</div>
                        </div>
                    </div>
                    {this.getComboText(item.attributes.size)}
                </div>
            </div>
             </div>         
        })
       
        return items
    }

    getComboText(size) {
		if(size == "combo"){
			return (
				<div class="text-silver combo-text pl-0">Combo of Bowl + Homemade Lemonade Sweetened With Jaggery</div>
			)
		}
	}

    deliveryHtml = () => {
        let order_data = this.state.orderSummary.order_data;
        return(
            <div className="summary-item">
                <div>
                    <label className="font-weight-light">Delivery fee</label>
                </div>
                <div className="font-weight-light">₹{order_data.summary.shipping_fee}</div>
            </div>
           )
    }
    getSummary = () => {
        let order_data = this.state.orderSummary.order_data;
       
       return(
        
        <div className="cart-summary-container">
            <div className="summary-item">
                <div>
                    <label className="font-weight-light">Total Item Price</label>
                </div>
                <div className="font-weight-light">₹{order_data.summary.sale_price_total} </div>
            </div>
            {order_data.summary.cart_discount && this.discountHtml()}
            {order_data.order_mode == 'online' && this.deliveryHtml()}
            <div className="summary-item border-grey-50 border-0-left border-0-right mt-1 pt-2 pb-2">
                <div>
                    <label className="font-weight-medium mb-0">You Paid</label>
                </div>
                <div className="font-weight-bold">₹{order_data.summary.you_pay}</div>
            </div>
        </div>);
    }

    getPaymentMode = () => {
        if(this.state.orderSummary.order_data.payment_details) {
            let payment_mode = ''
            let paymentObj = this.state.orderSummary.order_data.payment_details
            if(paymentObj.method == 'card') {
                payment_mode = paymentObj.card.type + "card"
            }  else if(paymentObj.method == 'upi'){
                payment_mode = "Upi"
            } else if(paymentObj.method == 'wallet') {
                payment_mode = "Wallet"
            } else if(paymentObj.method == 'netbanking') {
                payment_mode = "Net banking"
            }
            return (<div className="font-weight-light" style={{textTransform:"capitalize"}}>{payment_mode}</div>)

        }
        return (<div className="font-weight-light">COD</div>)
    }

    getFailedMarkup = () => {
        let payment_details = this.state.orderSummary.order_data.payment_details
        return (
            <div className="payment-failed">
               <div className="p-15">
                   <h3 className="mt-4 h1 ft6 text-red">Your payment failed.</h3>
                   <h4 className="font-weight-light mt-4 pb-4">No worries, you can always try again</h4>
               </div> 
               <div className="d-flex justify-content-between p-15 secure-checkout fixed-bottom visible bg-white payment-button">
                   <Link to={`/cart/cart-summary`} auto_pay={true}>
                       <button className="btn btn-primary btn-arrow-icon position-relative rounded-0 p-15 text-left w-100 d-flex align-items-center justify-content-between">
                           <span className="zindex-1">Try Again </span>
                           <i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
                       </button>
                   </Link>
               </div>
           </div>
       );
    }

    discountHtml = () => {
        const order_data = this.state.orderSummary.order_data;
        const couponCateLabel = order_data.applied_coupon.coupon_category_label || "Coupon Discount"
        return <>
            <div className="summary-item align-items-end">
                <div>
                    <label className="mb-0">{couponCateLabel}</label>
                    <label className="d-block font-weight-medium font-italic mb-0 font-size-13">{order_data.applied_coupon.code}</label>
                </div>
                <div className="text-success">-₹{order_data.summary.cart_discount}</div>
            </div>
        </>
    }
}

export default OrderDetails;