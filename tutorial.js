//Javascript file for tutorial
//THE GLOBAL VARIABLES

var userAPIKey = "";
var activeLesson;
var isTutorialFinished = false;

//object to store lesson information
function Lesson(divID, options) {
  this.divID = divID;
  this.title = options.title;
  if (options.submit) {
    this.submit = options.submit;
  }
  //noSubmitRequired is TRUE if the user does not need to submit anything to complete the lesson
  //noSubmitRequired is FALSE if the user needs to pass an exercise and submit them in order to complete it
  this.noSubmitRequired = options.noSubmitRequired
  //done is TRUE if: the user submit correctly OR the user has loaded the page that does not need submission
  this.done = false;
  this.unlocked = false;
}

Lesson.prototype.update = function() {
  //if the lesson is still unlocked, it can't be accessed
  if (!this.unlocked) return;
  //else, the lesson can be accessed
  hideAll();
  activeLesson = this;
  document.title = this.title;
  $("#"+this.divID).css({display : "block"});

  //update buttons
  if ($("#"+this.divID+'button').is(":hidden")) {
    hideLessons('medium');
    var lesson = this.chapter.lessons;
    lesson.forEach(function(lesson) {
      $('#' + lesson.divID + 'button').show('medium');
    })
  }

  //display the instruction blurb
  this.displayInstructions();

  localStorage['currentLesson'] = activeLesson.divID;

  //if no submission required, the user automatically unlock the next page
  if(this.noSubmitRequired){
    this.unlock();
  } 
}

// Displays the instructions, possibly loading them from the markdown file.
Lesson.prototype.displayInstructions = function() {
  var me = this;

  // If the instructions aren't loaded, load them.
  if (!this.instructions){
    $.get(this.divID+".md", function(response){
      me.instructions = response;
      me.displayInstructions();
    });
  }

  if (this.instructions) {
    $("#instructions").html(markdown.toHTML(this.instructions));
  }
}

//Give the submit prototype for the lessons that does not have submission function
//the submit button will call the update function for those lessons
Lesson.prototype.submit = function() {
  this.update();
};

//Marked the current lesson as done, update the completion tick, and unlock the next lesson
Lesson.prototype.unlock = function(){
  this.done = true;
  this.next.unlocked = true;
  localStorage[this.divID] = true;
  updateTick();
};

//Object to store chapter information
function Chapter(divID, options) {
  this.divID = divID;
  this.lessons = options.lessons;
  this.title = options.title;
  this.done = false;
}

//Chapter update, call update for the first lesson in the chapter
Chapter.prototype.update = function() {
  var lesson = this.lessons;
  lesson.forEach(function(lesson) {
    $('#' + lesson.divID + 'button').toggle('medium');
  })
  this.lessons[0].update();
}

//ARRAY OF CHAPTERS
var chapters = [
  new Chapter('chapter0-intro', {title: '0.Introduction', lessons: [
    new Lesson('lesson0-intro', {title: 'Introduction', noSubmitRequired: true}),
    new Lesson('lesson1-gmeapi', {title: 'GME API', noSubmitRequired: true})
  ]}),
  new Chapter('chapter1-registration', {title: 'I.Registration', lessons: [
    new Lesson('lesson2-apikey', {title: 'API Key', submit: testAPIKey, noSubmitRequired: false})
  ]}),
  new Chapter('chapter2-read', {title: 'II.Reading Public Data', lessons: [
    new Lesson('lesson3-gettable', {title: 'Get Table', submit: testGetTable, noSubmitRequired: false}),
    new Lesson("lesson4-listfeatures", {title: "List Features", submit: executeListInput, noSubmitRequired: false}),
    new Lesson("lesson5-queries", {title: "Queries", submit: executeQueries, noSubmitRequired: false}),
  ]})
];

//Determining the prev, next, and chapter for each lesson
var prevLesson = chapters[0].lessons[0]; //first lesson
chapters.forEach(function(chapter){
  chapter.lessons.forEach(function(lesson){
    lesson.chapter = chapter;
    lesson.prev = prevLesson;
    prevLesson.next = lesson;
    prevLesson = lesson;
  });
});
//last lesson
prevLesson.next = prevLesson;

//*****************THE GLOBAL FUNCTIONS**********************//
google.maps.event.addDomListener(window, 'load', function initialize(){
  //create the HTML elements
  makeLessonDivs();
  createInputOutput();
  chapters.forEach(function(chapter){
    makeButton(chapter, "chapter-button");
    chapter.lessons.forEach(function(lesson){
      makeButton(lesson, "lesson-button");
    });
  });

  //LOADING THE FONT SIZE ACCORDING TO WINDOW SIZES
   //TITLE
  $("#title").css({fontSize: 0.031*($("#title").height()+$("#title").width())});
  //INSTRUCTIONS
  $("#instructions").css('font-size', 0.018*($("#instructions").height()+$("#instructions").width()));

  //The first page shown is the first lesson
  hideLessons(0);
  loadState();
});

function loadState() {
  chapters[0].lessons[0].unlocked = true;
  var activeLessonId = localStorage['currentLesson'] || 'lesson0-intro';
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      //if lesson is completed, stored as 'true'
      if (localStorage[lesson.divID]) {
        lesson.done = true;
        lesson.next.unlocked = true;
      }
      if (lesson.divID === activeLessonId) {
        lesson.update();
      }
      if (localStorage[lesson.divID+'input']){
        lesson.inputDiv.val(localStorage[lesson.divID+'input']);
      }
      if (localStorage[lesson.divID+'output']){
        lesson.outputDiv.html(localStorage[lesson.divID+'output']);
      }
    });
  });
  updateTick();
}

//Create the divs for each lesson
function makeLessonDivs(){
  var body = $("#body");
  chapters.forEach(function(chapter){
     var newChapterDiv = $("<div>")
        .attr("id", chapter.divID)
        .addClass("chapter");
    body.append(newChapterDiv);
    var chapterDiv = $("#"+chapter.divID);
    chapter.lessons.forEach(function(lesson){
      var newLessonDiv = $("<div>")
        .attr("id", lesson.divID)
        .addClass("lesson");
      chapterDiv.append(newLessonDiv);
    });
  });
}

//Create the menu button for each lesson & chapter
function makeButton(object, objectClass){
  var button = $("#buttons");
  var newButton = $("<input>")
    .attr("type", "button")
    .attr("id", object.divID+"button")
    .attr("value", object.title)
    .addClass("menu-button")
    .addClass(objectClass)
    .click(function(){
      object.update();
    });
  button.append(newButton);
}

//BLOCKING ALL DIVS AUTOMATICALLY
function hideAll() {
  $(".lesson").hide();
}

//Hides the lesson buttons within the chapter
function hideLessons(speed) {
  chapters.forEach(function(chapters) {
    var lessons = chapters.lessons;
    lessons.forEach(function(lessons) {
      $('#' + lessons.divID + 'button').hide(speed);
    })
  })
}

//Create the input and output area for each lesson
function createInputOutput() {
  chapters.forEach(function(chapter, i){
    chapter.lessons.forEach(function(lesson, j){
      var lessonDiv = $("#"+lesson.divID);
      //add the text area
      var newInput = $("<textarea>")
        .addClass("text-input")
        .change(function(){
          localStorage[lesson.divID+'input'] = newInput.val();
        });
      lessonDiv.append(newInput);
      lesson.inputDiv = newInput;
      //add the output area
      var newOutput = $("<textarea>")
        .addClass("text-output");
      lessonDiv.append(newOutput);
      lesson.outputDiv = newOutput;
    });
  });
}

//Clear the input area 
function clearInput() {
  activeLesson.inputDiv.val("");
}

//Trim the pre white spaces in the user input
function trimLeft(string){
  return string.replace(/^\s+/, '');
}

//update the completion tick
function updateTick(){
  //set the tutorial to be in completed stage
  var allChapterDone = true;
  chapters.forEach(function(chapter){
    //if there is a not done chapter, look through the lessons to check if the chapter is completed
    if (!chapter.done){
      //set the chapter to be in completed stage
      var allLessonDone = true;
      //Go through each lesson to see whether it is done or not
      chapter.lessons.forEach(function(lesson){
          if (lesson.done){
            var lessonButton = $("#"+lesson.divID+"button");
            //if the green tick is not set up yet
            if (lessonButton.css('background-image') === "none"){
              //create the green tick for the lesson
              lessonButton.css('background-image', 'url(http://www.sxc.hu/assets/183254/1832538623/green-tick-in-circle-1335495-m.jpg)');
            }
          } else {
            //the chapter is not completed since there is an incomplete lesson
            allLessonDone = false;
          }
      });
      //if the chapter is done
      if(allLessonDone){
        //create green tick for chapter
        //set the chapter object "done" property to true
        chapter.done = true;
        var chapterButton  = $("#"+chapter.divID+"button");
        chapterButton.css('background-image', 'url(http://www.sxc.hu/assets/183254/1832538623/green-tick-in-circle-1335495-m.jpg)');
      }
    }
    //if there is still a not done chapter, the tutorial is not complete
    if(!chapter.done){
      allChapterDone = false;
    }
  });
  //if the tutorial is complete and it is the first time user completed it, send a congratulatory message
  if(allChapterDone && !isTutorialFinished){
    alert("Congratulations, you have completed this tutorial!");
    isTutorialFinished = true;
  }
}

//*****************THE API Key FUNCTIONS**********************//
function testAPIKey() {
  //get user input
  var userKey = activeLesson.inputDiv.val();
  var $data = activeLesson.outputDiv;
  //use user's API Key to do a HTTP request, if it works then it is a valid API Key
  jQuery.ajax({
  url: 'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=' + userKey,
    dataType: 'json',
    success: function(resource) {
      alert("Congrats! Your API Key works. Now continue on to Get Table!");
      userAPIKey = userKey;
      activeLesson.unlock();
    },
    error: function(response) {
      alert("Sorry your API Key did not work. Try again!");
    }
  });
}

//*****************THE Get Table FUNCTIONS**********************//
  
function testGetTable() {
  //get user input and trim it
  var string = activeLesson.inputDiv.val();;
  var $data = activeLesson.outputDiv;
  var address = trimLeft(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0";
  //the Get Table is currently NOT AVAILABLE in v1, will someday be available and this 2 line codes needs to be removed
  address = address.replace("v1","search_tt");
  correctAns = correctAns.replace("v1","search_tt");
  checkCorrectness(address, correctAns);
}

//*****************THE List Features FUNCTIONS**********************//
function executeListInput(){
  //get user input and trim it
  var string = activeLesson.inputDiv.val();
  var address = trimLeft(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0";
  checkCorrectness(address, correctAns);
}

//*****************THE Query FUNCTIONS**********************//

function executeQueries(){
  //get user input and trim it
  var string = activeLesson.inputDiv.val();;
  var address = trimLeft(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&where=Population<2000000";
  checkCorrectness(address, correctAns);
}

//*****************CHECKING CORRECT INPUT*******************//
function checkCorrectness(addressString, correctAns){
  var $data = activeLesson.outputDiv;
  //style the output div
  $data.css({ whiteSpace: 'pre' });
  $data.empty();
  //Get the response with the correct URL
  jQuery.ajax({
    url: correctAns,
    dataType: 'json',
    success: function(resource) {
      var correctResourceString = JSON.stringify(resource, null, 2);
      //Get the response with users's input
      jQuery.ajax({
        url: addressString,
        dataType: 'json',
        success: function(resource2) {
          var resourceString = JSON.stringify(resource2, null, 2);
          $data.append(resourceString);
          localStorage[activeLesson.divID+'output']=resourceString;
          //if the response user got is the correct response, then the user is right!
          if(resourceString === correctResourceString){
            alert("Great work! You can move on to the next lesson.");
            activeLesson.unlock();
          } else {
            alert("Oops! You've entered wrong URL! Try again!");
          }
        },
        error: function(response) {
          alert ("Oops! You've entered wrong URL! Try again!");
          $data.append("Wrong URL\n");
          //Output the HTTP status
          $data.append("HTTP Status: "+response.status);
          response = JSON.parse(response.responseText);
          var errorMess = response.error.errors[0];
          //Giving messages for different error reasons
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
        }
      });
    }
  });
}
