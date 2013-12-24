You can see the response from the server in the box below. What you see now in the output area is the table schema, displayed as a JSON resource. It contains:  

* "id": the table's id
* "projectId": the id of the project where the table is stored
* "name": the name of the table
* "description": the table's description
* "bbox": a bounding box, the smallest quadrilateral that contains the features in the table
* "schema": contains a primaryGeometry (specifies the geometry of the feature), and the array of columns, which contains the column names and the type of data for each column. One column is a "gx-id". which is the primary key value for the feature
* "versions": the table's version
* "role": the role of the person's accessing the table, which in your case is "viewer"