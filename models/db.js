var mysql = require('mysql');
const { dboptions } = require('../config');
var con = mysql.createPool(dboptions);
var conn = mysql.createConnection(dboptions);
const util = require('util');

exports.execute = function(sql,callback){
    con.getConnection(function(err,connection) {
        if (err) throw err;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) throw err;
            callback(JSON.parse(JSON.stringify(rows)))
        });
    });
}






exports.asyncexecute = async function(sql){
    // node native promisify
        const query = util.promisify(conn.query).bind(conn);
        const rows = await query(sql);
        return JSON.parse(JSON.stringify(rows));
    // return new Promise((resolve, reject)=>{
    //     con.query(sql,  (error, results)=>{
    //         if(error) return reject(error)
    //         console.log(results,error);
    //         return resolve(JSON.parse(JSON.stringify(results)));
    //     });
    // });
};