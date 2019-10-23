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
    if(window.location.href.includes('#/cart')){
        loadCartApp();
        $('.cart-wrapper').addClass('active');
    }

    let lat_lng = getCookie('lat_lng')
    if(lat_lng){
        window.lat_lng = [parseFloat(lat_lng.split(',')[0]), parseFloat(lat_lng.split(',')[1])]
        let formatted_address = getCookie('formatted_address');
        if(formatted_address){
            window.formatted_address = formatted_address;
            document.querySelector("#selected-location-address").innerHTML = formatted_address;
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
    console.log("location hash changed");
    if (location.hash === '#/cart') { 
        loadCartApp();
        $('.cart-wrapper').addClass('active');
    } 
}

loaded = false;

function loadCartApp(){
    console.log("file_hashes ==>", react_js_file_hashes);
    if(!loaded){
        let url = "/wp-content/themes/ajency-portfolio/js/cart/static/";
        if(window.location.hostname == "localhost"){
            url = "/greengrainbowl" + url;
        }

        $("<link/>", {
           rel: "stylesheet",
           type: "text/css",
           href: url+"css/main.c11e78da.chunk.css"
        }).appendTo("head");

        $.getScript(url+"js/runtime-main."+ react_js_file_hashes['runtime-main'] +".js")        
            .done(function(script, textStatus){
                $.getScript(url+"js/main."+ react_js_file_hashes['main'] +".chunk.js")
                    .done(function(script2, textStatus2){
                                $.getScript(url+"js/2."+ react_js_file_hashes['2'] +".chunk.js")
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
   window.showGpsModalPrompt(true);
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