import React, { Component } from 'react';
import axios from 'axios';
import Header from '../header/header.js';
import './add-new-address.scss'
import GoogleMap from '../google-map/google-map';
import { generalConfig } from '../config.js';
import * as _ from 'underscore';

import homeLocation from '../../assets/images/home_location.png';
import addressLocation from '../../assets/images/address_location.png';
import officeLocation from '../../assets/images/office_location.png';

const CancelToken = axios.CancelToken;
let cancel;
let debounceTimer;
class AddNewAddress extends Component {
    constructor(props) {
        super(props);
        this.handleCenter = this.handleCenter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            apiEndPoint: generalConfig.apiEndPoint,
            locError: '',
            gpsError: '',
            showLoader: false,
            showUserDetailsFields: false,
            address: '',
            landmark: "",
            building: "",
            latlng: {
                lat: '15.49359569999',
                lng: '73.8301322'
            },
            address_type: 'Home',
            addressInput: false,
            locations: [],
            searchText: '',
            address_obj: {
                formatted_address: '',
                city: '',
                state: '',
                pincode: '',
            },
            name: '',
            email: '',
            btnLable: 'Add Address',
            errors: {
                building: '',
                landmark: '',
                name: '',
                type: '',
                email: ''
            }
        };
        this.setInitData();

    }
    static getDerivedStateFromProps(props, state) {
        let returnState = {}
        if (window.firebase.auth().currentUser.isAnonymous) {
            returnState['showUserDetailsFields'] = true;
        } else {
            if (window.userDetails) {
                if (window.userDetails.name == '' || window.userDetails.email == '') {
                    returnState['showUserDetailsFields'] = true;
                }
                if (state.name == '') {
                    returnState["name"] = window.userDetails.name;
                }
                if (state.email == '') {
                    returnState["email"] = window.userDetails.email;
                }
                returnState["phone"] = window.userDetails.phone;
            } else {
                returnState['showUserDetailsFields'] = true;
            }
        }

        if (props.cartRequest) {
            returnState["btnLable"] = "Save and Proceed";
        }
        return returnState;
    }

    setInitData() {
        try {
            window.addCartLoader();
            if (this.props.location) {
                console.log(this.props.location, 'setInitData')
                this.setState({ latlng: { lat: this.props.location.state.lat_lng[0], lng: this.props.location.state.lat_lng[1] } })
                this.setState({ address: this.props.location.state.formatted_address })
                window.removeCartLoader();
            } else {
                let cart_id = window.readFromLocalStorage(generalConfig.site_mode + '-cart_id-' + generalConfig.businessId)
                console.log("setInitData ====>", cart_id)
                if (cart_id) {
                    window.removeCartLoader();
                    window.getCartByID(cart_id).then(cart => {
                        console.log("fetch cart response ==>", cart);
                        cart = JSON.parse(JSON.stringify(cart));
                        console.log("fetch cart response ==>", cart.shipping_address);
                        let address = cart.shipping_address.formatted_address || "";
                        let latlng = { lat: cart.shipping_address.lat_long[0], lng: cart.shipping_address.lat_long[1],address}
                        let landmark = cart.shipping_address.landmark || '';
                        let name = cart.shipping_address.name || '';
                        let email = cart.shipping_address.email || '';
                        let building = cart.shipping_address.address || '';
                        let address_type = cart.shipping_address.type || 'Home';
                        this.setState({ latlng: latlng, landmark, name, email, building, address_type, address })
                        this.reverseGeocode(latlng);
                    })


                } else {
                    this.displayError("Cart not found.")
                }
                window.removeCartLoader();

            }
        } catch (error) {
            window.removeCartLoader();
            this.displayError(error)
        }

    }

    render() {
        return (
            <div className="address-container">
                <Header />
                <div className="map-container">
                    <GoogleMap handleCenter={this.handleCenter} latlng={this.state.latlng} />
                    <div id="marker"><i className="fas fa-map-marker-alt"></i></div>
                    <div id="marker"><i class="fas fa-map-marker-alt"></i></div>
                </div>
                <div className="p-15">
                    <div className="position-relative title-wrap pl-0">
                        {/* <button className="btn btn-reset btn-back p-0"><i class="fa fa-arrow-left font-size-20" aria-hidden="true"></i></button> */}
                        <h3 className="mt-4 h1 ft6">Set a delivery address</h3>
                    </div>
                    <div className="list-text-block p-15 mb-4 mt-4">
                        <div className="font-weight-light h5 mb-0">
                            <span class="font-weight-semibold d-block mb-2">Delivery area</span>
                            {this.state.showLoader ? <div>Address is loading...</div> : this.state.address}
                            {this.state.addressInput ? this.getChangeAddressInput() : this.state.address ? <span className="text-green d-inline-block cursor-pointer" onClick={this.changeAddress}>. Change</span> : null}
                        </div>
                    </div>
                    <form className="add-address-form">
                        <div>
                            {this.getAddressTypeRadio()}
                        </div>
                        <div className="secure-checkout fixed-bottom visible bg-white p-15">
                            <button className="btn btn-primary btn-arrow-icon w-100 p-15 rounded-0 text-left position-relative h5 ft6 mb-0 d-flex align-items-center justify-content-between text-capitalize" onClick={this.handleSubmit}>
                                <span className="zindex-1">{this.state.btnLable}</span>
                                <i class="text-white fa fa-arrow-right font-size-20" aria-hidden="true"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    getAddressTypeRadio = () => {
        const { errors } = this.state
        return (
            <div>
                <label className="d-block mb-4">
                    House/Flat/Block no<span className='error d-inline-block ml-1'>*</span>
                    <input type="text" name='building' value={this.state.building} class="d-block w-100 rounded-0 input-bottom" onChange={(e) => { this.setState({ 'building': e.target.value }); this.handleChange(e) }} required />
                    {errors.building.length > 0 && <span className='error'>{errors.building}</span>}
                </label>
                <label className="d-block mb-4">
                    Landmark<span className='error d-inline-block ml-1'>*</span>
                    <input type="text" name='landmark' value={this.state.landmark} class="d-block w-100 rounded-0 input-bottom" onChange={(e) => { this.setState({ 'landmark': e.target.value }); this.handleChange(e) }} required />
                    {errors.landmark.length > 0 && <span className='error'>{errors.landmark}</span>}
                </label>

                {this.state.showUserDetailsFields ? this.showUserDetailsFields() : null}
                <h5 className="ft6 mb-4">Save as</h5>

                <div className="d-flex mb-3">
                    <div className="radio d-inline-block pr-5">
                        <label className="text-center">
                            <input class="invisible position-absolute radio-input" type="radio" onChange={this.handleAddressTypeChange} value="Home" checked={this.state.address_type === 'Home'} />
                            <img src={homeLocation} className="mb-1" height="30" />
                            <span className="radio-text d-block">Home</span>
                        </label>
                    </div>
                    <div className="radio d-inline-block pr-5">
                        <label className="text-center">
                            <input class="invisible position-absolute radio-input" type="radio" onChange={this.handleAddressTypeChange} value="Work" checked={this.state.address_type === 'Work'} />
                            <img src={officeLocation} className="mb-1" height="30" />
                            <span className="radio-text d-block">Work</span>
                        </label>
                    </div>
                    <div className="radio d-inline-block">
                        <label className="text-center">
                            <input class="invisible position-absolute radio-input" type="radio" onChange={this.handleAddressTypeChange} value="Other" checked={this.state.address_type === 'Other'} />
                            <img src={addressLocation} className="mb-1" height="30" />
                            <span className="radio-text d-block">Other</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    getChangeAddressInput = () => {
        return (
            <div>
                {this.showLocationSearch()}
                <ul className="location-list" style={{ listStyle: 'none' }}>
                    {this.getAutoCompleteLocations()}
                </ul>

            </div>
        );
    }

    showLocationSearch() {
        if (!this.state.fetchingGPS)
            return (
                <div className="mt-3 position-relative">
                    <input className="border-grey-2 w-100 rounded-0 p-3 mb-0 w-100 search-input plceholder-text" type="search" placeholder="search for area, street name" value={this.state.searchText} onChange={e => { this.autoCompleteLocation(e.target.value) }} />
                    <button className="search-close" onClick={this.changeAddress}><i class="fas fa-times"></i></button>
                </div>
            );
    }

    getAutoCompleteLocations() {
        if (this.state.locations.length) {
            let locs = this.state.locations.map((loc) =>
                <li className="mb-3" key={loc.id} onClick={() => this.reverseGeocode({ loc: loc })}>
                    {loc.description}
                </li>
            );
            return locs;
        }
        if (this.state.showLoader && !this.state.locations.length) {
            return (
                <div>
                    {/* Need better loader */}
                    <i >loading...</i>
                </div>
            )
        }
    }

    closeAddAddress = (e) => {
        if (this.props.cartRequest) {
            this.props.closeAddAddress()
        }
    }

    handleCenter = (mapProps, map) => {
        this.setState({ 'landmark': '', 'latlng': { lat: map.getCenter().lat(), lng: map.getCenter().lng() } });
        //  console.log(map.getCenter().lat(), map.getCenter().lng())
        this.reverseGeocode({ 'lat': map.getCenter().lat(), 'lng': map.getCenter().lng() });
    }


    handleAddressTypeChange = (e) => {
        this.setState({ 'address_type': e.target.value })
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        let errors = this.state.errors;
        switch (name) {
            case "name":
                errors.name = value.length > 1 ? '' : 'required';
                break;
            case "email":
                if (value.length < 1) {
                    errors.email = 'required'
                } else if (!window.validEmailRegex.test(value)) {
                    errors.email = "Please enter valid email";
                } else {
                    errors.email = ''
                }
                break;
            case "landmark":
                errors.landmark = value.length > 1 ? '' : 'required';
                break;
            case "building":
                errors.building = value.length > 1 ? '' : 'required';
                break;
            default:
                break;
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        window.addCartLoader()
        let errors = this.state.errors;
        let error = false
        if (this.state.name.length < 1) {
            errors.name = "required";
            error = true;
        }
        if (this.state.email.length < 1) {
            errors.email = "required"
            error = true;
        } else if (!window.validEmailRegex.test(this.state.email)) {
            errors.email = "Please enter valid email";
            error = true;
        }
        if (this.state.landmark.length < 1) {
            errors.landmark = 'required';
            error = true;
        }
        if (this.state.building.length < 1) {
            errors.building = 'required';
            error = true;
        }
        if (error) {
            window.removeCartLoader();
            this.setState({ "errors": errors });
            return false;
        }

        let data = {
            name: this.state.name,
            email: this.state.email,
            phone: this.state.phone,
            lat_long: [this.state.latlng.lat, this.state.latlng.lng],
            address: this.state.building,
            landmark: this.state.landmark,
            type: this.state.address_type,
            set_default: false
        }

        try {
            window.addAddress({ ...this.state.address_obj, ...data }).then(address => {
                window.updateSavedAddressUI()
                if (this.props.cartRequest) {
                    this.props.assignAndProceed(null, address.id)
                }
            }).catch(err => {
                console.log(err)
            })


        } catch (err) {
            window.removeCartLoader()
            console.log(err)
        }
    }

    showUserDetailsFields() {
        const { errors } = this.state;
        return (
            <div className="user-details">
                <h5 className="ft6 mb-4">Account details</h5>
                <label className="d-block mb-4">
                    Full Name<span className='error d-inline-block ml-1'>*</span>
                    <input type="text" name="name" className="d-block w-100 rounded-0 input-bottom" onChange={(e) => { this.setState({ name: e.target.value }); this.handleChange(e) }} value={this.state.name} required />
                    {errors.name.length > 0 && <span className='error'>{errors.name}</span>}
                </label>

                <label className="d-block mb-4">
                    Email<span className='error d-inline-block ml-1'>*</span>
                    <input type="email" name="email" className="d-block w-100 rounded-0 input-bottom" onChange={(e) => { this.setState({ email: e.target.value }); this.handleChange(e) }} value={this.state.email} required />
                    {errors.email.length > 0 && <span className='error'>{errors.email}</span>}
                </label>
            </div>
        );
    }

    changeAddress = (e) => {
        e.preventDefault();
        this.setState({ 'addressInput': !this.state.addressInput, 'searchText': '' });
    }

    async reverseGeocode(obj) {
        console.log(obj)
        this.setState({ locError: '' });
        this.setState({ showLoader: true });
        if(!obj.address) {
            this.setState({ address: null });
        }
        let url = this.state.apiEndPoint + "/reverse-geocode";
        let body = {};

        if (obj.loc) {
            body.place_id = obj.loc.place_id;
        } else if (obj.lat && obj.lng) {
            body.latlng = obj.lat + ',' + obj.lng;
            if (! await this.isAddressDeliverable([obj.lat, obj.lng])) {
                this.displayError("Cannot deliver to this address. :(")
                return false;
            }
        }

        axios.get(url, { params: body })
            .then(async (res) => {
                let res_address = {};
                if (res.data.status === "OK") {
                    if (obj.loc) {
                        res_address = res.data.result
                        if (! await this.isAddressDeliverable([res.data.result.geometry.location.lat, res.data.result.geometry.location.lng])) {
                            this.displayError("Cannot deliver to this address. :(")
                            return false;
                        }
                        this.setState({ 'latlng': { lat: res.data.result.geometry.location.lat, lng: res.data.result.geometry.location.lng } });
                        this.setState({ 'locations': [], 'addressInput': false });
                    } else if (obj.lat && obj.lng) {
                        res_address = res.data.results[1]

                    }
                    if(!obj.address) {
                        this.setState({ "address": res_address.formatted_address });
                    }
                    let city = '', state = '', pincode = '';
                    _.forEach(res_address.address_components, (obj) => {
                        if (_.include(obj.types, 'locality')) {
                            city = obj.long_name;
                        }
                        if (_.include(obj.types, 'administrative_area_level_1')) {
                            state = obj.long_name;
                        }
                        if (_.include(obj.types, 'postal_code')) {
                            pincode = obj.long_name;
                        }

                    })
                    let formatted_address = ''
                    if(obj.address) {
                        formatted_address = obj.address
                    } else {
                        formatted_address = res_address.formatted_address
                    }
                    this.setState({ address_obj: { formatted_address, state: state, city: city, pincode: pincode } })
                    this.setState({ showLoader: false })

                }
                else {
                    this.setState({ locError: res.data.error_message })
                    this.setState({ showLoader: false });
                }
                return;
            })
            .catch((error) => {
                this.setState({ showLoader: false });
                let msg = error.message ? error.message : error;
                this.setState({ locError: msg })
                this.displayError(msg)
                return;
            })
    }

    autoCompleteLocation = (value) => {
        clearTimeout(debounceTimer);
        this.setState({ searchText: value });
        debounceTimer = setTimeout(() => {
            console.log("autoCompleteLocation =>", value);
            this.setState({ locError: '' });
            if (value.length > 2) {
                let url = this.state.apiEndPoint + "/places-autocomplete";
                let body = {
                    input: value
                }
                this.setState({ showLoader: true, locations: [] })
                cancel && cancel();
                axios.get(url, {
                    params: body,
                    cancelToken: new CancelToken((c) => {
                        cancel = c;
                    })
                })
                    .then((res) => {
                        this.setState({ showLoader: false })
                        if (res.data.status === "OK")
                            this.setState({ locations: res.data.predictions })
                        else {
                            //display error
                            this.setState({ locError: res.data.error_message })
                        }
                    })
                    .catch((error) => {
                        // this.setState({showLoader : false})
                        console.log("error in autoCompleteLocation ==>", error);
                        // let msg = error.message ? error.message : error;
                        // this.setState({locError : msg})
                    })
            }
            else {
                this.setState({ locations: [] })
            }
        }, 600);
    }

    isAddressDeliverable(lat_lng) {

        return window.getCurrentStockLocation().then(locations => {
            if (!locations.length) {
                this.displayError("Something went wrong...")
                return false;
            }
            let deliverable = window.findDeliverableLocation(locations, lat_lng)

            return !!deliverable

        })

    }


    displayError(msg) {
        // document.querySelector('#failure-toast').innerHTML = msg;
        // document.querySelector('#failure-toast').classList.remove('d-none');
        // document.querySelector('#failure-toast-close-btn').classList.remove('d-none');
        // setTimeout(()=>{
        // 	document.querySelector('#failure-toast').classList.add('d-none');
        // 	document.querySelector('#failure-toast-close-btn').classList.add('d-none');
        // },30000)
        window.displayError(msg);
    }

}

export default AddNewAddress;