# JSONToSQL

### Why?

during my development when dealing with SQL queries I found my self handling with too much string manipulations mixed with logic ending with unreadable spaghetti code which caused a lot of stupid bugs like missed closing quotation mark and \<other examples\>
then I found [knex.js](http://knexjs.org) and I found it lovely. with knex you can express your SQL with regular javaScript functions with intuitive syntax like select(), where() etc.

### examples

```javascript
var JSONToSQL = require('./index.js')({
    client: 'mysql',
    connection: {
        host     : 'database_host',
        user     : 'database_user',
        password : 'database_password',
        database : 'database_name'
    }
});

var query = {
    $select: {
        $from: 'users',
        $fields: ['first_name', 'last_name'],
        $where: {
            $rel: "and",
            first_name: "albert",
            age: ['>', 25],
            last_name: ['like', '%einst%'],
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
                ['albert', {
                    $select: {
                        $from: 'users',
                        $fields: 'first_name',
                        $where: {
                            age: ['>', 12]
                        }
                    }
                }]
            ]
        }
    }
};

console.log( JSONToSQL(query).toString() );
// select `first_name`, `last_name` from `users` where 6 in (select `id` from `users` where `age` <= 30) and `albert` in (select `first_name` from `users` where `age` > 12) and `first_name` = 'albert' and `age` > 25 and `last_name` like '%einst%'
```