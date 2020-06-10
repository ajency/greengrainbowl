import React, { Component } from 'react';
import './delivery-address.scss';
import editImage from '../../assets/images/Edit.png';

class DeliveryAddress extends Component {
	constructor(props) {
		super(props);
		this.changeShippingAddress = this.changeShippingAddress.bind(this)
	}
	render() {
		return (
			<div className="delivery-address-container p-15 mt-3">
				<div className="address-details list-text-block p-15 mb-0">
					<div className="address-details-inner font-weight-light">
						<span className="font-weight-semibold">Deliver to </span>
						<span id="cart-delivery-address"> {this.props.address}</span>
						<span className="text-green d-inline-block cursor-pointer" onClick={() => this.openChangeLocationModal()}>. Edit</span>
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
}

export default DeliveryAddress;