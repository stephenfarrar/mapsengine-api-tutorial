//Javascript file for tutorial
//THE GLOBAL VARIABLES
var activeLesson;
var placeholder = "Enter your input here, press enter or click 'Get' to submit.";
var fadeInTime = 1000;

//object to store lesson information
function Lesson(divID, options) {
  this.divID = divID;
  this.title = options.title;
  if (options.submit) {
    this.submit = options.submit;
  }
  //done is TRUE if: the user has submitted correctly
  this.done = false;
  this.unlocked = false;
  this.showInventory = options.showInventory;
}

Lesson.prototype.update = function() {
  //if the lesson is still unlocked, it can't be accessed
  if (!this.unlocked) return;
  //else, the lesson can be accessed
  //scroll to top of the page
  $("html, body").animate({scrollTop:0},500);
  $('.response').empty();
  activeLesson = this;
  document.title = this.title;
  //hide some elements
  hideResultDivs();
  //show inventory if needed
  if(this.showInventory){
    $(".inventory").show();
  } else {
     $(".inventory").hide();
  }
  //make the border black again
  $(".url").removeClass('redborder');
  //update buttons
  if ($("#"+this.divID+'button').is(":hidden")) {
    hideLessons('medium');
    var lesson = this.chapter.lessons;
    lesson.forEach(function(lesson) {
      $('#' + lesson.divID + 'button').show('medium');
    })
  }
  //make text on button for active lesson red, and all others black
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      $("#"+lesson.divID+'button').removeClass('active');
      if (lesson.unlocked) {
        $("#"+lesson.divID+'button').addClass('unlocked');
      }
    });
  });
  $("#"+this.divID+'button').removeClass('unlocked').addClass('active');
  //display the instruction blurb
  this.displayInstructions();

  localStorage['currentLesson'] = activeLesson.divID;
  
  var storedUrl = localStorage[this.divID + 'input'];
  $(".url").toggleClass("placeholder", !storedUrl)
    .text(storedUrl || placeholder);
  
}

// Displays the instructions, possibly loading them from the markdown file.
Lesson.prototype.displayInstructions = function() {
  var me = this;
  if (!this.instructions) {
    // If the instructions aren't loaded, load them.
    $.get(this.divID+".md", function(response){
      me.instructions = response;
      me.displayInstructions();
    });
    return;
  }
  $(".instructions").html(markdown.toHTML(this.instructions));
}


//If the input is right, do the success responses
Lesson.prototype.displaySuccessMessage = function() {
  var me = this;
  if (!this.successMessage) {
    // If the success message aren't loaded, load them.
    $.get(this.divID+"-success.md", function(response){
      me.successMessage = response;
      me.displaySuccessMessage();
    });
    return;
  }
  $(".message").html(markdown.toHTML(this.successMessage));
  //Display the success ribbon and message
  $(".feedback").hide().fadeIn(fadeInTime).removeClass("failure").addClass("success");
  $(".ribbon").show();
  $(".message").show();

  //automatically scroll to the success message
  var successTop = $(".feedback").position().top;
  $("html, body").animate({scrollTop:successTop-25},500);
  //change border colour to black
  $(".url").removeClass('redborder');
  
  showResponse();

  //Display the next button
  $(".general-button").addClass('next-button');
  $(".next-button").hide();
  $(".next-button").attr("value","Next Lesson");
  $(".next-button").fadeIn(fadeInTime);
}

//If the input is wrong, do the error responses
Lesson.prototype.displayErrorMessage = function(errorMessage) {
  $(".message").html("You entered the wrong input. ");
  $(".message").append(errorMessage);
  $(".message").append(" Please try again.");
  
  //Display the message, hide the success ribbon
  $(".feedback").hide().fadeIn(fadeInTime).removeClass("success").addClass("failure");
  $(".ribbon").hide();
  $(".message").show();
    
  //automatically scroll to the error message
  var errorTop = $(".feedback").position().top;
  $("html, body").animate({scrollTop:errorTop-225},500);
  //change border colour to red
  $(".url").addClass("redborder");

  showResponse();
}

function showResponse(){
   //Display the response 
  if (!$(".response").text()){
    //if there is no response (for API Key lessons, etc., do not display output)
    $(".response").hide();
  } else{
    $(".response").hide();
    $(".response").fadeIn(fadeInTime);
  }
}

Lesson.prototype.complete = function() {
  this.done = true; 
  localStorage[this.divID] = true;
  this.next.unlock();
  this.tick();
  this.chapter.tickIfComplete();
}

Lesson.prototype.tick = function() {
   $('#'+this.divID+'button').css('background-image', 'url("UI-Mocks/Images/green-tick.jpg")');
}

//marks a lesson as unlocked
Lesson.prototype.unlock = function(){
  this.unlocked = true;
  $("#"+this.divID+'button').removeClass('locked').addClass('unlocked');
  $("#"+this.chapter.divID+'button').removeClass('locked').addClass('unlocked');
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
  this.lessons.forEach(function(lesson) {
    $('#' + lesson.divID + 'button').toggle('medium');
  })
  this.lessons[0].update();
}

Chapter.prototype.tick = function() {
   $('#'+this.divID+'button').css('background-image', 'url("UI-Mocks/Images/green-tick.jpg")');
}

//checks if a chapter is complete and, as a result, if the tutorial is also complete
Chapter.prototype.tickIfComplete = function() {
  this.done = true;
  var me = this;
  this.lessons.forEach(function(lesson) {
    if (!lesson.done) {
      me.done = false;
    }
  });
  if (this.done) {
    me.tick();
    me.checkTutorialCompletion();
  }
}

Chapter.prototype.checkTutorialCompletion = function() {
  var finished = true;
  chapters.forEach(function(chapter) {
    if (!chapter.done) {
      finished = false;
    }
  });
  //make sure user only sees completion message once
  if (finished && !localStorage['finished']) {
    alert("Congratulations, you have completed this tutorial!");
    localStorage['finished'] = true;
  }
}

//ARRAY OF CHAPTERS
var chapters = [
  new Chapter('chapter0-intro', {title: 'Introduction', lessons: [
    new Lesson('lesson1-gmeapi', {title: 'GME API', submit: getText, showInventory:false}),
    new Lesson('lesson2-apikey', {title: 'API Key', submit: testAPIKey, showInventory:false})
  ]}),
  new Chapter('chapter1-read', {title: 'Reading Public Data', lessons: [
    new Lesson('lesson3-gettable', {title: 'Get Table', submit: testGetTable, showInventory:true}),
    new Lesson("lesson4-listfeatures", {title: "List Features", submit: executeListInput, showInventory:true}),
    new Lesson("lesson5-queries", {title: "Queries", submit: executeQueries, showInventory:true}),
  ]})
];

//Determining the next, and chapter for each lesson
var prevLesson = chapters[0].lessons[0]; //first lesson
chapters.forEach(function(chapter){
  chapter.lessons.forEach(function(lesson){
    lesson.chapter = chapter;
    prevLesson.next = lesson;
    prevLesson = lesson;
  });
});
//last lesson
prevLesson.next = prevLesson;

//*****************THE GLOBAL FUNCTIONS**********************//
google.maps.event.addDomListener(window, 'load', function initialize(){
  //create the HTML elements
  chapters.forEach(function(chapter){
    makeButton(chapter, "chapter-button");
    chapter.lessons.forEach(function(lesson){
      makeButton(lesson, "lesson-button");
    });
  });

  var $input = $(".url");
  //create placeholder for the input
  $input.focus(function(){
    if($input.text()===placeholder){
      $input.removeClass("placeholder");
      $input.text("");
    }
  })
  .focusout(function(){
    if(!$input.text().length){
      $input.addClass("placeholder")
      $input.text(placeholder);
    }
  });  

  //store the input everytime it changes, to the respective local storage
  //onkeypress
  $input.keypress(function(event){
    //enable submit by enter, not making the enter visible in the input
    if(event.which == 13){
      event.preventDefault();
      activeLesson.submit();
    }
    localStorage[activeLesson.divID+'input'] = $input.text();
  });
  //onkeyup -> handle backspaces
  $input.keyup(function(){
    localStorage[activeLesson.divID+'input'] = $input.text();
  });
  //on cut, and also pasting with mouse
  $input.on('paste cut',function(){
    setTimeout(function(){
      localStorage[activeLesson.divID+'input'] = $input.text();
      $input.text($input.text());
    },0);
  });

  //The first page shown is the first lesson
  hideLessons(0);
  loadState();
});

function loadState() {
  //enable the first lesson on first load
  chapters[0].lessons[0].unlock();
  var activeLessonId = localStorage['currentLesson'] || 'lesson1-gmeapi';
  //update the inventory box
  populateInventory();
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      //if lesson is completed, stored as 'true'
      if (localStorage[lesson.divID]) {
        lesson.complete();
      }
      if (lesson.divID === activeLessonId) {
        lesson.update();
      }
    });
  });
}

//Create the menu button for each lesson & chapter
function makeButton(object, objectClass){
  var button = $(".buttons");
  var newButton = $("<input>")
    .attr("type", "button")
    .attr("id", object.divID+"button")
    .attr("value", object.title)
    .addClass("menu-button " + objectClass + " locked")
    .click(function(){
      object.update();
    });
  button.append(newButton);
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

//Trim the white spaces in the user input
function trim(string){
  return string.replace(/^\s+|\s+$/g, '');
}

//hide the feedback, output, and next button
function hideResultDivs(){
  $('.feedback').hide();
  $('.response').hide();
  $('.general-button').hide();
}

//updating the inventory box
function populateInventory(){
  var $inventory = $(".inventory");
  $inventory.empty();
  $inventory.append("<b>Helpful information</b><br>");
  $inventory.append("table ID: 15474835347274181123-14495543923251622067<br>");
  $inventory.append("your API Key: ");
  $inventory.append(localStorage['APIKey']);
}
//*****************THE GME API FUNCTIONS**********************//
function getText() {
  var string = $(".url").text();
  var address = trim(string);
  var $data = $('.response');
  $data.empty();
  $data.css({ whiteSpace: 'pre' });
  var me = this;
  jQuery.ajax({
  url: address,
    dataType: 'html',
    success: function(resource) {
      $data.append(resource);
      me.displaySuccessMessage();
      me.complete();
    },
    error: function(response) {
      me.displayErrorMessage("Make sure that the spelling is correct, and there are no spaces between the text.");
    }
  });
}

//*****************THE API Key FUNCTIONS**********************//
function testAPIKey() {
  //get user input
  var userKey = $(".url").text();
  var me = this;
  var $data = $('.response');
  $data.empty();
  //use user's API Key to do a HTTP request, if it works then it is a valid API Key
  jQuery.ajax({
  url: 'https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=' + userKey,
    dataType: 'json',
    success: function(resource) {
      localStorage['APIKey'] = userKey;
      populateInventory();
      me.displaySuccessMessage();
      me.complete();
    },
    error: function(response) {
      me.displayErrorMessage("Make sure that you entered the right API Key from Google Developer's Console.");
    }
  });
}

//*****************THE Get Table FUNCTIONS**********************//
  
function testGetTable() {
  //get user input and trim it
  var string = $(".url").text();

  var address = trim(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0";
  //the Get Table is currently NOT AVAILABLE in v1, will someday be available and this 2 line codes needs to be removed
  address = address.replace("v1","search_tt");
  correctAns = correctAns.replace("v1","search_tt");
  checkCorrectness(this, address, correctAns);
}

//*****************THE List Features FUNCTIONS**********************//
function executeListInput(){
  //get user input and trim it
  var string = $(".url").text();
  var address = trim(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0";
  checkCorrectness(this, address, correctAns);
}

//*****************THE Query FUNCTIONS**********************//

function executeQueries(){
  //get user input and trim it
  var string = $(".url").text();
  var address = trim(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyAllwffSbT4nwGqtUOvt7oshqSHowuTwN0&where=Population<2000000";
  checkCorrectness(this, address, correctAns);
}

//*****************CHECKING CORRECT INPUT*******************//
function checkCorrectness(lesson, addressString, correctAns){
  var $data = $('.response');
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
          //if the response user got is the correct response, then the user is right!
          if(resourceString === correctResourceString){
            lesson.displaySuccessMessage();
            lesson.complete();
          } else {
            lesson.displayErrorMessage("You did not do what the exercise is telling you to do. Make sure that you read the question carefully.");
          } 
        },
        error: function(response) {
          $data.append("Wrong URL\n");
          //Output the HTTP status
          $data.append("HTTP Status: "+response.status);
          //call the display error message here to handle the response that is not JSON objects
          lesson.displayErrorMessage("You did not enter a valid URL.");
          response = JSON.parse(response.responseText);
          var errorMess = response.error.errors[0];
          //Giving messages for different error reasons
          if (errorMess.reason === "authError") {
            lesson.displayErrorMessage("Your authorization token is invalid. Please check that the table can be viewed by general public.");
          } else if (errorMess.reason === "dailyLimitExceededUnreg"){
            lesson.displayErrorMessage("Your API Key is invalid. Make sure that you entered the right API Key and table ID.");
          } else if (errorMess.reason === "invalid") {
            var field = errorMess.location;
            lesson.displayErrorMessage("Invalid value in the \""+field+"\" field. Check whether you've given the right tableId.");
          } else if (errorMess.reason === "required"){
            lesson.displayErrorMessage("A required parameter has been left out of the request. Make sure that you entered all parameters needed.");
          } else if (errorMess.reason === "notFound"){
            lesson.displayErrorMessage("No results were found for your request. The asset might not exist, not a public asset, or itt has been deleted from the Google Maps Engine.")
          } else if (errorMess.reason === "insufficientPermissions"){
            lesson.displayErrorMessage("You don't have the permission to do this request. Make sure that the scope of your access is correct.");
          } else if (errorMess.reason === "limitExceeded"){
            lesson.displayErrorMessage("The resource is too large to be accessed through the API.");
          } else if (errorMess.reason === "duplicate"){
            lesson.displayErrorMessage("The new feature you are trying to insert has an ID that already exists in the table.");
          } else if (errorMess.reason === "rateLimitExceeded"|| errorMess.reason === "quotaExceeded"){
            lesson.displayErrorMessage("You have exhausted the application's daily quota or its per-second rate limit. Please contact the Enterprise Support for higher limits.");
          } else if (errorMess.reason === "unauthorized"){
            lesson.displayErrorMessage("You didn't pass an authorization header with your request.");
          } else if (errorMess.reason === "requestToolarge"){
            lesson.displayErrorMessage("Your request contained too many features and/or vertices.");
          } else if (errorMess.reason === "accessNotConfigured"){
            lesson.displayErrorMessage("There is a per-IP or per-Referer restriction configured on the API Key and the request does not match these restrictions, or the Maps Engine API is not activated on the project ID.");
          } else {
            lesson.displayErrorMessage("The data cannot be processed. Please check your request again to ensure that it is correct.");
          }
          var responseString = JSON.stringify(errorMess, null, 2);
          $data.append(responseString); 
        }
      });
    }
  });
}
