var XLSX = require('xlsx');

function getSheet(data, opts) {
    var ws = {};

    var range = {
        s: {
            c:0, 
            r:0
        }, 
        e: {
            c:2, 
            r: data.length
        }
    };
    for(var R = 0; R < data.length; R++) {
        for(var C = 0; C < 2; C++) {

            var cell = {
                v: data[R][C],
                t: 'n'
            };
            var cell_ref = XLSX.utils.encode_cell({
                c:C,
                r:R
            });

            // if(C == 2) {
            //     cell.f = "Airport"+ (R+1) +"+Code" + (R+1);
            // }

            ws[cell_ref] = cell;
        }
    }
    ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}


var data = [
    [1, 2],
    [3, 4],
    [5, 6], 
    [7, 8]
];

function Workbook() {
    if(!(this instanceof Workbook)) {
        return new Workbook();
    }
    this.SheetNames = [];
    this.Sheets = {};
}

var wb = new Workbook();
var wsName = "Airports";
wb.SheetNames.push(wsName);



module.exports = {
    dataset: [],
    getExcelFile: function (resultset, res) {
        wb.Sheets[wsName] = getSheet(resultset);
        /* write file */
        XLSX.writeFile(wb, 'airports.xlsx');
    }
};