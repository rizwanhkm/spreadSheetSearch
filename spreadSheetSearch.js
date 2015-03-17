/*jslint browser: true */
/*global $:false */
var spreadSheetData = {
    "setup": {
        "url": "",
        "msg": "",
        "keyword": "",
        "column": "",
        "search": "",
        "resulttable": "",
        "startRow": "",
        "startCol": "",
        "defaultCol": ""
    }
};

function spreadSheetSearchGetData() {
    "use strict";

    function parseData(entry) {
        var i = 0,
            entryLength = entry.length,
            rowData = {},
            numberOfColumns = 0,
            row,
            col,
            currentCellRow;
        if (!(spreadSheetData.setup.startRow)) {
            spreadSheetData.setup.startRow = 1;
        }
        if (!(spreadSheetData.setup.startCol)) {
            spreadSheetData.setup.startCol = 1;
        }
        if (!(spreadSheetData.setup.defaultCol)) {
            spreadSheetData.setup.defaultCol = 1;
        }
        for (i = 0; parseInt(entry[i].gs$cell.row, 10) < (spreadSheetData.setup.startRow + 1); i = i + 1) {
            if (parseInt(entry[i].gs$cell.row, 10) === spreadSheetData.setup.startRow) {
                numberOfColumns = numberOfColumns + 1;
                rowData[numberOfColumns] = entry[i].content.$t;
            }
        }
        spreadSheetData[0] = rowData;
        spreadSheetData.columns = numberOfColumns;
        while (i < entryLength) {
            row = parseInt(entry[i].gs$cell.row - spreadSheetData.setup.startRow, 10);
            currentCellRow = parseInt(entry[i].gs$cell.row - spreadSheetData.setup.startRow, 10);
            rowData = {};
            while (currentCellRow === row && i < entryLength) {
                col = parseInt(entry[i].gs$cell.col, 10);
                rowData['"' + spreadSheetData[0][col] + '"'] = entry[i].content.$t;
                i = i + 1;
                if (i < entryLength) {
                    currentCellRow = parseInt(entry[i].gs$cell.row - spreadSheetData.setup.startRow, 10);
                }
            }
            spreadSheetData[row] = rowData;
        }
        spreadSheetData.rows = row;
    }


    function findmatches(keyword, column) {
        var regexp = new RegExp(keyword, "i"),
            i,
            counter = 0,
            results = {};
        for (i = 1; i <= spreadSheetData.rows; i = i + 1) {
            if (!(spreadSheetData[i] === undefined)) {
                if (regexp.test(spreadSheetData[i]['"' + column + '"'])) {
                    results[counter] = spreadSheetData[i];
                    counter = counter + 1;
                }
            }
        }
        results.length = counter;
        return results;
    }

    function printResults(results) {
        var i,
            j,
            row = "";
        if (results.length === 0) {
            $("#" + spreadSheetData.setup.msg).html("No Results Found");
            $("#" + spreadSheetData.setup.resulttable).find("tbody").empty();
        } else {
            $("#" + spreadSheetData.setup.msg).html("Total Results Found :" + results.length + "<br>Search Results:");
            $("#" + spreadSheetData.setup.resulttable).find("tbody").empty();
            row = "<tr>";
            for (i = spreadSheetData.setup.startCol; i <= spreadSheetData.columns; i = i + 1) {
                row += "<td><div>" + spreadSheetData[0][i] + "</div></td>";
            }
            row += "</tr>";
            $("#" + spreadSheetData.setup.resulttable).append(row);
            for (i = 0; i < results.length; i = i + 1) {
                row = "<tr>";
                for (j = spreadSheetData.setup.startCol; j <= spreadSheetData.columns; j = j + 1) {
                    row += "<td><div>" + results[i]['"' + spreadSheetData[0][j] + '"'] + "</div></td>";
                }
                row += "</tr>";
                $("#" + spreadSheetData.setup.resulttable).append(row);
            }
        }
    }

    function search() {
        var searchparameters = {},
            results;
        searchparameters.keyword = $("#" + spreadSheetData.setup.keyword).val();
        searchparameters.column = $("#" + spreadSheetData.setup.column).val();
        results = findmatches(searchparameters.keyword, searchparameters.column);
        printResults(results);
    }

    function spreadSheedSearchCallback(data) {
        var entry = data.feed.entry,
            o,
            i,
            defaultCol = spreadSheetData.setup.defaultCol;

        parseData(entry);
        o = new Option(spreadSheetData[0][defaultCol], spreadSheetData[0][defaultCol]);
        $(o).html(spreadSheetData[0][defaultCol]);
        $("#" + spreadSheetData.setup.column).append(o);
        for (i = spreadSheetData.setup.startCol; i <= spreadSheetData.columns; i = i + 1) {
            if (i !== defaultCol) {
                o = new Option(spreadSheetData[0][i], spreadSheetData[0][i]);
                $(o).html(spreadSheetData[0][i]);
                $("#" + spreadSheetData.setup.column).append(o);
            }
        }
        $("#" + spreadSheetData.setup.search).css("visibility", "visible");
        $("#" + spreadSheetData.setup.search).on("click", search);
        $("#" + spreadSheetData.setup.keyword).on("keyup", search);
        $(document).ready(function () {
            $("#" + spreadSheetData.setup.keyword).keyup(function () {
                var offset = $(this).offset();
                offset.top -= 50;
                $('html, body').animate({
                    scrollTop: offset.top
                });
            });
        });
    }

    $.jsonp({
        "url": spreadSheetData.setup.url + "?alt=json-in-script&callback=?",
        "callback": "spreadSheedSearchCallback",
        "success": spreadSheedSearchCallback,
        "error": function () {
            $("#" + spreadSheetData.setup.msg).innerHTML = "Something went wrong :( ... Please Refresh the page<br> ";
            return;
        }
    });
}
