/*jslint browser: true*/
var spreadSheetData = {};
function parseData(entry) {
    "use strict";
    var i = 0,
        row,
        entryLength = entry.length,
        currentCellRow,
        col,
        rowData;
    while (i < entryLength) {
        row = parseInt(entry[i].gs$cell.row, 10);
        currentCellRow = parseInt(entry[i].gs$cell.row, 10);
        rowData = {};
        while (row === currentCellRow && i < entryLength) {
            col = parseInt(entry[i].gs$cell.col, 10);
            switch (col) {
            case 1:
                break;
            case 2:
                rowData.name = entry[i].content.$t;
                break;
            case 3:
                rowData.email = entry[i].content.$t;
                break;
            case 4:
                rowData.affiliation = entry[i].content.$t;
                break;
            case 5:
                rowData.areasOfInterest = entry[i].content.$t;
                break;
            case 6:
                rowData.position = entry[i].content.$t;
                break;
            case 7:
                rowData.city = entry[i].content.$t;
                break;
            case 8:
                rowData.country = entry[i].content.$t;
                break;
            default:
                window.console.log("error Parsing Data " + entry[i]);
                break;
            }
            i = i + 1;
            if (i < entryLength) {
                currentCellRow = parseInt(entry[i].gs$cell.row, 10);
            }
        }
        spreadSheetData[row] = rowData;
    }
    spreadSheetData.length = row;
}
function findmatches(keyword, column) {
    "use strict";
    var regexp = new RegExp(keyword, "i"),
        i,
        counter = 0,
        results = {};
    for (i = 2; i <= spreadSheetData.length; i = i + 1) {
        if (!(spreadSheetData[i] === undefined)) {
            if (regexp.test(spreadSheetData[i][column])) {
                results[counter] = spreadSheetData[i];
                counter = counter + 1;
            }
        }
    }
    results.length = counter;
    return results;
}
function printResults(results) {
    "use strict";
    var searchresults = document.getElementById("spreadSheetSearchResults"),
        i,
        row,
        name,
        email,
        affliation,
        areasOfInterest,
        position,
        city,
        country,
        offset;
    if (results.length === 0) {
        document.getElementById("spreadSheetSearchResultsMsg").innerHTML = "No Results Found";
        offset = $("#spreadSheetSearchResultsMsg").offset();
        offset.top -= 50;
        $('html, body').animate({
            scrollTop: offset.top
        });
        searchresults.innerHTML = "";
    } else {
        document.getElementById("spreadSheetSearchResultsMsg").innerHTML = "Total Results Found :" + results.length + "<br>Search Results:";
        searchresults.innerHTML = "";
        row = searchresults.insertRow(0);
        name = row.insertCell(0);
        email = row.insertCell(1);
        affliation = row.insertCell(2);
        areasOfInterest = row.insertCell(3);
        position = row.insertCell(4);
        city = row.insertCell(5);
        country = row.insertCell(6);
        name.innerHTML = "<div>" + spreadSheetData[1].name + "</div>";
        email.innerHTML = "<div>" + spreadSheetData[1].email + "</div>";
        affliation.innerHTML = "<div>" + spreadSheetData[1].affiliation + "</div>";
        areasOfInterest.innerHTML = "<div>" + spreadSheetData[1].areasOfInterest + "</div>";
        position.innerHTML = "<div>" + spreadSheetData[1].position + "</div>";
        city.innerHTML = "<div>" + spreadSheetData[1].city + "</div>";
        country.innerHTML = "<div>" + spreadSheetData[1].country + "</div>";
        for (i = 0; i < results.length; i = i + 1) {
            row = searchresults.insertRow(i + 1);
            name = row.insertCell(0);
            email = row.insertCell(1);
            affliation = row.insertCell(2);
            areasOfInterest = row.insertCell(3);
            position = row.insertCell(4);
            city = row.insertCell(5);
            country = row.insertCell(6);
            name.innerHTML = "<div>" + results[i].name + "</div>";
            email.innerHTML = "<div>" + results[i].email + "</div>";
            affliation.innerHTML = "<div>" + results[i].affiliation + "</div>";
            areasOfInterest.innerHTML = "<div>" + results[i].areasOfInterest + "</div>";
            position.innerHTML = "<div>" + results[i].position + "</div>";
            city.innerHTML = "<div>" + results[i].city + "</div>";
            country.innerHTML = "<div>" + results[i].country + "</div>";
        }
    }
}
function search() {
    "use strict";
    if (!(spreadSheetData.length)) {
        document.getElementById("spreadSheetSearchResultsMsg").innerHTML = "Something went wrong :( ... Please Refresh the page ";
        return;
    }
    var searchparameters = {},
        results;
    searchparameters.keyword = document.getElementById("spreadSheetSearchKeyword").value;
    searchparameters.column = document.getElementById("spreadSheetSearchColumn").value;
    results = findmatches(searchparameters.keyword, searchparameters.column);
    printResults(results);
}
function spreadSheedSearchCallback(data) {
    "use strict";
    var entry = data.feed.entry;
    parseData(entry);
    document.getElementById("spreadSheetSearch").style.visibility = "visible";
//        console.log(spreadSheetData);
}
