##Queries##  
If you want to query a table for specific data, you can add additional parameters to a List Features request including:  

* intersects: get features which intersect with a geometry (point, polygon, circle, linestring)
* limit: create an upper bound of the number of features returned.
* select: specifies which properties of the features will be shown in the result, equivalent to SQL projection clause. It can also be used to create a new property (column alias).
* where: create a condition that must be fulfilled by the features returned. Equivalent to SQL predicate.
* orderBy: specified the ordering of the features returned (ascending/descending). It is equivalent to SQL order and it is ascending by default.  

One example of the query: `https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAujS4mL7zZxVwoO9dTqPFswl6glp_yvo0&select=Name&limit=2`

For more information regarding queries and a full list of available parameters, you can read the [GME API Documentation for list features](https://developers.google.com/maps-engine/documentation/read).

**EXERCISE**  
Using the table ID = 15474835347274181123-14495543923251622067 and your valid API Key, create the URL to list features whose “Population” is less than 2 million. Click submit to see whether your answer is correct or not.