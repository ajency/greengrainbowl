import React, {Component} from 'react'
import {razorPayConfig, generalConfig} from '../../../config'; 
class Standard extends Component {
    constructor(props) {
        super(props);
        this.standardPayment = this.standardPayment.bind(this);
        this.state = {
            amount:this.props.order.amount || window.cartData.summary.you_pay
        }
    }

    render() {
        return (
            <div>
                <button className={this.props.pgconfig.classes} onClick={(e)=> { this.standardPayment(e)}}>Proceed to Payment</button>
            </div>
        );
    }
    async standardPayment(e) {
       
         const canProceed = await this.props.createOrder(e)
         if(!canProceed) {
             return false
         }
         let amount = this.state.amount*100
         if(!this.props.r_order_id) {
             console.log("no order id")
            window.displayError("Something went wrong")
            return
         }
        //  let options = {
        //     "amount": 500000, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
        //     "currency": "INR",
        //     "order_id": this.props.r_order_id,
        //     "prefill": {
        //     "contact": this.props.user_details.contact,
        //     "email": this.props.user_details.email,
        //     "name": this.props.user_details.name
        //     },
        //     "handler": function (response){
        //          alert(response.razorpay_payment_id);
        //     },
        let site_mode_append = '' 
        if(generalConfig.site_mode == 'kiosk') {
            site_mode_append = '&site_mode='+generalConfig.webSiteAddon
        }
        let Razorpay = new window.Razorpay({
            "key": razorPayConfig.api_key,
            "image": razorPayConfig.image,
            "name": generalConfig.company_name,
            "callback_url":generalConfig.apiEndPoint+"/anonymous/payment/verify-payment?r_order_id="+this.props.r_order_id + site_mode_append,
            "redirect": true,
            "amount": amount, 
            "currency": "INR",
            "order_id":this.props.r_order_id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
            "handler": function (response){
                window.location = window.location.origin + '#/order-details/' + response.razorpay_payment_id
            },
            "modal.handleback":true,
            "prefill": {
                "email": this.props.user_details.email,
                "name": this.props.user_details.name ,
                "contact": this.props.user_details.phone
            },
            "modal.escape":false,
            "modal.backdropclose":false
            
         });
         Razorpay.open();
      
     }
}

export default Standard