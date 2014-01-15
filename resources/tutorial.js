//Javascript file for tutorial
//THE GLOBAL VARIABLES
var activeLesson;
var fadeInTime = 500;
var pendingFiles = {};

//object to store lesson information
function Lesson(divID, options) {
  this.divID = divID;
  this.title = options.title;
  this.buttonValue = options.buttonValue || 'Next Lesson';
  this.submitButtonValue = options.submitButtonValue || 'Get';
  if (options.submit) {
    this.submit = options.submit;
    //if it has a submission, then it must be a lesson
    this.hasSubmit = true;
  } else {
    //it is an intro/final page
    this.hasSubmit = false;
  }
  if (options.update) {
    this.update = options.update;
  }
  //done is TRUE if: the user has submitted correctly
  this.done = false;
  this.unlocked = false;
  if (options.showInventory){
    this.showInventory = options.showInventory;
  } else {
    this.showInventory = false;
  }
}

Lesson.prototype.update = function() {
  //if the lesson is still locked, it can't be accessed
  if (!this.unlocked) return;
  //else, the lesson can be accessed
  //scroll to top of the page
  $("html, body").animate({scrollTop:0},500);
  activeLesson = this;
  document.title = this.title;
  //hide the lesson elements
  $('.hidden-by-default').hide();
  $('.invisible-by-default').css('visibility', 'hidden');
  $('.show-button').show();
  $('.next-button').attr('value', this.buttonValue);
  $('.submit-button').attr('value', this.submitButtonValue);
  //display the instruction blurb
  this.displayInstructions();
  //a number of elements are common to the lessons
  if (this.hasSubmit) {
    $('.response-div').empty();
    //show the necessary element for lesson
    $('.menu-area').show();
    $('.request').show();
    $('.url').show();
    //show inventory if needed
    if(this.showInventory){
      $(".inventory").show();
    } else {
       $(".inventory").hide();
    }
    //make the border black again
    $(".url").removeClass('redborder');
    //right aligned the green button
    $(".next-button").addClass('right-aligned');
    //make text on menu for active lesson red, and all others black
    chapters.forEach(function(chapter) {
      chapter.lessons.forEach(function(lesson) {
        lesson.$menuDiv.removeClass('active');
        if (lesson.unlocked) {
          lesson.$menuDiv.addClass('unlocked');
        }
      });
    });
    this.$menuDiv.removeClass('unlocked').addClass('active');
    //store the current lesson
    localStorage['currentLesson'] = activeLesson.divID;
    //update the input (placeholder/saved URL)
    var storedUrl = localStorage[this.divID + 'input'];
    $(".url").val(storedUrl || "");
    setTextAreaHeight();
    //if the input is empty, user should not be allowed to submit
    disableOrEnableGetButton($(".url"));
  }
  //set up analytics for the page visited by the user (number of times the page visited)
  ga('send', {
    'hitType': 'pageview',
    'page': this.divID
  });
}

// Displays the instructions, possibly loading them from the markdown file.
Lesson.prototype.displayInstructions = function() {
  if (this.instructions) {
    $(".instructions").html(markdown.toHTML(this.instructions));
  }
}

Lesson.prototype.showAnswer = function(){
  if (this.answer) {
    //replace userAPIKey with the API Key stored in local storage
    //change the markdown files to HTML and combined with the API Key
    var htmlAnswer = markdown.toHTML(this.answer);
    var htmlKey =  $("<span>").text(localStorage['APIKey']).html();
    htmlAnswer = htmlAnswer.replace("{userAPIKey}", htmlKey);
    //change the html of answer div
    $(".answer").html(htmlAnswer);
    //hide button once clicked
    $(".show-button").hide();
    //show the answer
    $(".answer").fadeIn(fadeInTime);
    //set up analytics for show answer button (how many times users click it)
    ga('send', {
       'hitType': 'event',
       'eventCategory': 'help',
       'eventAction': 'show answer',
       'eventLabel': this.divID,
    });
  }
}

//If the input is right, do the success responses
Lesson.prototype.displaySuccessMessage = function() {
  if (this.successMessage) {
    $(".message").html(markdown.toHTML(this.successMessage));
    //Display the success ribbon and message
    $(".feedback").hide().fadeIn(fadeInTime).removeClass("failure").addClass("success");
    $(".ribbon").show();

    //automatically scroll to the success message
    var successTop = $(".feedback").position().top;
    $("html, body").animate({scrollTop:successTop-25},500);
    //change border colour to black
    $(".url").removeClass('redborder');
    
    showResponse();

    //Display the next button
    $(".next-button").hide().fadeIn(fadeInTime);

    //set up analytics to indicate success (how many times)
    ga('send', {
       'hitType': 'event',
       'eventCategory': 'submit',
       'eventAction': 'success',
       'eventLabel': this.divID,
    });
  }
}

//If the input is wrong, do the error responses
Lesson.prototype.displayErrorMessage = function(errorMessage) {
  $(".message").html("Sorry, that input is incorrect. ").append(errorMessage).append(" Please try again.");
  
  //Display the message, hide the success ribbon
  $(".feedback").hide().fadeIn(fadeInTime).removeClass("success").addClass("failure");
  $(".ribbon").hide();
  
  //Append the attempt made on the lesson
  if(!this.attempt){
    this.attempt = 0;
  }
  this.attempt++;

  //if there has been 3 attempt or more, show the answer button
  if ((this.attempt>=3) && ($('.answer').is(':hidden'))) {
    $(".show-button").css('visibility', 'visible');
  }

  //automatically scroll to the error message
  var errorTop = $(".feedback").position().top;
  $("html, body").animate({scrollTop:errorTop-225},500);
  //change border colour to red
  $(".url").addClass("redborder");

  showResponse();

  //Hide the next button
  $(".next-button").hide();

  //Set up analytics to indicate failure (how many times)
  ga('send', {
     'hitType': 'event',
     'eventCategory': 'submit',
     'eventAction': 'failure',
     'eventLabel': this.divID,
  });
}

function showResponse(){
   //Display the response 
  if (!$(".response-div").text()){
    //if there is no response (for API Key lessons, etc., do not display output)
    $(".response").hide();
  } else{
    $(".response").hide().fadeIn(fadeInTime);
  }
}

Lesson.prototype.complete = function() {
  this.done = true; 
  localStorage[this.divID] = true;
  this.next.unlock();
  this.tick();
}

Lesson.prototype.tick = function() {
   this.$tick.css('visibility', 'visible');
}

//marks a lesson as unlocked
Lesson.prototype.unlock = function(){
  this.unlocked = true;
  if (this.hasSubmit){
    this.$menuDiv.removeClass('locked').addClass('unlocked');
    this.chapter.$menuDiv.removeClass('locked').addClass('unlocked');
  }
};

Lesson.prototype.makeMenu = function() {
  var me = this;
  var menu = $(".lesson-menu");
  //create lesson div
  var newDiv = $("<div>")
    .addClass("lesson-div menu locked");
  //add tick image to div and object
  var newTick = $("<img>")
    .addClass(this.divID + "tick tick-image")
    .attr('src', "images/ic_check.png");
  newDiv.append(newTick);
  this.$tick = newTick;
  //add text
  var newLink = $("<a>")
    .text(this.title)
    .addClass("lesson-link pointer")
    .click(function(){
      me.update();
    });
  newDiv.append(newLink);
  menu.append(newDiv);
  //add div to lesson object
  this.$menuDiv = newDiv;
}

//load lesson markdown
Lesson.prototype.loadInstruction = function(){
  var me = this;
  var filename = this.divID + ".txt";
  pendingFiles[filename] = true;
  $.get("resources/"+filename, function(response){
    me.instructions = response;
    delete pendingFiles[filename];
    checkNoFilesPending();
  });
}
//load success message markdown
Lesson.prototype.loadSuccessMessage = function(){
  var me = this;
  var filename = this.divID + "-success.txt";
  pendingFiles[filename] = true;
  $.get("resources/"+filename, function(response){
    me.successMessage = response;
    delete pendingFiles[filename];
    checkNoFilesPending();
  });
}
//load the answers
Lesson.prototype.loadAnswer = function(){
  var me = this;
  var filename = this.divID + "-answer.txt";
  pendingFiles[filename] = true;
  $.get("resources/"+filename, function(response){
    me.answer = response;
    delete pendingFiles[filename];
    checkNoFilesPending();
  });
}

//Object to store chapter information
function Chapter(divID, options) {
  this.divID = divID;
  this.lessons = options.lessons;
  this.title = options.title;
}

//Chapter update, call update for the first lesson in the chapter
Chapter.prototype.update = function() {
  this.lessons[0].update();
}

Chapter.prototype.makeMenu = function() {
  var menu = $(".lesson-menu");
  var newHeader = $("<div>")
    .text(this.title)
    .addClass("menu chapter locked")
  this.$menuDiv = newHeader;
  menu.append(newHeader);
}

// An array of the chapters and lessons.
var chapters = [
  new Chapter('chapter0-intro', {title: 'Introduction', lessons: [
    new Lesson('lesson1-gmeapi', {title: 'GME API', submit: getText}),
    new Lesson('lesson2-apikey', {title: 'API Key', submit: testAPIKey, submitButtonValue: 'Submit'})
  ]}),
  new Chapter('chapter1-read', {title: 'Reading Public Data', lessons: [
    new Lesson('lesson3-gettable', {title: 'Get Table', submit: testGetTable, showInventory:true}),
    new Lesson('lesson4-listfeatures', {title: 'List Features', submit: executeListInput, showInventory:true}),
    new Lesson('lesson5-queries', {title: 'Queries', submit: executeQueries, showInventory:true})
  ]}),
  new Chapter('chapter2-authorization', {title: 'Authorization', lessons: [
    new Lesson('lesson6-login', {
      title: 'Login and Authorization', 
      submit: authorizeUser,
      submitButtonValue: 'Sign In',
      update: function() {
        Lesson.prototype.update.call(this);
        $('.submit-button').show().removeAttr('disabled');
        $('.url').hide();
      }
    }),
    new Lesson('lesson7-project', {title: 'Create a Free Project',
      submit: storeProjectID,
      submitButtonValue: 'Select',
      update: function() {
        Lesson.prototype.update.call(this);
        $('.url').hide();
        $('.project-menu').show();
        $('.submit-button').show().removeAttr('disabled');
        setInterval(function() {
          gapi.client.request({
            path: '/mapsengine/v1/projects/',
            method: 'GET',
            callback: function(jsonBody) {
              var list = $('.project-list')
              list.empty();
              jsonBody.projects.forEach(function(project) {
                var listItem = $('<option>').attr('value', project.id)
                    .text(project.name);
                list.append(listItem);
              });
            }
          });
        }, 5000); //5 seconds
      }
    })
  ]})
];

var introduction = new Lesson('introduction', {
  title: 'Welcome!',
  buttonValue: 'Yes, I am!',
  update: function() {
    Lesson.prototype.update.call(this);
    $('.next-button').removeClass('right-aligned').show();
  }
});
var resume = new Lesson('resume', {
  title: 'Welcome back!',
  buttonValue: 'Resume',
  update: function() {
    Lesson.prototype.update.call(this);
    $('.next-button').removeClass('right-aligned').show();
  }
});
var finish = new Lesson('finish', {
  title:'Congratulations!',
  update: function() {
    Lesson.prototype.update.call(this);
    // The finish page will not have next button, but it will have the menu and go to documentation button.
    $('.menu-area').show();
    $('.documentation-button').show();
    // Store the current lesson (the finish page).
    localStorage['currentLesson'] = activeLesson.divID;
  }
});

//Determining the next, and chapter for each lesson
var prevLesson = chapters[0].lessons[0]; //first lesson
introduction.next = prevLesson;
chapters.forEach(function(chapter){
  chapter.lessons.forEach(function(lesson){
    lesson.chapter = chapter;
    prevLesson.next = lesson;
    prevLesson = lesson;
  });
});
//last lesson
prevLesson.next = finish;
//the final page does not need to have a next

//*****************THE GLOBAL FUNCTIONS**********************//
$(window).load(function() {
  //load the markdown files for the introduction, resume, and finish page
  introduction.loadInstruction();
  resume.loadInstruction();
  finish.loadInstruction();
  //create the chapter + lesson buttons + load markdown files for lessons
  chapters.forEach(function(chapter){
    chapter.makeMenu();
    chapter.lessons.forEach(function(lesson){
      lesson.makeMenu();
      //load the markdown files for each lesson
      lesson.loadInstruction();
      lesson.loadSuccessMessage();
      lesson.loadAnswer();
    });
  });

  var $input = $(".url");
  //store the input everytime it changes, to the respective local storage
  //onkeypress
  $input.keypress(function(event){
    disableOrEnableGetButton($input);
    //enable submit by enter, not making the enter visible in the input
    if(event.which == 13){
      event.preventDefault();
      //submit only if the input is not blank
      if ($input.val() !== ""){
        activeLesson.submit();
      }
    }
    localStorage[activeLesson.divID+'input'] = $input.val();
    setTextAreaHeight();
  });
  //onkeyup -> handle backspaces
  $input.keyup(function(){
    disableOrEnableGetButton($input);
    localStorage[activeLesson.divID+'input'] = $input.val();
    setTextAreaHeight();
  });
  //on cut, and also pasting with mouse
  $input.on('paste cut',function(){
    setTimeout(function(){
      disableOrEnableGetButton($input);
      localStorage[activeLesson.divID+'input'] = $input.val();
      setTextAreaHeight();
    },0);
  });

  //set up analytics to indicate how many times users go to the documentation page using the final page button
  $('.documentation-button').on('click', function() {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'readTheDocs',
      'eventAction': 'finalPageButton',
    });
  });

  //set up analytics to indicate how many times users go to the documentation page while visiting a specific lesson
  $('.documentation-link').on('click', function() {
    ga('send', {
      'hitType': 'event',
      'eventCategory': 'readTheDocs',
      'eventAction': 'navigationMenu',
      'eventLabel': activeLesson.divID,
    });
  });
});

function checkNoFilesPending() {
  if (jQuery.isEmptyObject(pendingFiles)) {
    loadState();
  }
}

function disableOrEnableGetButton($input){
  if ($input.val() === ""){
    $('.submit-button').attr('disabled','disabled');
  } else {
    $('.submit-button').removeAttr('disabled');
  }
}

function setTextAreaHeight(){
  var $input = $(".url");
  //store it in the div, get the height and set the textarea height
  $(".hidden-url-div").text($input.val()+'a');
  $input.height($(".hidden-url-div").height());
}

function loadState() {
  //enable the introduction page and first lesson on first load
  introduction.unlock();
  chapters[0].lessons[0].unlock();

  var activeLessonId = localStorage['currentLesson'] || 'introduction';
  //update the inventory box
  populateInventory();
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      //restore user completion information
      if (localStorage[lesson.divID]) {
        lesson.complete();
      }
      //add resume point
      if (lesson.divID === activeLessonId) {
        resume.next = lesson;
      }
    });
  });
  if (activeLessonId === "introduction"){
    //if the user has not started yet
    introduction.update();
  } else {
    //the user has started previously
    //if the user left at the final page
    if (activeLessonId === "finish"){
      resume.next = finish;
    }
    resume.unlock();
    resume.update();
  }
}

//Trim the white spaces in the user input
function trim(string){
  return string.replace(/^\s+|\s+$/g, '');
}

//updating the inventory box
function populateInventory(){
  var $inventory = $(".inventory");
  $inventory.empty()
            .append("<b>Helpful information</b><br>")
            .append("table ID: 15474835347274181123-14495543923251622067<br>")
            .append("your API Key: ")
            .append(localStorage['APIKey']);
}

//*****************THE GME API FUNCTIONS**********************//
function getText() {
  var string = $(".url").val();
  //the .txt file must exist in a directory and be referenced this way
  var address = "resources/" + trim(string);
  var $data = $('.response-div');
  $data.empty();
  var me = this;
  jQuery.ajax({
    url: address,
    dataType: 'text',
    success: function(resource) {
      $data.text(resource);
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
  //get user input & trim it
  var userKey = trim($(".url").val());
  var me = this;
  var $data = $('.response-div');
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
      me.displayErrorMessage("Make sure that you have created a browser key and copied it correctly.");
    }
  });
}

//*****************THE Get Table FUNCTIONS**********************//
function testGetTable() {
  //get user input and trim it
  var string = $(".url").val();

  var address = trim(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067?version=published&key=AIzaSyDa6xKBtlB7i6FTG58RxDAQc125sjk5v38";
  //the Get Table is currently NOT AVAILABLE in v1, will someday be available and this 2 line codes needs to be removed
  address = address.replace("v1","search_tt");
  correctAns = correctAns.replace("v1","search_tt");
  checkCorrectness(this, address, correctAns);
}

//*****************THE List Features FUNCTIONS**********************//
function executeListInput(){
  //get user input and trim it
  var string = $(".url").val();
  var address = trim(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyDa6xKBtlB7i6FTG58RxDAQc125sjk5v38";
  checkCorrectness(this, address, correctAns);
}

//*****************THE Query FUNCTIONS**********************//
function executeQueries(){
  //get user input and trim it
  var string = $(".url").val();
  var address = trim(string);
  var correctAns = "https://www.googleapis.com/mapsengine/v1/tables/15474835347274181123-14495543923251622067/features?version=published&key=AIzaSyDa6xKBtlB7i6FTG58RxDAQc125sjk5v38&where=Population<2000000";
  checkCorrectness(this, address, correctAns);
}

//*****************CHECKING CORRECT INPUT*******************//
function checkCorrectness(lesson, addressString, correctAns){
  var $data = $('.response-div');
  //style the output div
  $data.empty()
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
          $data.text(resourceString);
          //if the response user got is the correct response, then the user is right!
          if(resourceString === correctResourceString){
            lesson.displaySuccessMessage();
            lesson.complete();
          } else {
            lesson.displayErrorMessage("Be sure to read the instructions carefully and complete the exercise requirements.");
          } 
        },
        error: function(response) {
          //Try parsing the response
          var errorMess;
          try {
            response = JSON.parse(response.responseText);
            errorMess = response.error.errors[0];
            //append the response to the output area
            var responseString = JSON.stringify(errorMess, null, 2);
            $data.text(responseString); 
          } catch (e) {
            errorMess = "notJSONObject";
          }
         
          //Giving messages for different error reasons
          if (errorMess === "notJSONObject"){
            lesson.displayErrorMessage("The URL is not a valid Google Maps Engine API URL.");
          } else if (errorMess.reason === "authError") {
            lesson.displayErrorMessage("It appears that your authorization token is invalid. Make sure that you entered the correct header for this request.");
          } else if (errorMess.reason === "keyInvalid"){
            //if it contains curly braces, ask user to remove them
            if (jQuery.inArray('{',addressString)!==-1 || jQuery.inArray('}',addressString)!==-1){
              lesson.displayErrorMessage("Check that you've removed the curly braces({ }) surrounding the API Key in your URL.");
            } else {
              lesson.displayErrorMessage("The API Key used in the URL is invalid. Make sure that you entered your API Key correctly.");
            }
          } else if (errorMess.reason === "dailyLimitExceededUnreg"){
            lesson.displayErrorMessage("There might be something wrong with your 'key' parameter. Make sure that you entered it correctly.");
          } else if (errorMess.reason === "invalid") {
            var field = errorMess.location;
            //if the error is not in table ID, give user information about the parameter error
            if (field!=="id"){
              lesson.displayErrorMessage("Check whether you've given the right values for the parameters, in particular, the \""+field+"\" field.");
            }
            else {
              //if it contains curly braces, ask user to remove them
              if (jQuery.inArray('{',addressString)!==-1 || jQuery.inArray('}',addressString)!==-1){
                lesson.displayErrorMessage("Check that you've removed the curly braces({ }) surrounding the table ID in your URL.");
              } else {
                lesson.displayErrorMessage("The table ID used in the URL is invalid. Check whether you've given the right table ID and make sure that the table has been made public. To make your table public, you can follow the instructions in <a href = \"https:\/\/support.google.com/mapsengine/answer/3164737?hl=en\">this link</a>.");
              }
            }
          } else if (errorMess.reason === "required"){
            lesson.displayErrorMessage("A required parameter has been left out of the request. Make sure that you entered all parameters needed.");
          } else if (errorMess.reason === "notFound"){
            lesson.displayErrorMessage("No results were found for your request. The asset might not exist, not a public asset, or it has been deleted from the Google Maps Engine.")
          } else if (errorMess.reason === "insufficientPermissions"){
            lesson.displayErrorMessage("You do not have sufficient permissions for this request. Make sure you have specified version=published in the request.");
          } else if (errorMess.reason === "limitExceeded"){
            lesson.displayErrorMessage("The resource is too large to be accessed through the API.");
          } else if (errorMess.reason === "duplicate"){
            lesson.displayErrorMessage("The new feature you are trying to insert has an ID that already exists in the table.");
          } else if (errorMess.reason === "rateLimitExceeded"|| errorMess.reason === "quotaExceeded"){
            lesson.displayErrorMessage("You have exhausted the application's daily quota or its per-second rate limit. Please contact the Enterprise Support for higher limits.");
          } else if (errorMess.reason === "unauthorized"){
            lesson.displayErrorMessage("Make sure you have included the required authorization header with the request.");
          } else if (errorMess.reason === "requestTooLarge"){
            lesson.displayErrorMessage("This request contains too many features and/or vertices.");
          } else if (errorMess.reason === "accessNotConfigured"){
            lesson.displayErrorMessage("There is a per-IP or per-Referer restriction configured on the API Key and the request does not match these restrictions, or the Maps Engine API is not activated on the project ID.");
          } else {
            lesson.displayErrorMessage("The data you requested cannot be processed. Check your request to ensure that it is correct.");
          }
        }
      });
    }
  });
}

//*****************THE Login FUNCTIONS*******************//
function authorizeUser() {
  var me = this;
  gapi.auth.signIn({
    'immediate': true,
    'callback': function(authResult) {
      if (authResult['status']['signed_in']) {
        $('.request').hide();
        me.displaySuccessMessage();
        me.complete();
      } else {
        me.displayErrorMessage("You need to grant this tutorial permissions if you wish to continue.")
      }
    }
  });
}

function storeProjectID() {
  var me = this;
  var projectID = $('.project-list').val();
  if (projectID) {
    localStorage['projectID'] = projectID;
    me.complete();
    me.displaySuccessMessage();
  } else {
    me.displayErrorMessage('You need to select a project from the dropdown list. It may take a few seconds for new projects to appear.')
  }
} 
