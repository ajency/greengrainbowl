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
const DAYS = { "monday": "Monday", "tuesday": "Tuesday", "wednesday": "Wednesday", "thursday": "Thursday", "friday": 'Friday', 'saturday': "Saturday", "sunday": "Sunday" };
const SLOTS = { "lunch": "Lunch", "dinner": "Dinner" };
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
			selectedSlot: '',
			disableSlot: true,
			slotError:false,
			dayError:false,
			defaultDay:""
		};
	}

	getDays() {
		const { variants,selectedSize } = this.state
		const daysArray = variants.filter((v) => {
			if(selectedSize) {
				if(v.size == selectedSize) {
					return v 
				} 
			} else {
				return v
			}
		})
		.map((p) => { return p.day }).filter((value, index, self) => self.indexOf(value) === index)
		let days = daysArray.map((day) => {
			return (
				<option value={day}>{DAYS[day]}</option>
			)
		})
		return days;
	}


	setDay(e) {
		console.log(e.target.value);
		this.setState({ selectedDay: e.target.value, disableSlot: false, selectedSlot: '', dayError:false })
	}
	render() {
		const { selectedDay, disableSlot, variants,selectedSlot, dayError,slotError } = this.state
		const slotsArray = variants.filter((v) =>{ return v.day == selectedDay }).map((p) => { return p.slot }).filter((value, index, self) => self.indexOf(value) === index)

		return (
			<div className="custom-modal" id="variation-selection-popup">
				<div className="custom-modal-content p-15">
					<button type="button" className="btn-reset close-modal" onClick={() => this.hideVariantModal()}><i class="fas fa-times text-silver"></i></button>
					<div className="product-variant text-left text-black">
						<h3 class="h1 ft6 pr-4">Choose Your Bowl</h3>
						{this.getItemType()}

						<div class="select-wrapper">
							<div class="select-wrapper-title">
								<span class="d-block">Select Size</span>
							</div>
						</div>
						<div className="variant-list mb-4">
							{this.getVariants()}
						</div>
						<div class="d-flex mb-4">
							<div class="select-wrapper w-50">
								<div class="select-wrapper-title">
									<span class="d-block">Select Delivery Day <span class="text-danger">*</span></span>
								</div>
								<div class="select-inner-wrap">
									<select name="days" id="days" onChange={(e) => this.setDay(e)} value={selectedDay}>
										<option value="choose">Choose a day</option>
										{this.getDays()}
									</select>
								</div>
								{dayError && <div class="error-msg mt-2 text-danger">Please select a day.</div>}
							</div>
							<div class="select-wrapper w-50">
								<div class="select-wrapper-title">
									<span class="d-block">Select Delivery Slot <span class="text-danger">*</span></span>
								</div>
								<div class="select-inner-wrap">
									<select name="slot" id="slot" value={selectedSlot} onChange={(e) => this.setSlots(e)} >
										<option value="choose" >Choose a slot</option>
										{ slotsArray.map((slot) => {
											return (
												<option value={slot}>{SLOTS[slot]}</option>
											)
										})}
									</select>
								</div>
								{slotError && <div class="error-msg mt-2 text-danger">Please select a slot.</div>}
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
		console.log("getVariants===>", this.state.selectedSize);
		
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
			let variants = variantsArray.map((variant, index) => {
				return (
					<div key={variant.id} className={"list-item  pb-3 border-bottom-lightgrey" + (index == 0 ? 'pt-1':'pt-3')}>
						<label className="custom-radio-btn mb-0 font-size-16">
							<span className={"mr-3 d-inline-block mw-150 text-capitalize " + (this.state.selectedVariant == variant.id ? 'text-primary' : '')}>{variant.size}</span>
							<span className="price-span text-right sale-price"><span className="currency-symbol">₹</span>{variant.sale_price}</span>
							{variant.mrp != variant.sale_price && <span className="price-span mrp-price"><span className="currency-symbol">₹</span>{variant.mrp}</span>}
							<input type="radio" data-productid={variant.id} name={"variant-" + this.state.productId} value={variant.size} checked={this.state.selectedSize == variant.size} onChange={(event) => this.handleOptionChange(event)} />
							<span className="checkmark"></span>
						</label>
						{this.getComboText(variant.size)}

					</div>
				)
			})
			// this.setState({selectedSize:variantsArray[0].size, selectedVariant: variantsArray[0].id})
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
		console.log("showVariantModal",last_selected);
		
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
		if(window.location.hash == '#/variants' || window.location.hash == '#variants') {
			window.history.back()
		}
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
		const { variants,defaultDay } = this.state
		const daysArray = variants.filter((v) => {
			if(v.size == event.target.value) {
				return v 
			} 
		})
		.map((p) => { return p.day }).filter((value, index, self) => self.indexOf(value) === index)
		let selectedDay = ""
		if(daysArray.includes(defaultDay)) {
			selectedDay = defaultDay
		} // else {
		// 	if(daysArray.length) {
		// 		selectedDay = daysArray[0]
		// 	}
		// }
		this.setState({ selectedSize: event.target.value, selectedDay, selectedSlot:"" });
	}

	setSlots(e) {
		this.setState({ selectedSlot: event.target.value, slotError:false });
	}

	fetchVariants(product_id, last_selected) {
		console.log("fetchVariants",last_selected);

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
				let msg = 'Sorry, this product is sold out.'
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
			const variantsArray = [];
			const map = new Map();
			for (const item of variants) {
				if (!map.has(item.size)) {
					map.set(item.size, true);    // set any value to Map
					variantsArray.push({
						...item
					});
				}
			}
			console.log("setVariants  ====>",variantsArray)
			if (!last_selected) {
				this.setState({ variants: variants, selectedVariant: variantsArray[0].id, selectedSize: variantsArray[0].size });
			}
			else {
				this.setState({ variants: variants, selectedVariant: variantsArray[0].id, selectedSize: variantsArray[0].size});
			}
		}
		else {
			setTimeout(() => {
				this.hideVariantModal();
			}, 100)
			let msg = 'Sorry, this product is sold out.'
			window.displayError(msg);
		}
	}

	addToCart(variant_id = null) {
		console.log("variant id==>", variant_id);
		const { variants, selectedDay, selectedSize, selectedSlot, product, productId } = this.state
		if(selectedDay =='' || selectedDay =='choose') {
			this.setState({dayError:true})
			return

		} 
		if(selectedSlot =='' || selectedSlot =='choose') {
			this.setState({slotError:true})
			return
		} 
		if(!selectedSize) {
			return
		} 
		const selectedVariant = variants.filter((v) => {
			return v.size == selectedSize && v.day == selectedDay && v.slot == selectedSlot
		})

		this.setState({ selectedDay: '', selectedSize: '', selectedSlot: '' }, () => {
			this.hideVariantModal();
			window.addToCartFromVariant(productId, selectedVariant[0].id, product);
		})

	}
}


let domContainer = document.querySelector('#react-variant-selection-modal');
const VariantSelectionComponent = ReactDOM.render(e(variantSelection), domContainer);


window.showVariantSelectionPopup = (product, last_selected, title) => {
	console.log("inside updateViewCartCompoent", product.product_id, last_selected);
	const selectedDay = product.day? product.day:""
	VariantSelectionComponent.setState({ variants: [], productId: product.product_id, title: title, selectedDay: selectedDay, defaultDay:product.day});
	VariantSelectionComponent.showVariantModal(product.product_id, last_selected);
}

function hideVariantSelectionPopup(event) {
	if (event.target == document.querySelector('#variation-selection-popup')) {
		VariantSelectionComponent.hideVariantModal();
	}
}

window.addEventListener("click", hideVariantSelectionPopup);
