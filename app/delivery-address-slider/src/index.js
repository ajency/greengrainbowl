'use strict';
const e = React.createElement;
window.lat_lng = null;				// store lat long in global varaible.
window.formatted_address = null;	// store address to be displayed in global variable.
window.modal_closed = false;		// used in add to cart component to resolve promise of geolocation.
const CancelToken = axios.CancelToken;
let cancel;
let debounceTimer;

const locationStyle = {
	'listStyle' : 'none'
}

class gpsModalPrompt extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// apiEndPoint : 'http://localhost:5000/project-ggb-dev/us-central1/api/rest/v1',
			// apiEndPoint : 'https://us-central1-project-ggb-dev.cloudfunctions.net/api/rest/v1',
			apiEndPoint : 'https://asia-east2-project-ggb-dev.cloudfunctions.net/api/rest/v1',
			locations : [],
			locError : '',
			gpsError : '',
			fetchingGPS : false,
			searchText : '',
			addresses : '',
			showNoAddressMsg : false,
			settingUserLocation : false,
			notLoggedIn : false,
			showSignInBtn : false
		}
		firebase.auth().onAuthStateChanged((user) => {
			console.log("check user ==>", user);
			if(user){
				console.log("user found ==== setting showSign in button to false");
				this.setState({showSignInBtn : false})
			}
			else{
				this.setState({showSignInBtn : true})
			}

		  	if (user && !this.state.notLoggedIn) {
		    	user.getIdToken().then((idToken) => {
		   			this.fetchAddresses(idToken);        
		        });
		  	}
		  	else {
		  		this.setState({notLoggedIn : true })
		  		console.log("no user");
		  	}
		});
	}

	render() {
		return (
		    <div className="slide-in" id="gpsModal">
			  <div className="slide-in-header header-container d-flex align-items-center">
			      <div className="app-name d-flex align-items-center">				
			          <img src="http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/Newlogo.png" className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
			      </div>
			      <div className="app-chekout text-green">
			          <img src="http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/checkout.png" className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl"/>
			          Secure <br/>Checkout
			      </div>
			      <h3 className="app-close bg-primary m-0 text-white btn-pay m-0" onClick={() => this.closeGpsSlider()}>
			          <span aria-hidden="true"><img src="http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/remove.png" className="app-log" alt="Green Grain Bowl" title="Green Grain Bowl" /></span>
			      </h3>
			  </div>
			  <div className="slide-in-content">
			      {this.showSignInButton()}
			      <h3 className="mt-4 h1 ft6">Add delivery address</h3>
			      <h4 className="font-weight-light mt-4 pb-4">
			        We currently serve at Panjim, Porvorim & its neighbourhood.
			      </h4>
				  <div className="map-container d-done">
					<div id="marker"><i class="fas fa-map-marker-alt"></i></div>
				  </div>
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

			      	<ul style={locationStyle} className="pl-0 h5 mb-0">
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
			        <div className="list-meta mt-0">If you have ordered with us before, <a className="text-underline test-primary text-underline cursor-pointer" onClick={()=> this.showSignInScreen()} >Sign in</a> to fetch saved addresses.</div>
			    </div>
	  		);
	  	}
	}

	checkGpsErrorMsg(){
		if(this.state.gpsError){
			return <div className="alert-danger">{this.state.gpsError}</div>
		}
	}

	showLocationSearch(){
		if(!this.state.settingUserLocation && !this.state.fetchingGPS)
			return (
					<div>
						<div className="text-center h4 mb-0 font-weight-light">-OR-</div>
						<div className="position-relative mb-3 mt-3 text-center">
			        		<input type="text" className="border-grey-2 w-100 rounded-0 p-3 h5 mb-0 plceholder-text" name="search" placeholder="Search Location" value={this.state.searchText} onChange={e => {this.autoCompleteLocation(e.target.value)}} />
			       			<img className="position-absolute-right20" src="http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/search.png"/>
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
				 <button onClick={() => this.getLocation()} type="button" className="btn-reset btn-location text-grey border-green-2  w-100 p-3 text-left h5 mb-0 position-relative">Use Current Location <img className="position-absolute-right20" src="http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/location.png"/></button>
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
				return (
					<li key={address.id} className="cursor-pointer address saved-address-item" onClick={() => this.setUserLocations(address.address.lat_long, address.address.formatted_address)}>
						{this.getAddressIcon(address.address.type)}
						<div className="address-text">
							<h5>{address.address.type}</h5>
							<span className=" font-weight-light h6">{address.address.address}, {address.address.landmark}, {address.address.city}, {address.address.state}, {address.address.pincode}</span>
						</div>
					</li>
				)
			})
			return (
				<div>
					<h4 className="mt-4">Saved Addresses</h4>
					<ul style={locationStyle} className="pl-0 mt-4">
						{addresses}
					</ul>
				</div>
			);
		}
	}

	getAddressIcon(type){
		console.log("type :  ", type);
		let src = "http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/map.png"
		if(type == 'home')
			src = "http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/home.png"
		else if(type == 'office')
			src = "http://greengrainbowl-com.digitaldwarve.staging.wpengine.com/wp-content/themes/ajency-portfolio/images/slidein/office.png"
		return (<img src={src} className="address-icon"/>)
	}

	getAutoCompleteLocations(){
		if(this.state.locations.length){
			let locs =  this.state.locations.map((loc)=>
				<li key={loc.id} className="btn p-1" onClick={() => {this.reverseGeocode(loc)}}>
					{loc.description}
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

		if(!this.state.locations.length && this.state.searchText.length > 2){
			return (
					<div>
						No results, please enter a valid street address
					</div>
				);
		}
	}

	checkLocationErrorMsg(){
		if(this.state.locError){
			return <div className="alert-danger">{this.state.locError}</div>
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
						this.setUserLocations([res.data.result.geometry.location.lat,res.data.result.geometry.location.lng], res.data.result.formatted_address) 
					else if(latlng)
						this.setUserLocations(latlng, res.data.results[0].formatted_address);
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

	setUserLocations(lat_lng, formatted_address){
		this.setSliderLoader();
		this.setState({settingUserLocation : true});
		let cart_id = window.readFromLocalStorage('cart_id');
		if(cart_id){
			let url = this.state.apiEndPoint + "/anonymous/cart/change-location";
			let body = {
				cart_id : cart_id,
				lat_long : lat_lng,
				formatted_address : formatted_address
			};
			axios.post(url, body)
			.then((res) => {
				this.removeSliderLoader();
				this.updateLocationUI(lat_lng, formatted_address);
				this.setState({ fetchingGPS : false, searchText : '', settingUserLocation : false});
				this.closeGpsModal();

			})
			.catch((error)=>{
				this.removeSliderLoader();
				this.setState({ fetchingGPS : false, settingUserLocation : false});
				console.log("error in updating cart location ==>", error);
				let msg = error.message ? error.message : error;
				this.setState({locError : msg});
			})
		}
		else{
			this.removeSliderLoader();
			this.setState({ fetchingGPS : false, searchText: '', settingUserLocation : false});
			this.updateLocationUI(lat_lng, formatted_address);
			this.closeGpsModal();
		}		
	}

	updateLocationUI(lat_lng, formatted_address){
		// document.cookie = "lat_lng=" + lat_lng[0] + ',' +lat_lng[1] + ";path=/";
		// document.cookie = "formatted_address=" + formatted_address + ";path=/";
		window.writeInLocalStorage('lat_lng', lat_lng[0] + ',' +lat_lng[1]);
		window.writeInLocalStorage('formatted_address', formatted_address);
		window.lat_lng = lat_lng;
		window.formatted_address = formatted_address;
		document.querySelector("#selected-location-address").innerHTML = '<div>' + formatted_address + '</div><i class="fas fa-pencil-alt number-edit cursor-pointer"></i>';
		let cart_address = document.querySelector("#cart-delivery-address");
		if(cart_address){
			cart_address.innerHTML = formatted_address;
			
			let cart_add_trigger = document.querySelector("#cart-address-change-trigger");
			if(cart_add_trigger && document.getElementById("root").classList.contains('active')){
				cart_add_trigger.click();
			}
		}
	}

	getLocation(){
		this.setSliderLoader();
		this.setState({locations : [], fetchingGPS : true})
		let geoOptions = {
			maximumAge: 30 * 60 * 1000,
			timeout: 20 * 1000,
			enableHighAccuracy : true
		}
		navigator.geolocation.getCurrentPosition((position) => {
			console.log("position ==>", position.coords);
			this.reverseGeocode(null, [position.coords.latitude, position.coords.longitude]);
		},
		(geoError) =>{
			this.removeSliderLoader();
			this.setState({fetchingGPS : false});
			console.log("error in getting geolocation", geoError);
			if(geoError.code === 1){
				// permission denied
				this.setState({gpsError : 'You have blocked Green Grain Bowl from tracking your location. To use this, change your location settings in browser.'})
			}
			else{
				// other errors
				this.setState({gpsError : 'Error in getting current location using GPS'});
			}
		},geoOptions);
	}

	fetchAddresses(idToken){
		let headers = {
			Authorization : 'Bearer '+ idToken
		}
		let url = this.state.apiEndPoint + "/user/get-addresses";
		axios.get(url, {headers :  headers })
			.then((res) => {
				this.setState({ addresses : res.data.addresses });
				// this.setDefaultAddress(res.data.addresses)
			})
			.catch((error)=>{
				console.log("error in fetch addresses ==>", error);
			})
	}

	setDefaultAddress(addresses){
		if(!window.lat_lng){
			let default_address = addresses.find((address) => {return address.address.default});
			console.log("check default address ==>", default_address);
			if(default_address){
				this.setUserLocations(default_address.address.lat_long, default_address.address.formatted_address);
			}
		}
	}

	closeGpsModal(){
		document.querySelector('#gpsModal').classList.remove('visible');
		window.removeBackDrop();
	}

	showSignInScreen(){
		window.showSignInModal(true);
	}

	setSliderLoader(){
		window.addCartLoader();
		// document.querySelector('#react-add-delivery-address-container').classList.add('slider-loader');
	}

	removeSliderLoader(){
		window.removeCartLoader();
		// document.querySelector('#react-add-delivery-address-container').classList.remove('slider-loader');
	}

}

let domContainer = document.querySelector('#react-add-delivery-address-container');
const gpsModalPromptComponent = ReactDOM.render(e(gpsModalPrompt), domContainer);


window.showGpsModalPrompt = (display, addresses = null) => {
	gpsModalPromptComponent.setState({showNoAddressMsg : false, locations : [], locError : '', gpsError : '', fetchingGPS : false, searchText : '', settingUserLocation : false});
	document.querySelector('#gpsModal').classList.add('visible');
	window.addBackDrop();
	window.checkPushNotificationPermissions();
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
