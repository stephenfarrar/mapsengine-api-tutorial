If you want to query a table for specific data, you can add additional parameters to a List Features request. There are several optional parameters you can use, which are:  

* intersects: get features which intersect with a geometry (point, polygon, circle, linestring)
* limit: create an upperbound of the number of features returned. If there are more features than the limit, the other features will not be shown.
* maxResults: determine the number of results displayed per page. If requires more than one page, it will return a nextPageToken at the bottom of the response.
* pageToken: accessing the next page results, as a consequence of the maxResults parameter.
* select: specified the properties of the features that will be shown in the result, equivalent to SQL projection clause. We can also create a new property(column alias).
* where: create a condition that must be fulfilled by the features returned. Equivalent to SQL predicate.
* orderBy: specified the ordering of the features returned (ascending/descending). It is equivalent to SQL order and it is ascending by default.  

One example of the query: [https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&maxResults=2](https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&maxResults=2)  
This example will return 2 features per page and return a nextPageToken at the bottom of the page.  

For more information regarding queries, you can read the [GME API Documentation for list features](https://developers.google.com/maps-engine/documentation/read).

**EXERCISE**  
Using the table ID = 15474835347274181123-14495543923251622067 and your valid API Key, create the URL to list features whose “Population” is less than 2 million. Click submit to see whether your answer is correct or not.