const request = require('request');
const awaitrequest = require("request-promise");
const xml2js = require('xml2js');
const date = require('date-and-time');
const config = require('../config');
const fs = require('fs');
var db = require('./db')

exports.juniperRequest = function(body,callback,action,uri='',method='POST'){
    if(uri == '') uri = 'https://xml-uat.bookingengine.es/WebService/jp/operations/staticdatatransactions.asmx';
    else uri = 'https://xml-uat.bookingengine.es/WebService/jp/operations/'+uri;
    request({
               method: method,
               uri: uri,
               gzip: true,
               body: body,
               headers: {
                   "User-Agent": "node-request",
                   "Accept-Encoding": "gzip,deflate",
                   "Host": "xml-uat.bookingengine.es",
                   "Content-Type": "text/xml; charset=utf-8",
                   "SOAPAction": '"http://www.juniper.es/webservice/2007/'+action+'"'
               }
           }
           , function (error, response, body) {
               if(typeof body == 'undefined') return callback(['connection failed Blocked IP'] , [])
               // body is the decompressed response body
               xml2js.parseString(body, (err, data) => {
                   if(err)  callback(err , [])
                   else callback([] , data)
               });
           })
}


exports.giataRequest = function(body,callback,uri='',method='GET'){
    if(uri == '') uri = 'http://ghgml.giatamedia.com/webservice/rest/1.0/items/';
    // console.log(uri);
    auth =  "Basic " + new Buffer.from(config.giata_user + ":" + config.giata_pass).toString("base64");
    request({
        method: method,
        uri: uri,
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            'authorization' :  auth
        },
    }, function (error, response, body) {
        // console.log(error);
        if(error) return callback(error , [])
        // body is the decompressed response body
        xml2js.parseString(body, (err, data) => {
            if(err)  callback(err , [])
            else callback([] , data)
        });
    })
}

exports.giataAwaitRequest = async function(body,uri='',method='GET'){
    if(uri == '') uri = 'http://ghgml.giatamedia.com/webservice/rest/1.0/items/';
    // console.log(uri);
    auth =  "Basic " + new Buffer.from(config.giata_user + ":" + config.giata_pass).toString("base64");
    var options = {
        uri: uri,
        method: method,
        headers: {
            "Content-Type": "text/xml; charset=utf-8",
            'authorization' :  auth
        }
    }
    try {
        var result = await awaitrequest(options);
        result = await parseXml(result);
        return result;
    } catch (err) {
        console.error(err);
    }
}


exports.giatadownloadimageRequest = function(uri='',path){
    auth =  "Basic " + new Buffer.from(config.giata_user + ":" + config.giata_pass).toString("base64");
    request({
        method: 'GET',
        uri: uri,
        headers: {
            "Content-Type": "image/jpeg",
            'authorization' :  auth
        },
    }, function (error, response, body) {}).pipe(fs.createWriteStream(path));
}


exports.handelError =  function(err ,data ,key){
    var error = [];
    if(typeof data['soap:Envelope'] == 'undefined' ) return ['connection failed'];
    // console.log(data['soap:Envelope']['soap:Body'][0]['soap:Fault']);

    if(typeof data['soap:Envelope']['soap:Body'][0]['soap:Fault'] != 'undefined') 
        return data['soap:Envelope']['soap:Body'][0]['soap:Fault'][0];

    if(typeof data['soap:Envelope']['soap:Body'][0][key[0]][0][key[1]][0]['Errors'] != 'undefined') 
        return data['soap:Envelope']['soap:Body'][0][key[0]][0][key[1]][0]['Errors'][0]['Error'];

    if(err.length != 0 || typeof data['soap:Envelope']['soap:Body']+key == 'undefined') 
        error  = err.length != 0 ? [err] : ['connection failed']
    return error;
}

exports.currentdate = function(){
    const now = new Date();
    return date.format(now, 'YYYY-MM-DD HH:mm:ss');
}

exports.readfile = function(path,readcallback,count=80){
    fs.readFile(path, 'utf8', async function(err, data) {
        if (err) throw err;
        filecontent = JSON.parse(data);
        result = [];cash = [];i=0;
        filecontent['data'].forEach(hotel=>{
            if(i < count) result[i] = hotel;
            else cash[i-count] = hotel;
            i++;
        });
        filecontent['data'] = cash;

        if(filecontent['data'].length == 0) fs.unlinkSync(path);
        else{
            fs.writeFile(path, JSON.stringify(filecontent), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        }
        readcallback(result)
      });
}

exports.checklanguage = async function(lang){
    var rows = await db.asyncexecute("SELECT * FROM `languages` where code='"+lang+"'");
    if(typeof rows[0] == 'undefined') return 0
    else return rows[0]['id'];
}

exports.sleep = function(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  function parseXml(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}


