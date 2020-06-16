let razorPayConfig = {
    api_key: process.env.REACT_APP_RZR_API_KEY,
    customJs: "https://checkout.razorpay.com/v1/razorpay.js",
    standardJs: "https://checkout.razorpay.com/v1/checkout.js",
    image: process.env.REACT_APP_CONTENT_LINK + "assets/images/logo_new.png",
    callback_url: process.env.REACT_APP_WEBSITE_LINK + "#/order-summary",
    cancel_url: process.env.REACT_APP_WEBSITE_LINK + "#/order-summary"
};

let payU = {
    api_key: ""
};

let generalConfig = {
    site_mode : process.env.REACT_APP_SITE_MODE,
    apiEndPoint: process.env.REACT_APP_API_END_PT,
    webSiteLink: process.env.REACT_APP_WEBSITE_LINK,
    webSiteAddon: process.env.REACT_APP_WEBSITE_ADDON,
    company_name: "GGB",
    googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    preparationTime: process.env.REACT_APP_PREPARATION_TIME,
    pickupPoint: process.env.REACT_APP_PICKUP_POINT,
    businessId: process.env.REACT_APP_BUSINESS_ID
}

export {
    razorPayConfig,
    payU,
    generalConfig
}