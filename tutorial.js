//Javascript file for tutorial
//THE GLOBAL VARIABLES

//global window size variables used in dynamic sizing
var winWidth = $(window).width();
var winHeight = $(window).height();
var userAPIKey = "";

//object to store lesson information
function Lesson(title, divID) {
  this.title = title;
  this.divID = divID;
}

Lesson.prototype.update = function() {
  hideAll();
  var me = this;
  document.title = this.title;
  document.getElementById(this.divID).style.display = "block";

  if (!this.upToDate){
    //first time page loaded
    $.get(this.divID+".md", function(response){
      //console.log(response);
      //preview.innerHTML = markdown.toHTML(response);
      document.getElementById("instructions").innerHTML = markdown.toHTML(response);
      me.instructions = response;
      me.upToDate = true;
    } );    
  } else {
      //has been loaded before
      document.getElementById("instructions").innerHTML = markdown.toHTML(this.instructions);
  } 
}

Lesson.prototype.submit = function() {
  this.update();
};

//THE LESSONS
var lesson0 = new Lesson("Introduction", "lesson0-intro");
var lesson1 = new Lesson("GME API", "lesson1-gmeapi");
var lesson2 = new Lesson("API Key", "lesson2-apikey");
lesson2.submit = testAPIKey;
var lesson3 = new Lesson("Get Table", "lesson3-gettable");
lesson3.submit = testGetTable;
var lesson4 = new Lesson("List Features", "lesson4-featureslist");
lesson4.submit = executeListInput;
var lesson5 = new Lesson("Javascript", "lesson5-javascript");
lesson5.submit = testJQuery;
var lesson6 = new Lesson("Other Methods", "lesson6-othermethods");
lesson6.submit = executeCurlInput;

//The Lesson Array
var lessonArray = [lesson0, lesson1, lesson2, lesson3, lesson4, lesson5, lesson6];

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
  lesson0.update();
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

//*****************THE API Key FUNCTIONS**********************//
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
function executeListInput(){
  var string = document.getElementById("input" + activeIndex).value;
  var address = trimLeft(string);
  getFeatures(address);
  
}

//*****************THE Javascript FUNCTIONS**********************//
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
