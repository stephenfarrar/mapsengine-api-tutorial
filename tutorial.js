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
  this.correct = options.correct;
  this.done = false;
}

Lesson.prototype.update = function() {
  hideAll();
  var me = this;
  document.title = this.title;
  $("#"+this.divID).css({display : "block"});

  //update buttons
  if ($("#"+this.divID+'button').is(":hidden")) {
    hideLessons('medium');
    var lesson = chapters[this.chapter].lessons;
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

  if(this.correct === true){
    this.done = true;
  } 
  updateTick();
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

  if(allChapterDone){
    alert("Congratulations, you have completed this tutorial!");
  }
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
    new Lesson('lesson0-intro', {title: 'Introduction', correct: true}),
    new Lesson('lesson1-gmeapi', {title: 'GME API', correct: true})
  ]}),
  new Chapter('chapter1-registration', {title: 'I.Registration', lessons: [
    new Lesson('lesson2-apikey', {title: 'API Key', submit: testAPIKey, correct: false})
  ]}),
  new Chapter('chapter2-read', {title: 'II.Reading Public Data', lessons: [
    new Lesson('lesson3-gettable', {title: 'Get Table', submit: testGetTable, correct: false}),
    new Lesson("lesson4-featureslist", {title: "List Features", submit: executeListInput, correct: false})
  ]})
];

//ARRAY OF LESSONS
//!!TODO: Remove lessonArray once code is changed to use prev/next information.
var lessonArray = new Array();
var prevLesson = chapters[0].lessons[0]; //first lesson
chapters.forEach(function(chapter){
  chapter.lessons.forEach(function(lesson){
    lesson.chapter = chapter;
    lesson.prev = prevLesson;
    prevLesson.next = lesson;
    prevLesson = lesson;
    lessonArray.push(lesson);
  });
});
//last lesson
prevLesson.next = prevLesson;

//*****************THE GLOBAL FUNCTIONS**********************//
google.maps.event.addDomListener(window, 'load', function initialize(){
  //CREATING BUTTONS
  makeLessonDivs();
  createInputOutput();
  createPrevNext();
  createSubmitClear();
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
  chapters[0].update();
});

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
        .attr("id", "input" + i + "-" + j)
        .addClass("text-input");
      lessonDiv.append(newInput);
      //add the output area
      var newOutput = $("<textarea>")
        .attr("id", "output" + i + "-" + j)
        .addClass("text-output");
      lessonDiv.append(newOutput);

        //INPUT
      $("#input"+i+"-"+j).css({fontSize: 0.015*($("#input"+i+"-"+j).height()+$("#input"+i+"-"+j).width())});
      //OUTPUT
      $("#output"+i+"-"+j).css({fontSize: 0.010*($("#output"+i+"-"+j).height()+$("#output"+i+"-"+j).width())});
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
      $("#prev-button"+i+"-"+j).css({fontSize: 0.18*($("#prev-button"+i+"-"+j).height()+0.55*$("#prev-button"+i+"-"+j).width())});
      $("#next-button"+i+"-"+j).css({fontSize: 0.18*($("#next-button"+i+"-"+j).height()+0.55*$("#next-button"+i+"-"+j).width())});
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
          updateTick();
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
      $("#submit-button"+i+"-"+j).css({fontSize: 0.20*($("#submit-button"+i+"-"+j).height()+$("#submit-button"+i+"-"+j).width())});
      $("#clear-button"+i+"-"+j).css({fontSize: 0.20*($("#clear-button"+i+"-"+j).height()+$("#clear-button"+i+"-"+j).width())});
    });
  });
}

function getFeatures(addressString, i, j){
  var $data = $("#output" + i + "-" + j);
  $data.css({ whiteSpace: 'pre' });
  
  $data.empty();
  jQuery.ajax({
    url: addressString,
    dataType: 'json',
    success: function(resource) {
      var resourceString = JSON.stringify(resource, null, 2);
      $data.append("\n");
      $data.append(resourceString);
      $data.append("\n");
      chapters[i].lessons[j].correct = true;
      chapters[i].lessons[j].done = true;
      updateTick();
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
  var userKey = $("#input"+i+"-"+j).val();
  var $data = $("#output"+i+"-"+j);
  jQuery.ajax({
  url: 'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/features?version=published&key=' + userKey,
    dataType: 'json',
    success: function(resource) {
      $data.html("Congrats! Your API Key works. Now continue on to Get Table!");
      userAPIKey = userKey;
      console.log(userAPIKey);
      chapters[i].lessons[j].correct = true;
      chapters[i].lessons[j].done = true;
      updateTick();
    },
    error: function(response) {
      $data.html("Sorry your API Key did not work. Try again!");
    }
  });
}

//*****************THE Get Table FUNCTIONS**********************//
function testGetTable(i,j) {
  var userURL = $("#input"+i+"-"+j).val();;
  var $data = $("#output"+i+"-"+j);
  var expectedURL = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-16143158689603361093/?version=published&key=" + userAPIKey;
  console.log(expectedURL);
  if (userURL == expectedURL) {
    alert("Huzzah! Great work!")
    getFeatures("https://www.googleapis.com/mapsengine/search_tt/tables/15474835347274181123-16143158689603361093/?version=published&key=" + userAPIKey, i, j);
  } else {
    $data.html("Oh no! Something isn't quite right. Try again. Hint: Make sure you entered a valid API Key in the previous exercise!");
  }
}
//*****************THE List Features FUNCTIONS**********************//
function executeListInput(i,j){
  var string = $("#input"+i+"-"+j).val();;
  var address = trimLeft(string);
  getFeatures(address, i, j);
}
