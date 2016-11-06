/**
 * Created by atli on 5.11.2016.
 */


exports.findPlaces = function(req,res,next){
    req.bestFit = 'macland';
    next();
};

exports.createForm = function(req,res,next){
    //This is an example of how we can create new
    //options to add to /start
    var form = [
        {
            title:'drasl',
            icon:'fa-bicycle',
            groupId:'groupId1',
            subGroupId:'subgroupId1',
            mainVals:[
                'hallo',
                'ballo',
                'kallo',
                'trallo'
            ],
            valIcons:[
                'fa-cutlery',
                'fa-bicycle',
                'fa-cutlery',
                'fa-cutlery'
            ],
            text:'this is a test text test text text'
        }
    ];
    req.form = form;
    next();
}