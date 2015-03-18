A Script That allows you to add a search box to your site that Searches a web published Google SpreadSheet and displays the result as a table

Depends on:
------------------
1. jQuery
2. jQuery-JSONP : https://github.com/jaubourg/jquery-jsonp

Setup:
---------
spreadSheeData.setup take URL and IDs of required Elements and URL of the spreadSheet as cells feed

in index.html
spreadSheetData.setup.pageid  = ''Its a long string of random letters in the the URL of the spreadsheet"
spreadSheetData.setup.sheetid  = ''Id of the worksheet in the spreadsheet to be searched usually '1' if it is first worksheet the file"
