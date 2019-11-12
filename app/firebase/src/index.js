 // Your web app's Firebase configuration

// var firebaseConfig = {
//     apiKey: "AIzaSyC-w19gW41OaoyjuK4jHPVN5JtviKGB7KQ",
//     authDomain: "project-ggb-dev.firebaseapp.com",
//     databaseURL: "https://project-ggb-dev.firebaseio.com",
//     projectId: "project-ggb-dev",
//     storageBucket: "project-ggb-dev.appspot.com",
//     messagingSenderId: "1034785903670",
//     appId: "1:1034785903670:web:496c7762259b7fb3b9f497"
// };

 var firebaseConfig = {
    apiKey: "AIzaSyDkH2U1VrkRiXNHkyrhTOuL48zeq_2dwAw",
    authDomain: "project-ggb.firebaseapp.com",
    databaseURL: "https://project-ggb.firebaseio.com",
    projectId: "project-ggb",
    storageBucket: "project-ggb.appspot.com",
    messagingSenderId: "854451069142",
    appId: "1:854451069142:web:0e523576b2ef9c7f47e977"
};

// Initialize Firebase
console.log("initialising firebase");
firebase.initializeApp(firebaseConfig)
var db = firebase.firestore();

initialiseMessaging();

function initialiseMessaging(){
    try{
        const messaging = firebase.messaging();
        messaging.usePublicVapidKey("BJplW7H_YA8Ii_slb0DTqh8U9UsuexByioSBOk4xKxAwdw2xcqUwzTTNy2HSvs_MncRZHRtUwsQ6nQqFSonHEaA");

        // monitor refresh token
        messaging.onTokenRefresh(() => {
          messaging.getToken().then((refreshed_token) => {
            console.log('Token refreshed.', refreshed_token);
            updateToken(refreshed_token);
          }).catch((err) => {
            console.log('Unable to retrieve refreshed token ', err);
            showToken('Unable to retrieve refreshed token ', err);
          });
        });


        messaging.onMessage((payload) => {
          console.log('Message received. ', payload);
        });


        navigator.serviceWorker.addEventListener("message", (message) => {
            console.log("check ==>",message)
            let data = message.data['firebase-messaging-msg-data'].notification;
            const notificationTitle = data.title;
              const notificationOptions = {
                body: data.body,
                icon: data.icon
            };

            navigator.serviceWorker.getRegistration()
            .then( function(reg){
                if(reg) {
                reg.showNotification(notificationTitle, notificationOptions);
               } else {
                 console.log('GOT undefined');
               }
            });
        });

    }
    catch(error){
        console.log("error messaging==>", error);
    }    
}
// firebase messaging - push notitifcations



function checkPushNotificationPermissions(){
    if(show_pn && 'Notification' in window && navigator.serviceWorker){
        askPermissions();
    }
}


function askPermissions(){
    Notification.requestPermission()
    .then( () => {
        messaging.getToken().then((current_token) => {
            if (current_token) {
                console.log("fcm token =>",current_token);
                updateToken(current_token);
            } 
          else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            // updateUIForPushPermissionRequired();
            // setTokenSentToServer(false);
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // showToken('Error retrieving Instance ID token. ', err);
          // setTokenSentToServer(false);
        });
    })
    .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
    });
}

function updateToken(token){
     let old_token = readFromLocalStorage('fcm_token')
    if(!old_token || old_token != token){
        sendTokenToServer(token);
        writeInLocalStorage('fcm_token', token)
    }
}

function sendTokenToServer(token){
    let url = 'https://asia-east2-project-ggb-dev.cloudfunctions.net/api/rest/v1/store-fcm-token';
    // let url = 'http://localhost:5000/project-ggb-dev/asia-east2/api/rest/v1/store-fcm-token';
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let body = {
        fcm_token : token,
        device : isMobile ? 'mobile' : 'desktop'
    }
    axios.get(url, {params : body})
        .then((res) => {
            console.log("fcm token stored successfully");
        })
        .catch((error)=>{
            console.log("error in storing fcm token ==>", error);
        })
}
// end of firebase messaging - push notitifcations


var products = [];
var cartData;

getProducts();


if(window.readFromLocalStorage('cart_id')){
    sycnCartData(window.readFromLocalStorage('cart_id'));
}

function getProducts(){
    let query = db.collection('products');
    query.onSnapshot(function(snapshot) {
        if (!snapshot.size){
            products = [];
        }

        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("data ==>", change.doc.data());
                let data = change.doc.data();
                data.id = change.doc.id;
                products.push(data);
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

async function fetchProduct(product_id){
    let product = await db.collection('products').doc(product_id).get();
    let product_obj = product.data();
    product_obj.id = product.id;
    console.log("async fetch product ==>", product_obj);
    return product_obj;
}

var unsubscribeCartListner;

function sycnCartData(id){
    if(unsubscribeCartListner)
        unsubscribeCartListner();
    let query = db.collection('carts').doc(id);    
    unsubscribeCartListner = query.onSnapshot(function(doc) {
        if(doc.exists)
            cartData = doc.data();
    });
}

async function getVariantById(id) {
    let variant = variants.find((v) => v.id == id);
    return variant;
}


async function getProductById(id){
    let product = products.find((p) => p.id == id);
    return product;
}


async function getLocationWithStock (id, quantity) {
        let available_stocks = stocks.filter((stock) => {return stock.variant_id == id && stock.quantity >= quantity })
        console.log("check stocks ==>",available_stocks);
        // if stock is available in atleast one location
        if(available_stocks.length){
            //get locations
            let availableLoc  = [], location, data;
            for (const stock of available_stocks) {
                // location = await db.collection('locations').doc(stock.loc_id).get();
                location = locations.find((loc) => loc.id == stock.loc_id)
                console.log("location ==>", location)
                if(location)
                    availableLoc.push(location)
            }
            return availableLoc;
        }
        else
            return [];
 }

 function isDeliverable (locations, lat_long) {
        console.log("finding deliverableLocation");
        let deliverble = [] ;
        // locations.forEach((loc)=>{
        //     let location_1 = {lat: loc.lat_long[0].lat, lon: loc.lat_long[0].long}
        //     let location_2 = {lat: lat_long[0], lon: lat_long[1]};
        //     let diff = geo_utils.headingDistanceTo(location_1, location_2);
        //     console.log("radius diff==>", diff);
        //     if(diff.distance < loc.radius){
        //         deliverble.push(loc);
        //         return;
        //     }
        // })
        return locations;
}


async function getCartByID (id ) {
        if(cartData){
            return cartData;
        }
        else{
            let cart = await db.collection('carts').doc(id).get();
            if(cart.exists){
                return cart.data();
            }
            return null;
        }
}

async function getLocation (loc_id ) {
        let location = locations.find((loc) => loc.id == loc_id );
        if(location)
            return [location]
        return []
}

async function updateOrder (item, cart_id, cart_data, stock_location_id) {

        cart_data.summary.mrp_total          += item.attributes.mrp * item.quantity;
        cart_data.summary.sale_price_total   += item.attributes.sale_price * item.quantity;
        cart_data.summary.you_pay            = cart_data.summary.sale_price_total + cart_data.summary.shipping_fee;
        cart_data.cart_count                 += item.quantity;
        cart_data.stock_location_id          =  stock_location_id;

        console.log("cart items ==>", cart_data.items);
        if(cart_data.items.length){
            let index = cart_data.items.findIndex((i) => { return i.variant_id == item.variant_id})
            if(index !== -1){
                console.log("item already in cart");
                cart_data.items[index].quantity += item.quantity;
                cart_data.items[index].timestamp = '';
            }
            else{
                console.log("new item");
                cart_data.items[cart_data.items.length] = item;
            }
        }
        else{
            cart_data.items = [item];
        }
        console.log("cart data before set ==>", cart_data);
        await db.collection('carts').doc(cart_id).set(cart_data);
        console.log("cart data after set")
        sycnCartData(cart_id);
        
        return cart_data;
}


function findDeliverableLocation(locations, lat_long){
    let deliverble, min_diff = 9999999;

        locations.forEach((loc)=>{
            let diff = headingDistanceTo(lat_long[0], lat_long[1], loc.lat_long.lat, loc.lat_long.long);
            console.log("radius diff==>", diff);

            if(diff < loc.radius && diff < min_diff){
                min_diff = diff;
                deliverble = loc;
            }
        })
    console.log("closest deliverable ==>", deliverble);
    return deliverble;
}

function headingDistanceTo(lat1, lon1, lat2, lon2) {
    console.log("check cordinates ==>", lat1, lon1, lat2, lon2);
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344 * 1000;
        console.log("distance ==>", dist);
        return dist;
    }
}