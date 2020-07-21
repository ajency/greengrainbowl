import React, {Component,createRef} from 'react'
import axios from 'axios';
import Standard from './checkout-types/standard';
import Custom from './checkout-types/custom';
import Hosted from './checkout-types/hosted';
import { razorPayConfig,generalConfig } from '../../config';
const script = document.createElement("script");


class Razorpay extends Component {
    constructor(props) {
        super(props)
        this.payForm = createRef();
        this.createOrder = this.createOrder.bind(this);
        this.state = {
            method: '',
            pgname:this.props.pgname,
            pgtype:this.props.pgconfig.pgtype,
            showPaymentOptns:false,
            r_order_id:null,
        };

    }

    componentDidMount() {
        console.log(this.props)
        if(this.state.pgtype == 'standard') {
            script.src = razorPayConfig.standardJs;
      
        } else if (this.state.pgtype == 'custom') {
            script.src = razorPayConfig.customJs;
        }
        script.async = true;
        document.body.appendChild(script);
        
    }

    componentWillUnmount(){
        document.body.removeChild(script);
    }

    render() {
        return (
            <div>
               {this.showPaymentBtn()} 
            </div>
        );
    }

    showPaymentBtn() {
        if(this.state.pgtype =='standard')
        {
            return <Standard order={this.props.order} user_details={this.props.user_details} r_order_id={this.state.r_order_id} createOrder={this.createOrder} pgconfig={this.props.pgconfig}/>

        } else if(this.state.pgtype == 'custom') {
            return <Custom order={this.props.order} pgconfig={this.props.pgconfig}  r_order_id={this.state.r_order_id} showPaymentOptns={this.state.showPaymentOptns} createOrder={this.createOrder}/>
        } else {
            return <Hosted order={this.props.order} r_order_id={this.state.r_order_id} payForm={this.payForm} createOrder={this.createOrder}/>
        }
    }
    

   
    
    async createOrder (e) {
        console.log("here")
        if(e) {
            e.preventDefault();
        }
        if(!this.props.validateCart()) {
            return false;
        }
        window.addCartLoader();
        let url = generalConfig.apiEndPoint + "/anonymous/payment/create-order";
			let body = {
                order_id : this.props.order.id,
                amount: this.props.order.amount || window.cartData.summary.you_pay,
                business_id:generalConfig.businessId,
                mode:generalConfig.site_mode
            }
            
        return  axios.post(url, body).then((res) => {
            this.setState({r_order_id: res.data.order_id});
            if(this.state.pgtype =='custom') 
                this.setState({"showPaymentOptns":true})
            if(this.state.pgtype == 'hosted') {
               this.setState({r_order_id: res.data.order_id});
            }
            window.removeCartLoader()

            return true;
        }) .catch((err) => {
            window.displayError("Something went wrong. Please try in sometime");
            window.removeCartLoader();
            return false;

        })        
    }
}

export default Razorpay;