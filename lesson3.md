The GME API stores data in tables with the columns representing attributes and each row representing a data entry. The attributes each have a name and a type which indicates what form the data takes (string, number etc.). Once a table is created, you can view the names of all attributes and their types (known as a **schema**) using the 'Get Table' read operation.

As you know, accessing data occurs through HTTP requests. The GME API allows you to use URLs to access public data. All requests use the same base URL:  
*https://www.googleapis.com/mapsengine/v1*.

To specify a 'Get Table' request, add */tables/{tableID}* followed by two compulsory parameters, */?version=published&key={APIkey}*.  
The API key is the one you created in the previous lesson.

Why don't you give this a try? type the URL into the input box below, using the tableID: 15474835347274181123-16143158689603361093 and submit.