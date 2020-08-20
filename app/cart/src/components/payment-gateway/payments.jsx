import React, { Component } from 'react';
import Razorpay from './razorpay/razorpay.jsx';
class Payments extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return this.getPaymentGateway()
    }

    getPaymentGateway() {
        switch (this.props.pgname.toLowerCase()) {
            case 'razorpay':
                return <Razorpay validateCart={this.props.validateCart} pgconfig={this.props.pgconfig} order={this.props.order} {...this.props.user_details}/>
                break;
        
            default:
                break;
        }
    }
}
export default Payments