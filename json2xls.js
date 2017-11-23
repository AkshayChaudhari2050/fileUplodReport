const remote = require('electron').remote

var button = document.createElement('button')
button.textContent = "Print excel"
button.addEventListener('click', () => {
    var json2xls = require('json2xls');
    var fs = require('fs');
    var sql = require('mssql');
    var dbConfig = {
        user: "sa",
        password: "sapwd",
        server: "192.168.0.147",
        database: "myDemo"
    };
    sql.close()
    sql.connect(dbConfig, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Student', function (err, recordset) {
            if (err) console.log(err)
            var uniqueFilename = require('unique-filename')
            var randomPrefixedTmpfile = uniqueFilename('./report/', 'Student')
            var xls = json2xls(recordset.recordset, {});
            fs.writeFileSync(randomPrefixedTmpfile + '.xlsx', xls, 'binary');
        });
    });
});
document.body.appendChild(button)