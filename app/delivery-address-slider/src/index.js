'use strict';
const e = React.createElement;
window.lat_lng = null;				// store lat long in global varaible.
window.formatted_address = null;	// store address to be displayed in global variable.
window.modal_closed = false;		// used in add to cart component to resolve promise of geolocation.
const CancelToken = axios.CancelToken;
let cancel;
let debounceTimer;

const logo = "https://greengrainbowl.com/assets/images/cart-images/app-logo.png";

const locationStyle = {
	'listStyle' : 'none'
}

class gpsModalPrompt extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			apiEndPoint : process.env.REACT_APP_API_END_PT,
			webSiteLink : process.env.REACT_APP_WEBSITE_LINK,
			locations : [],
			locError : '',
			gpsError : '',
			fetchingGPS : false,
			searchText : '',
			addresses : '',
			showNoAddressMsg : false,
			settingUserLocation : false,
			notLoggedIn : false,
			showSignInBtn : false,
			businessId: process.env.REACT_APP_BUSINESS_ID,
			siteMode: process.env.REACT_APP_SITE_MODE
		}
		
	}

	componentDidMount(){
		if(firebase && firebase.app()){
			let unsubscribeOnAuthStateChanged = firebase.auth().onAuthStateChanged((user) => {
				console.log("check user ==>", user);
				if(user && !user.isAnonymous){
					console.log("user found ==== setting showSign in button to false");
					this.setState({showSignInBtn : false})
				}
				else{
					this.setState({showSignInBtn : true})
				}

			  	if (user && !this.state.notLoggedIn && !user.isAnonymous) {
			    	user.getIdToken().then((idToken) => {
			   			this.fetchAddresses();        
			        });
			  	}
			  	else {
			  		this.setState({notLoggedIn : true })
			  		console.log("no user");
			  	}
			  	// unsubscribeOnAuthStateChanged();
			});
		}
	}

	render() {
		return (
		    <div className="slide-in" id="gpsModal">
			  <div className="slide-in-header header-container d-flex align-items-center">
			      <div className="app-name d-flex align-items-center">			
			          <img src={logo} className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
			      </div>
			      <div className="app-chekout text-green">
				  	  <i class="sprite sprite-checkout"></i>
			          Secure <br/>Checkout
			      </div>
			      <h3 className="app-close bg-primary m-0 text-white btn-pay m-0" onClick={() => this.closeGpsSlider()}>
			          <span aria-hidden="true"><i class="sprite sprite-remove"></i></span>
			      </h3>
			  </div>
			  <div className="slide-in-content">
			      {this.showSignInButton()}
					<div className="position-relative title-wrap pl-0">
						{/* <button className="btn btn-reset btn-back p-0"><i class="fa fa-arrow-left font-size-20" aria-hidden="true"></i></button> */}
						<h3 className="mt-4 h1 ft6">Set delivery area</h3>
					</div>
			      <h4 className="font-weight-light mt-4 pb-4">
			        We currently serve at Panjim, Porvorim & its neighbourhood.
			      </h4>
			      <div className="mb-3 pt-4">
			       		{this.showFetchLocationUsingGps()}
			      </div>
			      <div className="gps-error-msg">
					{this.checkGpsErrorMsg()}
				  </div>

					<div className="test-center">
			      		{this.showLocationSearch()}
					</div>
			      	<div className="gps-error-msg">
						{this.checkLocationErrorMsg()}
					</div>

			      	<ul style={locationStyle} className="pl-0 h5 mb-0 add-list">
						{this.getAutoCompleteLocations()}
					</ul>

					{this.getSavedAddresses()}

					{this.getNoSavedAddressesMsg()}
			  </div>
			</div>
		);
	}

	showSignInButton() {
	  	if(this.state.showSignInBtn){
	  		return (
	  			<div className="list-text-block p-3 mb-2 full-width-15">
			        <div className="list-meta mt-0">If you have ordered with us before, <a className="text-underline test-primary text-underline cursor-pointer font-weight-bold f-18" onClick={()=> this.showSignInScreen()} >Sign in</a> to fetch saved addresses.</div>
			    </div>
	  		);
	  	}
	}

	checkGpsErrorMsg(){
		if(this.state.gpsError == 'permission_denied'){
			return (<div className="alert-danger p-15 mb-3">
					<p>You have blocked GreenGrainBowl from tracking your location. <a target="_blank" href="https://www.lifewire.com/denying-access-to-your-location-4027789">Know more</a> </p> 
					<p className="mb-0"> Or use location search option below.</p>
				</div>
			)
		}
		else if(this.state.gpsError == 'other_error'){
			return (
				<div className="alert-danger p-15 mb-3">
					<p>Error in getting current location using GPS.</p> 
					<p>Use location search option below.</p>
				</div>
			)
		}
	}

	showLocationSearch(){
		if(!this.state.settingUserLocation && !this.state.fetchingGPS)
			return (
					<div>
						<div className="text-center h4 mb-0 font-weight-light">-OR-</div>
						<div className="position-relative mb-3 mt-3 text-center">
			        		<input onFocus={this.scrollTop} type="text" className="text-grey border-green-2 w-100 rounded-0 p-3 h5 mb-0 outline-0" name="search" placeholder="Search Location" value={this.state.searchText} onChange={e => {this.autoCompleteLocation(e.target.value)}} autoComplete="off"/>
							{/* <i class="sprite sprite-search position-absolute-right20"></i> */}
							<i class="fa fa-search position-absolute-right20 text-primary"></i>
			      		</div>
			      	</div>
			)
	}

	showFetchLocationUsingGps(){
		if(this.state.fetchingGPS && !this.state.settingUserLocation)
			return (
				<div>
					<div className="" > Fetching current Location </div>
					<div>
						<i className="fas fa-circle-notch fa-spin fa-lg"></i>
					</div>
				</div>
			)
		else if(!this.state.settingUserLocation)
			return (
				 <button onClick={() => this.getLocation()} type="button" className="btn-reset btn-location text-grey border-green-2  w-100 p-3 text-left h5 mb-0 position-relative">Use Current Location <i class="sprite sprite-location position-absolute-right20"></i></button>
			)
	}

	showAddressUpdateMsg(){
		if(this.state.settingUserLocation)
			return (
				<div>
					Setting User location ...
					<div>
						<i className="fas fa-circle-notch fa-spin fa-lg"></i>
					</div>
				</div>
			)
	}

	getSavedAddresses(){
		if(this.state.addresses && this.state.addresses.length && !this.state.locations.length && !this.state.settingUserLocation && !this.state.fetchingGPS){
			let addresses = this.state.addresses.map((address)=>{
				let address_extra =''
				if (address.hasOwnProperty('address')) {
					address_extra = address.address+', '
				}
				if(address.hasOwnProperty('landmark')) {
					address_extra = address_extra + address.landmark+', '
				}
				return (
					<li key={address.id} className="cursor-pointer address saved-address-item" onClick={() => this.setUserLocations(address.lat_long, address, true)}>
						{this.getAddressIcon(address.type)}
						<div className="address-text">
							<h5>{address.type}</h5>
							<span className=" font-weight-light h6">{address_extra}{address.formatted_address}</span>
						</div>
					</li>
				)
			})
			return (
				<div>
					<h4 className="mt-4">Saved Addresses</h4>
					<ul style={locationStyle} className="pl-0 mt-4 address-list">
						{addresses}
					</ul>
				</div>
			);
		}
	}

	getAddressIcon(type){
		console.log("type :  ", type);
		let src = "https://greengrainbowl.com/assets/images/cart-images/map.png"
		if(type == 'home')
			src = "https://greengrainbowl.com/assets/images/cart-images/home.png"
		else if(type == 'office')
			src = "https://greengrainbowl.com/assets/images/cart-images/office.png"
		return (<img src={src} className="address-icon"/>)
	}

	getAutoCompleteLocations(){
		if(this.state.locations.length){
			let locs =  this.state.locations.map((loc)=>
				<li key={loc.id} className="btn p-1 position-relative" onClick={() => {this.reverseGeocode(loc)}}>
					<div class="address-icon"><i class="fas fa-map-marker-alt"></i></div>
					<div class="address-text">{loc.description}</div>
				</li>
			);
			this.scrollTop();
			return locs;
		}
		if(this.state.showLoader && !this.state.locations.length){
			return (
					<div>
						<i className="fas fa-circle-notch fa-spin fa-lg"></i>
					</div>
				)
		}

		if(!this.state.locations.length && this.state.searchText.length > 2 && !this.state.settingUserLocation){
			return (
					<div className="no-results-msg">
						No results, please enter a valid street address
					</div>
				);
		}
	}

	checkLocationErrorMsg(){
		if(this.state.locError){
			return <div className="alert-danger p-15 mb-3">{this.state.locError}</div>
		}
	}

	getNoSavedAddressesMsg(){
		if(this.state.showNoAddressMsg)
			return (
				<div class="list-text-block p-3 mb-2 full-width-15">
					<div class="list-meta mt-0">You have no saved addreses. Please set delivery location to continue.</div>
				</div>
			);
	}

	scrollTop(){
		setTimeout(()=> {
			let objDiv = document.getElementById("gpsModal"); 
			objDiv.scrollTop = objDiv.scrollHeight;
		},100)
	}

	closeGpsSlider(){
		window.modal_closed = true;
		this.setState({searchText : '', locError : '', gpsError : ''});
		this.closeGpsModal();
	}

	autoCompleteLocation(value) {
		clearTimeout(debounceTimer);
		this.setState({searchText : value});
		debounceTimer = setTimeout(()=>{
			this.setState({locError : '', showNoAddressMsg : false});
			if(value.length > 2 ) {
				let url = this.state.apiEndPoint + "/places-autocomplete";
				let body = {
					input : value
				}
				this.setState({showLoader : true, locations : []})
				cancel && cancel();
				axios.get(url, {params : body,
						cancelToken : new CancelToken((c) => {
							cancel = c;
						})
					})
					.then((res) => {
						this.setState({showLoader : false})
						if(res.data.status === "OK")
							this.setState({locations : res.data.predictions})
						else{
							//display error
							this.setState({locError : res.data.error_message})
						}
					})
					.catch((error)=>{
						console.log("error in autoCompleteLocation ==>", error);
						// let msg = error.message ? error.message : error;
						// this.setState({locError : msg})
					})
			}
			else{
				this.setState({locations : []})
			}
		},500);
	}

	reverseGeocode(loc = null, latlng=null) {
		this.setSliderLoader();
		this.setState({locations : [], locError : '', settingUserLocation : true})
		let url = this.state.apiEndPoint + "/reverse-geocode";
		let body = {};
		if(loc)
			body.place_id = loc.place_id;
		else if(latlng)
			body.latlng = latlng[0] + ',' +latlng[1];

		axios.get(url, {params : body})
			.then((res) => {
				if(res.data.status === "OK"){
					this.setState({settingUserLocation : false, gpsError : ''});
					if(loc)
						this.setUserLocations([res.data.result.geometry.location.lat,res.data.result.geometry.location.lng], res.data.result.formatted_address,false);
					else if(latlng)
						if(res.data.results>=4) {
							this.setUserLocations(latlng, res.data.results[1].formatted_address,false);
						} else {
							this.setUserLocations(latlng, res.data.results[1].formatted_address,false);
						}
				}
				else{
					this.removeSliderLoader();
					this.setState({fetchingGPS : false, locError : res.data.error_message});
				}
			})
			.catch((error)=>{
				this.removeSliderLoader();
				this.setState({ fetchingGPS : false, settingUserLocation : false});
				console.log("error in autoCompleteLocation ==>", error);
				let msg = error.message ? error.message : error;
				this.setState({locError : msg})
			})
	}

	setUserLocations(lat_lng, address, savedAddress=null){
		try{
			this.setSliderLoader();
			this.setState({settingUserLocation : true});
			let cart_id = window.brewCartId(this.state.siteMode, this.state.businessId);
			let formatted_address = address
			if(savedAddress) {
				formatted_address = address.formatted_address
				window.writeInLocalStorage('saved_address_id', address.id);
				window.writeInLocalStorage('saved_name', address.name);
				window.writeInLocalStorage('saved_email', address.email);
				window.writeInLocalStorage('saved_nos', address.phone);
				if(address.landmark)
					window.writeInLocalStorage('saved_landmark', address.landmark);
				if(address.address)
					window.writeInLocalStorage('saved_address', address.address);
			}  else {
				window.writeInLocalStorage('saved_landmark', "");
				window.writeInLocalStorage('saved_address', "");
				window.writeInLocalStorage('saved_address_id', "");
			}
			window.getCartByID(cart_id).then((res)=>{
				if(res){
					window.updateDeliveryLocation(lat_lng, address, cart_id, savedAddress).then((res)=>{
						this.removeSliderLoader();
						this.updateLocationUI(lat_lng, formatted_address);
						this.setState({ fetchingGPS : false, searchText : '', settingUserLocation : false});
						this.closeGpsModal();
					})
				}
				else{
					this.removeSliderLoader();
					this.setState({ fetchingGPS : false, searchText: '', settingUserLocation : false});
					this.updateLocationUI(lat_lng, formatted_address);
					this.closeGpsModal();
				}
			})	
		}
		catch(error){
			this.removeSliderLoader();
			this.setState({ fetchingGPS : false, searchText: '', settingUserLocation : false});
			this.updateLocationUI(lat_lng, formatted_address);
			this.closeGpsModal();
		}	
	}

	updateLocationUI(lat_lng, formatted_address, ){
		window.writeInLocalStorage('lat_lng', lat_lng[0] + ',' +lat_lng[1]);
		window.writeInLocalStorage('formatted_address', formatted_address);
		window.lat_lng = lat_lng;
		window.formatted_address = formatted_address;
		document.querySelector("#selected-location-address").innerHTML = '<div>' + formatted_address + '</div><i class="fas fa-pencil-alt number-edit cursor-pointer"></i>';
		let cart_address = document.querySelector("#cart-delivery-address");
		if(cart_address){
			// cart_address.innerHTML = formatted_address;			
			let cart_add_trigger = document.querySelector("#cart-address-change-trigger");
			if(cart_add_trigger && document.getElementById("root").classList.contains('active')){
				cart_add_trigger.click();
			}
		}
		window.displaySuccess("Location is set to - " + formatted_address)
	}

	getLocation(){
		this.setSliderLoader();
		this.setState({locations : [], fetchingGPS : true})
		let geoOptions = {
			maximumAge: 30 * 60 * 1000,
			timeout: 20 * 1000
			// enableHighAccuracy : true
		}
		navigator.geolocation.getCurrentPosition((position) => {
			console.log("position ==>", position.coords);
			this.reverseGeocode(null, [position.coords.latitude, position.coords.longitude]);
		},
		(geoError) =>{
			this.removeSliderLoader();			
			console.log("error in getting geolocation", geoError);
			let gps_error = '';
			if(geoError.code === 1){
				gps_error = 'permission_denied'
			}
			else{
				gps_error = 'other_error'
			}
			this.setState({fetchingGPS : false, gpsError : gps_error});
		},geoOptions);
	}

	fetchAddresses(){
		try{
			window.getAddresses().then((res)=>{
				console.log("fetched addresses", res);
				this.setState({ addresses : res });
			})
		}
		catch(error){
			console.log("error in fetching addresses", error);
		}

	}

	setDefaultAddress(addresses){
		if(!window.lat_lng){
			let default_address = addresses.find((address) => {return address.address.default});
			console.log("check default address ==>", default_address);
			if(default_address){
				this.setUserLocations(default_address.address.lat_long, default_address.address.formatted_address,false);
			}
		}
	}

	closeGpsModal(){
		// if(window.location.hash =='#/set-address' || window.location.hash =='#set-address') {
		// 	window.history.back()
		// }
		document.querySelector('#gpsModal').classList.remove('visible');
		window.removeBackDrop();
	}

	showSignInScreen(){
		window.showSignInModal(true);
	}

	setSliderLoader(){
		window.addCartLoader();
	}

	removeSliderLoader(){
		window.removeCartLoader();
	}

}

let domContainer = document.querySelector('#react-add-delivery-address-container');
const gpsModalPromptComponent = ReactDOM.render(e(gpsModalPrompt), domContainer);


window.showGpsModalPrompt = (display, addresses = null) => {
	gpsModalPromptComponent.setState({showNoAddressMsg : false, locations : [], locError : '', gpsError : '', fetchingGPS : false, searchText : '', settingUserLocation : false});
	document.querySelector('#gpsModal').classList.add('visible');
	setTimeout(() => {
		window.addBackDrop();
	},2000)
}

window.closeGpsSlider = () => {
	gpsModalPromptComponent.closeGpsSlider()
	showScroll();
}
window.updateAddresses = (addresses = null) => {
	let showNoAddressMsg = false;
	if(addresses && !addresses.length)
		showNoAddressMsg = true;

	gpsModalPromptComponent.setState({addresses : addresses, showNoAddressMsg : showNoAddressMsg});
	// setTimeout(() => {
	// 	gpsModalPromptComponent.setState({showNoAddressMsg : false});
	// },4000);
}

window.updateSavedAddressUI = () => {
	console.log("called updateSavedAddressUI");
	gpsModalPromptComponent.fetchAddresses()
}
