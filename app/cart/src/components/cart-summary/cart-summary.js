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
		this.popupTimeOut = ""
	}
	render() {
		return (
			<div className="cart-summary-container position-relative">
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
			return <div className="pb-52">
				<div className="summary-item align-items-end">
					<div>
						<div>
							<label className="mb-0">Coupon Discount</label>
						</div>
						<div>
							<label className="font-weight-medium font-italic mb-0 font-size-13">{couponDetails.code}</label>
							{this.props.callFrom &&
								<button className="p-0 ml-2 btn-remove-coupon" type="button" onClick={e => this.removeCoupon()}>
									<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path fill="red" fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z" />
									</svg>
								</button>}
						</div>
					</div>
					<div className="text-success">-₹{this.props.summary.cart_discount}</div>
				</div>

				{showPopup && msgContent}
			</div>

		} else {
			if (this.props.callFrom) {
				return <div className="pb-52">
					{/* <div className="apply-coupon-wrapper">
						<div><label className="">Apply Coupon</label></div>
						<div className="summary-items">
							<input type="text" name="coupon_applied" value={ coupon } onChange={e => this.setCoupon(e.target.value)} />
							<div> <button onClick={this.applyCoupon()}>Apply</button></div>
						</div> 
						<input type="text" placeholder="Coupon Code" class="coupon-inp-box border-green ft6 h5 p-3 plceholder-text rounded-0 w-100 mb-0" value={coupon} onChange={e => { this.setCoupon(e.target.value) }} />
						<button type="button" placeholder="Coupon Code" class="coupon-apply-btn cursor-pointer f-18 font-weight-bold test-primary text-underline" onClick={e => this.applyCoupon()}>Apply</button>
					</div> */}
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


	// <div class="animated fadeIn success modal-fullscreen modal-content-center">
	// 	<div class="modal-content-block">
	// 		<span class="p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-lg-center text-capitalize">
	// 			<svg class="bi bi-check-circle-fill" width="20px" height="20px" viewBox="0 0 16 16" fill="#4aa74f" xmlns="http://www.w3.org/2000/svg">
	// 				<path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
	// 			</svg>
	// 			{msg}
	// 		</span>
	// 		<button class="btn-reset close-img" onclick={this.removeToast()}>
	// 			<i class="sprite sprite-close_btn"></i>
	// 		</button>
	// 	</div>
	// </div>
	// <div class="animated fadeIn failure toast d-flex justify-content-center w-100 mw-100 position-absolute">
	// 				<span class="alert-danger p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-capitalize">{msg}
	// 				</span><button class="btn-reset close-img" onclick={this.removeToast()}>
	// 					<i class="sprite sprite-close_btn"></i>
	// 				</button>
	// 			</div>



	displayToast(msg, type) {
		let element;
		if (type == 'success' && msg) {
			element = <div class="animated fadeIn success modal-fullscreen modal-content-center">
				<div class="modal-content-block">
					<div class="align-items-center d-flex justify-content-center mb-2">
						<label class="font-size-15 font-weight-medium mb-0 mr-2 text-uppercase">'COUNP002' applied</label>
						<svg xmlns="http://www.w3.org/2000/svg" fill="#4aa74f" viewBox="0 0 16 16" height="20px" width="20px" class="bi bi-check-circle-fill">
							<path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
						</svg>
					</div>
					<div class="text-align-center">
						<label class="font-size-25 font-weight-bold mb-0">₹ 100</label>
						<label class="d-block font-size-13 mt-0">saved on this coupon</label>
					</div>
					<div class="font-size-13 mt-3 text-align-center">{msg}</div>
					<div class="mt-4 text-align-center">
						<button class="background-white border-0 font-weight-medium text-primary outline-0-btn" onClick={e => this.removeToast()}>Okay</button>
					</div>
				</div>
			</div>
		}
		else if (type == 'error' && msg) {
			element = <div class="animated fadeIn success modal-fullscreen modal-content-center">
				<div class="modal-content-block">
					<div class="align-items-center d-flex justify-content-center mb-2">
						<label class="font-size-15 font-weight-medium mb-0 mr-2 text-uppercase">OPPS!</label>
						<svg width="20px" height="20px" viewBox="0 0 16 16" class="bi bi-exclamation-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
							<path fill="red" fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
						</svg>
					</div>
					<div class="font-size-13 mt-3 text-align-center">{msg}</div>
					<div class="mt-4 text-align-center">
						<button class="background-white border-0 font-weight-medium text-primary outline-0-btn" onClick={e => this.removeToast()}>Okay</button>
					</div>
				</div>
			</div>	
		}

		this.setState({ showPopup: true, msgContent: element })

		this.popupTimeOut = setTimeout(() => {
			 this.setState({ showPopup: false, msgContent: "" })
		}, 4000)
	}

	removeToast = () =>  {
		console.log(this.popupTimeOut)
		if(this.popupTimeOut) {
			clearTimeout(this.popupTimeOut)
		}
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