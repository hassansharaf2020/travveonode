var mysql = require('mysql2');
const { dboptions } = require('../config');
var con = mysql.createPool(dboptions);
// var conn = mysql.createConnection(dboptions);
// const util = require('util');

exports.execute = function(sql,callback){
    con.getConnection(function(err,connection) {
        if (err) throw err;
        connection.query(sql, function (err, rows) {
            console.log(sql);
            connection.release();
            if (err) throw err;
            callback(JSON.parse(JSON.stringify(rows)))
        });
    });
}

exports.asyncexecute = async function(sql){
    //  console.log(sql);
    return await new Promise((resolve, reject)=>{
        // console.log(con);
    con.query(sql,  async (error, results)=>{
        if(error) {
            // console.log(sql);
            if (error['code'] == 'ER_LOCK_DEADLOCK') return [];
            else return reject(error);   
        }
        var result = await JSON.parse(JSON.stringify(results));
        return resolve(result);
     });
    });
};