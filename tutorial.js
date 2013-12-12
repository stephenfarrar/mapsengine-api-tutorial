//Javascript file for tutorial
//THE GLOBAL VARIABLES

//global window size variables used in dynamic sizing
var userAPIKey = "";

//object to store lesson information
function Lesson(divID, options) {
  this.divID = divID;
  this.title = options.title;
  if (options.submit) {
    this.submit = options.submit;
  }
}

Lesson.prototype.update = function() {
  hideAll();
  var me = this;
  document.title = this.title;
  document.getElementById(this.divID).style.display = "block";

  if (!this.upToDate){
    //first time page loaded
    $.get(this.divID+".md", function(response){
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

function Chapter(divID, options) {
  this.divID = divID;
  this.lessons = options.lessons;
  this.title = options.title;
}

var chapters = [
  new Chapter('chapter0-intro', {title: '0.Introduction', lessons: [
    new Lesson('lesson0-intro', {title: 'Introduction'}),
    new Lesson('lesson1-gmeapi', {title: 'GME API'})
  ]}),
  new Chapter('chapter1-registration', {title: 'I.Registration', lessons: [
    new Lesson('lesson2-apikey', {title: 'API Key', submit: testAPIKey})
  ]}),
  new Chapter('chapter2-read', {title: 'II.Reading Public Data', lessons: [
    new Lesson('lesson3-gettable', {title: 'Get Table', submit: testGetTable}),
    new Lesson("lesson4-featureslist", {title: "List Features", submit: executeListInput})
  ]})
];

Chapter.prototype.update = function() {
  this.lessons[0].update();
}

//*****************THE GLOBAL FUNCTIONS**********************//
google.maps.event.addDomListener(window, 'load', function initialize(){
  //CREATING BUTTONS
  makeLessonDivs();
  createInputOutput();
  createPrevNext();
  createSubmitClear();

  for (var i=0; i<chapters.length; i++){
    makeButton(chapters[i]);
    for (var j=0; j<chapters[i].lessons.length; j++) {
      makeButton(chapters[i].lessons[j]);
    }
  }
  //LOADING THE FONT SIZE ACCORDING TO WINDOW SIZES
   //TITLE
  $("#title").css('font-size', 0.031*($("#title").height()+$("#title").width()));
  //INSTRUCTIONS
  $("#instructions").css('font-size', 0.018*($("#instructions").height()+$("#instructions").width()));

  chapters[0].lessons[0].update();
});

function makeLessonDivs(){
  var body = document.getElementById("body");
  for (var i = 0; i<chapters.length; i++){

    var newChapterDiv = document.createElement("div");
    newChapterDiv.id = chapters[i].divID;
    newChapterDiv.class = "chapter";
    body.appendChild(newChapterDiv);
    var chapterDiv = document.getElementById(chapters[i].divID);
    for (var j = 0; j<chapters[i].lessons.length; j++){
      
      var newLessonDiv = document.createElement("div");
      newLessonDiv.id = chapters[i].lessons[j].divID;
      newLessonDiv.class = "lesson";
      chapterDiv.appendChild(newLessonDiv);
    }
  }
}

function makeButton(object){
  var button = document.getElementById("buttons");
  var newButton = document.createElement("input");
  newButton.type = "button";
  newButton.id = object.divID+"button";
  newButton.value = object.title;
  newButton.className = 'menu-button';
  newButton.onclick = function(){
    object.update();
  };
  button.appendChild(newButton);
}

//BLOCKING ALL DIVS AUTOMATICALLY
function hideAll() {
  for (var i=0; i<chapters.length; i++){
    for (var j=0; j<chapters[i].length; j++) {
      document.getElementById(chapters[i].lessons[j].divID).style.display = "none";
    }
  }
}

//Should be called initially to dynamically create divs for each lesson
function createInputOutput() {
  for (var i = 0; i < chapters.length; i++) {
    for (var j = 0; j < chapters[i].lessons.length; j++) {
      var lesson = document.getElementById(chapters[i].lessons[j].divID);
      //add the text area
      var newInput = document.createElement("textarea");
      newInput.className = "text-input";
      newInput.id = "input" + i + "-" + j;
      lesson.appendChild(newInput);
      //add the output area
      var newOutput = document.createElement("div");
      newOutput.className = "text-output"
      newOutput.id = "output" + i + "-" + j;
      lesson.appendChild(newOutput);
    }
  }
}

function createPrevNext() {
  for (var i = 0; i < chapters.length; i++) {
    for (var j = 0; j < chapters[i].lessons.length; j++) {
      var lesson = document.getElementById(chapters[i].lessons[j].divID);
      //add prev button
      var newPrevButton = document.createElement("input");
      newPrevButton.type = "button";
      newPrevButton.id = "prev-button" + i + "-" + j;
      newPrevButton.className = "prev-button";
      newPrevButton.value = "< Prev Lesson"
      lesson.appendChild(newPrevButton);
      //add the output area
      var newNextButton = document.createElement("input");
      newNextButton.type = "button";
      newNextButton.id = "next-button" + i + "-" + j;
      newNextButton.className = "next-button";
      newNextButton.value = "Next Lesson >"
      lesson.appendChild(newNextButton);
    }
  }
}

function createSubmitClear(){
  for (var i = 0; i < chapters.length; i++) {
    for (var j = 0; j < chapters[i].lessons.length; j++) {
      var lesson = document.getElementById(chapters[i].lessons[j].divID);
      //add submit button
      var newSubmitButton = document.createElement("input");
      newSubmitButton.type = "button";
      newSubmitButton.id = "submit-button" + i + "-" + j;
      newSubmitButton.className = "submit-button";
      newSubmitButton.value = "Submit"
      lesson.appendChild(newSubmitButton);
      //add clear button
      var newClearButton = document.createElement("input");
      newClearButton.type = "button";
      newClearButton.id = "clear-button" + i + "-" + j;
      newClearButton.className = "clear-button";
      newClearButton.value = "Clear"
      var input = document.getElementById("input"+i+"-"+j);
      newClearButton.onclick = function(){
        input.value='';
      }
      lesson.appendChild(newClearButton);
    }
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
