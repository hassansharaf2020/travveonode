const request = require('request');
const xml2js = require('xml2js');

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