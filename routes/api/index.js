var express = require('express');
var apiTools = require('../../middleware/apiTools');
var validateTools = require('../../middleware/validateTools');
var pikkTools = require('../../middleware/pikkTools');
var authTools = require('../../middleware/authTools');
var notificationTools = require('../../middleware/notificationTools');
var querystring = require('querystring');
var session = require('session');
var groupTools = require('../../middleware/groupTools');
var eventTools = require('../../middleware/eventTools');
var dbTools = require('../../middleware/dbTools');
var passport = require('passport');
var router = express.Router();
var groups = require('./groups');


//------------ROUTING FOR INDEX------------//
router.get('/',
    pikkTools.getIndexFeed,
    apiTools.firstFeedConnector,
    getIndex
);

router.post('/',
    authTools.isLoggedIn,
    notificationTools.deleteIfOwner
);

function getIndex(req, res, next) {
    // console.log(req.user);
    if (req.params.format) {

    }else{
        res.send({
            results: req.feed_result,
            // user: req.session.user,
            // groups: req.user_groups,
            // events: req.user_events,
            // notifications: req.notifications,
            isIndex:true
        });
    }
}

//------------ROUTING FOR SEARCH------------//
// router.get('/search',
//     // authTools.isLoggedIn,
//     groupTools.getGroupsByUser,
//     eventTools.getEventsByUser,
//     notificationTools.getNotificationsByUser,
//     apiTools.doSearch,
//     getSearch
// );

// function getSearch(req, res, next) {
//     res.render('resultlist', {
//         results: req.search_result,
//         user: req.session.user,
//         groups: req.user_groups,
//         events: req.user_events,
//         notifications: req.notifications
//     });
// }

//------------ROUTING FOR PLACE------------//
router.get('/place/:placeId',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    apiTools.showPlace,
    getPlace
);

function getPlace(req, res, next) {
    var rating_string = (req.search_result[0].cluster_rating_mean).toString();
    // var user = req.session.user;
    res.send({
        // user: user,
        rating_string: rating_string,
        place: req.search_result[0],
        // groups: req.user_groups,
        // events: req.user_events
    });

}

//------------ROUTING FOR MAP------------//
router.get('/map/*',
    // authTools.isLoggedIn,
    // groupTools.getGroupsByUser,
    // eventTools.getEventsByUser,
    // notificationTools.getNotificationsByUser,
    showMap
);

function showMap(req, res, next) {
    var query = querystring.stringify(req.query);
    query = querystring.unescape(query);
    query = (querystring.parse(query));
    res.send({
        query: query,
        // user: req.session.user,
        // groups: req.user_groups,
        // events: req.user_events,
        // notifications: req.notifications
    });
}

//------------ROUTING FOR LOGOUT------------//
router.get('/logout', function (req, res) {
    req.logout();
    var home = req.headers.host;
    if(!home.startsWith('http://'))
        home = 'http://'+home;
    var logg =
        "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue="+home;

    req.session.destroy(function (err) {
        res.redirect(logg);
        // res.redirect('/');
    });
});

router.get('/tags',function(req,res){
    var tags = [
        {
            id: 1,
            tag1: 'kjúklingur',
            name: 'Chicken',
            tag2: 'chicken',
            desc: 'Chicken is amazing and healthy!',
            imgurl:  'https://edge.alluremedia.com.au/m/l/2013/04/Chicken2.jpg'
        },
        {
            id: 2,
            tag1: 'steik',
            name: 'Steak',
            tag2: 'beef',
            desc: 'Where\'s the beef?',
            imgurl: 'http://www.omahasteaks.com/gifs/990x594/fi004.jpg'
        },
        {
            id: 3,
            tag1: 'pítsa',
            name: 'Pizza',
            tag2: 'pizza',
            desc: 'No one can say no to a pizza?',
            imgurl: 'http://www.mysticpizza.com/admin/resources/pizza-pepperoni-w857h456.jpg'
        },
        {
            id: 4,
            tag1: 'hamborgari',
            name: "Hamburger",
            tag2: 'burger',
            desc: 'A hamburger is a good foody?',
            imgurl: 'http://images.r.cruisecritic.com/features/2016/04/best-burgers-hero.jpg'
        },
        {
            id: 5,
            tag1: 'sjávarréttir',
            name: 'Seafood',
            tag2: 'seafood',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'https://static.squarespace.com/static/5229dcade4b054f0e185b5f4/t/522dedf0e4b074119b2458ac/1378741744995/Seafood-dish-wallpaper_4074.jpg'
        },
        {
            id: 6,
            tag1: 'sushi',
            name: 'Sushi',
            tag2: 'healthy',
            desc: '123',
            imgurl: 'http://www.hesca.org/wp-content/uploads/2016/09/sushi-featured.jpg'
        },
        {
            id: 7,
            tag1: 'salat',
            name: 'Salad',
            tag2: 'healthy',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://assets.simplyrecipes.com/wp-content/uploads/2016/07/2016-08-12-BLT-Salad-3-600x400.jpg'
        },
        {
            id: 7,
            tag1: 'arabískt',
            name: 'Kebab',
            tag2: 'kebab',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://static.wixstatic.com/media/efa988_f77bf3153d4640928c2171ab5399df20.jpg_srz_980_648_85_22_0.50_1.20_0.00_jpg_srz'
        },
        {
            id: 8,
            tag1: 'tælenskt',
            name: 'Thai',
            tag2: 'thai',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://static.asiawebdirect.com/m/bangkok/portals/bangkok-com/homepage/food-top10/pagePropertiesImage/thai-foods.jpg'
        },
        {
            id: 9,
            tag1: 'asískt',
            name: 'Asian',
            tag2: 'asian',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://nebula.wsimg.com/82c2438bcec6ce077fdb9f5777483347?AccessKeyId=FB771320EF82836BDCA7&disposition=0&alloworigin=1'
        },
        {
            id: 10,
            tag1: 'indverskt',
            name: 'Indian',
            tag2: 'indian',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://i.telegraph.co.uk/multimedia/archive/03521/india-thali_3521793b.jpg'
        },
        {
            id: 11,
            tag1: 'mexikóskt',
            name: 'Mexican',
            tag2: 'mexican',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://vallartanayaritblog.com/wp-content/uploads/2016/06/a-mexican-food-20.jpg'
        },
        {
            id: 12,
            tag1: 'ítalskt',
            name: 'Italian',
            tag2: 'italian',
            desc: '',
            imgurl: 'https://alianosdundee.com/file/2015/12/Italian-Pasta-in-East-Dundee-IL-Alianos-Italian-Food.jpg'
        },
        {
            id: 13,
            tag1: 'íslenskt',
            name: 'Icelandic',
            tag2: 'icelandic',
            desc: '',
            imgurl: 'http://www.fotothing.com/photos/a02/a02d9ac804337e19e224e7a066085fa7.jpg'
        },
        {
            id: 14,
            tag1: 'hádegismatur',
            name: 'Brunch',
            tag2: 'brunch',
            desc: '',
            imgurl: 'http://www.maennlichen.ch/files/content/sommer/erlebnisse/kulinarische-erlebnisse/bergbrunch/bergbrunch.jpg'
        },
        {
            id: 15,
            tag1: 'vegan',
            name: 'Vegan',
            tag2: 'healthy',
            desc: '',
            imgurl: 'http://cdn.everything.io/vegankit/images/veggies.jpg'
        },
        {
            id: 16,
            tag1: 'hollt',
            name: 'Hollt',
            tag2: 'healthy',
            desc: '',
            imgurl: 'http://wire.kapitall.com/wp-content/image-import/healthy-food-stocks.jpeg'
        },
        {
            id: 17,
            tag1: 'bakarí',
            name: 'Bakery',
            tag2: 'bakery',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'https://discoverpasco.com/wp-content/uploads/2017/01/bakery_case1.jpg'
        },
        {
            id: 18,
            tag1: 'bístró',
            name: 'Bistro',
            tag2: 'bistro',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'http://www.finecooking.com/CMS/uploadedImages/Images/Cooking/Articles/Issues_61-70/fc70qd002-03_xlg.jpg'
        },
        {
            id: 19,
            tag1: 'kaffi',
            name: 'Coffee',
            tag2: 'juice',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'https://lisamulch.files.wordpress.com/2011/06/img_8930.jpg'
        },
        {
            id: 20,
            tag1: 'áfengi',
            name: 'Alcohol',
            tag2: 'alcohol',
            desc: 'Under the sea. Under the sea!',
            imgurl: 'https://www.eatrightontario.ca/EatRightOntario/media/Website-images-resized/Alcohol-v-2-resized.jpg'
        }
    ];
    res.send({
        tags: tags
    });
});

module.exports = router;