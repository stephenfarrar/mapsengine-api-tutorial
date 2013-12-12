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

Chapter.prototype.update = function() {
  this.lessons[0].update();
}

//ARRAY OF CHAPTERS
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

//ARRAY OF LESSONS
var lessonArray = new Array();
for (var i = 0; i<chapters.length; i++){
  for (var j = 0; j<chapters[i].lessons.length; j++){
    lessonArray.push(chapters[i].lessons[j]);
  }
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
  var body = $("#body");
  for (var i = 0; i<chapters.length; i++){
    var newChapterDiv = $("<div>")
        .attr("id", chapters[i].divID)
        .addClass("chapter");
    body.append(newChapterDiv);
    var chapterDiv = $("#"+chapters[i].divID);
    for (var j = 0; j<chapters[i].lessons.length; j++){
      var newLessonDiv = $("<div>")
        .attr("id", chapters[i].lessons[j].divID)
        .addClass("lesson");
      chapterDiv.append(newLessonDiv);
    }
  }
}

function makeButton(object){

  var button = $("#buttons");
  var newButton = $("<input>")
    .attr("type", "button")
    .attr("id", object.divID+"button")
    .attr("value", object.title)
    .addClass('menu-button')
    .click(function(){
      object.update();
    });
  button.append(newButton);
}

//BLOCKING ALL DIVS AUTOMATICALLY
function hideAll() {
  $(".lesson").hide();
}

//Should be called initially to dynamically create divs for each lesson
function createInputOutput() {
  chapters.forEach(function(chapter, i){
    chapter.lessons.forEach(function(lesson, j){
      var lessonDiv = $("#"+lesson.divID);
      //add the text area
      var newInput = $("<textarea>")
        .attr("id", "input" + i + "-" + j)
        .addClass("text-input");
      lessonDiv.append(newInput);
      //add the output area
      var newOutput = $("<textarea>")
        .attr("id", "output" + i + "-" + j)
        .addClass("text-output");
      lessonDiv.append(newOutput);

        //INPUT
      $("#input"+i+"-"+j).css('font-size', 0.015*($("#input"+i+"-"+j).height()+$("#input"+i+"-"+j).width()));
      //OUTPUT
      $("#output"+i+"-"+j).css('font-size', 0.010*($("#output"+i+"-"+j).height()+$("#output"+i+"-"+j).width()));
    });
  });

}

function createPrevNext() {
  var lessonIndex = 0;
  chapters.forEach(function(chapter, i){
    chapter.lessons.forEach(function(lesson, j){
      var lessonDiv = $("#"+lesson.divID);
      //add prev button
      var newPrevButton = $("<input>")
        .attr("type", "button")
        .attr("id", "prev-button" + i + "-" + j)
        .attr("value", "< Prev Lesson")
        .addClass("prev-button");

      if(lessonIndex === 0){
        newPrevButton.click(function(){
          lesson.update();
        });
      } else {
        var prevLesson = lessonArray[lessonIndex-1];
        newPrevButton.click(function(){
          prevLesson.update();
        });
      }
      lessonDiv.append(newPrevButton);

      //add next button
      var newNextButton = $("<input>")
        .attr("type", "button")
        .attr("id", "next-button" + i + "-" + j)
        .attr("value", "Next Lesson >")
        .addClass("next-button");

      if(lessonIndex === (lessonArray.length-1)){
        newNextButton.click(function(){
          lesson.update();
        });
      } else {
        var nextLesson = lessonArray[lessonIndex+1];
        newNextButton.click(function(){
          nextLesson.update();
        });
      }
      lessonDiv.append(newNextButton);
      $("#prev-button"+i+"-"+j).css('font-size', 0.18*($("#prev-button"+i+"-"+j).height()+0.55*$("#prev-button"+i+"-"+j).width()));
      $("#next-button"+i+"-"+j).css('font-size', 0.18*($("#next-button"+i+"-"+j).height()+0.55*$("#next-button"+i+"-"+j).width()));
      lessonIndex++;
    });
  });
}


function createSubmitClear(){
  chapters.forEach(function(chapter, i){
    chapter.lessons.forEach(function(lesson, j){
      var lessonDiv = $("#"+lesson.divID);
      //add submit button

      var newSubmitButton = $("<input>")
        .attr("type", "button")
        .attr("id", "submit-button" + i + "-" + j)
        .attr("value", "Submit")
        .addClass("submit-button")
        .click(function(){
          lesson.submit(i,j); 
        });
      lessonDiv.append(newSubmitButton);

      //add clear button
      var newClearButton = $("<input>")
        .attr("type", "button")
        .attr("id", "clear-button" + i + "-" + j)
        .attr("value", "Clear")
        .addClass("clear-button")
        .click(function(){
          $("#input"+i+"-"+j).val("");
        });
      lessonDiv.append(newClearButton);
      $("#submit-button"+i+"-"+j).css('font-size', 0.20*($("#submit-button"+i+"-"+j).height()+$("#submit-button"+i+"-"+j).width()));
      $("#clear-button"+i+"-"+j).css('font-size', 0.20*($("#clear-button"+i+"-"+j).height()+$("#clear-button"+i+"-"+j).width()));
    });
  });
}

function getFeatures(addressString, outputId){
  var $data = $("#" + outputId);
  var data = document.getElementById(outputId);
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
function testAPIKey(i,j) {
  var userKey = document.getElementById("input"+i+"-"+j).value;
  var $data = $("#output"+i+"-"+j);
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
function testGetTable(i,j) {
  var userURL = document.getElementById("input"+i+"-"+j).value;
  var outputId = "output"+i+"-"+j;
  var $data = $("#output"+i+"-"+j);
  var expectedURL = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/?version=published&key=" + userAPIKey;
  console.log(expectedURL);
  if (userURL == expectedURL) {
    alert("Huzzah! Great work!")
    getFeatures("https://www.googleapis.com/mapsengine/search_tt/tables/15474835347274181123-16143158689603361093/?version=published&key=" + userAPIKey, outputId);
  } else {
    $data.html("Oh no! Something isn't quite right. Try again. Hint: Make sure you entered a valid API Key in the previous exercise!");
  }
}
//*****************THE List Features FUNCTIONS**********************//
function executeListInput(i,j){
  var string = document.getElementById("input"+i+"-"+j).value;
  var address = trimLeft(string);
  var outputId = "output"+i+"-"+j;
  getFeatures(address, outputId);
}
