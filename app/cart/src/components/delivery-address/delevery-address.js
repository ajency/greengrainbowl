import React, { Component } from 'react';
import './delivery-address.scss';
import editImage from '../../assets/images/Edit.png';

class DeliveryAddress extends Component {
	constructor(props) {
		super(props);
		this.changeShippingAddress = this.changeShippingAddress.bind(this)
	}
	render() {
		const { addressType="" } = this.props
		let addressTypeLabel ="Delivery Area";
		if(addressType == "area") {
			addressTypeLabel="Delivery Area"
		}
		return (
			<div className="delivery-address-container p-15 mt-3">
				<div className="address-details list-text-block p-15 mb-0">
					{addressType !='area' && <div className="address-details-inner font-weight-light mb-1">
						<span className="font-weight-semibold">Delivery address:</span>
						<span id="cart-delivery-address" style={{textTransform:"capitalize"}}> {this.props.deliveryAddress}</span>
					</div>}
					<div className="address-details-inner font-weight-light mb-1">
						<span className="font-weight-semibold">Delivery area:</span>
						<span id="cart-delivery-address"> {this.props.deliveryArea}</span>
						<span style={{color:'#4aa751', cursor:"pointer", marginLeft:3}} onClick={(e)=> this.openMap(e)} className>see on map</span>
						<span className="text-green d-inline-block cursor-pointer ml-2" onClick={() => this.openChangeLocationModal()}>Change</span>

					</div>
					

					{this.showSummaryContent()}
				</div>
			</div>
		);
	}

	openChangeLocationModal(){
		console.log("openChangeLocationModal");
		if(!this.props.showSummaryContent){
		 	window.showGpsModalPrompt(true);
		}
		else{
			this.props.navigateToAddress();
		}
	}

	showSummaryContent() {
		if(this.props.showSummaryContent) {
			return (
				<div>
					<div className="address-details-inner font-weight-light mt-3 pt-3 border-grey-top">
						<div className="">
							<span className="text-green font-weight-semibold">Name: </span> 
							<span id="cart-delivery-address"> {this.props.userDetails ? this.props.userDetails.name:''} </span>
						</div>
						<div className="">
							<span className="text-green font-weight-semibold">Mobile No: </span> 
							<span id="cart-delivery-address"> {this.props.userDetails ? this.props.userDetails.phone:''} </span>
						</div>						
					</div>
					{/*<div className="btn-edit" onClick={() => this.changeShippingAddress()}>
						<img src={editImage} className="app-log" alt="Edit address" title="Edit address"/>
					</div>*/}
				</div>
			);
		}
	}

	changeShippingAddress() {
		this.props.history.push('/cart/select-address');
	}
	openMap(e) {
		e.preventDefault()
		window.open(this.props.mapLink)
	}
}

export default DeliveryAddress;