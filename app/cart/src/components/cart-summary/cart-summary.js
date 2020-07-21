import React, { Component } from 'react';
import './cart-summary.scss';

class CartSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			coupon: '',
			showPopup: false,
			msgContent: ''
		}
	}
	render() {
		return (
			<div className="cart-summary-container">
				<div className="summary-item">
					<div><label className="font-weight-light">Total Item Price</label></div>
					<div className="font-weight-light">₹{this.props.summary.sale_price_total} </div>
				</div>

				{this.getCouponDiscount()}

				{this.getShippingFee()}

				<div className="summary-item border-grey-50 border-0-left border-0-right mt-1 pt-2 pb-2">
					<div><label className="font-weight-medium mb-0">To Pay</label></div>
					<div className="font-weight-bold">₹{this.props.summary.you_pay}</div>
				</div>
			</div>
		);
	}

	getCouponDiscount() {
		const { coupon, showPopup = false, msgContent } = this.state;
		const { couponDetails } = this.props
		if (this.props.summary.cart_discount) {
			return <>
				<div className="summary-item">
					<div>
						<label className="">Applied {couponDetails.code}</label>
						<button type="button" onClick={e => this.removeCoupon()}>X</button>
					</div>

				</div>
				<div className="summary-item">
					<div><label className="">Coupon Discount</label></div>
					<div className="text-success">-₹{this.props.summary.cart_discount}</div>
				</div>

				{showPopup && msgContent}
			</>

		} else {
			if (this.props.callFrom) {
				return <div>
					<div className="apply-coupon-wrapper">
						{/* <div><label className="">Apply Coupon</label></div>
						<div className="summary-items">
							<input type="text" name="coupon_applied" value={ coupon } onChange={e => this.setCoupon(e.target.value)} />
							<div> <button onClick={this.applyCoupon()}>Apply</button></div>
						</div> */}
						<input type="text" class="coupon-inp-box border-green ft6 h5 p-3 plceholder-text rounded-0 w-100 mb-0" value={coupon} onChange={e => { this.setCoupon(e.target.value) }} />
						<button type="button" placeholder="Coupon Code" class="coupon-apply-btn cursor-pointer f-18 font-weight-bold test-primary text-underline" onClick={e => this.applyCoupon()}>Apply</button>					
					</div>
					{showPopup && msgContent}
				</div>

			}

		}
	}

	setCoupon(coupon = "") {
		coupon = coupon.trim();
		this.setState({ coupon })
	}

	applyCoupon() {
		const { coupon } = this.state;

		if (coupon) {

			this.props.applyCoupon(coupon)
			console.log(`Applying coupon ${coupon}`)

		} else {
			console.log(`Applying error`)
			this.displayToast("Please enter valid coupon code.", "error")
		}
	}

	removeCoupon() {
		this.props.removeCoupon()
	}

	clearCoupon() {
		this.setState({ coupon: "" })
	}




	displayToast(msg, type) {
		let element;
		if (type == 'success') {
			element = <div class="animated fadeInUp success toast d-flex justify-content-center sb-shadow mt-lg-5 position-relative">
				<span class="p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-lg-center text-capitalize">
					<svg class="bi bi-check-circle-fill" width="20px" height="20px" viewBox="0 0 16 16" fill="#4aa74f" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
					</svg>
					{msg}
				</span>
				<button class="btn-reset close-img" onclick={this.removeToast()}>
					<i class="sprite sprite-close_btn"></i>
				</button>
			</div>
		}
		else {
			element = <div class="animated fadeInUp failure toast d-flex justify-content-center position-relative mt-lg-5">
				<span class="alert-danger p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-capitalize">{msg}
				</span><button class="btn-reset close-img" onclick={this.removeToast()}>
					<i class="sprite sprite-close_btn"></i>
				</button>
			</div>
		}

		this.setState({ showPopup: true, msgContent: element })

		setTimeout(() => {
			this.setState({ showPopup: false, msgContent: "" })
		}, 3000)
	}

	removeToast() {
		this.setState({ showPopup: false, msgContent: "" })
	}

	getShippingFee() {
		if (this.props.summary.shipping_fee)
			return <div className="summary-item">
				<div><label className="font-weight-light">Delivery fee</label></div>
				<div className="font-weight-light">₹{this.props.summary.shipping_fee}</div>
			</div>
	}
}

export default CartSummary;