'use strict';
var fecha = require('fecha');
var express = require('express');
var router = express.Router();
var session = require('express-session');
var groups = require('../models/groups');
var db = require('../middleware/dbTools');
var authTools = require('../middleware/authTools');
var apiTools= require('../middleware/apiTools');
var pikkTools= require('../middleware/pikkTools');
var groupTools= require('../middleware/groupTools');
var eventTools= require('../middleware/eventTools');

var notificationTools = require('../middleware/notificationTools');

var Group = db.Group;
var User = db.User;
var Event = db.Event;
var Notification = db.Notification;

module.exports = router;


//THIS ROUTE MUST BE AT TOP
//----------ROUTING FOR CHOOSE------------//
router.use('/:eventid/choose',
    authTools.isLoggedIn,
    apiTools.queryByTags,
    apiTools.doSearch,
    //pikkTools.filterByDistance,
    getChoose
);

router.get('/createevent',
    showCreateEvent);

router.post('/createevent',
    createEvent);

router.use('/:eventid',
    eventTools.choosePlace, //gefur req.picked_place - BOOL
    eventTools.getUnDecidedMembers, //gefur req.decidedMembers - []user
    eventTools.getDecidedMembers, //gefur req.decidedMembers - []user
    eventTools.checkIfEventReady, //gefur req.eventReady - BOOL
    apiTools.pickAPlace,
    apiTools.queryByIds, //gefur results fra APA
    showEventPage);

router.get('/',
    displayEventPage);


router.get('/createevent', authTools.isLoggedIn,showCreateEvent);
router.post('/createevent', authTools.isLoggedIn, createEvent);
router.get('/',authTools.isLoggedIn, displayEventPage);


//-------handlers------//

function getChoose(req,res,next){
    var user = req.session.user;
    res.render('choose', {
        title           : 'Choose',
        results         : req.search_result,

        event_id        : req.params.eventid,


        user            : user,
        groups          : req.user_groups,
        events          : req.user_events,
        notifications   : req.notifications
    });
}

function showCreateEvent(req, res, next) {
    var user = req.session.user;
    res.render('createevent',{
        user            : user,
        groups          : req.user_groups,
        events          : req.user_events,
        notifications   : req.notifications
    });
}

function createEvent(req, res, next){
    var user = req.session.user;
    var title = req.body.title;
    var description = req.body.description;
    var deadline = fecha.format(new Date(req.body.deadline),'YYYY-MM-DD HH:mm:ss')+' +02:00';
    var toe = fecha.format(new Date(req.body.toe),'YYYY-MM-DD HH:mm:ss')+' +02:00';
    var currentgroup = req.session.currentGroup;

    var groupid = req.session.currentGroup.id;
    Group.findOne({
            where: {id: groupid},
            include: [{model:User, as:'member'}]
        }
    ).then(function(group){
        //Create the event
        Event.create({
            title: title,
            description: description,
            deadline: deadline,
            toe: toe,
            groupId: groupid
        })
            .then(function (event) {
                var groupmembers = group.member;

                //add all groupmembers to the event
                event
                    .addMember(groupmembers)
                    .then(function(members){

                        var notificationArray = [];
                        var url = '/e/'+event.id;
                        var content = user.first_name + ' invited you to the event '+title
                            +' with your group '+currentgroup.name +'!';

                        groupmembers.forEach(function (member) {
                            if(member.dataValues.id != user.id)
                                notificationArray.push({
                                    url     : url,
                                    memberId: member.dataValues.id,
                                    content : content
                                });
                        });
                        // Notify all members
                        Notification
                            .bulkCreate(notificationArray)
                            .then(function(notification){
                                res.redirect(url);
                            });
                    });
            },function(err){
                return next('no thing'+err);
            });
    }, function(err){
        return next('no group'+err);
    });
}

function showEventPage(req, res, next){
    var user = req.session.user;
    var eventid = req.params.eventid;
    req.session.user.current_event_id = eventid;

    // console.log('the whole shabang');
    // console.log(req.hasSelected);
    // console.log('mamma mia');
    // console.log(req.decidedMembers);
    // console.log('pabbi pia');
    // console.log(req.unDecidedMembers)
    // console.log(req.eventReady);
    // // console.log(req.search_result);

    var jaObject;
    if(req.eventReady){
        jaObject = req.search_result;

        console.log(jaObject);
        console.log('!-------------------------');
    }


    Event.findOne({
        where:{
            id: eventid
        },
        include: [{
            model: User,
            as: 'member'
        }]
    })
        .then(function(event){


            console.log(req.search_result[0]);
                res.render('eventlayout', {
                    event           : event,

                    user            : user,
                    groups          : req.user_groups,
                    events          : req.user_events,
                    notifications   : req.notifications,
                    eventReady      : req.eventReady,
                    unDecidedMembers: req.unDecidedMembers,
                    results:req.search_result,
                    decidedMembers  : req.decidedMembers,
                    hasSelected     : req.hasSelected,
                    jaObject        : req.search_result[0]
                });
            }
        );
}
function getj(){
    return {"white": {
        "meta": {
            "total_time": 0.4000396728515625,
            "api_version": "5",
            "items_per_page": 10,
            "search_steps_explanation": "",
            "search_time": 0.002,
            "paging": false,
            "query": "hamborgarafabrikkan",
            "copyright": "© 2016, Já hf.",
            "company_types": {},
            "last_item": 0,
            "query_id": "P9T5CZIK9jQYz9r1",
            "first_item": 1,
            "tags": {},
            "total_results": 0
        },
        "items": []
    },
        "yellow": {
            "meta": {
                "total_time": 0.4000513553619385,
                "api_version": "5",
                "items_per_page": 10,
                "search_steps_explanation": "",
                "search_time": 0.003,
                "paging": false,
                "query": "hamborgarafabrikkan",
                "copyright": "© 2016, Já hf.",
                "company_types": {},
                "last_item": 1,
                "query_id": "P9T5CZIK9jQYz9r1",
                "first_item": 1,
                "tags": {},
                "total_results": 1
            },
            "items": [
                {
                    "address": "Katrínartúni 2",
                    "fax": null,
                    "address_nominative": "Katrínartún 2",
                    "rating_score": 310,
                    "booking_link": null,
                    "url_pretty": "www.fabrikkan.is",
                    "has_infopage": null,
                    "brand_banner_modified": "2016-10-30 00:00:00",
                    "name": "Íslenska Hamborgarafabrikkan",
                    "cluster_rating_mean": 4.2,
                    "hide_ssn": false,
                    "rating_count": 58,
                    "house_number_supplement": "",
                    "twitter_uid": null,
                    "match_in_oskrad": false,
                    "brand_banner_path": "http://media.ja.is/sala/vorumerkjasida/banner/bannandi.png",
                    "logo_url_medium": "sala/logo/200x114/24816_1_1_HT0oa6p.png",
                    "url": "http://www.fabrikkan.is",
                    "logo_url_low": "sala/logo/100x57/24816_1_1_HT0oa6p.png",
                    "bold": true,
                    "postal_station_nominative": "105 Reykjavík",
                    "vat_number": "103255",
                    "has_branches": true,
                    "banned": false,
                    "is_person": false,
                    "first_name": "Íslenska Hamborgarafabrikkan",
                    "street": "Katrínartúni",
                    "municipality": "Reykjavík",
                    "hashid": "21pnM",
                    "facebook_uid": null,
                    "logo_url": "sala/logo/120x70/24816_1_1_HT0oa6p.png",
                    "brand_banner_height": 398,
                    "logo_url_high": "sala/logo/300x171/24816_1_1_HT0oa6p.png",
                    "has_map_img": null,
                    "cluster_rating_score": 310,
                    "hours_presentation": [
                        [
                            "sun-mið",
                            "11-22",
                            "current-closed"
                        ],
                        [
                            "fim-lau",
                            "11-24",
                            ""
                        ]
                    ],
                    "occupation": "Höfðatorgi",
                    "gift_certificate_link": null,
                    "cluster_rating_split": {
                        "1": 3,
                        "2": 5,
                        "3": 7,
                        "4": 8,
                        "5": 35
                    },
                    "video_url": null,
                    "rating_comment_id": 3711,
                    "instant_messaging_address": null,
                    "postal_station": "105 Reykjavík",
                    "rating_split": {
                        "1": 3,
                        "2": 5,
                        "3": 7,
                        "4": 8,
                        "5": 35
                    },
                    "indexed_at": "2016-10-29 21:09:12",
                    "additional_phones": [],
                    "has_slogan": null,
                    "hours": "sun-mid 11:00-22:00\nfim-lau 11:00-00:00",
                    "last_name": "",
                    "has_branded_page": true,
                    "slogan": null,
                    "is_open": false,
                    "subtype": null,
                    "distance": null,
                    "cluster_rating_count": 58,
                    "type": "yellow",
                    "middle_name": "",
                    "postal_code": 105,
                    "distance_display": null,
                    "color": null,
                    "twitter_link": null,
                    "coordinates": {
                        "show_map_link": true,
                        "y": 407935,
                        "lat": 64.144973,
                        "ja360_url": "http://ja.is/kort/?q=%C3%8Dslenska%20Hamborgarafabrikkan%2C%20Katr%C3%ADnart%C3%BAni%202&x=358541&y=407946&z=8&ja360=1&ji=1053854&jh=351&fov=90&vlookat=0.0",
                        "ja360_heading": 350.64966,
                        "ja360_fov": 90,
                        "x": 358518,
                        "ja360_image_url": "http://stor-1.ja.is/preview/preview_1493514.jpg",
                        "ja360_vlookat": 0,
                        "lon": -21.907435,
                        "ja360_image_id": 1053854,
                        "map_image_url": "http://ja.is/kort/static/?x=358518&y=407935&z=7",
                        "ja360_image_y": 407946,
                        "has_360": true,
                        "ja360_image_x": 358541,
                        "map_url": "http://ja.is/kort/?q=%C3%8Dslenska%20Hamborgarafabrikkan%2C%20Katr%C3%ADnart%C3%BAni%202&x=358518&y=407935&z=8&type=map"
                    },
                    "email": "fabrikkan@fabrikkan.is",
                    "has_ratings": null,
                    "phone": {
                        "pretty": "575 7575",
                        "number": "5757575",
                        "country_code": "",
                        "type": "almenn",
                        "operator": "07",
                        "banned": false
                    },
                    "has_coordinates": true,
                    "is_primary": true,
                    "company_type": [
                        "veisluþjónusta",
                        "veitingastaður"
                    ],
                    "brand_banner_width": 916,
                    "country": null,
                    "keywords": [
                        "borgari",
                        "burger",
                        "börger",
                        "citizen",
                        "fabrikka hamburger",
                        "fabrikkan",
                        "fabrikkuborgari",
                        "food",
                        "hamborgarafabrikkan",
                        "hamborgari",
                        "matur",
                        "morhtens",
                        "morthens",
                        "restaurant",
                        "simmi and jói",
                        "simmi og jói",
                        "tavern",
                        "veitingahús",
                        "veitingastaður",
                        "íslenska hamborgarafabrikkan"
                    ],
                    "slug": "islenska-hamborgarafabrikkan",
                    "map_img_url": null,
                    "facebook_link": null,
                    "sub_lines": [
                        {
                            "title": "Afgreiðslutími:",
                            "phones": [],
                            "bold": false,
                            "color": null,
                            "type": "phone"
                        },
                        {
                            "title": "Sun-mið kl 11:00-22:00.  Fim-lau kl 11:00-00:00",
                            "phones": [],
                            "bold": false,
                            "color": null,
                            "type": "phone"
                        }
                    ],
                    "categories": [
                        "hamburger restaurants",
                        "veitingahús",
                        "restauracje serwujace hamburgery",
                        "hamborgarastaðir",
                        "restauracje",
                        "restaurants"
                    ],
                    "brand_background_color": "#ffffff",
                    "square_logo_url_large": null,
                    "branch_title": {
                        "is": {
                            "plural": "Aðrar skráningar",
                            "singular": "Önnur skráning"
                        },
                        "en": {
                            "plural": "Other entries",
                            "singular": "Another entry"
                        }
                    },
                    "social": [],
                    "rating_display": true,
                    "has_description": null,
                    "phonebook_id_number": "1493514",
                    "description": null,
                    "rating_mean": 4.2,
                    "national_id_number": "7107090170",
                    "square_logo_url_small": null,
                    "cluster_key": "hamborgarafabrikkan",
                    "house_number": 2,
                    "explanation": null,
                    "common_id": "1493514",
                    "is_branch": false,
                    "service_page_path": "hamborgarafabrikkan",
                    "brand_banner_target": "http://www.fabrikkan.is/"
                }
            ]
        }
    };
}
function displayEventPage(req,res,next){
    var user = req.session.user;
    Event
        .findAll({
            include:[{model: User, as: 'member', where: {'google.id': user.google.id}}]
        })
        .then(function(events) {
            res.render('eventlist',{
                title: 'My groups',

                user            : user,
                events          : events,
                groups          : req.user_groups,
                notifications   : req.notifications
            });
        });
}