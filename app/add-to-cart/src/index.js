'use strict';

const e = React.createElement;

class addToCart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apiCallInProgress : false,
			quantity : 0,
			lastSelected : '',
			items : [], // variants added to cart
			site_mode : process.env.REACT_APP_SITE_MODE,
			pickup_point : process.env.REACT_APP_PICKUP_POINT,
			businessId: process.env.REACT_APP_BUSINESS_ID,
			default_lat_lng : [process.env.REACT_APP_DEFAULT_LAT, process.env.REACT_APP_DEFAULT_LNG],
		};
	}

	render() {
		return (
			<div>
				{this.getButtonContent()}
			</div>
		);
	}

	showVariantModal(){
		if (window.products && window.products.length) {
			let products = window.products.filter((product) => product.id == this.props.product_data.product_id);
			const variants = products[0].variants.filter((variant) => { return variant.active })
			if(variants.length) {
				window.location.hash = "/variants"
				window.showVariantSelectionPopup(this.props.product_data, this.state.lastSelected, this.props.product_data.title)
			} else {
				let msg = 'Sorry, this product is sold out.'
				window.displayError(msg);
			}
		} else {
			window.location.hash = "/variants"
			window.showVariantSelectionPopup(this.props.product_data, this.state.lastSelected, this.props.product_data.title)
		}

	}

	getButtonContent(){
		if(this.state.apiCallInProgress){
			return (<div class="btn-icon">
						<i class="fas fa-circle-notch fa-spin fa-lg"></i>
					</div>);

		}
		if(this.state.quantity == 0)
			return (
				 <a className="btn-add-to-cart text-white bg-primary p-15 text-decoration-none m-0 font-size-25 ft6 cursor-pointer d-inline-block p-add" onClick={() => this.checkVariant('add')} disabled={this.state.apiCallInProgress}>
					<span className="zindex-1">Add to cart</span><i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
                 </a>
				)

		return (
			<div className="border-green bg-white">
				<button className="btn-primary" onClick={() => this.checkVariant('remove')} disabled={this.state.apiCallInProgress}>-</button>
				<span className="mw-50 text-center text-black">	{this.state.quantity} </span>
				<button className="btn-primary" onClick={() => this.checkVariant('add')} disabled={this.state.apiCallInProgress}>+</button>
			</div>
		)		
	}

	
	checkVariant(action){
		window.addBackDrop();
		let unsubscribeOnAuthStateChanged = firebase.auth().onAuthStateChanged((user) => {
			console.log("check user ==>", user);
			if(user){
				console.log("user exist");
				this.variantPopUp(action);
			}
			else{
				console.time('signin')
				this.signInAnonymously(action);
				console.timeEnd('signin')
			}
			unsubscribeOnAuthStateChanged();
		});
	}

	variantPopUp(action){
		if(action == 'add'){
			window.removeBackDrop();
			this.showVariantModal()
		}
		else{
			if(this.state.items.length > 1){
				window.removeBackDrop();
				let msg = "Item has multiple variants added. Please remove correct item from cart";
				window.displayError(msg);
			}
			else{
				this.removeFromCart(this.state.items[0].variant_id);
			}
		}
	}

	signInAnonymously(action){
		firebase.auth().signInAnonymously()
			.then((res)=>{
				// res.user.getIdToken().then((idToken) => {
		  //          this.updateUserDetails(idToken);
		  //       });
		  		this.variantPopUp(action);
			})
			.catch((error) => {
				window.removeBackDrop();
			  	console.log("error in anonymous sign in", error);
			});
	}

	addToCart(variant_id = null, product) {
		console.log("add to cart function");
		this.setState({apiCallInProgress : true});
		let cart_id = window.readFromLocalStorage(this.state.site_mode+'-cart_id-'+this.state.businessId);
		if(this.state.site_mode == 'kiosk') {
			window.lat_lng = this.state.default_lat_lng;
			window.formatted_address = this.state.pickup_point;
		}
		if(cart_id && window.lat_lng){
			this.addToCartApiCall(variant_id, window.lat_lng, cart_id, window.formatted_address, product);
		}
		else if(window.lat_lng){
			this.addToCartApiCall(variant_id, window.lat_lng, null, window.formatted_address, product);
		}
		else{
			this.getGeolocation().then((res)=>{
				console.log("add to cart geolocation");			
				this.addToCartApiCall(variant_id, window.lat_lng, null, window.formatted_address, product);
			})
			.catch((error) => {
				this.setState({apiCallInProgress : false});
				console.log("error ==>", error);
				window.displayError(error);
			});
		}
	}

	removeFromCart(variant_id = null){
		window.addBackDrop();
		this.setState({apiCallInProgress : true});
			let cart_id = window.readFromLocalStorage(this.state.site_mode+'-cart_id-'+this.state.businessId), quantity = 1;
			window.removeItemFromCart(variant_id, cart_id, quantity).then((res)=>{
				if(res.success){
					window.displaySuccess(this.props.product_data.title + " removed from cart");
					let item = {
						variant_id : variant_id,
						quantity : 1
					}
					this.removeItems(item);
					window.updateViewCartCompoent(res);
				}
				else{
					window.displayError(res.message);
				}
				this.setState({apiCallInProgress : false});
				window.removeBackDrop();
			})
	}

	addToCartApiCall(variant_id = null, lat_long = null, cart_id = null, formatted_address = null, product){
		window.addBackDrop()
			window.addToCart(this.state.site_mode, variant_id, lat_long, cart_id, formatted_address, product).then((res) =>{
				console.log("addToCart response ==>", res);
				if(res.success){
					console.log(" addToCart response success ==>", res);
					console.time("addItems")
					this.addItems(res.item);
					console.timeEnd("addItems")
					console.time("updateViewCartCompoent")
					window.updateViewCartCompoent(res);
					console.timeEnd("updateViewCartCompoent")
					window.displaySuccess(res.item.attributes.size + '-' +res.item.attributes.title + '-' +res.item.attributes.day + '-' +res.item.attributes.slot +" added to cart");
					this.setState({apiCallInProgress : false});
					window.removeBackDrop();
				}
				else{
					this.setState({apiCallInProgress : false});
					window.displayError(res.message);
					window.removeBackDrop();
				}
			})
			.catch((error)=>{
				console.log("error in add to cart ==>", error);
				this.setState({apiCallInProgress : false});
				let msg = error && error.message ? error.message : error;
				window.displayError(msg);
				window.removeBackDrop();		
			})
	}

	addItems(item){
		let items = this.state.items;
		let updated_item_index = items.findIndex((i) => { return i.variant_id == item.variant_id});
		if(updated_item_index !== -1){
			items[updated_item_index].quantity += item.quantity;
		}
		else{
			items.push(item);
		}
		let quantity = this.state.quantity + item.quantity;
		this.setState({quantity : quantity, items : items, lastSelected : item.variant_id});
	}

	removeItems(item){
		let items = this.state.items;
		let updated_item_index = items.findIndex((i) => { return i.variant_id == item.variant_id});
		let last_selected = '', quantity = this.state.quantity - item.quantity;
		if(updated_item_index !== -1){
			items[updated_item_index].quantity -= item.quantity;
		}
		if(items[updated_item_index].quantity == 0){
			items.splice(updated_item_index, 1);
		}
		if(items.length == 1){
			last_selected = items[0].variant_id;
		}
		this.setState({quantity : quantity, items : items, lastSelected : last_selected});
	}

	getGeolocation(){
		return new Promise((resolve, reject) => {
			// setTimeout(() => {
			// 	window.location.hash = "/set-address"
			// },300)
		    window.showGpsModalPrompt(true);
		    let timer = setInterval(()=>{
		    	if(window.lat_lng){
		    		clearInterval(timer);
		    		resolve();
		    	}
		    	if(window.modal_closed){
		    		clearInterval(timer);
		    		window.modal_closed = false;
		    		reject("Please select location to add to cart");
		    	}
		    },500)
		});
	}
}

let addToCartComponents = [];
let variantModals = [];
let repeateModals = []
// Find all DOM containers, and render add-to-cart buttons into them.
document.querySelectorAll('.react-add-to-cart-container')
	.forEach((domContainer, index) => {
		const product_data = JSON.parse(domContainer.dataset.product_data);
		addToCartComponents[index] =  ReactDOM.render(e(addToCart, { product_data : product_data }),domContainer);
		domContainer.classList.remove("btn-hide")
	});


window.updateaddToCartComponent = async (item) => {
	const products = await window.fetchProducts()

	addToCartComponents.forEach((component) =>{
		if(component.props.product_data.product_id == item.product_id && item.day == component.props.product_data.day){
			let items = component.state.items;
			items.push(item)
			items.sort((a,b)=>{
	  			return b.timestamp - a.timestamp;
	  		})
			let last_added = items[0].variant_id;
			let qty = 0;
			items.forEach((item) => {
				qty += item.quantity;
			})
			component.setState({items : items, lastSelected : last_added, quantity : qty})
		}
	})
}

window.updateItemQuantity = async (item, action) => {
	console.log("updateItemQuantity ==>", item, action);

	addToCartComponents.forEach((component) =>{
		const product = window.products.find((p) => p.id == item.product_id)
		const variant = product.variants.find((v) => v.id == item.variant_id)
		if(component.props.product_data.product_id == item.product_id && component.props.product_data.day == variant.day){
			if(action == 'add')
				component.addItems(item)
			else
				component.removeItems(item)
		}
	})
}

window.addToCartFromVariant = (product_id, variant_id , product) => {
	let found = false;
	addToCartComponents.forEach((component) =>{
		const variant = product.variants.find((p) => p.id == variant_id)
		if(component.props.product_data.product_id == product_id && variant.day == component.props.product_data.day && !found){
			component.addToCart(variant_id, product);
			found = true;
		}
	})
}
