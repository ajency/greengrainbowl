import React, { Component } from 'react';
import './item.scss';
// import addToCart from '../../../add-to-cart/add-to-cart.js';
import Quantity from './components/cart_quantity.js';
const DAYS = { "monday": "Monday", "tuesday": "Tuesday", "wednesday": "Wednesday", "thursday": "Thursday", "friday": 'Friday', 'saturday': "Saturday", "sunday": "Sunday" };
const SLOTS = { "lunch": "Lunch", "dinner": "Dinner" };

class Item extends Component {
	constructor(props) {
		super(props);
		this.state = {
			apiErrorMsg : ''
		}
	}
	render() {
		const extraContent  = this.props.item.attributes.day? ` (${DAYS[this.props.item.attributes.day]}-${SLOTS[this.props.item.attributes.slot]})`:''
		return (
			<div className="item-container flex-column">
				<div className="d-flex mb-4">
					<div className="product-cartimage d-inline-block">
						<img className="border-radius-rounded" alt="" title="" height="50" width="50" src={this.props.item.attributes.images['1x']}/>
					</div>
					<div className="product-details d-inline-block">
						<div className="d-flex justify-content-between">
							<div className="product-title-c font-weight-light">
								{this.props.item.attributes.title}
							</div>
							<div className="product-price font-weight-light text-right pl-3">
								{/* {this.checkItemDiscount()} */}
								<span className="sale-price">₹{this.props.item.attributes.price_final}</span>	
								{this.props.item.attributes.price_mrp != this.props.item.attributes.price_final && <span className="mrp-price">₹{this.props.item.attributes.price_mrp}</span>}															
							</div>
						</div>	
						<div className="d-flex justify-content-between">
							<div className="product-size-c font-italic text-capitalize">
								Size: {this.props.item.attributes.size}{extraContent}
							</div>
							<div className="d-flex align-items-center">
								<div className="product-quantity d-inline-block">
									<Quantity quantity={this.props.item.quantity} variant_id={this.props.item.variant_id} product_id={this.props.item.product_id} removeItem={()=>{this.removeItem()}} updateSummary={(summary) => this.updateSummary(summary)} showApiErrorMsg={(msg) => this.setApiErrorMsg(msg)}/>
								</div>
							</div>								
						</div>
						{this.getComboText(this.props.item.attributes.size)}
					</div>
				</div>
				<div>
					{this.checkServiceability()}
					{this.displayApiErrorMsg()}
				</div>
			</div>
		);
	}

	getComboText(size) {
		if(size == "combo"){
			return (
				<div class="text-silver combo-text pl-0">Combo of Bowl + Homemade Lemonade Sweetened With Jaggery</div>
			)
		}
	}

	checkItemDiscount(){
		if(this.props.item.attributes.price_final < this.props.item.attributes.price_mrp){
			return <div><span className="gbb-original-price mr-0">₹{this.props.item.attributes.price_mrp}</span> <span className="gbb-discount text-danger d-none">{this.getOffPercentage()}% OFF</span></div>
		}
	}

	getOffPercentage(){
		return Math.round(((this.props.item.attributes.price_mrp - this.props.item.attributes.price_final) / (this.props.item.attributes.price_mrp )) * 100)
	}

	checkServiceability(){
		if(!this.props.item.deliverable)
			return <div className="alert-danger p-15 mb-3">Cannot be delivered at your location</div>
		if(!this.props.item.availability)
			return <div className="alert-danger p-15 mb-3">Quantity not available</div>
	}

	displayApiErrorMsg(){
		if(this.state.apiErrorMsg && this.props.item.deliverable && this.props.item.availability ){
			return <div className="alert-danger p-15 mb-3">{this.state.apiErrorMsg}</div>
		}
	}

	removeItem(){
		this.props.removeItem(this.props.item.variant_id);
	}

	setApiErrorMsg(msg){
		this.setState({apiErrorMsg : msg});
		setTimeout(()=>{
			this.setState({apiErrorMsg : ''});
		},3000)
	}

	updateSummary(summary){
		this.props.updateSummary(summary);
	}
}

export default Item;