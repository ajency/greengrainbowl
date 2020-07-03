import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import Header from '../header/header.js';
import {generalConfig} from '../config';
import axios from 'axios';
import './address-list.scss'
import * as _ from 'underscore';
import AddNewAddress from '../add-new-addess/add-new-address.js';
class AddressList extends Component {
    _webSiteLink = "#/cart"
    constructor(props) {
        super(props);
        this.closeAddAddress = this.closeAddAddress.bind(this);
        this.assignAndProceed = this.assignAndProceed.bind(this);
        this.state = {
            fetchComplete:false,
            addresses:[],
			redirectToSummary:false,
            cartSummary:null,
            cart_id:'',
            redirectToCart:false,
            showAddressComponent: false,
            approxDeliveryTime:generalConfig.preparationTime,
            showSkip:false
        }
    }

    componentDidMount() {
        window.addCartLoader()
        let unsubscribeOnAuthStateChanged = window.firebase.auth().onAuthStateChanged(async (user) => {
            let returnState = {};
            returnState["cart_id"]=window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId)
            if(window.firebase.auth().currentUser.isAnonymous) {
                returnState["showAddressComponent"] = true
            } else {
                if(window.firebase.auth().currentUser) {
                    try {
                        const  userAddresses =  await window.getAddresses();
                       
                        if(_.isEmpty(userAddresses)) {
                            returnState["showAddressComponent"] = true
                        } else {
                            const cartId = window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId);
                            const cart = await window.getCartByID(cartId)
                            if(cart.shipping_address.landmark && cart.shipping_address.landmark) {
                                returnState["addresses"] = userAddresses
                                returnState["fetchComplete"] = true
                            } else {
                                returnState["showAddressComponent"] = true
                                returnState["showSkip"] =true
                            }
                        }
                        
                    } catch (error) {
                        returnState["showAddressComponent"] = true
                        
                    }

                } else {
                    this.displayError("Please login to continue");
                }            
            }
            this.setState(returnState);
            window.removeCartLoader()
            unsubscribeOnAuthStateChanged();
        });
    }

    render() {
        return (
            <div>
                {this.state.redirectToAddAddress ? "redirect":null}
                {this.state.redirectToSummary ? <Redirect to={{ pathname:`/cart/cart-summary`, state:{order_obj:this.state.cartSummary, approx_delivery_time:this.state.approxDeliveryTime}}} />: null}
                {this.state.redirectToCart ? <Redirect to={{ pathname:`/cart`}} />: null}
                {this.state.showAddressComponent ? <AddNewAddress closeAddAddress={this.closeAddAddress} cartRequest={true} assignAndProceed={this.assignAndProceed}/>: this.showAllAddresses()}
            </div>
        );
    }

    displayError(msg){
		// document.querySelector('#failure-toast').innerHTML = msg;
		// document.querySelector('#failure-toast').classList.remove('d-none');
		// document.querySelector('#failure-toast-close-btn').classList.remove('d-none');
		// setTimeout(()=>{
		// 	document.querySelector('#failure-toast').classList.add('d-none');
		// 	document.querySelector('#failure-toast-close-btn').classList.add('d-none');
		// },30000)
        window.displayError(msg);
	}
    showAllAddresses() {
        return (
            <div className="address-container visible">
                <Header/>
                <div className="cart-heading p-15 pb-0">
                    <div className="position-relative title-wrap">
                        <button className="btn btn-reset btn-back p-0" onClick={()=> this.props.history.push('/cart')}><i class="fa fa-arrow-left font-size-20" aria-hidden="true"></i></button>
                        <h3 className="mt-4 h1 ft6">Choose Delivery Address</h3>
                    </div> 
                </div>
                <div className="address-list p-15 pt-0 mt-4">
                    {this.state.fetchComplete ? this.displayAddressList():null}  
                    <div className="post-content pb-5"> 
                        <div className="next-title m-0 cursor-pointer" onClick={(e) => this.setState({showAddressComponent:true})}>Add new address <i className="fas fa-arrow-right text-green"></i></div>
                    </div>
                </div>
            </div>
        );
    }

    displayAddressList() {
       let addressMarkups =  _.map(this.state.addresses, (obj,index) => {
           let shipping_address='';
            if (obj.hasOwnProperty('address')) {
                shipping_address = obj.address+', '
            }
            if(obj.hasOwnProperty('landmark')) {
                shipping_address = shipping_address + obj.landmark+', '
            }
            shipping_address = shipping_address + obj.formatted_address;
           
            return( 
                <div key={index}  className="items mb-5" onClick={(e) => this.assignAndProceed(e,obj.id)} data-lat-long={obj.lat_long}>
                    <div className="text-black text-link highlight">
                        <h1 className="ft6">{obj.type}</h1>
                        <h5 className="font-weight-light">
                            
                            <span className="p-name d-inline-block"  style={{marginRight: 10}}>{obj.name}</span>
                            <span className="p-phone-number d-inline-block">{obj.phone}</span>
                        </h5>
                        <h5 className="font-weight-light">
                            {shipping_address}
                        </h5>
                    </div>
                </div>                
            )
        })

        return addressMarkups;
    }

   async assignAndProceed(e,address_id) {
        console.log(this.state, address_id)
        if(this.state.showAddressComponent) {
            this.setState({showAddressComponent:false})
        }

        //let cart_id =  e.target.getAttribute("data-id")
        this._currentCart = window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId);
		let cart_id =  window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId);
        if(cart_id) {
             if(e) {
                e.preventDefault();
                if(!await this.isAddressDeliverable(address_id)) {
                    
                    this.displayError("Selected address is not deliverable :(");
                    return false;
                }
             }
            // let url = generalConfig.apiEndPoint + "/anonymous/cart/create-order"
            // let data = {
            //     address_id: address_id,
            //     cart_id: cart_id
            // }
            window.addCartLoader();
            return window.assignAddressToCart(address_id)
            .then((res) => {
                if(res.success) {
                    this.setState({cartSummary:res.cart, redirectToSummary:true,})
                } else {
                    window.removeCartLoader();
                    if(res.code =='PAYMENT_DONE') {
                        // window.removeFromLocalStorage('cart_id')
                        this.setState({redirectToCart:true})
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            this.setState({redirectToCart:true})
        }
        
        
    }
    isAddressDeliverable(address_id) {
        let address = window.userAddresses.filter((address) => { return address.id == address_id;})[0];
        return window.getCurrentStockLocation().then(locations => {
            if(!locations.length) {
                this.displayError("Something went wrong...")
                return false;
            }
            let deliverable =  window.findDeliverableLocation(locations,address.lat_long)
        
            return !!deliverable
        })
    }

    closeAddAddress() {
        this.setState({showAddressComponent:false})
    }
}

export default AddressList;