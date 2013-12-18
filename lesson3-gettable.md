The GME API stores data in tables with the columns representing attributes and each row representing a data entry. The attributes each have a name and a type which indicates what form the data takes (string, integer etc.). Once a table is created, you can view the names of all attributes and their types (known as a **schema**) using the 'Get Table' operation.

As you know, accessing data occurs through HTTP requests. The GME API does this through URLs which can be typed into your browser. The basic URL to make a ‘Get Table’ request is:   
`https://www.googleapis.com/mapsengine/v1/tables/{tableID}?version=published&key={APIkey}`

Why don't you give this a try? Copy the above URL into the input box below and replace {tableID} with this ID from an existing table: 15474835347274181123-14495543923251622067 and {APIkey} with your API Key from the previous lesson.