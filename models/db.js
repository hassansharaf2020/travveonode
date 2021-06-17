var mysql = require('mysql');
const { dboptions } = require('../config');
var con = mysql.createPool(dboptions);

exports.execute = function(sql,callback){
    con.getConnection(function(err,connection) {
        if (err) throw err;
        connection.query(sql, function (err, rows) {
            connection.release();
            if (err) throw err;
            callback(rows)
        });
    });
}