//Javascript file for tutorial
//THE GLOBAL VARIABLES

//global window size variables used in dynamic sizing
var winWidth = $(window).width();
var winHeight = $(window).height();
var userAPIKey = "";

//object to store lesson information
function Lesson(title, blurb, divID) {
  this.title = title;
  this.blurb = blurb;
  this.divID = divID;
  this.update = function() {};
  this.submit = function() {};
}



//THE LESSONS
var lesson0 = new Lesson("Introduction", "Welcome to Google Maps Engine API tutorial. <br> In this tutorial, we will teach you how to read public data from a Google map project."+
                        "<br>To begin the tutorial, you can click the tutorial menu on the left. Enjoy!", "lesson0-intro");
lesson0.update = updateIntro;
lesson0.submit = updateIntro;
var lesson1 = new Lesson("GME API", "The Google Maps Engine API (Application Programming Interface) is a RESTful API" +
                         " where resources are represented as JavaScript Object Notation (JSON). This makes it simple for developers to create, share" +
                         " and publish their own custom Google maps and develop applications for a number of platforms.<br> The interface allows" +
                         " users to Create, Read, Upload, Update and Delete data from custom tables using simple HTTP requests.<br><br> As stated" +
                         " in the introduction, this tutorial will focus on reading public data and customising the JSON resources." +
                         " If you want to make your data public, you can follow the steps in this link: https://support.google.com/mapsengine/answer/3164737?hl=en", "lesson1-gmeapi");
lesson1.update = updateGMEAPI;
lesson1.submit = updateGMEAPI;
var lesson2 = new Lesson("API Key", "For this tutorial you will need an API key in order to access the data. To obtain an API Key" +
                         ", go to the <a href=https://cloud.google.com/console target='_blank'>Google Cloud Console</a>. Click on APIs & Auth and turn the Google Maps " +
                         "Engine API to ON.<br>Next, you will need to register your app as a Web Application through the Registered Apps tab. The API key" +
                         " can be found under the Server/Browser Key dropdown.<br><br>Once you have the key, paste it in the input box below.", "lesson2-apikey");
lesson2.update = updateAPIKey;
lesson2.submit = testAPIKey;
var lesson3 = new Lesson("Get Table", "The GME API stores data in tables with the columns representing attributes and each row " +
                         "representing a data entry. The attributes each have a name and a type which indicates what form the data takes (string, number etc.)." +
                         " Once a table is created, you can view the names of all attributes and their types (known as a <b>schema</b>) using the 'Get Table'" +
                         " read operation.<br><br>As stated, accessing data occurs through HTTP requests. The GME API allows you to use URLs to access public data." +
                         " All requests use the same base URL: <br><i>https://www.googleapis.com/mapsengine/v1</i>.<br><br>To specify a 'Get Table' request, add <i>/tables/{tableID}</i>" +
                         " followed by two compulsory parameters, <i>/?version=published&key={APIkey}</i>.<br>The API key is the one you created in the previous lesson.<br><br>" +
                         "Why don't you give this a try? type the URL into the input box below, using the tableID: 15474835347274181123-16143158689603361093 and submit.", "lesson3-gettable");
lesson3.update = updateGetTable;
lesson3.submit = testGetTable;
var lesson4 = new Lesson("List Features", "Besides viewing a table's attribute, you can also access table's features." +
                         " A feature is a data entry in a table, represented by each row in the table. It can be a point, polygone, or polyline."+
                         " To access a table's features in the GME API, you can type in a specific URL in your browser." +
                         " It will return a list of features that the table has." +
                         " However, you need to remember that in order to do this, the table that you want to access has to be publicly accessible." +
                         "<br><br>The basic URL to access features list:" +
                         "<br> https://www.googleapis.com/mapsengine/v1/tables/<em>{tableId}</em>/features?<em>{parameters}</em>" +
                         "<br><br>If you have more than 1 parameter, you can join them together in the URL with the '&' symbol." +
                         " There are 2 required parameters, that must be included in your URL, which are:" +
                         "<ul>"+
                           "<li>version=published <br> The table must be a published version to be accessed. </li>" +
                           "<li>key=<em>your API key</em></li>"+
                         "</ul>"+
                         "One example of the URL:" +
                         "<br>https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0" +
                         "<br>You can copy this URL and paste it in the white input box below, and click the submit button to see the output." +
                         " You can also try to create your own URL and submit it below!" +
                         "<br><br>Before we take a look of other parameters that we can use, it is probably a good idea to learn about geometry functions in Maps Engine API, that might be useful for some of your parameters value (where and select parameters)." +
                         "<br>Two main geometry functions in Maps Engine API are:"+
                           "<ol>" +
                             "<li>Constructors" +
                               "<ul>"+
                                 "<li>ST_POINT: creates a point from a longitude and latitude value."+
                                   "<br>The syntax: ST_POINT(lng, lat)"+
                                 "</li>"+
                                 "<li>ST_GEOMFROMTEXT: Creates a geometry from a string specifying points and the geometry (polygon, linestring, etc.)"+
                                 "</li>"+
                               "</ul>"+
                             "</li>" +
                             "<li>Relationships functions" +
                               "<ul>"+
                                 "<li>ST_DISTANCE: Calculate shortest distance between two geometries. Accepts geometry column name and geometry value (might be the result of the constructors)"+
                                   "<br>The syntax example: ST_DISTANCE(geometry, ST_POINT(1.23,4.56))"+
                                 "</li>"+
                                 "<li>ST_INTERSECTS: Returns all features that intersect the described polygon. Accepts geometry column name and geometry value (might be the result of the constructors)"+
                                   "<br>The syntax example: ST_INTERSECTS(geometry, ST_GEOMFROMTEXT('POLYGON((1 3, 1 1, 4 1, 4 4, 1 3))'))"+
                                 "</li>"+
                               "</ul>"+
                             "</li>" +
                           "</ol>"+
                         "<br><br>There are several optional parameters for the list feature, including:" +
                         "<ul>"+
                           "<li>intersects" +
                             "<br>This parameter will return the features which is restricted by the geometries specified in the value. The geometries supported by Google Maps API are:"+
                             "<ul>"+
                               "<li>POLYGON"+
                                 "<ul>" +
                                   "<li>The syntax to specify a polygon: <br>intersects=POLYGON((v1_lng v1_lat, v2_lng v2_lat, ..., v1_lng v1_lat))"+
                                     "<br>Where lng:longitude of the vertex and lat:latitude of the vertex"+
                                   "</li>" +
                                   "<li>The vertices must be specified in counter-clockwise order, and you can have up to 50 vertices" +
                                   "</li>" +
                                   "<li>The first and last vertices has to be the same to close the polygon, hence you need to have at least 4 vertices(3 distinct points)"+
                                   "</li>" +
                                   "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=POLYGON((175 -41, 174 -41, 174 -42, 175 -41))"+
                                   "</li>" +
                                 "</ul>" +
                               "</li>"+  
                               "<li>POINT"+
                                 "<ul>" +
                                   "<li>The syntax to specify a point: <br>intersects=POINT(lng lat)"+
                                     "<br>Where lng:longitude of the point and lat:latitude of the point"+
                                   "</li>" +
                                   "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=POINT(174.7928369177438 -41.29150501119897)"+
                                   "</li>" +
                                 "</ul>" +
                               "</li>"+
                               "<li>CIRCLE"+
                                "<ul>" +
                                   "<li>The syntax to specify a circle: <br>intersects=CIRCLE(center_lng center_lat, radius)"+
                                     "<br>Where lng:longitude of the center of the circle and lat:latitude of the center of the circle"+
                                   "</li>" +
                                   "<li>The radius is in meters" +
                                   "</li>" +
                                   "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=CIRCLE(174.7928369177438 -41.29150501119897, 5000)"+
                                   "</li>" +
                                 "</ul>" +
                               "</li>"+
                               "<li>LINESTRING"+
                                 "<ul>" +
                                   "<li>The syntax to specify a linestring: <br>intersects=LINESTRING(pt1_lng pt1_lat, pt2_lng pt2_lat,...)"+
                                     "<br>Where lng:longitude of the point and lat:latitude of the point"+
                                   "</li>" +
                                   "<li>May consist of up to 50 points" +
                                   "</li>" +
                                   "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&intersects=LINESTRING(174.82994218881467 -41.312541307982784, 174.7928369177438 -41.29150501119897)"+
                                   "</li>" +
                                 "</ul>" +
                               "</li>"+
                             "</ul>"+
                           "</li>"+
                           "<li>limit"+
                             "<ul>" +
                               "<li>The value of this parameter will become the upper bound to the number of features returned. If there are more features than the limit, the number of features returned will be the value of the limit" +
                                 " and the other features will not be shown." +
                               "</li>" +
                               "<li>Example(returning 3 results): https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&limit=3" +
                               "</li>" +
                               "<li>You can try to change the value of the limit in the URL and see the changes to the output! Try it!" +
                               "</li>" +
                             "</ul>" +
                           "</li>" +
                           "<li>maxResults"+
                             "<ul>" +
                               "<li>The value of this parameter will become the upper bound to the number of features shown in one page." +
                               "</li>" +
                               "<li>If there are more features results than the value of this parameter, we will find a nextPageToken at the bottom of the page." +
                                 "<br>This token can be used to access the next page containing the other results, which can be used by using the pageToken parameter(see the details below)"+
                               "</li>" +
                               "<li>Example(returning 5 results each page): https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&maxResults=5" +
                               "</li>" +
                               "<li>You can try to change the value of the maxResults in the URL and see the changes to the output! Try it!" +
                               "</li>" +
                             "</ul>" +
                           "</li>" +
                           "<li>pageToken"+
                             "<ul>" +
                               "<li>The value of this parameter is the continuation token we get from the maxResults parameter." +
                               "</li>" +
                               "<li>This parameter will give you the next page results from the previous request.." +
                               "</li>" +
                               "<li>Example:" +
                                 "<ol>"+
                                   "<li>Create a request of features by limiting the number of results per page: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&maxResults=5" +
                                   "</li>"+
                                   "<li>Use the nextPageToken from the bottom of the page and execute this link: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&pageToken=<em>{put your nextPageToken here}</em>" +
                                   "</li>"+
                                 "</ol>"+
                               "</li>" +
                               "<li>You can try to change the value of the maxResults in the URL, get the token, update the URL, and see the changes to the output! Try it!" +
                               "</li>" +
                             "</ul>" + 
                           "</li>" +
                           "<li>select"+
                             "<ul>" +
                               "<li>This parameter will specify returned properties. It is an SQL-like projection clause. If we use it, the features returned will only have the property defined in the value of the parameter." +
                               "</li>" +
                               "<li>If not included, all properties are returned." +
                               "</li>" +
                               "<li>If you wanted to include more than 1 property, you can add commas(,) after each property." +
                               "</li>" +
                               "<li>If you have properties with other characters besides letters, numbers, and underscores; you have to enclosed it with \"\"" +
                               "</li>" +
                               "<li>If you have property names with quotation marks/backslashes, it must be escaped with a backslash." +
                               "</li>" +
                               "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&select=location, disabled" +
                               "</li>" +
                               "<li>You can also add new properties by using the geometry functions defined above by using AS (creating column alias). The name of the new property must be enclosed in single quotes if it contains spaces/other special characters." +
                                 "<br>For example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&select=geometry, ST_DISTANCE(geometry,ST_POINT(174.8,-41.3)) AS distance"+
                               "</li>" +
                             "</ul>" + 
                           "</li>" +
                           "<li>where"+
                             "<ul>" +
                               "<li>This parameter will filter the features, and returns the features with true condition. It is an SQL-like predicate." +
                               "</li>" +
                               "<li>If you wanted to include more than 1 condition, you can use AND and/or OR." +
                               "</li>" +
                               "<li>The supported operators are: >, <, >=, <=, =, <>" +
                               "</li>" +
                               "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&where=ST_DISTANCE(geometry,ST_POINT(174.8,-41.3))<2200" +
                               "</li>" +
                             "</ul>" + 
                           "</li>"+ 
                           "<li>orderBy"+
                             "<ul>" +
                               "<li>This parameter will sort your features based on the key you put in. It is an SQL-like order by clause." +
                               "</li>" +
                               "<li>If not included, the order of the features is undefined." +
                               "</li>" +
                               "<li>You can only sorted with one order key, which must be defined in the select clause (either existing column or column alias)" +
                               "</li>" +
                               "<li>The default sort is in ascending order. If you want to do descending order, you can append DESC to the orderBy clause." +
                               "</li>" +
                               "<li>You <b>must</b> include limit parameter! The limit must be less than or equal to 75" +
                               "</li>" +
                               "<li>Example: https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&select=geometry, ST_DISTANCE(geometry,ST_POINT(174.8,-41.3)) AS distance&orderBy=distance DESC&limit=5"+
                               "</li>" +
                             "</ul>" + 
                           "</li>" +
                           
                         "</ul>","lesson4-featureslist");
lesson4.update = updateListFeatures;
lesson4.submit = executeListInput;
var lesson5 = new Lesson("Javascript", "So far, you have learned to generate a URL to request public data. Using JavaScript" +
                         " and jQuery you can create a function that will send this URL in a HTTP request and display the results. There are a few ways" +
                         " that this can be achieved, but this lesson will demonstrate using the jQuery AJAX (Asynchronous JavaScript and XML) method.<br><br>" +
                         "Within a function, create a request structured in the following way:<br>" +
                         "jQuery.ajax({<br>" +
                         "&nbsp;&nbsp;url: &ltyour-url&gt,<br>" +
                         "&nbsp;&nbsp;dataType: 'json',<br>" +
                         "&nbsp;&nbsp;success: function(resource) {<br>" +
                         "&nbsp;&nbsp;&nbsp;&nbsp;//what will happen if the request is successful, e.g. display the JSON results<br>" +
                         "&nbsp;&nbsp;&nbsp;&nbsp;//NOTE: the two last parameters specify a nicer formatting for the output<br>" +
                         "&nbsp;&nbsp;&nbsp;&nbsp;console.log(JSON.stringify(resource, null, 4));<br>" +
                         "&nbsp;&nbsp;},<br>" +
                         "&nbsp;&nbsp;error: function(response) {<br>" +
                         "&nbsp;&nbsp;&nbsp;&nbsp;//what will happen if the request is unsuccessful, e.g. display error<br>" +
                         "&nbsp;&nbsp;&nbsp;&nbsp;console.log('Error: ', response.error.errors[0]);<br>" +
                         "&nbsp;&nbsp;}<br>" +
                         "});<br>" +
                         "Once you have the function created you will need to call it using:<br>" +
                         "jQuery(document).ready(functionName);<br><br>Test your AJAX syntax in the input box below. Create a request with the basic list " + 
                         "features URL from the previous lesson (i.e. without any parameters) and press enter to see the results.", "lesson5-javascript");
lesson5.update = updateJavascript;
lesson5.submit = testJQuery;
var lesson6 = new Lesson("Other Methods", "Besides directly typing the URL into the browser or using Javascript, you can access the public data by using 'curL'." +
                         "<br>cURL is a command-line tool that can be used to make HTTP requests. Simply type into your console/terminal:" +
                         "<br>curl \"<em>your URL</em>\"" +
                         "<br><br>For example, the command line that you typed in your console/terminal should look like this: " +
                         "<br>curl \"https://www.googleapis.com/mapsengine/v1/tables/01512215508764088245-12798225287603138914/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0\""+
                         "<br><br>To check whether you have the correct URL, you can submit it in the white box below. Then you can type the command line curl to your console and see if it works!" +
                         "<br><br>PS: Don't forget the \"\" surrounding the URL in your command line :)", "lesson6-othermethods");

lesson6.update = updateOtherMethods;
lesson6.submit = executeCurlInput;

//The Lesson Array
var lessonArray = [lesson0, lesson1, lesson2, lesson3, lesson4, lesson5, lesson6];

//Active index
var activeIndex = 0;


//The color array
var color = ['red', 'blue', 'purple'];

//Finding objects with class "lesson"
var lessonsClass = document.getElementsByClassName("lesson");

//*****************THE GLOBAL FUNCTIONS**********************//
google.maps.event.addDomListener(window, 'load', function initialize(){
  //CREATING BUTTONS
  for (var i=0; i<lessonsClass.length; i++){
    makeButton(lessonsClass[i].id, i);
  }
  createInputOutput();
  //dynamically changing the divs

  document.getElementById('instructions').style.width = winWidth - 240 + 'px';

  //set the initial page to be the introduction
  lessonArray[activeIndex].update();
});

function makeButton(string, i){
  var button = document.getElementById("buttons");
  var newButton = document.createElement("input");
  newButton.type = "button";
  newButton.id = string+"button";
  newButton.value = lessonArray[i].title;
  newButton.onclick = function(){
    lessonArray[i].update();
  };
  button.appendChild(newButton);
  button.appendChild(document.createElement("br"));
  var buttonElement = document.getElementById(string+"button");
  buttonStyle(buttonElement, i);
}

function buttonStyle(buttonProp, i){
  buttonProp.style.display = ' ';
  buttonProp.style.backgroundColor = 'yellow';
  buttonProp.style.width = '160px';
  buttonProp.style.height = '40px';
  buttonProp.style.fontSize = '20px';
  buttonProp.style.opacity = 0.8;
  buttonProp.style.fontWeight = 'bold';
  buttonProp.style.color = 'black';
  buttonProp.onmouseover = function(){  
    buttonProp.style.backgroundColor = color[i%color.length];
    buttonProp.style.color = 'white';
  }
  buttonProp.onmouseout = function(){
    buttonProp.style.backgroundColor = 'yellow';
    buttonProp.style.color = 'black';
  }
}

/*
function clear(){
  for (var i=0; i<lessonArray.length; i++){
    if(lessonArray[i].title === document.title){
      break;
    }
  }
  $("#output"+i).empty();
}
*/
//BLOCKING ALL DIVS AUTOMATICALLY
function hideAll() {
  for (var i=0; i<lessonsClass.length; i++){
    document.getElementById(lessonsClass[i].id).style.display = "none";
  }
}

//Should be called initially to dynamically create divs for each lesson
function createInputOutput() {
  for (var i = 0; i < lessonArray.length; i++) {
    var lesson = document.getElementById(lessonArray[i].divID);
    //add the text area
    var newInput = document.createElement("textarea");
    newInput.class = "text-input";
    newInput.id = "input" + i;
    lesson.appendChild(newInput);
    //add the output area
    var newOutput = document.createElement("div");
    newOutput.class = "text-output"
    newOutput.id = "output" + i;
    lesson.appendChild(newOutput);
    //create the divs of input output explanation
    var inputExp = document.createElement("div");
    inputExp.id = "input-explanation" + i;
    lesson.appendChild(inputExp);
    var outputExp = document.createElement("div");
    outputExp.id = "output-explanation" + i;
    lesson.appendChild(outputExp);

    //style the areas
    var inputElement = document.getElementById("input" + i);
    inputStyle(inputElement, i);
    var outputElement = document.getElementById("output" + i);
    outputStyle(outputElement, i)
    var inputExpElement = document.getElementById("input-explanation" + i);
    inputExpElement.innerHTML = "Please type your input below. Press the submit button to see the output.";
    inputExplanationStyle(inputExpElement, i);
    var outputExpElement = document.getElementById("output-explanation" + i);
    outputExpElement.innerHTML = "Output";
    outputExplanationStyle(outputExpElement, i);
    makeSubmit(i);
  }
}

function inputStyle(element, i) {
  element.style.position = 'absolute';
  element.style.backgroundColor = 'white';
  element.style.color = 'black';
  element.style.fontSize = '18px';
  element.style.width = (winWidth - 180)/2 - 4 + 'px';
  element.style.height = winHeight - ((winHeight * 34 / 100) + 103) + 'px';
  element.style.left = '180px';
  element.style.top = (winHeight * 34 / 100) + 100 + 'px'
  element.style.resize = 'none';
  element.style.border = '2px solid black'
  element.style.overflowY = 'scroll';
}

function outputStyle(element, i) {
  element.style.position = 'absolute';
  element.style.backgroundColor = 'black';
  element.style.color = 'white';
  element.style.fontSize = '18px';

  element.style.width = (winWidth - 180)/2 - 10 + 'px';
  element.style.height = winHeight - ((winHeight * 34 / 100) + 105) + 'px';
  element.style.left = 180 + (winWidth - 180)/2 - 4 + 'px';
  element.style.top = (winHeight * 34 / 100) + 100 + 'px'
  element.style.border = '5px solid black'
  element.style.overflowY = 'scroll';
}

function inputExplanationStyle(element, i){
  element.style.position = 'absolute';
  element.style.backgroundColor = 'yellow';
  element.style.color = 'black';
  element.style.fontSize = '20px';
  element.style.width = (winWidth - 200)/2 + 'px';
  element.style.left = '180px';
  element.style.top = (winHeight * 34 / 100) + 55 + 'px';
  element.style.height = '35px'
  element.style.border = '5px solid red'
  element.style.fontWeight = 'bold';
  element.style.opacity = 0.7;
  element.style.overflowY = 'scroll';
}

function outputExplanationStyle(element, i){
  element.style.position = 'absolute';
  element.style.backgroundColor = 'yellow';
  element.style.color = 'black';
  element.style.fontSize = '20px';
  element.style.width = (winWidth - 200)/2 + 'px';
  element.style.height =  '35px'
  element.style.left = 190 + (winWidth - 200)/2 + 'px';
  element.style.top = (winHeight * 34 / 100) + 55 + 'px';
  element.style.border = '5px solid red'
  element.style.fontWeight = 'bold';
  element.style.opacity = 0.7;
  element.style.overflowY = 'scroll';
}

function makeSubmit(i) {
  //add a submit button
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Submit";
  submit.id = "submitbutton" + i;
  submit.style.position = "absolute";
  submit.onclick = function() {
    lessonArray[i].submit();
  };
  submitbuttonStyle(submit, i)
  var button = document.getElementById("input-explanation" + i);
  button.appendChild(submit);
}

function submitbuttonStyle(submit, i) {
  submit.style.display = ' ';
  submit.style.backgroundColor = 'black';
  submit.style.width = '160px';
  submit.style.height = '30px';
  submit.style.fontSize = '20px';
  submit.style.opacity = 0.9;
  submit.style.fontWeight = 'bold';
  submit.style.color = 'white';
  submit.onmouseover = function(){  
    submit.style.backgroundColor = 'blue';
    submit.style.color = 'white';
  }
  submit.onmouseout = function(){
    submit.style.backgroundColor = 'black';
    submit.style.color = 'white';
  }
}

function getFeatures(addressString){
  var $data = $("#output" + activeIndex);
  var data = document.getElementById("output" + activeIndex);
  data.style.whiteSpace = 'pre';
  
  $data.empty();
  jQuery.ajax({
    url: addressString,
    dataType: 'json',
    success: function(resource) {
      var resourceString = JSON.stringify(resource, null, 2);
      $data.append("\n");
      $data.append(resourceString);
      $data.append("\n");
    },
    error: function(response) {
      alert ("Oops! You've entered wrong URL! Try again!")
      $data.append("Wrong URL\n");
      response = JSON.parse(response.responseText);
      var errorMess = response.error.errors[0];
      if (errorMess.reason === "authError") {
        $data.append("\nYour authorization token is invalid. \nPlease check that the table can be viewed by general public\n\n");
      } else if (errorMess.reason === "invalid") {
        var field = errorMess.location;
        $data.append("\nInvalid value in the \""+field+"\" field.\nCheck whether you've given the right tableId\n\n");
      } else {
        $data.append("\nThe data cannot be processed. See the details below for the information regarding the error:\n\n");
      }
      var responseString = JSON.stringify(errorMess, null, 2);
      $data.append(responseString);
      $data.append("\n");
    
    }
  });
}

function trimLeft(string){
  return string.replace(/^\s+/, '');
}
//*****************THE INTRO FUNCTIONS**********************//
function updateIntro() {
  activeIndex = 0;
  hideAll();
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
}

//*****************THE GME API FUNCTIONS**********************//
function updateGMEAPI() {
  activeIndex = 1;
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
}

//*****************THE API Key FUNCTIONS**********************//
function updateAPIKey() {
  activeIndex = 2;
  hideAll();
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
}

function testAPIKey() {
  var userKey = document.getElementById("input" + activeIndex).value;
  var $data = $("#output" + activeIndex);
  jQuery.ajax({
  url: 'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/features?version=published&key=' + userKey,
    dataType: 'json',
    success: function(resource) {
      $data.html("Congrats! Your API Key works. Now continue on to Get Table!");
      userAPIKey = userKey;
      console.log(userAPIKey);
    },
    error: function(response) {
      $data.html("Sorry your API Key did not work. Try again!");
    }
  });
}

//*****************THE Get Table FUNCTIONS**********************//
function updateGetTable() {
  activeIndex = 3;
  hideAll();
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
}

function testGetTable() {
  var userURL = document.getElementById("input" + activeIndex).value;
  var $data = $("#output" + activeIndex);
  var expectedURL = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/?version=published&key=" + userAPIKey;
  if (userURL == expectedURL) {
    alert("Huzzah! Great work!")
    getFeatures("https://www.googleapis.com/mapsengine/search_tt/tables/15474835347274181123-16143158689603361093/?version=published&key=" + userAPIKey);
  } else {
    $data.html("Oh no! Something isn't quite right. Try again. Hint: Make sure you entered a valid API Key in the previous exercise!");
  }
}
//*****************THE List Features FUNCTIONS**********************//
function updateListFeatures() {
  activeIndex = 4;
  hideAll();
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
}

function executeListInput(){
  var string = document.getElementById("input" + activeIndex).value;
  var address = trimLeft(string);
  getFeatures(address);
  
}

//*****************THE Javascript FUNCTIONS**********************//
function updateJavascript() {
  activeIndex = 5;
  hideAll();
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
  var inputBox = $("#input" + activeIndex);
}

function testJQuery() {
  activeIndex = 5;
  var userString = document.getElementById("input" + activeIndex).value;
  var $data = $("#output" + activeIndex)
  console.log(userString);
  var expectedInput = "jQuery.ajax({\n  url: 'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/features?version=published&key=" + userAPIKey + "'," +
  "\n  dataType: 'json'," +
  "\n  success: function(resource) {" +
  "\n    console.log(JSON.stringify(resource, null, 4));" +
  "\n  }," +
  "\n  error: function(response) {" +
  "\n    console.log('Error: ', response.error.errors[0]);" +
  "\n  }\n});";
  console.log(expectedInput);
  if (userString == expectedInput) {
    //user input is correct
    getFeatures ("https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/features?version=published&key=" + userAPIKey);
  } else {
    //user input is incorrect
    $data.html("Sorry, your input is not correct. Please check that you have the following:<ul><li>Make sure you have entered a valid API Key in a previous exercise!</li>" +
    "<li>Request is correctly indented using TWO spaces</li>" +
    "<li>URL is:'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/features?version=published&key=" + userAPIKey + 
    "', including '' characters</li><li>There are no comments in your code.</li><li>For this exercise, make sure your success and error handling is the same as in the example.</li></ul>");
  }

}

//*****************THE Other Methods FUNCTIONS**********************//
function updateOtherMethods(){
  activeIndex = 6;
  hideAll();
  document.title = lessonArray[activeIndex].title;
  document.getElementById(lessonArray[activeIndex].divID).style.display = "block";
  document.getElementById("instructions").innerHTML = lessonArray[activeIndex].blurb;
}

function executeCurlInput(){
  var string = document.getElementById("input" + activeIndex).value;
  var address = trimLeft(string);
  getFeatures(address);

  /*
  //the user has to type curl
  if (string.length<=(i+3) ||string[i]!== 'c' || string[i+1]!=='u' || string[i+2]!=='r' || string[i+3]!=='l'){
    alert("You entered wrong command-line. See the tutorial again.");
  } else {
    i = i+4;
    //there should be space after the curl
    if (string.length == i || string[i]!== ' ') {
      alert("You entered wrong command-line. See the tutorial again.");
    } else {
      i = i+1;
      for (; i<string.length; i++){
        if(string[i]!== ' '){
          break;
        }
      }
      //there should be " after the curl command, and there should be something after that
      if(string.length == i || string.length == i+1 || string[i]!== '\"'){
        alert("You entered wrong command-line. See the tutorial again.");
      } else {
        var address="";
        i = i+1;
        for(; i<string.length; i++){
          if(string[i] == '\"' || string[i] == ' '){
            break;
          }
          address += string[i];
        }
        //if not closing the "
        if (string[i] !== '\"'){
          alert("You entered wrong command-line. See the tutorial again.");
        } else {
          getFeatures(address);
        }
      }
    }
  }
  */
}

