const fs = require('fs-extra');
let jsonData = require('./build_location.json');

let react_file_hash = {};
let react_css_file_hash = {}
let js_files = ["runtime-main.", "main.", "2."];
let css_files = ["main."];

let react_component_file_hash = {};
let react_component_js_files = ["add-to-cart.js", "delivery-address-slider.js", "sign-in.js", "verify-otp.js", "view-cart.js", "variant-selection-popup.js"];

fs.emptyDir('../pre_build/cart')
.then(() => {
	fs.copy('./build/', '../pre_build/cart/')
		.then(async (success) =>{
			console.log("build folder copied successfully");

			//cart app js and css
			for(let i = 0; i<js_files.length; i++){
			    fromDir('./build/static/js/', js_files[i], 'js');
			}

			fromDir('./build/static/css/', css_files[0], 'css');

			let timestamp = new Date().getTime();
			
			await fs.copy('firebase/src/firebase-functions.js', '../build/site/firebase-functions.'+timestamp+'.js');
			react_file_hash["firebase"] = timestamp;

			//copy components to one file
			for(let file of react_component_js_files){
			    copyComponentsToOneFile(file, timestamp);
			}

			// copy hash to react_file_hash.json file
			fromDir('../pre_build/', 'react-components.', 'js');

			//delete components build file
			for(let file of react_component_js_files){
			    fs.unlinkSync('../pre_build/'+file)
			}
			

			fs.copy('../pre_build/' , '../build/' + jsonData['location'] + '/').then((success)=>{
				fs.writeJson('../build/' + jsonData['location'] + '/react_component_file_hash.json', react_file_hash)
				.then(() => {
				  console.log('success!')
				})
				.catch(err => {
				  console.error(err)
				})

				fs.writeJson('../build/' + jsonData['location'] + '/cart_app_css_file_hash.json', react_css_file_hash)
				.then(() => {
				  console.log('success!')
				})
				.catch(err => {
				  console.error(err)
				})	
			})
			.catch((error)=>{
				console.log("error in copying pre build folder to build folder ==>", error)
			})

			

		})
		.catch((error)=>{
			console.log("error in copying build folder", error);
		})
})
.catch(err => {
  console.error(err)
})



function fromDir(startPath,filter, type){
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }
    console.log("type ==>", type);

    var files=fs.readdirSync(startPath);
    if(type == 'js'){
    	for(var i=0;i<files.length;i++){
	        if (files[i].indexOf(filter)>=0) {
	            console.log('-- found: ',files[i]);
	            react_file_hash[files[i].split('.')[0]] = files[i].split('.')[1];
	        };
	    };
    }
    else {
    	for(var i=0;i<files.length;i++){
	        if (files[i].indexOf(filter)>=0) {
	            console.log('-- found: ',files[i]);
	            react_css_file_hash[files[i].split('.')[0]] = files[i].split('.')[1];
	        };
	    };
    }
};

async function copyComponentsToOneFile(file, timestamp){
	await copyFile('../pre_build/'+file, '../pre_build/react-components.'+timestamp+'.js');
};



async function copyFile(source, destination) {
    let readMe = fs.readFileSync(source); 
    fs.appendFileSync(destination, readMe);
}
