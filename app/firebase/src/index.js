
// Your web app's Firebase configuration

// Initialize Firebase
console.log("initialising firebase");
firebase.initializeApp(allConfig.firebaseConfig)
var db = firebase.firestore();
// initialiseMessaging();

// function initialiseMessaging(){
//     try{
//         const messaging = firebase.messaging();
//         messaging.usePublicVapidKey("BJplW7H_YA8Ii_slb0DTqh8U9UsuexByioSBOk4xKxAwdw2xcqUwzTTNy2HSvs_MncRZHRtUwsQ6nQqFSonHEaA");

//         // monitor refresh token
//         messaging.onTokenRefresh(() => {
//           messaging.getToken().then((refreshed_token) => {
//             console.log('Token refreshed.', refreshed_token);
//             updateToken(refreshed_token);
//           }).catch((err) => {
//             console.log('Unable to retrieve refreshed token ', err);
//             showToken('Unable to retrieve refreshed token ', err);
//           });
//         });


//         messaging.onMessage((payload) => {
//           console.log('Message received. ', payload);
//         });


//         navigator.serviceWorker.addEventListener("message", (message) => {
//             console.log("check ==>",message)
//             let data = message.data['firebase-messaging-msg-data'].notification;
//             const notificationTitle = data.title;
//               const notificationOptions = {
//                 body: data.body,
//                 icon: data.icon
//             };

//             navigator.serviceWorker.getRegistration()
//             .then( function(reg){
//                 if(reg) {
//                 reg.showNotification(notificationTitle, notificationOptions);
//                } else {
//                  console.log('GOT undefined');
//                }
//             });
//         });

//     }
//     catch(error){
//         console.log("error messaging==>", error);
//     }    
// }
// // firebase messaging - push notitifcations



// function checkPushNotificationPermissions(){
//     if(show_pn && 'Notification' in window && navigator.serviceWorker){
//         askPermissions();
//     }
// }


// function askPermissions(){
//     Notification.requestPermission()
//     .then( () => {
//         messaging.getToken().then((current_token) => {
//             if (current_token) {
//                 console.log("fcm token =>",current_token);
//                 updateToken(current_token);
//             } 
//           else {
//             // Show permission request.
//             console.log('No Instance ID token available. Request permission to generate one.');
//             // Show permission UI.
//             // updateUIForPushPermissionRequired();
//             // setTokenSentToServer(false);
//           }
//         }).catch((err) => {
//           console.log('An error occurred while retrieving token. ', err);
//           // showToken('Error retrieving Instance ID token. ', err);
//           // setTokenSentToServer(false);
//         });
//     })
//     .catch(function(err) {
//         console.log("Unable to get permission to notify.", err);
//     });
// }

// function updateToken(token){
//      let old_token = readFromLocalStorage('fcm_token')
//     if(!old_token || old_token != token){
//         sendTokenToServer(token);
//         writeInLocalStorage('fcm_token', token)
//     }
// }

// function sendTokenToServer(token){
//     let url = 'https://asia-east2-project-ggb-dev.cloudfunctions.net/api/rest/v1/store-fcm-token';
//     // let url = 'http://localhost:5000/project-ggb-dev/asia-east2/api/rest/v1/store-fcm-token';
//     var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//     let body = {
//         fcm_token : token,
//         device : isMobile ? 'mobile' : 'desktop'
//     }
//     axios.get(url, {params : body})
//         .then((res) => {
//             console.log("fcm token stored successfully");
//         })
//         .catch((error)=>{
//             console.log("error in storing fcm token ==>", error);
//         })
// }
// // end of firebase messaging - push notitifcations


var products = [];
var cartData;
var stockLocations = []
var userAddresses = [];
var userDetails;
var cartIdLabel = allConfig.businessConfig.siteMode + '-cart_id-' + allConfig.businessConfig.businessId
anomynousSignIn();
syncProducts();
syncLocations()
syncAddresses();
syncUserDetails();
if (window.readFromLocalStorage(cartIdLabel)) {
    sycnCartData(window.readFromLocalStorage(cartIdLabel));
}

function anomynousSignIn() {
    let unsubscribeOnAuthStateChanged = firebase.auth().onAuthStateChanged((user) => {
        console.log("check user ==>", user);
        if (user) {
            console.log("user exist");
            // this.variantPopUp(action);
        }
        else {
            console.time('signin')
            this.signInAnonymously();
            // console.timeEnd('signin')
        }
        unsubscribeOnAuthStateChanged();
    });
}

function signInAnonymously() {
    firebase.auth().signInAnonymously()
        .then((res) => {
            return;
        })
        .catch((error) => {
            return
            console.log("error in anonymous sign in", error);
        });
}

function syncProducts() {
    let query = db.collection('products');
    query.onSnapshot(function (snapshot) {
        if (!snapshot.size) {
            products = [];
        }

        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                let data = change.doc.data();
                data.id = change.doc.id;
                products.push(data);
            }
            if (change.type === "modified") {
                //update variant
                let data = change.doc.data();
                data.id = change.doc.id;
                let index = products.findIndex((product) => { return product.id == change.doc.id });
                products[index] = data;
            }
            if (change.type === "removed") {
                // remove variant
            }
        });
    });
}

function syncLocations() {
    let query = db.collection('locations');
    query.onSnapshot(function (snapshot) {
        if (!snapshot.size) {
            stockLocations = [];
        }

        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                let data = change.doc.data();
                data.id = change.doc.id;
                stockLocations.push(data);
            }
            if (change.type === "modified") {
                //update variant
            }
            if (change.type === "removed") {
                // remove variant
            }
        });
    });
}


var unsubscribeAddressListner
function syncAddresses() {
    let unsubscribeOnAuthStateChanged = firebase.auth().onAuthStateChanged((user) => {
        if (user) {

            if (unsubscribeAddressListner) {
                unsubscribeAddressListner();
            }
            let query = db.collection('user-details').doc(firebase.auth().currentUser.uid).collection('addresses');
            unsubscribeAddressListner = query.onSnapshot(function (snapshot) {
                if (!snapshot.size) {
                    userAddresses = [];
                }

                snapshot.docChanges().forEach(function (change) {
                    if (change.type === "added") {
                        let data = change.doc.data();
                        data.id = change.doc.id;
                        userAddresses.push(data);
                    }
                    if (change.type === "modified") {
                        //update variant
                    }
                    if (change.type === "removed") {
                        // remove variant
                    }
                });
            });
        }
        // unsubscribeOnAuthStateChanged();
    });
}

var unsubscribeUserDetailsListner
function syncUserDetails() {
    let unsubscribeOnAuthStateChanged = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if (unsubscribeUserDetailsListner) {
                unsubscribeUserDetailsListner();
            }

            let query = db.collection('user-details').doc(firebase.auth().currentUser.uid);
            unsubscribeUserDetailsListner = query.onSnapshot(function (doc) {
                if (doc.exists)
                    userDetails = doc.data();
            });
        }
        // unsubscribeOnAuthStateChanged();
    });
}

async function getUserDetails() {
    if (window.userDetails) {
        return userDetails
    }
    let user_details = await db.collection('user-details').doc(firebase.auth().currentUser.uid).get();
    if (user_details.exists) {
        return user_details.data();
    }
    return null;
}


async function getAllStockLocations() {
    let location_ref = await db.collection('locations').get()
    let all_locations = location_ref.docs.map(doc => {
        let obj = doc.data();
        obj.id = doc.id;
        return obj;
    });
    return all_locations;
}

async function fetchProduct(product_id) {
    let product = await db.collection('products').doc(product_id).get();
    let product_obj = product.data();
    product_obj.id = product.id;
    console.log("async fetch product ==>", product_obj);
    return product_obj;
}

var unsubscribeCartListner;

function sycnCartData(id) {
    if (unsubscribeCartListner)
        unsubscribeCartListner();
    let query = db.collection('carts').doc(id);
    unsubscribeCartListner = query.onSnapshot(function (doc) {
        if (doc.exists)
            cartData = doc.data();
    });
}

async function getCartByID(id) {
    if (cartData) {
        return cartData;
    }
    else if (id) {
        let cart = await db.collection('carts').doc(id).get();
        if (cart.exists) {
            return cart.data();
        }
        return null;
    }
    return null;
}

async function updateOrder(item, cart_id, cart_data, stock_location_id) {

    cart_data.summary.mrp_total += item.attributes.mrp * item.quantity;
    cart_data.summary.sale_price_total += item.attributes.sale_price * item.quantity;
    cart_data.summary.you_pay = (cart_data.summary.sale_price_total - cart_data.summary.cart_discount) + cart_data.summary.shipping_fee;
    cart_data.cart_count += item.quantity;
    cart_data.stock_location_id = stock_location_id;

    console.log("in update order :cart items ==>", cart_data.items);
    if (cart_data.items.length) {
        let index = cart_data.items.findIndex((i) => { return i.variant_id == item.variant_id })
        if (index !== -1) {
            console.log("item already in cart");
            cart_data.items[index].quantity += item.quantity;
            cart_data.items[index].timestamp = new Date().getTime();
        }
        else {
            console.log("new item");
            let order_line_item = formateOrderLine(item);
            cart_data.items[cart_data.items.length] = order_line_item;
        }
    }
    else {
        let order_line_item = formateOrderLine(item);
        cart_data.items = [order_line_item];
    }
    console.log("cart data before set ==>", cart_data);
    if (cart_data.hasOwnProperty('order_id')) {
        cart_data.order_id = ''
    }

    try {

        console.time("db carts update")
        await db.collection('carts').doc(cart_id).set(cart_data);
        console.timeEnd("db carts update")
        if (cart_data.summary.cart_discount) {
            let resP = await window.recalculateCart(cart_data)
            console.time("cart sync")
            sycnCartData(cart_id);
            console.timeEnd("cart sync")
            return resP.data.cart
        }
        console.time("cart sync")
        sycnCartData(cart_id);
        console.timeEnd("cart sync")
        return cart_data;
    } catch (error) {
        console.log(error)
        return cart_data;
    }
}

function formateOrderLine(item) {
    console.log("formateOrderLine items ==> ", item);

    let order_line_item = {
        variant_id: item.variant_id,
        quantity: item.quantity,
        product_name: item.attributes.title,
        description: item.attributes.description,
        mrp: item.attributes.mrp,
        sale_price: item.attributes.sale_price,
        veg: item.attributes.veg,
        size: item.attributes.size,
        product_id: item.product_id,
        slot: item.attributes.slot,
        day: item.attributes.day,
        timestamp: new Date().getTime()
    }
    return order_line_item;
}


function findDeliverableLocation(locations, lat_long) {
    console.log(lat_long, locations);

    console.time("findDeliverableLocation", lat_long)
    let deliverble, min_diff = 9999999;

    locations.forEach((loc) => {
        let diff = headingDistanceTo(lat_long[0], lat_long[1], loc.lat_long.lat, loc.lat_long.long);
        console.log("radius diff==>", diff);

        //if(diff < loc.radius && diff < min_diff){ // radius compare
        if (diff < min_diff) {
            min_diff = diff;
            deliverble = loc;
            return
        }
    })
    console.timeEnd("findDeliverableLocation")
    console.log("closest deliverable ==>", deliverble);
    return deliverble;
}

function headingDistanceTo(lat1, lon1, lat2, lon2) {
    console.log("check cordinates ==>", lat1, lon1, lat2, lon2);
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344 * 1000;
        console.log("distance ==>", dist);
        return dist;
    }
}


async function removeItemFromCart(variant_id, cart_id, quantity) {
    try {
        let cart_data = await window.getCartByID(cart_id);
        let index = cart_data.items.findIndex((item) => item.variant_id == variant_id);
        let item_data = cart_data.items[index];
        let new_quantity = Number(item_data.quantity) - quantity;

        if (new_quantity <= 0) {
            cart_data.summary.mrp_total -= item_data.mrp * item_data.quantity;
            cart_data.summary.sale_price_total -= item_data.sale_price * item_data.quantity;
            cart_data.cart_count -= item_data.quantity;
            if (cart_data.cart_count == 0) {
                cart_data.shipping_fee = 0;
                cart_data.applied_coupon = {}
                cart_data.summary.cart_discount = 0
            }
            cart_data.items.splice(index, 1);
        } else {

            cart_data.summary.mrp_total -= item_data.mrp * quantity;
            cart_data.summary.sale_price_total -= item_data.sale_price * quantity;
            cart_data.cart_count = Number(cart_data.cart_count) - quantity;
            cart_data.items[index].quantity = new_quantity
        }
        cart_data.summary.you_pay = (cart_data.summary.sale_price_total - cart_data.summary.cart_discount) + cart_data.summary.shipping_fee;
        if (cart_data.hasOwnProperty('order_id')) {
            cart_data.order_id = ''
        }
        await db.collection("carts").doc(cart_id).set(cart_data);
        let summaryRes = cart_data.summary
        if (cart_data.summary.cart_discount) {
            let resP = await window.recalculateCart(cart_data)
            summaryRes = resP.data.cart.summary;
        }
        let response = {
            "message": "Successfully updated the cart",
            "cart_count": cart_data.cart_count,
            "summary": summaryRes,
            success: true
        }
        return response;

    }
    catch (error) {
        console.log("error in remove item from cart ==>", error);
        let res = {
            success: false,
            message: error,
        }
        return res;
    }
}


async function fetchCart(cart_id) {
    let cart_data = await window.getCartByID(cart_id);
    let products = window.products;
    let items = [], response;
    cart_data = JSON.parse(JSON.stringify(cart_data));
    if (cart_data && cart_data.order_type) {
        cart_data.items.forEach((item) => {
            let product = products.find((product) => { return product.id == item.product_id })
            let deliverable = true; //check if deliverable
            let in_stock = true;     // check if in stock
            if (!cart_data.stock_location_id) {
                deliverable = false;
            }
            else {
                let variant = product.variants.find((v) => { return v.id == item.variant_id });
                let stock_location = variant.stock_locations.find((stock) => { return stock.id == cart_data.stock_location_id })
                if (stock_location) {
                    if (stock_location.quantity < item.quantity) {
                        // in_stock = false;
                    }
                } else {
                    // in_stock = false;
                }

            }
            let formatted_item = {
                variant_id: item.variant_id,
                attributes: {
                    title: item.product_name,
                    images: {
                        "1x": product.image_urls[0]
                    },
                    size: item.size,
                    price_mrp: item.mrp,
                    price_final: item.sale_price,
                    discount_per: 0,
                    slot: item.slot,
                    day: item.day

                },
                availability: in_stock,
                quantity: item.quantity,
                timestamp: item.timestamp,
                deliverable: deliverable,
                product_id: product.id
            }
            items.push(formatted_item);
        })

        cart_data.items = items;
        response = {
            success: true,
            cart: cart_data,
            coupon_applied: null,
            coupons: []
        }
    }
    else {
        cart_data.items = items;
        response = {
            success: true,
            cart: cart_data,
            coupon_applied: null,
            coupons: []
        }
    }

    return response;

}


async function addToCart(site_mode, variant_id = null, lat_long = null, cart_id = null, formatted_address = null, product) {
    try {
        console.log(" addToCart product ==>", product);

        let stock_location_id, quantity = 1, locations = [], location;
        let cart_data;
        let user_id = firebase.auth().currentUser.uid;
        console.time("fetch variant")
        let variant = product.variants.find((v) => v.id === variant_id);
        console.timeEnd("fetch variant")
        console.log("addToCart varaint ==>", variant);


        // this check is done to avoid getting cart if cart does not exist
        // user_id is not used as user is creted as on click of add to cart and will exist at this point but cart may not exist
        if (cart_id) {
            console.time("fetch cart by id Time")
            cart_data = await window.getCartByID(await window.brewCartId(allConfig.businessConfig.siteMode, allConfig.businessConfig.businessId));
            console.timeEnd("fetch cart by id Time")
        }

        if (cart_data == undefined || cart_data.order_type == undefined) {
            console.time("getNewCartData")
            cart_data = getNewCartData(lat_long, formatted_address, site_mode);
            console.timeEnd("getNewCartData")
            console.time("writeInLocalStorage")
            window.writeInLocalStorage(cartIdLabel, window.brewCartId(site_mode, allConfig.businessConfig.businessId));
            console.timeEnd("writeInLocalStorage")
        }
        console.log(" add to cart, cart data ==>", cart_data);

        // TODO : check if the item is already in cart and update the qunatity value accordingly.
        // create new variable called updated quantity

        let item_from_cart = cart_data.items ? cart_data.items.find((i) => { return i.variant_id == variant_id }) : 0;
        let new_quantity = quantity;
        if (item_from_cart) {
            new_quantity += item_from_cart.quantity;
        }

        if (cart_data.stock_location_id) {
            location = variant.stock_locations.find((loc) => { return loc.id == cart_data.stock_location_id });
            if (location && location.quantity < new_quantity) {
                throw 'Quantity Not Available';
            }
        }
        else {
            //new code
            if (!window.findDeliverableLocation(window.stockLocations, cart_data.shipping_address.lat_long)) {
                throw 'Not deliverable at your location';
            }
            //end of new code
            else {
                locations = variant.stock_locations.filter((loc) => { return loc.quantity >= new_quantity });
                if (locations && locations.length) {
                    location = window.findDeliverableLocation(locations, cart_data.shipping_address.lat_long)
                }
                else {
                    throw 'Quantity Not Available';
                }
            }
        }
        console.log("check deliverable_locations", location)
        if (location) {
            stock_location_id = location.id;
        }
        else {
            throw 'Quantity Not Available';
        }

        let item = {
            attributes: {
                title: product.title,
                images: product.image_urls,
                size: variant.size,
                mrp: variant.mrp,
                day: variant.day,
                slot: variant.slot,
                sale_price: variant.sale_price,
                discount_per: 0,
                description: product.description,
                veg: product.veg
            },
            quantity: quantity,
            variant_id: variant_id,
            product_id: product.id,
            timestamp: new Date().getTime()
        }
        console.time("updateOrder")
        let order_data = await window.updateOrder(item, window.brewCartId(site_mode, allConfig.businessConfig.businessId), cart_data, stock_location_id)
        console.timeEnd("updateOrder")

        console.log("update order data", order_data);

        let res = {
            success: true,
            message: 'Successfully added to cart',
            item: item,
            summary: order_data.summary,
            cart_count: order_data.cart_count,
            cart_id: order_data.id,
        }
        return res;
    }
    catch (error) {
        console.log("firestore function error in add to cart ==>", error);
        let res = {
            success: false,
            message: error,
        }
        return res;
    }
}


function getNewCartData(lat_long, formatted_address, site_mode) {
    let landmark = "";
    let flatNo = "";
    let addressId = "";
    let name = "";
    let email = "";
    let phone = "";
    if (!!window.readFromLocalStorage("saved_landmark")) {
        landmark = window.readFromLocalStorage("saved_landmark")
    }
    if (!!window.readFromLocalStorage("saved_address")) {
        flatNo = window.readFromLocalStorage("saved_address")
    }
    if (!!window.readFromLocalStorage("saved_address_id")) {
        addressId = window.readFromLocalStorage("saved_address_id")
    }
    if (!!window.readFromLocalStorage('saved_name')) {
        name = window.readFromLocalStorage('saved_name');
    }
    if (!!window.readFromLocalStorage('saved_email')) {
        email = window.readFromLocalStorage('saved_email');
    }
    if (!!window.readFromLocalStorage('saved_nos')) {
        phone = window.readFromLocalStorage('saved_nos');
    }
    let cart_data = {
        user_id: firebase.auth().currentUser.uid,
        summary: {
            mrp_total: 0,
            sale_price_total: 0,
            cart_discount: 0,
            shipping_fee: (site_mode == 'kiosk') ? 0 : 0, // get from config or db
            you_pay: (site_mode == 'kiosk') ? 0 : 50, // change accordingly
        },
        applied_coupon: {},
        order_mode: site_mode,
        order_type: 'cart',
        cart_count: 0,
        shipping_address: {
            name: name,
            phone: phone,
            email: email,
            landmark: landmark,
            address: flatNo,
            id: addressId,
            lat_long: lat_long,
            formatted_address: formatted_address
        },
        stock_location_id: '',
        verified: !firebase.auth().currentUser.isAnonymous,
        business_id: "zq6Rzdvcx0UrULwzeSEr",  // get from config or db
        mobile_number: firebase.auth().currentUser.phoneNumber ? firebase.auth().currentUser.phoneNumber : '',
        items: [],
        created_at: new Date().getTime()
    }
    return cart_data;
}

async function updateDeliveryLocation(lat_long, address, cart_id, savedAddress = false) {
    console.log("updateDeliveryLocation=>", savedAddress)
    let cart_data = await getCartByID(cart_id), locations;
    let landmark = ""
    let addressFlat = ""
    let formatted_address = address
    let addressId = ""
    if (window.stockLocations.length) {
        locations = window.stockLocations;
    }
    else {
        locations = await getAllStockLocations();
    }

    if (savedAddress) {
        landmark = address.landmark
        formatted_address = address.formatted_address
        addressId = address.id
        if (address.address) {
            addressFlat = address.address
        }
    }


    console.log("update delivery address all locations", locations, lat_long);
    let stock_location_id = '';

    let closest_deliverable_location = findDeliverableLocation(locations, lat_long)
    if (closest_deliverable_location) {
        stock_location_id = closest_deliverable_location.id;
    }


    console.log("update delivery address delivery id ==>", stock_location_id);
    await db.collection('carts').doc(cart_id)
        .update(
            {
                'shipping_address.lat_long': lat_long,
                'shipping_address.formatted_address': formatted_address,
                'stock_location_id': stock_location_id,
                'shipping_address.landmark': landmark,
                'shipping_address.address': addressFlat,
                'shipping_address.id': addressId
            })
    let res = { success: true, message: 'Address updated successfully' }
    return res;
}


async function getAddresses() {
    if (window.userAddresses.length) {
        return window.userAddresses
    }

    let addresses_ref = await db.collection('user-details').doc(firebase.auth().currentUser.uid).collection('addresses').get();
    let addresses = addresses_ref.docs.map(doc => {
        let obj = doc.data();
        obj.id = doc.id;
        return obj;
    });
    return addresses;
}

async function createCartForVerifiedUser(cart_id, siteMode, businessId) {
    let cart_data = await window.getCartByID(cart_id);
    if (cart_data) {
        cart_data.user_id = firebase.auth().currentUser.uid;
        cart_data.verified = true;
        await db.collection("carts").doc(window.brewCartId(siteMode, businessId)).set(cart_data);
        sycnCartData(window.brewCartId(siteMode, businessId));
    }
}

async function addAddress(addressObj) {
    //TODO : get UID from id token
    //userDetails_ref = await db.collection("user-details").doc(firebase.auth().currentUser.uid).get()
    await db.collection("user-details").doc(firebase.auth().currentUser.uid).update({
        name: addressObj.name,
        email: addressObj.email
    })
    console.log("addressObj ==>", addressObj, userDetails);
    let address_obj = {
        name: addressObj.name,
        email: addressObj.email,
        phone: userDetails && userDetails.phone ? userDetails.phone : '',
        address: addressObj.address,
        landmark: addressObj.landmark,
        city: addressObj.city,
        state: addressObj.state,
        pincode: addressObj.pincode ? addressObj.pincode : '',
        default: addressObj.set_default,
        lat_long: addressObj.lat_long,
        formatted_address: addressObj.formatted_address,
        type: addressObj.type,
        verified: !firebase.auth().currentUser.isAnonymous

    }
    let address_ref = await db.collection("user-details").doc(firebase.auth().currentUser.uid).collection('addresses').doc();
    await address_ref.set(address_obj);

    address_obj.id = address_ref.id;
    return address_obj
}

async function addUserDetails(userObj, cart_id) {
    await db.collection("user-details").doc(firebase.auth().currentUser.uid).update({
        name: userObj.name,
        email: userObj.email
    })
    await db.collection('carts').doc(cart_id).update({
        'shipping_address.name': userObj.name,
        'shipping_address.email': userObj.email,
        'shipping_address.phone': userObj.phone
    })
    return userObj;
}


async function getCurrentStockLocation() {
    let location = [];
    let cart_id = window.readFromLocalStorage(cartIdLabel);
    if (cart_id) {
        let cart = await getCartByID(cart_id);
        if (window.stockLocations.length) {
            location = window.stockLocations.filter((loc) => { return loc.id == cart.stock_location_id });
        } else {
            if (cart.stock_location_id) {
                location = await db.collection('locations').doc(cart.stock_location_id).get()
                if (location.exists) {
                    location = [location.data()];
                }
            }
        }
    }

    return location;

}

async function assignAddressToCart(address_id, fetchDraft, phoneNumber) {
    let order_line_items = [], items = [];
    let cart_id = window.readFromLocalStorage(cartIdLabel);
    if (!cart_id) {
        return { code: "PAYMENT_DONE" }
    }
    let cart = await window.getCartByID(cart_id);

    if (!cart.items.length) {
        return { code: "PAYMENT_DONE" }
    }
    let lat_lng = [], shipping_address
    if (fetchDraft) {
        shipping_address = cart.shipping_address
        if (phoneNumber) {
            shipping_address.phone = phoneNumber
        }
    } else {
        let address = userAddresses.filter((address) => { return address.id == address_id })[0]
        shipping_address = address
        window.writeInLocalStorage('saved_landmark', address.landmark);
        window.writeInLocalStorage('saved_address', address.address);
        window.writeInLocalStorage('saved_address_id', address.id);
        window.writeInLocalStorage('saved_name', address.name);
        window.writeInLocalStorage('saved_email', address.email);
        window.writeInLocalStorage('saved_nos', address.phone);
        window.writeInLocalStorage('formatted_address', address.formatted_address);
        window.writeInLocalStorage('lat_lng', `${address.lat_long[0]},${address.lat_long[1]}`);
    }


    let user_details = { ...userDetails }


    if (!fetchDraft || phoneNumber) {
        await db.collection('carts').doc(cart_id).update({
            shipping_address: shipping_address,
        })
    }
    let cart_data = JSON.parse(JSON.stringify(cart));
    let cartValid = true
    cart_data.items.forEach((item) => {
        let product = products.find((product) => { return product.id == item.product_id })
        let deliverable = true; //check if deliverable
        let in_stock = true;     // check if in stock
        if (!cart_data.stock_location_id) {
            deliverable = false;
        }
        else {
            let variant = product.variants.find((v) => { return v.id == item.variant_id });
            let stock_location = variant.stock_locations.find((stock) => { return stock.id == cart_data.stock_location_id })
            if (stock_location.quantity < item.quantity) {
                in_stock = false;
            }
        }
        let formatted_item = {
            variant_id: item.variant_id,
            attributes: {
                title: item.product_name,
                images: {
                    "1x": product.image_urls[0]
                },
                size: item.size,
                price_mrp: item.mrp,
                price_final: item.sale_price,
                discount_per: 0,
                slot: item.slot,
                day: item.day
            },
            availability: in_stock,
            quantity: item.quantity,
            timestamp: item.timestamp,
            deliverable: deliverable,
            product_id: product.id
        }
        if (cartValid) {
            cartValid = deliverable && in_stock
        }
        items.push(formatted_item);
    })

    cart_data.items = items;
    cart_data.cartValid = cartValid;
    let response = {
        success: true,
        cart: cart_data,
        coupon_applied: null,
        coupons: []
    }


    response.cart.items = items;
    response.cart.order_id = cart_id;
    response.cart.shipping_address = shipping_address;
    response.cart.user_details = user_details
    return response;

}


async function orderSummary(transaction_id) {
    let order_line_items = [], items = [];
    let lat_lng = [], shipping_address
    currentUser_uid = firebase.auth().currentUser.uid;

    let paymentDoc = await db.collection('payments').where("pg_order_id", "==", transaction_id).get()
    if (!paymentDoc.docs.length) {
        return { success: false, msg: "Order not found" }
    }
    let data = paymentDoc.docs[0].data();
    console.log("payment data ===> " + data)
    console.log(data.user_id + "!=" + currentUser_uid);

    if (data.user_id != currentUser_uid) {
        return { success: false, msg: "Please login to view summary" }
    }
    if (data.status == "draft") {
        return { success: true, pending: 1 };
    }
    if (data.other_details) {
        data.other_details = JSON.parse(data.other_details)
    }

    let order_ref = await db.collection('user-details').doc(currentUser_uid).collection('orders').doc(data.order_id).get()

    if (!order_ref.exists) {
        return { success: false, msg: "Order not found" };
    }
    let order_data = order_ref.data()
    let shipping_address_obj = order_data.shipping_address
    if (shipping_address_obj) {
        let latlng = {}
        latlng["lat"] = shipping_address_obj.lat_long[0]
        latlng["lng"] = shipping_address_obj.lat_long[1]
        order_data.shipping_address.lat_long = latlng

    }

    order_data.items.forEach((item) => {
        let product = products.find((product) => { return product.id == item.product_id })
        let deliverable = true; //check if deliverable
        let in_stock = true;     // check if in stock

        let formatted_item = {
            variant_id: item.variant_id,
            attributes: {
                title: item.product_name,
                images: {
                    "1x": product.image_urls[0]
                },
                size: item.size,
                price_mrp: item.mrp,
                price_final: item.sale_price,
                discount_per: 0
            },
            availability: in_stock,
            quantity: item.quantity,
            timestamp: item.timestamp,
            deliverable: deliverable,
            product_id: product.id
        }
        items.push(formatted_item);
    })

    order_data.items = items;
    let response = {
        success: true,
        order_data: order_data,
        payment_summary: data,
        coupon_applied: null,
        coupons: []
    }
    return response;
}

async function orderDetails(order_id) {
    let order_line_items = [], items = [];
    let lat_lng = [], shipping_address
    if (!order_id) {
        return { success: false, msg: "order is empty" }
    }


    let user_order_map_ref = await db.collection("user-orders-map").where("order_id", "==", order_id).get()

    if (!user_order_map_ref.docs.length) {
        return { success: false, msg: "Order cannot be found" }
    }

    let orderDoc = await db.collection('user-details').doc(user_order_map_ref.docs[0].data().user_id).collection("orders").doc(order_id).get()
    if (!orderDoc.exists) {
        return { success: false, msg: "Order cannot be found" }
    }


    let order_data = orderDoc.data();

    if (order_data.status == "draft") {
        return { success: true, pending: 1 };
    }

    let payment_ref = await db.collection("payments").where("user_id", "==", user_order_map_ref.docs[0].data().user_id).where("order_id", "==", order_id).get()
    if (payment_ref.docs.length) {


        let payment_data = payment_ref.docs[0].data()

        if (payment_data.other_details) {
            order_data.payment_details = JSON.parse(payment_data.other_details)
        }
    }

    let shipping_address_obj = order_data.shipping_address

    // let order_data = order_ref.data()
    if (order_data.order_mode == "kiosk") {

    } else {
        if (shipping_address_obj) {
            let latlng = {}
            latlng["lat"] = shipping_address_obj.lat_long[0]
            latlng["lng"] = shipping_address_obj.lat_long[1]
            order_data.shipping_address.lat_long = latlng

        }
    }


    order_data.items.forEach((item) => {
        let product = products.find((product) => { return product.id == item.product_id })
        let deliverable = true; //check if deliverable
        let in_stock = true;     // check if in stock

        let formatted_item = {
            variant_id: item.variant_id,
            attributes: {
                title: item.product_name,
                image: product.image_urls[0],
                size: item.size,
                price_mrp: item.mrp,
                price_final: item.sale_price,
                discount_per: 0
            },
            slot: item.slot,
            day: item.day,
            availability: in_stock,
            quantity: item.quantity,
            timestamp: item.timestamp,
            deliverable: deliverable,
            product_id: product.id
        }
        items.push(formatted_item);
    })

    order_data.order_nos = orderDoc.id
    order_data.items = items;
    let response = {
        success: true,
        order_data: order_data,
        coupon_applied: null,
        coupons: [],
        approx_delivery_time: "40 mins"
    }
    return response;
}

function brewCartId(site_mode, business_id) {
    let uid;
    if (window.firebase.auth().currentUser) {
        uid = window.firebase.auth().currentUser.uid
        business_id = allConfig.businessConfig.businessId
        site_mode = allConfig.businessConfig.siteMode
        return uid + '-' + business_id + '-' + site_mode
    } else {
        return null
    }
}

async function getHeaders() {
    const tokenID = await window.firebase.auth().currentUser.getIdToken()
    const UID = window.firebase.auth().getUid();
    const cartID = window.readFromLocalStorage(cartIdLabel)
    return {
        Authorization : 'Bearer '+ tokenID,
        UID: UID,
        CARTID: cartID
    }
}

function recalculateCart(cartData) {
    return new Promise(async (resolve, reject) => {
        try {
            const headers = await getHeaders()
            const resp = await axios.post("https://asia-east2-project-ggb-dev.cloudfunctions.net/api/rest/v1/admin/recalculate-coupon", {cartData:cartData}, {headers: headers});
            cartData.applied_coupon = resp.data.cart.applied_coupon
            cartData.summary = resp.data.cart.summary
            resp.data.cart = cartData
            resolve(resp.data)
        } catch (error) {
            resolve({data: {cart :cartData}})
            console.log(error)
        }
    })
}

function applyCoupon(couponCode, cartData) {
    return new Promise(async (resolve, reject) => {
        try {
            const headers = await getHeaders()
            const resp = await axios.post("https://asia-east2-project-ggb-dev.cloudfunctions.net/api/rest/v1/admin/recalculate-coupon", {operation:"add", couponCode:couponCode, cartData:cartData },{headers: headers});
            cartData.applied_coupon = resp.data.data.cart.applied_coupon
            cartData.summary = resp.data.data.cart.summary
            resp.data.data.cart = cartData
            resolve(resp.data)
        } catch (error) {
            reject({success:false, message:"Something went wrong."})
            console.log(error)
        }
    })
}

function removeCoupon(cartData) {
    return new Promise(async (resolve, reject) => {
        try {
            const headers = await getHeaders()
            const resp = await axios.post("https://asia-east2-project-ggb-dev.cloudfunctions.net/api/rest/v1/admin/recalculate-coupon", {operation:"remove", cartData:cartData},{headers: headers});
            cartData.applied_coupon = resp.data.data.cart.applied_coupon
            cartData.summary = resp.data.data.cart.summary
            resp.data.data.cart = cartData
            resolve(resp.data)
        } catch (error) {
            reject({success:false, message:"Something went wrong."})
            console.log(error)
        }
    })
}