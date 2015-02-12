# JSONToSQL

### Why?

during my development when dealing with SQL queries I found my self handling with too much string manipulations mixed with logic ending with unreadable spaghetti code which caused a lot of studied bugs like missed closing quotation mark and <other examples>
then I found [knex.js](http://knexjs.org) and I found it lovely. with knex you can express your SQL with regular javaScript functions with intuitive syntax like select(), where() etc.