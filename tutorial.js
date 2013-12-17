//Javascript file for tutorial
//THE GLOBAL VARIABLES

var userAPIKey = "";
var activeLesson;
var isTutorialFinished = false;

var jsonLocalStorage = {
  set: function(key, value) {
    localStorage[key] = JSON.stringify(value);
  },
  get: function(key) {
    return localStorage[key] ? JSON.parse(localStorage[key]) : null;
  }
};

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
}

Lesson.prototype.update = function() {
  hideAll();
  activeLesson = this;
  var me = this;
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
  if (!this.upToDate){
    //first time page loaded
    $.get(this.divID+".md", function(response){
      $("#instructions").html(markdown.toHTML(response));
      me.instructions = response;
      me.upToDate = true;
    } );    
  } else {
      //has been loaded before
      $("#instructions").html(markdown.toHTML(this.instructions));
  }

  if(this.noSubmitRequired === true){
    this.done = true;
  } 
  updateTick();

  jsonLocalStorage.set('state', {currentLesson: activeLesson.divID});
}

Lesson.prototype.submit = function() {
  this.update();
};

function Chapter(divID, options) {
  this.divID = divID;
  this.lessons = options.lessons;
  this.title = options.title;
  this.done = false;
}

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

//ARRAY OF LESSONS
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
  //CREATING BUTTONS
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

  hideLessons(0);
  loadState();
});

function loadState() {
  var load = jsonLocalStorage.get('state');
  var activeLessonId = load.currentLesson || 'lesson0-intro';
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      if (lesson.divID === activeLessonId) {
        lesson.update();
      }
    });
  });
}

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

//Should be called initially to dynamically create divs for each lesson
function createInputOutput() {
  chapters.forEach(function(chapter, i){
    chapter.lessons.forEach(function(lesson, j){
      var lessonDiv = $("#"+lesson.divID);
      //add the text area
      var newInput = $("<textarea>")
        .addClass("text-input");
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

function clearInput() {
  activeLesson.inputDiv.val("");
}

function trimLeft(string){
  return string.replace(/^\s+/, '');
}

function updateTick(){
  var allChapterDone = true;
  chapters.forEach(function(chapter){
    var allLessonDone = true;
    chapter.lessons.forEach(function(lesson){
        if (lesson.done === true){
          var lessonButton = $("#"+lesson.divID+"button");
          lessonButton.css('background-image', 'url(http://www.sxc.hu/assets/183254/1832538623/green-tick-in-circle-1335495-m.jpg)');
        } else {
          allLessonDone = false;
        }
    });
    if(allLessonDone){
      chapter.done = true;
      var chapterButton  = $("#"+chapter.divID+"button");
      chapterButton.css('background-image', 'url(http://www.sxc.hu/assets/183254/1832538623/green-tick-in-circle-1335495-m.jpg)');
    }
    if(chapter.done === false){
      allChapterDone = false;
    }
  });

  if(allChapterDone && isTutorialFinished===false){
    alert("Congratulations, you have completed this tutorial!");
    isTutorialFinished = true;
  }
}

//*****************THE API Key FUNCTIONS**********************//
function testAPIKey() {
  var userKey = activeLesson.inputDiv.val();
  var $data = activeLesson.outputDiv;
  jQuery.ajax({
  url: 'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=' + userKey,
    dataType: 'json',
    success: function(resource) {
      alert("Congrats! Your API Key works. Now continue on to Get Table!");
      userAPIKey = userKey;
      activeLesson.done = true;
      updateTick();
    },
    error: function(response) {
      alert("Sorry your API Key did not work. Try again!");
    }
  });
}

//*****************THE Get Table FUNCTIONS**********************//
  
function testGetTable() {
  var string = activeLesson.inputDiv.val();;
  var $data = activeLesson.outputDiv;
  var address = trimLeft(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0";
  //the Get Table is currently NOT AVAILABLE in v1, will someday be available and this 2 line codes needs to be removed
  address = address.replace("v1","search_tt");
  correctAns = correctAns.replace("v1","search_tt");
  checkCorrectness(address, correctAns);
}
//*****************THE List Features FUNCTIONS**********************//
function executeListInput(){
  var string = activeLesson.inputDiv.val();
  var address = trimLeft(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0";
  checkCorrectness(address, correctAns);
}

function executeQueries(){
  var string = activeLesson.inputDiv.val();;
  var address = trimLeft(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&limit=3";
  checkCorrectness(address, correctAns);
}

function checkCorrectness(addressString, correctAns){
  var $data = activeLesson.outputDiv;
  $data.css({ whiteSpace: 'pre' });
  $data.empty();
  jQuery.ajax({
    url: correctAns,
    dataType: 'json',
    success: function(resource) {
      var correctResourceString = JSON.stringify(resource, null, 2);
      jQuery.ajax({
        url: addressString,
        dataType: 'json',
        success: function(resource2) {
          var resourceString = JSON.stringify(resource2, null, 2);
          $data.append(resourceString);
          if(resourceString === correctResourceString){
            alert("Great work! You can move on to the next lesson.");
            activeLesson.done = true;
            updateTick();
          } else {
            alert("Oops! You've entered wrong URL! Try again!");
          }
        },
        error: function(response) {
          alert ("Oops! You've entered wrong URL! Try again!");
          $data.append("Wrong URL\n");
          $data.append("HTTP Status: "+response.status);
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
        }
      });
    }
  });
}
