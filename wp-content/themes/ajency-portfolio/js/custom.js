var validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

var $ = jQuery.noConflict();

$('.mobile-slick').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true
});

$('.mobile-slick').on('setPosition', function() {
    // jbResizeSlider();
});
//we need to maintain a set height when a resize event occurs.
//Some events will through a resize trigger: $(window).trigger('resize');
// $(window).on('resize', function(e) {
//   jbResizeSlider();
// });
//since multiple events can trigger a slider adjustment, we will control that adjustment here
// function jbResizeSlider(){
//   $slickSlider = $('.mobile-slick');
//   $slickSlider.find('.slick-slide').height('auto');
//   var slickTrack = $slickSlider.find('.slick-track');
//   var slickTrackHeight = $(slickTrack).height();
//   $slickSlider.find('.slick-slide').css('height', slickTrackHeight + 'px');
// }
jQuery('.variable-width').slick({
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    dots: false,
    initialSlide: 1,
    centerMode: true,
    variableWidth: true,
    responsive: [{
        breakpoint: 768,
        settings: {
            arrows: false,
            centerMode: true,
            slidesToShow: 2,
        }
    }, {
        breakpoint: 480,
        settings: {
            arrows: false,
            slidesToShow: 1,
            centerPadding: '35px',
        }
    }]
});
jQuery(".aj-home .items").hover(function() {
    $('.aj-our-work').addClass("invisible");
}, function() {
    $('.aj-our-work').removeClass("invisible");
});
$('.aj-team-member').slick({
    dots: true,
    infinite: true,
    speed: 300,
    arrows: false,
    slidesToShow: 1,
    variableWidth: true
});
// $(window).scroll(function() {
//     if ($(window).scrollTop() >= 20) {
//         $('nav').addClass('fixed-header');
//         $('nav').addClass('position-fixed');
//     } else {
//         $('nav').removeClass('fixed-header');
//         $('nav').removeClass('position-fixed');
//     }
// });
if ($(window).width() < 1198) {
    $('.pf-1').click(function() {
        $('.scroll-left').addClass('active');
        $('.mobile-slick').slick('slickGoTo', 0);
        $('body').css("overflow", "hidden");
        ourWorkUrl();
    });
    $('.pf-2').click(function() {
        $('.scroll-left').addClass('active');
        $('.mobile-slick').slick('slickGoTo', 1);
        $('body').css("overflow", "hidden");
        ourWorkUrl();
    });
    $('.pf-3').click(function() {
        $('.scroll-left').addClass('active');
        $('.mobile-slick').slick('slickGoTo', 2);
        $('body').css("overflow", "hidden");
        ourWorkUrl();
    });
    $('.pf-4').click(function() {
        $('.scroll-left').addClass('active');
        $('.mobile-slick').slick('slickGoTo', 3);
        $('body').css("overflow", "hidden");
        ourWorkUrl();
    });
    $('.pf-5').click(function() {
        $('.scroll-left').addClass('active');
        $('.mobile-slick').slick('slickGoTo', 4);
        $('body').css("overflow", "hidden");
        ourWorkUrl();
    });
    $('.pf-6').click(function() {
        $('.scroll-left').addClass('active');
        $('.mobile-slick').slick('slickGoTo', 5);
        $('body').css("overflow", "hidden");
        ourWorkUrl();
    });
    $('.back').click(function() {
        window.history.go(-1);
    });

    function ourWorkUrl() {
        if (history.pushState) {
            var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '#our-work';
            window.history.pushState({
                path: newurl
            }, '', newurl);
        }
        $(window).on('popstate', function(event) {
            ourWorkBack();
        });
    }

    function ourWorkBack() {
        $('.scroll-left').removeClass('active');
        $('div[id^=showdiv]').removeClass("highlight");
        $('body').css("overflow", "scroll");
        $(".scroll-left").animate({
            scrollTop: 0
        }, "slow");
        return false;
    }
}

$('#showdiv1').click(function() {
    $('div[id^=div]').css('opacity', 0);
    $('#div1').css('opacity', 1);
    $('div[id^=showdiv]').removeClass("highlight");
    $('#showdiv1').addClass("highlight");
});
$('#showdiv2').click(function() {
    $('div[id^=div]').css('opacity', 0);
    $('#div2').css('opacity', 1);
    $('div[id^=showdiv]').removeClass("highlight");
    $('#showdiv2').addClass("highlight");
});
$('#showdiv3').click(function() {
    $('div[id^=div]').css('opacity', 0);
    $('#div3').css('opacity', 1);
    $('div[id^=showdiv]').removeClass("highlight");
    $('#showdiv3').addClass("highlight");
});
$('#showdiv4').click(function() {
    $('div[id^=div]').css('opacity', 0);
    $('#div4').css('opacity', 1);
    $('div[id^=showdiv]').removeClass("highlight");
    $('#showdiv4').addClass("highlight");
});
$('#showdiv5').click(function() {
    $('div[id^=div]').css('opacity', 0);
    $('#div5').css('opacity', 1);
    $('div[id^=showdiv]').removeClass("highlight");
    $('#showdiv5').addClass("highlight");
});
$('#showdiv6').click(function() {
    $('div[id^=div]').css('opacity', 0);
    $('#div6').css('opacity', 1);
    $('div[id^=showdiv]').removeClass("highlight");
    $('#showdiv6').addClass("highlight");
});
$('.close').click(function() {
    $('body').css('overflow', 'visible');
    $('div[id^=div]').css('opacity', 0);
    $('div[id^=showdiv]').removeClass("highlight");

});

$(window).on("load", function() {
   // jQuery.ready().then(function() {
        var imgDefer = document.getElementsByTagName('img');
        for (var i = 0; i < imgDefer.length; i++) {
            if (imgDefer[i].getAttribute('data-delaysrc')) {
                imgDefer[i].setAttribute('src', imgDefer[i].getAttribute('data-delaysrc'));
                imgDefer[i].setAttribute('srcset', imgDefer[i].getAttribute('data-delaysrcset'));
                imgDefer[i].setAttribute('sizes', imgDefer[i].getAttribute('data-delaysizes'));
                imgDefer[i].removeAttribute('data-delaysrc', 'data-delaysrcset', 'data-delaysizes');
                imgDefer[i].removeAttribute('data-delaysrcset');
                imgDefer[i].removeAttribute('data-delaysizes');
            }
        }
    //});
})

$(document).ready(function(){
    if(window.location.href.includes('#/cart') || window.location.href.includes('#/order-summary') || window.location.href.includes('#/order-details')){
        loadCartApp();
        showCartSlider()
    }

    let lat_lng = readFromLocalStorage('lat_lng')
    if(lat_lng){
        window.lat_lng = [parseFloat(lat_lng.split(',')[0]), parseFloat(lat_lng.split(',')[1])]
        let formatted_address = readFromLocalStorage('formatted_address');
        if(formatted_address){
            window.formatted_address = formatted_address;
            document.querySelector("#selected-location-address").innerHTML = 
            '<div>' + formatted_address + '</div><i class="fas fa-pencil-alt number-edit cursor-pointer"></i>'
        }
    }
})

$(function() {
    $('.pop').on('click', function() {
        $('.imagepreview').attr('src', $(this).find('img').attr('data-original'));
        $('#imagemodal').modal('show');
        jQuery('meta[name=viewport]').attr('content', 'initial-scale=1.0');
    });
});
$('.modal').on('click', function() {
    $('#imagemodal').modal('hide');
    jQuery('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
});
$(window).on('hashchange', function(event) {
    $('.scroll-left').removeClass('active');
    locationHashChanged();
});
$(document).on('click', '.card-front .card-trigger', function() {
    $(this).toggleClass('active');
    $('.card-front').toggleClass('active');
    $(this).siblings().toggleClass('not-active');
})

$('.bread-crumb__menu').on('click', function(e) {
    // e.preventDefault();
    $(this).toggleClass('is-active');
});

function locationHashChanged() {
    console.log("location hash changed", window.location.hash);
    if (window.location.hash === '#/cart' || window.location.hash === '#/order-summary') { 
        loadCartApp();
        showCartSlider()
    }
    else if(!window.location.hash){
        closeCart();
    } else if(window.location.hash == '#/' || window.location.hash == '') {
        closeCart();
    }
}


function closeCart(){
    document.querySelector(".cart-wrapper").classList.remove('active');
    removeBackDrop();
}

function showCartSlider(){
    $('.cart-wrapper').addClass('active');
    addBackDrop();
}

loaded = false;

function loadCartApp(){
    console.log("file_hashes ==>", react_js_file_hashes);
    if(!loaded){
        addCartLoader();
        let url = app_url;

        $.ajaxSetup({ cache: true });

        $("<link/>", {
           rel: "stylesheet",
           type: "text/css",
           href: url+"/cart/static/css/main."+ react_css_file_hashes['main'] + ".chunk.css"
        }).appendTo("head");

        $.getScript(url+"/cart/static/js/runtime-main."+ react_js_file_hashes['runtime-main'] +".js")        
            .done(function(script, textStatus){
                $.getScript(url+"/cart/static/js/main."+ react_js_file_hashes['main'] +".chunk.js")
                    .done(function(script2, textStatus2){
                                $.getScript(url+"/cart/static/js/2."+ react_js_file_hashes['2'] +".chunk.js")
                                    .done(function(script4,textStatus4){
                                        loaded = true;
                                    })
                                    .fail(function(jqxhr, settings, exception){
                                        console.log("loadCartApp failed")
                                    })
                    })
                    .fail(function(jqxhr, settings, exception){
                        console.log("loadCartApp failed")
                    })
            })
            .fail(function(jqxhr, settings, exception){
                console.log("loadCartApp failed")
            })
    }
}

$('.delivery-location').click(function() {
    setTimeout(()=>{
        if(window.lat_lng && window.formatted_address){
            $('#selected-location-address').addClass('show');
        }
        else{
            window.showGpsModalPrompt(true);
        }
    },50)
});

$('#selected-location-address').click(function(){
    window.showGpsModalPrompt(true);
})

$(window).click(function(e) {
    if($( "#selected-location-address" ).hasClass( "show" ) ){
        $('#selected-location-address').removeClass('show');
    }
});


function getCookie(cname){
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function addBackDrop(){
    $('.backdrop').addClass('show');
    $('body').addClass('hide-scroll');
}

function hideScroll(){
    $('body').addClass('hide-scroll');
}

function showScroll(){
    $('body').removeClass('hide-scroll');
}


function removeBackDrop(){
    if(!$('.cart-wrapper').hasClass('active')){
        $('.backdrop').removeClass('show');
        $('body').removeClass('hide-scroll');
    }
}

function addCartLoader(){
    // $('.cart-wrapper').addClass('cart-loader');
    $('.site-loader').addClass('visible');
}

function removeCartLoader(){
    // $('.cart-wrapper').removeClass('cart-loader');   
    $('.site-loader').removeClass('visible');
}


function writeInLocalStorage(item_name, value) {
    if(isLocalStorageSupported()) {
        localStorage.setItem(item_name, value);
    }
    else {
        document.cookie = item_name + "=" + value + ";expires="+getCookieExpiryDate()+";max-age="+getCookieMaxAge()+";path=/";
    }
}


function readFromLocalStorage(item_name) {
    if(isLocalStorageSupported()) {
        return localStorage.getItem(item_name);
    }
    else {
        return getCookie(item_name);
    }
}

function removeFromLocalStorage(item_name) {
    if(isLocalStorageSupported()) {
        localStorage.removeItem(item_name);
    } else {
        removeCookie(item_name);  
    }
    return true;
}

function isLocalStorageSupported() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch(e) {
        return false;
    }
}

function removeCookie(item_name) {
    let expiredate = new Date('12-02-1970').toUTCString();
    document.cookie = item_name + "=" + ";expires="+expiredate+";max-age="+getCookieMaxAge()+";path=/";
}

function getCookieMaxAge(){
    return 30*24*60*60;
}

function getCookieExpiryDate(){
    let milli_sec = new Date().getTime();
    milli_sec = milli_sec+(30*24*60*60*1000);
    let expiredate = new Date(milli_sec).toUTCString();
}


window.addEventListener("click", checkInternetConnection, true);
window.addEventListener('online',  updateOnlineStatus);

function checkInternetConnection(){
    if(navigator.onLine){
        //do nothing
    } else {
        event.stopPropagation();
        disableSite();
        document.querySelector('#offline-toast').innerHTML = "You are offline and may be viewing outdated content!";
        document.querySelector('#offline-toast').classList.remove('d-none');
        setTimeout(()=>{
            document.querySelector('#offline-toast').classList.add('d-none');
        },5000)
    }
}

function updateOnlineStatus(){
    enableSite();
    document.querySelector('#offline-toast').innerHTML = "You are online";
    document.querySelector('#offline-toast').classList.remove('d-none');
    setTimeout(()=>{
        document.querySelector('#offline-toast').classList.add('d-none');
    },4000)
}

function enableSite(){
    $('body').removeClass('site-offline');
}

function disableSite(){
    $('body').addClass('site-offline');
}

document.addEventListener("DOMContentLoaded", function() {
    let lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    let active = false;
  
    const lazyLoad = function() {
        if (active === false) {
        active = true;

        setTimeout(function() {
            lazyImages.forEach(function(lazyImage) {
            if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.srcset = lazyImage.dataset.srcset;
                lazyImage.classList.remove("lazy");

                lazyImages = lazyImages.filter(function(image) {
                return image !== lazyImage;
                });

                if (lazyImages.length === 0) {
                document.removeEventListener("scroll", lazyLoad);
                window.removeEventListener("resize", lazyLoad);
                window.removeEventListener("orientationchange", lazyLoad);
                }
            }
            });

            active = false;
        }, 20);
    }
};

document.addEventListener("scroll", lazyLoad);
window.addEventListener("resize", lazyLoad);
window.addEventListener("orientationchange", lazyLoad);
});

window.addEventListener("load", function() {
    
    $('.product-image').on('init', function(event, slick){
        // console.log("initialized")
    });
    
    // $('.product-image').slick({
    //     infinite: false,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     dots: true,
    //     fade: true,
    //     speed: 900,
    //     cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    //     touchThreshold: 100,
    //     autoplay: true,
    //     autoplaySpeed: 2000,
    // });

    // if ($(window).innerWidth() < 767) {

    //     if(window.innerHeight > window.innerWidth){
    //         $('.product-list').find('.product-list-item:last').removeClass('effect');
    //         // build scene
    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger1", 
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardone", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger1", {pushFollowers: false})
    //         // .offset(-10)
    //         // .addIndicators({name: "2 (duration: 300)"}) // add indicators (requires plugin)
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger2", 
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardtwo", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger2", {pushFollowers: false})
    //         // .offset(-10)
    //         // .addIndicators({name: "2 (duration: 300)"}) // add indicators (requires plugin)
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger3", 
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardthree", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger3", {pushFollowers: false})
    //         // .offset(-10)
    //         // .addIndicators({name: "2 (duration: 300)"}) // add indicators (requires plugin)
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger4", 
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardfour", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger4", {pushFollowers: false})
    //         // .offset(-10)
    //         // .addIndicators({name: "2 (duration: 300)"}) // add indicators (requires plugin)
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger5", 
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardfive", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger5", {pushFollowers: false})
    //         // .offset(-10)
    //         // .addIndicators({name: "2 (duration: 300)"}) // add indicators (requires plugin)
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger6", 
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardsix", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger6", {pushFollowers: false})
    //         // .offset(-10)
    //         // .addIndicators({name: "2 (duration: 300)"}) // add indicators (requires plugin)
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger7",
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardseven", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger7", {pushFollowers: false})
    //         .addTo(controller);

    //         var scene = new ScrollMagic.Scene({
    //             triggerElement: ".effect.trigger8",
    //             triggerHook: 'onLeave', 
    //             duration: '150%'
    //         })
    //         .setTween(".cardend", { scale: 0.75, opacity: 0}) // the tween durtion can be omitted and defaults to 1
    //         .setPin(".effect.trigger8", {pushFollowers: false})
    //         .addTo(controller);
    //     }        
    // }
});



function displayError(msg){
    displayToast(msg, 'failure');
}

function displaySuccess(msg){
    displayToast(msg, 'success')
}

function displayToast(msg, type){
    let length = $('#success-failure-toast-container div').length, element
    if(type == 'success'){
        element = '<div class="animated fadeInUp success toast d-flex justify-content-center sb-shadow mt-lg-5 position-relative"><span class="p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-lg-center text-capitalize">' + msg +'</span><button class="btn-reset close-img" onclick="removeToast(this)"><i class="sprite sprite-close_btn"></i></button></div>';
    }
    else{
        element = '<div class="animated fadeInUp failure toast d-flex justify-content-center position-relative mt-lg-5"><span class="alert-danger p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-capitalize">'+ msg +'</span><button class="btn-reset close-img" onclick="removeToast(this)"><i class="sprite sprite-close_btn"></i></button></div>'
    }

    if(length == 2){
        $('#success-failure-toast-container').children().first().remove();
    }
    $('#success-failure-toast-container').append(element);

    setTimeout(()=>{
       $('#success-failure-toast-container').children().first().remove();
    },30000)
}

function removeToast(element){
    $(element).parent().remove();
}

// function displayToast(msg, type){
//     let length = $('#success-failure-toast-container div').length, element
//     if(type == 'success'){
//         $.notify({
//             message: msg
//         },{
//             type: 'success',
//             timer: 30000,
//             spacing: 50,
//             offset: {
//                 x: 50,
//                 y: 200,
//             },
//             placement: {
//                 from: "bottom",
//                 align: "right",
//             },
//             template: '<div data-notify="container" class="alert alert-{0} max-320 sb-shadow success toast p-0" role="alert">' +
//                 '<button type="button" aria-hidden="true" class="close btn-reset close-img" data-notify="dismiss"><i class="sprite sprite-close_btn"></i></button>' +
//                 '<span data-notify="icon"></span> ' +
//                 '<span data-notify="title">{1}</span> ' +
//                 '<span data-notify="message" class="p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-lg-center text-capitalize d-block">{2}</span>' +
//                 '<div class="progress" data-notify="progressbar">' +
//                     '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
//                 '</div>' +
//                 '<a href="{3}" target="{4}" data-notify="url"></a>' +
//             '</div>' 
//         });
//     }
//     else{
//         $.notify({
//             message: msg
//         },{
//             type: 'danger',
//             timer: 30000,
//             spacing: 50,
//             offset: {
//                 x: 50,
//                 y: 200,
//             },
//             placement: {
//                 from: "bottom",
//                 align: "right"
//             },
//             template: '<div data-notify="container" class="alert alert-{0} max-320 sb-shadow failure toast w-100 p-0" role="alert">' +
//                 '<button type="button" aria-hidden="true" class="close btn-reset close-img" data-notify="dismiss"><i class="sprite sprite-close_btn"></i></button>' +
//                 '<span data-notify="icon"></span> ' +
//                 '<span data-notify="title">{1}</span> ' +
//                 '<span data-notify="message" class="alert-danger p-15 pt-lg-2 pb-lg-2 w-100 position-relative text-lg-center text-capitalize d-block">{2}</span>' +
//                 '<div class="progress" data-notify="progressbar">' +
//                     '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
//                 '</div>' +
//                 '<a href="{3}" target="{4}" data-notify="url"></a>' +
//             '</div>' 
//         });
//     }
//     if(length == 2){
//         $('#success-failure-toast-container').children().first().remove();
//     }
// }