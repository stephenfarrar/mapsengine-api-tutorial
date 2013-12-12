//Javascript file for tutorial
//THE GLOBAL VARIABLES

//global window size variables used in dynamic sizing
var winWidth = $(window).width();
var winHeight = $(window).height();
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

function Chapter(divID, lessons) {
  this.divID = divID;
  this.lessons = lessons;
}

var chapters = [
  new Chapter('0.Introduction', [
    new Lesson('lesson1-intro', {title: 'Introduction'}),
    new Lesson('lesson1-gmeapi', {title: 'GME API'})
  ]),
  new Chapter('I.Registration', [
    new Lesson('lesson2-apikey', {title: 'API Key', submit: testAPIKey})
  ]),
  new Chapter('II.Reading Public Data', [
    new Lesson('lesson3-gettable', {title: 'Get Table', submit: testGetTable}),
    new Lesson("lesson4-featureslist", {title: "List Features", submit: executeListInput})
  ])
];

//*****************THE GLOBAL FUNCTIONS**********************//
google.maps.event.addDomListener(window, 'load', function initialize(){
  //CREATING BUTTONS
  for (var i=0; i<chapters.length; i++){
    makeButton(chapters[i].divID, chapters[i].divID, chapters[i].lessons[0].update)
    for (var j=0; j<chapters[i].length; j++) {
      makeButton(chapters[i].lessons[j].divID, chapters[i].lessons[j].title, chapters[i].lessons[j].update);
    }
  }
  makeLessonDivs();
  createInputOutput();
  createPrevNext();

  //LOADING THE FONT SIZE ACCORDING TO WINDOW SIZES
   //TITLE
  $("#title").css('font-size', 0.031*($("#title").height()+$("#title").width()));
  //INSTRUCTIONS
  $("#instructions").css('font-size', 0.020*($("#instructions").height()+$("#instructions").width()));
  //INPUT
   $(".text-input").css('font-size', 0.015*($(".text-input").height()+$(".text-input").width()));
  //OUTPUT
  $(".text-output").css('font-size', 0.010*($(".text-output").height()+$(".text-output").width()));
  //PREV NEXT BUTTON
  $("#prev-button").css('font-size', 0.18*($("#prev-button").height()+0.55*$("#prev-button").width()));
  $("#next-button").css('font-size', 0.18*($("#next-button").height()+0.55*$("#next-button").width())); 
  //set the initial page to be the introduction
  chapters[0].lessons[0].update();
});

function makeLessonDivs(){
  /*
  var body = document.getElementById("body"); 
  for (var i = 0; i<lessonArray.length; i++){
    var newLessonDiv = document.createElement("div");
    newLessonDiv.id = lessonArray[i].divID;
    newLessonDiv.class = "lesson";
    body.appendChild(newLessonDiv);
  }
  */
  
  var body = document.getElementById("body");
  for (var i = 0; i<chapters.length; i++){
    var newChapterDiv = document.createElement("div");
    newChapterDiv.id = chapters[i].divID;
    newChapterDiv.class = "chapter";
    body.appendChild(newChapterDiv);
    var chapterDiv = document.getElementById(chapters[i].divID);
    for (var j = 0; j<chapters[i].length; i++){
      var newLessonDiv = document.createElement("div");
      newLessonDiv.id = chapters[i][j].divID;
      newLessonDiv.class = "lesson";
      chapterDiv.appendChild(newLessonDiv);
    }
  }
}


function makeButton(id, title, update){
  var button = document.getElementById("buttons");
  var newButton = document.createElement("input");
  newButton.type = "button";
  newButton.id = id+"button";
  newButton.value = title;
  newButton.onclick = function(){
    update();
  };
  button.appendChild(newButton);
  button.appendChild(document.createElement("br"));
  var buttonElement = document.getElementById(id+"button");
  buttonStyle(buttonElement);
}

function buttonStyle(buttonProp){
  buttonProp.style.display = ' ';
  buttonProp.style.backgroundColor = 'yellow';
  buttonProp.style.width = '160px';
  buttonProp.style.height = '40px';
  buttonProp.style.fontSize = '20px';
  buttonProp.style.opacity = 0.8;
  buttonProp.style.fontWeight = 'bold';
  buttonProp.style.color = 'black';
}

//BLOCKING ALL DIVS AUTOMATICALLY
function hideAll() {
  for (var i=0; i<chapters.length; i++){
    for (var j=0; j<chapters[i].length; j++) {
      document.getElementById(chapters[i].lessons[j].divID).style.display = "none";
    }
    document.getElementById(chapters[i].divID).style.display = "none";
  }
}

//Should be called initially to dynamically create divs for each lesson
function createInputOutput() {
  for (var i = 0; i < chapters.length; i++) {
    for (var j = 0; j < chapters[i].length; j++) {
      var lesson = document.getElementById(chapters[i].lessons[j].divID);
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
      makeSubmit(i, j);
    }
  }
}

function inputStyle(element, i) {
  element.style.display = 'block'
  element.style.position = 'absolute';
  element.style.backgroundColor = '#FFFFFF';
  element.style.color = 'black';
  element.style.width = '39.75%';
  element.style.height = '39.5%';
  element.style.left = '23%';
  element.style.top = '56%';
  element.style.resize = 'none';
  element.style.overflowY = 'scroll';
  element.style.fontFamily = 'monospace';
}

function outputStyle(element, i) {
  element.style.display = 'block'
  element.style.position = 'absolute';
  element.style.backgroundColor = '#2D2D2D';
  element.style.color = 'white';
  element.style.resize = 'none';
  element.style.fontFamily = 'monospace';
  element.style.padding = '1%';
  element.style.width = '35%';
  element.style.height = '85.9%';
  element.style.left = '63%';
  element.style.top = '10.75%';
  element.style.overflowY = 'scroll';
  element.style.zIndex = 2;
}

function createPrevNext() {
  for (var i = 0; i < lessonArray.length; i++) {
    var lesson = document.getElementById(lessonArray[i].divID);
    //add prev button
    var newPrevButton = document.createElement("button");
    newPrevButton.id = "prev-button" + i;
    newPrevButton.class = "prev-button";
    newPrevButton.value = "< Prev Lesson"
    lesson.appendChild(newPrevButton);
    //add the output area
    var newNextButton = document.createElement("button");
    newNextButton.id = "next-button" + i;
    newNextButton.class = "next-button";
    newNextButton.value = "NextLesson >"
    lesson.appendChild(newNextButton);

    //style the areas
    var prevButtonElement = document.getElementById("prev-button" + i);
    prevButtonStyle(prevButtonElement, i);
    var nextButtonElement = document.getElementById("next-button" + i);
    nextButtonStyle(nexttButtonElement, i)
  }
}

function prevButtonStyle(element, i) {
  element.style.display = 'block'
  element.style.position = 'absolute';
  element.style.backgroundColor = '#4D90FE';
  element.style.color = 'white';
  element.style.width = '8%';
  element.style.height = '3%';
  element.style.left = '23.5%';
  element.style.top = '11.25%';
  element.style.fontWeight = 'bold';
  element.style.fontFamily = 'Arial regular';
  element.style.border = "1px solid #1155CC";
  eleement.style.zIndex = 2;
}

function nextButtontStyle(element, i) {
  element.style.display = 'block'
  element.style.position = 'absolute';
  element.style.backgroundColor = '#4D90FE';
  element.style.color = 'white';
  element.style.width = '8%';
  element.style.height = '3%';
  element.style.left = '54.5%';
  element.style.top = '11.25%';
  element.style.fontWeight = 'bold';
  element.style.fontFamily = 'Arial regular';
  element.style.border = "1px solid #1155CC";
  eleement.style.zIndex = 2;
}
/*
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

function makeSubmit(i, j) {
  //add a submit button
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Submit";
  submit.id = "submitbutton" + i;
  submit.style.position = "absolute";
  submit.onclick = function() {
    chapters[i].lessons[j].submit();
  };
  submitbuttonStyle(submit)
  var button = document.getElementById("input-explanation" + i);
  button.appendChild(submit);
}

function submitbuttonStyle(submit) {
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
*/
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
