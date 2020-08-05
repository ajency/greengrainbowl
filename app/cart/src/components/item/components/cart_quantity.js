import React, { Component } from 'react';
import axios from 'axios';
import {generalConfig} from '../../config'

class Quantity extends Component {
	constructor(props) {
		super(props)
		this.state = {
			site_mode : generalConfig.site_mode,
			apiEndPoint : generalConfig.apiEndPoint,
			apiCallInProgress : false,
			quantity : 0
		}
	}

	componentDidMount(){
		this.setState({quantity : this.props.quantity});
	}

	render() {
		return (
			<div className="quantity">
				{this.getButtonContent()}
			</div>
		);
	}

	getButtonContent(){
		if(this.state.apiCallInProgress){
			return (<div class="btn-icon">
						<i class="fas fa-circle-notch fa-spin fa-lg"></i>
					</div>);

		}
		return (
			<div>
				<div className="d-flex">
					<button className="btn btn-qty text-grey p-0" onClick={() => this.removeFromCart(1)} disabled={this.state.apiCallInProgress}>-</button>
					<span className="cart-qty text-primary">	{this.state.quantity} </span>
					<button className="btn btn-qty text-green p-0" onClick={() => this.addToCart(1)} disabled={this.state.apiCallInProgress}>+</button>
				</div>
			</div>
		)		
	}

	async removeFromCart(quantity){
		try{
			window.addCartLoader();
			this.setState({apiCallInProgress : true});
			let cart_id = window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId);
			let res = await window.removeItemFromCart(this.props.variant_id, cart_id, quantity);
			if(res.success){
				let updated_quantity = this.state.quantity - quantity;
				console.log("check ==>", updated_quantity, quantity, this.state.quantity);
				this.props.updateSummary(res.summary);
				if(updated_quantity === 0){
					this.props.removeItem();
				}
				else{
					this.setState({quantity : updated_quantity})
				}
				window.updateViewCartCompoent(res);
				let item = {
					variant_id : this.props.variant_id,
					quantity : quantity,
					product_id : this.props.product_id
				}
				window.updateItemQuantity(item, 'remove');
			}
			else{
				this.displayError(res.message);
			}
			window.removeCartLoader();
			this.setState({apiCallInProgress : false});
		}
		catch(error){
			window.removeCartLoader();
			console.log("error in add to cart ==>", error);
			this.setState({apiCallInProgress : false});
			let msg = error && error.message ? error.message : error;
			this.displayError(msg);
		}
	}

	async addToCart(quantity){
		window.addCartLoader();
		this.setState({apiCallInProgress : true});
		let cart_id = window.readFromLocalStorage(generalConfig.site_mode+'-cart_id-'+generalConfig.businessId), product;
		if(window.products && window.products.length){
			product = window.products.find((product) => product.id == this.props.product_id);
		}
		else{
			product = await window.fetchProduct(this.props.product_id);
		}

		window.addToCart(this.state.site_mode, this.props.variant_id, null, cart_id, null, product).then((res) =>{
			console.log("response ==>", res);
			window.removeCartLoader();
			this.setState({apiCallInProgress : false});
			if(res.success){
				console.log("response ==>", res);
				this.props.updateSummary(res.summary);
				let quantity = this.state.quantity + res.item.quantity;
				this.setState({quantity : quantity})
				window.updateViewCartCompoent(res);
				window.updateItemQuantity(res.item, 'add');
			}
			else{
				this.displayError(res.message);
			}
		})
		.catch((error)=>{
			window.removeCartLoader();
			console.log("error in add to cart ==>", error);
			this.setState({apiCallInProgress : false});
			let msg = error && error.message ? error.message : error;
			this.displayError(msg);
		})
	}

	displayError(msg){
		// TODO : Display error message
		this.props.showApiErrorMsg(msg);
	}
}

export default Quantity;