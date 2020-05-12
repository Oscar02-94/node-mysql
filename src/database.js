const mysql=require('mysql');
// como el modulo pool no soporta las promesas importamos utils y su metodo promisifile para que las sopirte
 const { promisify } = require('util'); 

const {database} = require('./key');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED') {
            console.log('DATABASE CONNECT WAS REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB is Connected');
    return;
});
// grcias a esta line vampos a poder usar asyn await
pool.query =  promisify(pool.query);

module.exports = pool;