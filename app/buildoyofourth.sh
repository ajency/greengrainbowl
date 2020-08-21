removePreBuildFolder(){
	rm -rf pre_build
	cp env/envoyofourth.json env.json
	node prebuild.js
}

buildAddToCart(){
	cd ./add-to-cart
	npm install
	npm run build
}

buildDeliveryAddress(){
	cd ../delivery-address-slider
	npm install
	npm run build
}

buildSignIn(){
	cd ../sign-in
	npm install
	npm run build
}

buildVerifyOtp(){
	cd ../verify-otp
	npm install
	npm run build
}

buildViewCart(){
	cd ../view-cart
	npm install
	npm run build
}

buildVariationSelection(){
	cd ../variant-selection-popup
	npm install
	npm run build
}

buildFirebaseFunctions(){
	cd ../firebase
	npm install
	node addfirebasecred.js
	# cp src/firebase-functions.js ../build/oyofourth/firebase-functions.js
	cd ..
}

buildCartApp(){
	cd ../cart
	npm install
	npm run build
	node postbuild.js
}



echo "running build script"
removePreBuildFolder
buildAddToCart
buildDeliveryAddress
buildSignIn
buildVerifyOtp
buildViewCart
buildVariationSelection
buildCartApp
buildFirebaseFunctions
removePreBuildFolder