App = {};
App.init = function() 
    var hamburger = $(".js-hamburger");
    var body      = $("body");
    hamburger.click(function() 
            {
                body.toggleClass("page-animate"); 
            });

    $('.js-slider').slick({
        autoplay: true,
        arrows: false,
    });
}();
