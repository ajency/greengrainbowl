import React, { Component } from 'react';
import './coupon-screen.scss';
import Header from '../header/header';

class CouponScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coupon: '',
            showPopup: false,
            msgContent: ''
        }
    }
    componentDidMount() {
        window.removeCartLoader()
    }
    render() {
        const { coupon, showPopup = false, msgContent } = this.state;
        const { couponDetails } = this.props
        return (
            <div className="coupon-container visible">
                <Header />
                <div className="ml-10 mr-10">
                    <div className="mt-15">
                        <div className="apply-coupon-wrapper">
                            {/* <div><label className="">Apply Coupon</label></div>
                            <div className="summary-items">
                                <input type="text" name="coupon_applied" value={ coupon } onChange={e => this.setCoupon(e.target.value)} />
                                <div> <button onClick={this.applyCoupon()}>Apply</button></div>
                            </div> */}
                            <input type="text" placeholder="Coupon Code" class="coupon-inp-box border-green ft6 h5 p-3 plceholder-text rounded-0 w-100 mb-0" value={coupon} onChange={e => { this.setCoupon(e.target.value) }} />
                            <button type="button" placeholder="Coupon Code" class="coupon-apply-btn cursor-pointer f-18 font-weight-bold test-primary text-underline" onClick={e => this.applyCoupon()}>Apply</button>
                        </div>
                    </div>
                    {showPopup && this.getResCard()}
                </div>
                <div className="p-15 pt-0 pb-0">
                    <div className="secure-checkout fixed-bottom visible bg-white p-15">
                        <button className="btn btn-primary btn-arrow-icon w-100 p-15 rounded-0 text-left position-relative h5 ft6 mb-0 d-flex align-items-center justify-content-between text-uppercase overflow-hidden" onClick={e => this.goToProceedCheckout()}>
                            <span className="zindex-1">Proceed to Checkout</span>
                            <i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

        );
    }

    setCoupon(coupon = "") {
        coupon = coupon.trim();
        this.setState({ coupon })
    }

    goToProceedCheckout = () => {
        this.props.history.replace("/cart/cart-summary")
    }
    // applyCoupon() {
    //     const { coupon } = this.state;

    //     if (coupon) {

    //         this.props.applyCoupon(coupon)
    //         console.log(`Applying coupon ${coupon}`)

    //     } else {
    //         console.log(`Applying error`)
    //         this.displayToast("Please enter valid coupon code.", "error")
    //     }
    // }


    getResCard = () => {
        const { msgContent } = this.state;
        return <div>
            <div dangerouslySetInnerHTML={{ __html: msgContent }} />
            <div>
                <button onClick={e => this.setState({ showPopup: false })}>close</button>
            </div>
        </div>
    }

    clearCoupon() {
        this.setState({ coupon: "" })
    }

    applyCoupon = () => {
        const { coupon } = this.state;
        if (!coupon) {
            console.log(`Applying error`)
            // this.displayToast("Please enter valid coupon code.", "error")
        }
        window.addCartLoader()
        window.cartOperation({ operation: "add", couponCode: coupon }, this.state.orderSummary).then((res) => {
            let msgContent = ""
            if (res.success) {
                console.log(res)
                if (res.formatted_message) {
                    msgContent = res.formatted_message
                } else {
                    msgContent = `<div class="msg-success"> ${res.message}</div>`
                }
                msgContent = `<div class="msg-success">
                <p>Yay! coupon code applied successfully, You have availed discount of <span>₹ 100</span></p>
             </div>`
                this.setState({ showPopup: true, msgContent })
                this.clearCoupon()
                window.removeCartLoader();

            } else {
                if (res.formatted_message) {
                    msgContent = res.formatted_message
                } else {
                    msgContent = `<div class="msg-error"> ${res.message}</div>`
                }
                msgContent = `<div class="msg-error">
                                <p>Coupon does not exist</p>
                            </div>`
                this.setState({ showPopup: true, msgContent })
                this.clearCoupon()
                window.removeCartLoader();
            }
        }).catch((e) => {
            console.log(e)
            this.setState({
                showPopup: true, msgContent: `<div class="msg-error">
            <p>Something went wrong!</p>
         </div>
         ` })
            this.clearCoupon()
            window.removeCartLoader();
            // this.CartSummary.current.displayToast(`Failed to apply coupon ${coupon}`, "error")
        })
    }



}

export default CouponScreen;