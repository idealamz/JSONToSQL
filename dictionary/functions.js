module.exports = functionjsonKnex;

var _ = require('lodash');

function jsonKnex(jsonQuery, knexObj){
    var $knex = knexObj || knex();

    for(var key in jsonQuery){
        if ( _.isFunction(key) ){
            var params = jsonQuery[key];
            key($knex, params);
        }else{
            console.warn( key + ' is an unrecognized word' )
        }

        if(_.isObject(params)){
            jsonKnex(params, $knex);
        }
    }
    return $knex;
};

function $select($knex, qObject){
    var fields = qObject.$fields ? _.cloneDeep(qObject.$fields) : '*';
    delete qObject.$fields;
    return $knex.select(fields);
}

function $from($knex, qObject){
    return $knex.from(qObject);
}

function $where($knex, qObject){
    var $rel = qObject.$rel || 'and';
    delete  qObject.$rel;

    if(qObject.$in){
        $in($knex, qObject.$in)
        delete qObject.$in;
    }

    for(var key in qObject){
        if( _.isString(qObject[key]) ){
            $knex[$rel + 'Where'](key, qObject[key]);
        }else if(_.isArray(qObject[key])){
            qObject[key].unshift(key);
            $knex[$rel + 'Where'].apply($knex, qObject[key] );
        }
        delete  qObject[key];
    }
    return $knex;
}

function $in($knex, qObject){
    if( _isMultipleCommands(qObject) ){
        qObject.forEach(function(command){
            $in($knex, command);
        });
    }else if( _isValueIsQuery(qObject) ){
        var innerQuery;
        innerQuery = jsonKnex(qObject[1]);
        return $knex.whereIn(qObject[0], innerQuery);
    }else{
        return $knex.whereIn(qObject);
    }
}

/**
 * getting every value from the main qObject to all it's offspring, returns
 * */
function _isMultipleCommands(qObject){
    return _.isArray(qObject) && _.isArray(qObject[0]);
}

/**
 * should get the final [key, value] qObject (_isMultipleCommands(qObject) == false).
 * if the value is calculated SQL query returns true.
 * */
function _isValueIsQuery(qObject){
    return !_.isUndefined(qObject[1].$select);
}