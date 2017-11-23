const remote = require('electron').remote
var uniqueid = require('uniqueid')
var button = document.createElement('button')
button.textContent = "Print PDf"
button.addEventListener('click', () => {

    var Report = require('fluentReports').Report;
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
        // create Request object
        var request = new sql.Request();
        // query to the database and get the records
        request.query('select * from Student', function (err, recordset) {
            if (err) console.log(err)
            console.log(recordset)
            var uniqueFilename = require('unique-filename')
            var randomPrefixedTmpfile = uniqueFilename('./report/', 'Student')
            
            var rpt = new Report(randomPrefixedTmpfile+ ".pdf")
                .margins(20) // Change the Margins to 20 pixels
                .data(recordset.recordset) // Add our Data
                .pageHeader(headerFunction) // Add a header
                .pageFooter(footerFunction) // Add a footer
                .detail("{{Id}} {{Name}} {{RollNumber}}") // Put how we want to print out the data line.
                .render();
        });
    });
    var headerFunction = function (Report) {
        Report.print("Student List", {
            fontSize: 22,
            bold: true,
            underline: true,
            align: "center"
        });
        Report.newLine(2);
    };

    var footerFunction = function (Report) {
        Report.line(Report.currentX(), Report.maxY() - 18, Report.maxX(), Report.maxY() - 18);
        Report.pageNumber({
            text: "Page {0} of {1}",
            footer: true,
            align: "right"
        });
        Report.print("Printed: " + (new Date().toLocaleDateString()), {
            y: Report.maxY() - 14,
            align: "left"
        });
    };
}, false)
document.body.appendChild(button)