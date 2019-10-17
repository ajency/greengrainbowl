'use strict';
const e = React.createElement;

const divStyle = {
	display : 'flex',
	'justify-content': 'space-between',
	'background' : '#A3DE9A'
}

const btnStyle = {
	cursor : 'pointer'
}

class viewCart extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			// apiEndPoint : 'http://localhost:5000/project-ggb-dev/us-central1/api/rest/v1',
			apiEndPoint : 'https://us-central1-project-ggb-dev.cloudfunctions.net/api/rest/v1',
			cart : null,
		};
	}

	componentDidMount(){
		this.fetchCart();
	}

	render() {
		if(this.state.cart && this.state.cart.cart_count){
			return (
				<div style={divStyle}>
					<div>
						{this.state.cart.cart_count} {this.state.cart.cart_count > 1 ? 'Items' : 'Item'}
					</div>
					<div>
						₹ {this.state.cart.summary.you_pay}
					</div>
					<div id="view-cart-btn" style={btnStyle} onClick={() => this.loadCart()}>
						VIEW CART
					</div>
				</div>
			);
		}
		else
			return (<div> </div>);
	}

	loadCart() {
		let url = window.location.href.split("#")[0] + '#/cart';
        window.location = url;
	}

	fetchCart() {
		console.log("inside fetch cart");
		let cart_id = window.getCookie('cart_id');
		if(cart_id){
			let url = this.state.apiEndPoint + "/anonymous/cart/fetch";
			let body = {
				cart_id : cart_id
			}
			axios.get(url, {params : body})
				.then((res) => {
					console.log("fetch cart response ==>", res);
					this.setState({cart : res.data.cart})
					res.data.cart.items.forEach((item)=>{
						window.updateaddToCartComponent(item);
					})
				})
				.catch((error)=>{
					console.log("error in fetch cart ==>", error);
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
