/**
 * Created by atli on 4.11.2016.
 */
$(document).ready(function() {
    $('.slider').slick(
        {
            dots: true,
            arrows: true,
            speed: 900,
            slidesToShow: 5,
            infinite: true,
            slidesToScroll: 3,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
                {
                    breakpoint: 1170,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 940,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        }
    )
});
