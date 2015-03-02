# JSONToSQL

### Why?

during my development when dealing with SQL queries I found my self handling with too much string manipulations mixed with logic ending with unreadable spaghetti code which caused a lot of stupid bugs like missed closing quotation mark etc...

then I found [knex.js](http://knexjs.org) and I found it lovely. with knex you can express your SQL with regular javaScript functions with intuitive syntax like select(), where() etc.

from the other hand, while developing in JS I found JSON as the most convenient data structure I know.

so I decided to combine all that good things to one place.

it's a very young project and I would be very glad to get help with suggestions and pull requests.

hope you will enjoy it.

### examples

```javascript
var JSONToSQL = require('JSONToSQL')({
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