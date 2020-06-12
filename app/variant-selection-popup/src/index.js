'use strict';
// import Select from 'react-select'
// var Select;
const e = React.createElement;

// const optionsDays = [
// 	{ value: 'monday', label: 'Monday' },
// 	{ value: 'tuesday', label: 'Tuesday' },
// 	{ value: 'wednesday', label: 'Wednesday' },
// 	{ value: 'thursday', label: 'Thursday' },
// 	{ value: 'friday', label: 'Friday' },
// 	{ value: 'saturday', label: 'Saturday' }
// ];

// const optionsSlot = [
// 	{ value: 'slot', label: 'Select a slot' },
// 	{ value: 'lunch', label: 'Lunch' },
// 	{ value: 'dinner', label: 'Dinner' }
// ];
const DAYS ={"monday": "Monday", "tue":"Tuesday", "wed":"Wednesday", "thus":"Thusday", "fri":'Friday', 'sat': "Saturday", "sun":"Sunday"}
class variantSelection extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			variants: [], // variants fetched from firestore
			selectedVariant: '',
			productId: '',
			title: '',
			product: null,
			selectedDay: '',
			selectedSize: '',
			selectedSlot: ''
		};
	}

	getDays(){
		const { variants } = this.state
		const daysArray = variants.map((p) => { return p.day }).filter((value, index, self) => self.indexOf(value) === index)
		let days = daysArray.map((day) => {
			return (
				<option value={day}>{DAYS[day]}</option>
			)
		})
		return days;
	}

	getSlots(){
		const { variants, selectedDay } = this.state
		const slots = variants.map((p) => { return p.day == selectedDay }).filter((value, index, self) => self.indexOf(value) === index)
	}

	setDay(e){
		this.setState({ selectedDay: e.target.value })
	}
	render() {
		const { selectedDay } = this.state
		return (
			<div className="custom-modal" id="variation-selection-popup">
				<div className="custom-modal-content p-15">
					<button type="button" className="btn-reset close-modal" onClick={() => this.hideVariantModal()}><i class="fas fa-times text-silver"></i></button>
					<div className="product-variant text-left text-black">
						<h3 class="h1 ft6 pr-4">Choose Your Bowl</h3>
						{this.getItemType()}
						<div className="variant-list mb-4">
							{this.getVariants()}
						</div>
						<div class="d-flex mb-4">
							<div class="select-wrapper w-50">
								<div class="select-wrapper-title">
									<span class="d-block">Select day</span>
								</div>
								<div class="select-inner-wrap">
									<select name="days" id="days" onChange={(e) => this.setDay(e)} value={selectedDay}>
										{this.getDays()}
									</select>
								</div>
							</div>
							<div class="select-wrapper w-50">
								<div class="select-wrapper-title">
									<span class="d-block">Select slot</span>
								</div>
								<div class="select-inner-wrap">
									<select name="slot" id="slot">
										<option value="choose">Choose a slot</option>
										<option value="lunch">Lunch</option>
										<option value="dinner">Dinner</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					<div className="custom-modal-footer d-flex justify-content-between">
						<button type="button" className="btn-reset btn-continue btn-arrow-icon font-size-15 text-capitalize p-15 bg-primary text-white text-left w-100 position-relative d-flex align-items-center justify-content-between" onClick={() => this.addToCart(this.state.selectedVariant)} >
							<span className="zindex-1">Select & Continue</span>
							<i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
						</button>
					</div>
				</div>
			</div>
		);
	}

	getVariants() {
		if (this.state.variants.length) {
			const variantsArray = [];
			const map = new Map();
			for (const item of this.state.variants) {
				if (!map.has(item.size)) {
					map.set(item.size, true);    // set any value to Map
					variantsArray.push({
						...item
					});
				}
			}
			let variants = variantsArray.map((variant) => {
				return (
					<div key={variant.id} className="list-item pt-3 pb-3 border-bottom-lightgrey">
						<label className="custom-radio-btn mb-0 font-size-16">
							<span className={"mr-3 d-inline-block mw-70 text-capitalize " + (this.state.selectedVariant == variant.id ? 'text-primary' : '')}>{variant.size}</span> <span className="price-span text-right"><span className="currency-symbol">₹</span>{variant.sale_price}</span>
							<input type="radio" name={"variant-" + this.state.productId} value={variant.id} checked={this.state.selectedVariant == variant.id} onChange={(event) => this.handleOptionChange(event)} />
							<span className="checkmark"></span>
						</label>
						{this.getComboText(variant.size)}

					</div>
				)
			})
			return variants;
		}
		else {
			return (
				<div className="list-item pt-3 pb-3 border-bottom-lightgrey">
					<div className="text-line mb-3">
					</div>
					<div className="text-line mb-3">
					</div>
					<div className="text-line">
					</div>
				</div>
			)
		}
	}

	getComboText(size) {
		if (size == "combo") {
			return (
				<div class="text-silver combo-text">Combo of Bowl + Homemade Lemonade Sweetened With Jaggery</div>
			)
		}
	}

	getItemType() {
		if (this.state.product && this.state.product.veg) {
			return (<div class="list-meta mt-4 mb-4">
				<div class="list-author">{this.state.title}</div>
				<div class="list-date">Veg</div>
			</div>)
		} else {
			return (<div class="list-meta nv mt-4 mb-4">
				<div class="list-author">{this.state.title}</div>
				<div class="list-date">Non Veg</div>
			</div>)
		}
	}

	showVariantModal(product_id, last_selected) {
		this.fetchVariants(product_id, last_selected);
		document.querySelector('#variation-selection-popup').classList.add('show-modal');
		document.querySelectorAll('.product-wrapper')
			.forEach((domContainer) => {
				domContainer.classList.add('transform-none');
			});
		let product_element = document.querySelector('#product-' + this.state.productId)
		if (product_element)
			product_element.classList.add('zindex');
		window.hideScroll();
	}

	hideVariantModal() {
		document.querySelector('#variation-selection-popup').classList.remove('show-modal');
		document.querySelectorAll('.product-wrapper')
			.forEach((domContainer) => {
				domContainer.classList.remove('transform-none');
			});

		document.querySelectorAll('.product-list-item')
			.forEach((domContainer) => {
				domContainer.classList.remove('zindex');
			});
		window.showScroll();
	}


	handleOptionChange(event) {
		this.setState({ selectedVariant: event.target.value });
	}


	fetchVariants(product_id, last_selected) {
		if (window.products && window.products.length) {
			let product = window.products.filter((product) => product.id == product_id);
			this.setVariants(product[0], last_selected)
		}
		else {
			try {
				window.fetchProduct(product_id).then((res) => {
					this.setVariants(res, last_selected);
				})
			}
			catch (error) {
				setTimeout(() => {
					this.hideVariantModal();
				}, 100)
				let msg = 'No active variants found'
				window.displayError(msg);
			}
		}
	}

	setVariants(product, last_selected) {
		this.setState(({ product: product }));
		let variants = [];
		if (product) {
			variants = product.variants.filter((variant) => { return variant.active })
		}
		if (variants.length) {
			if (!last_selected) {
				this.setState({ variants: variants, selectedVariant: variants[0].id });
			}
			else {
				this.setState({ variants: variants, selectedVariant: last_selected });
			}
		}
		else {
			setTimeout(() => {
				this.hideVariantModal();
			}, 100)
			let msg = 'No active variants found'
			window.displayError(msg);
		}
	}

	addToCart(variant_id = null) {
		console.log("variant id==>", variant_id);
		this.hideVariantModal();
		window.addToCartFromVariant(this.state.productId, variant_id, this.state.product);
	}
}


let domContainer = document.querySelector('#react-variant-selection-modal');
const VariantSelectionComponent = ReactDOM.render(e(variantSelection), domContainer);


window.showVariantSelectionPopup = (product_id, last_selected, title) => {
	console.log("inside updateViewCartCompoent", product_id, last_selected);
	VariantSelectionComponent.setState({ variants: [], productId: product_id, title: title });
	VariantSelectionComponent.showVariantModal(product_id, last_selected);
}

function hideVariantSelectionPopup(event) {
	if (event.target == document.querySelector('#variation-selection-popup'))
		VariantSelectionComponent.hideVariantModal();
}

window.addEventListener("click", hideVariantSelectionPopup);
