Besides viewing a public table's attributes, you can also access the table's features using a GET request. A feature is a data entry in a table, represented by each row in the table. It can be a point, polygon, or polyline. 

The basic URL to access a features list is:                  
https://www.googleapis.com/mapsengine/v1/tables/{tableId}/features?version=published&key={APIkey}{other parameters}

“version” and “key” are two required parameters. If you have other parameters(queries, will be explained in the next lesson), you can join them together in the URL with the ‘&’ symbol.

One example of the URL:  
[https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0](https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0)  

**EXERCISE**  
Try to make the URL to list a table's features. Use the table ID = 15474835347274181123-16555504137828543390 and your valid API Key for the URL, then click submit.