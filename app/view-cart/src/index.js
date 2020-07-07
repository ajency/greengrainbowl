'use strict';
const e = React.createElement;

class viewCart extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			apiEndPoint : process.env.REACT_APP_API_END_PT,
			cart : null,
			siteMode: process.env.REACT_APP_SITE_MODE,
			businessId: process.env.REACT_APP_BUSINESS_ID
		};
	}

	componentDidMount(){
		console.log("viewCart")
		this.fetchCart();
	}

	render() {
			return (
				<div className={(!this.state.cart || !this.state.cart.cart_count ? 'd-none' : 'view-cart-holder empty-cart')}>
						{this.getItemsCount()}
					<div id="view-cart-btn" className="cursor-pointer zindex-1" onClick={() => this.loadCart()}>
						VIEW CART
					</div>
					<div className="d-none">
						<a href="javascript:void(0)" class="d-inline-block location-icon text-primary text-decoration-none">
							<i class="fas fa-map-marker-alt text-primary font-size-34" aria-hidden="true"></i>
						</a> 
					</div>
				</div>
			);
	}

	getItemsCount(){
		if(this.state.cart && this.state.cart.cart_count){
			return (
				<div className="zindex-1">
					<div className="cart-count d-inline-block d-lg-flex">
						{this.state.cart.cart_count} 
					</div>
					<span className="d-inline-block d-lg-none ml-1">Item(s)</span>
				</div>
			)
		}
	}

	getCartTotal(){
		if(this.state.cart && this.state.cart.cart_count){
			return (
				<div>
					₹ {this.state.cart.summary.sale_price_total}
				</div>
			)
		}
	}

	loadCart() {
		let url = window.location.href.split("#")[0] + '#/cart';
        window.location = url;
	}

	fetchCart() {
		let cart_id = window.readFromLocalStorage(this.state.siteMode+'-cart_id-'+this.state.businessId);
		console.log("inside fetch cart",cart_id)
		if(cart_id){
			window.getCartByID(cart_id).then((cart_data)=>{
				this.setState({cart : cart_data})
				if(cart_data && cart_data.items) {
					cart_data.items.forEach((item)=>{
						window.updateaddToCartComponent(item);
					})
				}
			})
		}
	}
}

let domContainer = document.querySelector('#react-view-cart-container');
const ViewCartComponent = ReactDOM.render(e(viewCart), domContainer);


window.updateViewCartCompoent = (cartValue) => {
	console.log("inside updateViewCartCompoent", cartValue);
	ViewCartComponent.setState({cart : cartValue})
}
