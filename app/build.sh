removePreBuildFolder(){
	rm -rf pre_build
	cp env/env.json env.json
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
	# cp src/firebase-functions.js ../build/site/firebase-functions.js
}

buildCartApp(){
	cd ../cart
	npm install
	npm run build
	node postbuild.js
	cd ..
}



echo "running build script"
removePreBuildFolder
buildAddToCart
buildDeliveryAddress
buildSignIn
buildVerifyOtp
buildViewCart
buildVariationSelection
buildFirebaseFunctions
buildCartApp
removePreBuildFolder