Besides viewing a table's attribute, you can also access table's features. A feature is a data entry in a table, represented by each row in the table. It can be a point, polygone, or polyline. To access a table's features in the GME API, you can type in a specific URL in your browser. It will return a list of features that the table has. However, you need to remember that in order to do this, the table that you want to access has to be publicly accessible.  

The basic URL to access features list:                  
https://www.googleapis.com/mapsengine/v1/tables/*{tableId}*/features?*{parameters}*  

If you have more than 1 parameter, you can join them together in the URL with the '&' symbol. There are 2 required parameters, that must be included in your URL, which are:

* version=published  
  The table must be a published version to be accessed.
* key=*your API key*  

One example of the URL:  
https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0  
You can copy this URL and paste it in the white input box below, and click the submit button to see the output. You can also try to create your own URL and submit it below!  

Before we take a look of other parameters that we can use, it is probably a good idea to learn about geometry functions in Maps Engine API, that might be useful for some of your parameters value (where and select parameters).  
Two main geometry functions in Maps Engine API are:  

1. Constructors
 * ST`_`POINT: creates a point from a longitude and latitude value.  
   The syntax: ST`_`POINT(lng, lat)  
 * ST`_`GEOMFROMTEXT: Creates a geometry from a string, specifying points and the geometry (polygon, linestring, etc.).
2. Relationships functions
 * ST`_`DISTANCE: Calculate shortest distance between two geometries. Accepts geometry column name and geometry value (might be the result of the constructors).  
   The syntax example: ST`_`DISTANCE(geometry, ST`_`POINT(1.23,4.56))
 * ST`_`INTERSECTS: Returns all features that intersect the described polygon. Accepts geometry column name and geometry value (might be the result of the constructors).  
   The syntax example: ST`_`INTERSECTS(geometry, ST`_`GEOMFROMTEXT('POLYGON((1 3, 1 1, 4 1, 4 4, 1 3))'))  

There are several optional parameters for the list feature, including:

* intersects  
  This parameter will return the features which is restricted by the geometries specified in the value. The geometries supported by Google Maps API are:
  * POLYGON
    * The syntax to specify a polygon:  
      intersects=POLYGON((v1`_`lng v1`_`lat, v2`_`lng v2`_`lat, ..., v1`_`lng v1`_`lat))  
      Where lng:longitude of the vertex and lat:latitude of the vertex  
    * The vertices must be specified in counter-clockwise order, and you can have up to 50 vertices
    * The first and last vertices has to be the same to close the polygon, hence you need to have at least 4 vertices(3 distinct points)  
    * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=POLYGON((175 -41, 174 -41, 174 -42, 175 -41))
  * POINT  
    * The syntax to specify a point:  
      intersects=POINT(lng lat)  
      Where lng:longitude of the point and lat:latitude of the point.  
    * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=POINT(174.7928369177438 -41.29150501119897)  
  * CIRCLE  
    * The syntax to specify a circle:  
      intersects=CIRCLE(center`_`lng center`_`lat, radius)  
      Where lng:longitude of the center of the circle and lat:latitude of the center of the circle.
    * The radius is in meters
    * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=CIRCLE(174.7928369177438 -41.29150501119897, 5000)
  * LINESTRING
    * The syntax to specify a linestring:  
      intersects=LINESTRING(pt1`_`lng pt1`_`lat, pt2`_`lng pt2`_`lat,...)  
      Where lng:longitude of the point and lat:latitude of the point.
    * May consist of up to 50 points.
    * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=LINESTRING(174.82994218881467 -41.312541307982784, 174.7928369177438 -41.29150501119897)
* limit
  * The value of this parameter will become the upper bound to the number of features returned. If there are more features than the limit, the number of features returned will be the value of the limit and the other features will not be shown.
  * Example(returning 3 results): https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&limit=3
  * You can try to change the value of the limit in the URL and see the changes to the output! Try it!
* maxResults
  * The value of this parameter will become the upper bound to the number of features shown in one page.
  * If there are more features results than the value of this parameter, we will find a nextPageToken at the bottom of the page.  
    This token can be used to access the next page containing the other results, which can be used by using the pageToken parameter(see the details below).
  * Example(returning 5 results each page): https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&maxResults=5
  * You can try to change the value of the maxResults in the URL and see the changes to the output! Try it!
* pageToken
  * The value of this parameter is the continuation token we get from the maxResults parameter.
  * This parameter will give you the next page results from the previous request.
  * Example:
    1. Create a request of features by limiting the number of results per page: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&maxResults=5
    2. Use the nextPageToken from the bottom of the page and execute this link: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&pageToken=*{put your nextPageToken here}*
  * You can try to change the value of the maxResults in the URL, get the token, update the URL, and see the changes to the output! Try it!
* select
  * This parameter will specify returned properties. It is an SQL-like projection clause. If we use it, the features returned will only have the property defined in the value of the parameter.
  * If not included, all properties are returned.
  * If you wanted to include more than 1 property, you can add commas(,) after each property.
  * If you have properties with other characters besides letters, numbers, and underscores; you have to enclose it with ""
  * If you have property names with quotation marks/backslashes, it must be escaped with a backslash.
  * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&select=location, disabled
  * You can also add new properties by using the geometry functions defined above by using AS (creating column alias). The name of the new property must be enclosed in single quotes if it contains spaces/other special characters.  
    For example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&select=geometry, ST`_`DISTANCE(geometry,ST`_`POINT(174.8,-41.3)) AS distance
* where
  * This parameter will filter the features, and returns the features with true condition. It is an SQL-like predicate.
  * If you wanted to include more than one condition, you can use AND and/or OR.  
  * The supported operators are: >, <, >=, <=, =, <>
  * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&where=ST`_`DISTANCE(geometry,ST`_`POINT(174.8,-41.3))<2200
* orderBy
  * This parameter will sort your features based on the key you put in. It is an SQL-like order by clause.
  * If not included, the order of the features is undefined.
  * You can only sorted with one order key, which must be defined in the select clause (either existing column or column alias).
  * The default sort is in ascending order. If you want to do descending order, you can append DESC to the orderBy clause.
  * You **must** include limit parameter! The limit must be less than or equal to 75.
  * Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&select=geometry, ST`_`DISTANCE(geometry,ST`_`POINT(174.8,-41.3)) AS distance&orderBy=distance DESC&limit=5