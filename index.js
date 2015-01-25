var SETTINGS = {
    APP_NAME: 'JSONToSQL'
};

var _ = require('lodash');
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host     : '127.0.0.1',
        user     : 'your_database_user',
        password : 'your_database_password',
        database : 'myapp_test'
    }
});

var functionsVocabulary = require('./dictionary/functions');

global.kn = function(jsonQuery, knexObj){
    var $knex = knexObj || knex();

    for(var key in jsonQuery){
        if ( _.isFunction(functionsVocabulary[key]) ){
            var params = jsonQuery[key];
            functionsVocabulary[key]($knex, params);
        }else{
            console.warn( key + ' is an unrecognized word by ' + SETTINGS.APP_NAME )
        }

        if(_.isObject(params)){
            kn(params, $knex);
        }
    }
    return $knex;
};

var query = {
    $select: {
        $from: 'users',
        $fields: ['first_name', 'last_name'],
        $where: {
            $rel: "and",
            first_name: "adiel",
            age: ['>', 25],
            last_name: ['like', '%zale%'],
            $in: [
                [6, {
                    $select: {
                        $from: 'users',
                        $fields: 'id',
                        $where: {
                            age: ['<=', 30]
                        }
                    }
                }],
                ['adiel', {
                    $select: {
                        $from: 'users',
                        $fields: 'id',
                        $where: {
                            age: ['<=', 30]
                        }
                    }
                }]
            ]
/*            $in: [6, {$select: {

            }}]*/
        }/*,
        $join: {

        }*/
    }
};

console.log( kn(query).toString() );