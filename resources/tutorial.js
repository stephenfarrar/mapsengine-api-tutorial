// Javascript file for tutorial.
// The global variables.
var activeLesson;
var fadeInTime = 500;
var userAuthorization;
/**
 * @type array of {Chapter}. Each {Chapter} contains an array of {Lesson}.
 * Need to be a global variable, since used in other functions.
 */
var chapters;
/**
 * @type {Lesson}
 * Need to be a global variable, since used in other functions.
 */
var introduction;
var resume;
var finish;
var signin;
/**
 * Url for create tables.
 * @const {string}
 */
var TABLES_URL = 'https://www.googleapis.com/mapsengine/v1/tables';
/**
 * Url for create features.
 * @const {string}
 */
var BATCH_INSERT_URL = TABLES_URL + '/{userTableId}/features/batchInsert';
/**
 * Header for GET request.
 * @const {Object}
 */
var HEADER_FOR_GET = {
  'Authorization': null
};
/**
 * Header for POST request.
 * @const {Object}
 */
var HEADER_FOR_POST = {
  'Authorization': null,
  'Content-type': 'application/json'
};
/** @const {string} Label for a user's API Key in the inventory. */
var API_KEY_LABEL = 'Your API Key: ';
/** @const {string} Label for a user's project ID in the inventory. */
var USER_PROJECT_ID = 'Your Project ID: ';
/** @const {string} Label for a user's table ID in the inventory. */
var USER_TABLE_ID = '\'World Famous Mountains\' Table ID: '

/**
 * Create object to store textarea input information.
 * A textarea that resizes itself to fit its contents.
 * @param {JQuery} textareaElement The textarea.
 * @param {JQuery} hiddenElement The hidden div. 
 * @param {boolean} enterSubmission Indicate the need of enter submission/not.
 * @param {function(string)} onChange Function executed when the input changes.
 * @param {JQuery} textareaAndLabelElement Indicates the input area div.
 */
function ResizingTextarea(textareaElement, hiddenElement, options) {
  this.textareaElement = textareaElement;
  this.hiddenElement = hiddenElement;
  this.enterSubmission = options.enterSubmission;
  this.onChange = options.onChange;
  this.textareaAndLabelElement = options.textareaAndLabelElement;
  this.setup();
}

/**
 * Set the height of textarea based on the input height.
 */
ResizingTextarea.prototype.updateTextareaHeight = function() {
  // Store it in the hidden div, get the height and set the textarea height.
  if (this.enterSubmission) {
    // Always store one more character to make the height change smoother.
    // This is for textarea that has enter submission property.
    this.hiddenElement.text(this.textareaElement.val() + 'a');
  } else {
    // Append one more line at the end to make height change smoother.
    // This is for textarea that has no enter submission property.
    this.hiddenElement.text(this.textareaElement.val() + '\n\n');
  }
  this.textareaElement.height(this.hiddenElement.height());
}

/**
 * Changes that need to happen everytime input changes.
 */
ResizingTextarea.prototype.update = function() {
  // Set the height of the textarea.    
  this.updateTextareaHeight();
  if (this.isEnabled) {
    // Enable or disable the submit button according to input.
    if (this.textareaElement.val() == '') {
      $('.submit-button').attr('disabled', 'disabled');
    } else {
      $('.submit-button').removeAttr('disabled');
    }
    this.onChange(this.textareaElement.val());
  }
};

/**
 * Create setup property of an input object.
 */
ResizingTextarea.prototype.setup = function() {
  var me = this;
  // Set events on keypress.
  this.textareaElement.keypress(function(event) {
    me.update(); 
    // Check if the input needs enter submission behaviour.
    if (me.enterSubmission) {
      // Enable submit by enter, not making the enter visible in the input.
      if (event.which == 13) {
        event.preventDefault();
        // Try to submit if the input is not empty.
        if (me.textareaElement.val() != '') {
          activeLesson.submit();
        }
      }
    }    
  });
  // Set events on keyup, to handle backspaces.
  this.textareaElement.keyup(function() {
    me.update();
  });
  // Set events on paste and cut.
  this.textareaElement.on('paste cut', function() {
    setTimeout(function() {
      me.update();
    }, 0);
  });
};

/**
 * Set the input of the textarea and update the height/submit button.
 */
ResizingTextarea.prototype.setInput = function(input) {
  // Show the input area.
  this.textareaAndLabelElement.show();
  this.textareaElement.val(input);
  this.update();
}

/**
 * Get the input from the textarea.
 */
ResizingTextarea.prototype.getInput = function() {
  return this.textareaElement.val();
}

/**
 * Enabling textarea.
 */
ResizingTextarea.prototype.enable = function() {
  this.isEnabled = true;
  this.textareaElement.removeAttr('disabled');
}

/**
 * Disabling textarea.
 */
ResizingTextarea.prototype.disable = function() {
  this.isEnabled = false;
  this.textareaElement.attr('disabled', 'disabled');
}

/**
 * Set the focus out of textarea. 
 */
ResizingTextarea.prototype.blur = function() {
  this.textareaElement.blur();
}

/**
 * Make the border of the textarea becomes red.
 * Indicates that the user entered the wrong input.
 */
ResizingTextarea.prototype.addRedBorder = function() {
  this.textareaElement.addClass('alert');
}

/**
 * Make the border of the textarea becomes black again.
 */
ResizingTextarea.prototype.removeRedBorder = function() {
  this.textareaElement.removeClass('alert');
}

/**
 * Function to store input in local storage.
 */
function storeInput(inputValue) {
  // Store the input in local storage.
  localStorage[activeLesson.elementId + 'input'] = inputValue;
}

function retrieveInput() {
  return localStorage[activeLesson.elementId + 'input'];
}

/**
 * Create object to store lesson information.
 */
function Lesson(elementId, options) {
  this.elementId = elementId;
  this.title = options.title;
  this.buttonValue = options.buttonValue || 'Next Lesson';
  this.submitButtonValue = options.submitButtonValue || 'Get';
  this.inputLabel = options.inputLabel || 'Url';
  this.inventoryContents = options.inventoryContents;
  if (options.submit) {
    // For lessons that does not take url/body input.
    this.submit = options.submit;
    this.hasSubmit = true;
  } else if (options.checkAnswer) {
    // For lessons that needs to take url/body input.
    this.checkAnswer = options.checkAnswer;
    this.hasSubmit = true;
  }
  if (options.update) {
    this.update = options.update;
  }
  if (options.urlTemplate) {
    this.urlTemplate = options.urlTemplate;
  }
  if (options.header) {
    this.header = options.header;
  }
  if (options.hasBodyFile) {
    this.hasBodyFile = options.hasBodyFile;
  }
  if (options.testingURLTemplate) {
    this.testingURLTemplate = options.testingURLTemplate;
  }
  // Done is 'true' if the user has submitted correctly.
  this.done = false;
  this.unlocked = false;
  // Indicate which input submission is needed.
  this.activeInput = options.activeInput;
  // Indicate the inactive input.
  this.inactiveInput = options.inactiveInput;
  // Set the submission status to be false.
  this.isSubmitting = false;
  // Load the instructions file for each lesson.
  this.loadInstruction();
  // Only lessons with a submission require success, answer and header content.
  if (this.hasSubmit) {
    this.loadSuccessMessage();
    this.loadBody();
    // Only lessons with an activeInput field have an answer.
    if (this.activeInput) {
      this.loadAnswer();
    }
  }
}

/**
 * Create update function for every lesson, called when loading a lesson.
 */
Lesson.prototype.update = function() {
  // Scroll to top of the page.
  $('html, body').animate({scrollTop: 0}, 500);
  activeLesson = this;
  document.title = this.title;
  // Hide the lesson elements.
  $('.hidden-by-default').hide();
  $('.invisible-by-default').css('visibility', 'hidden');
  // Update the buttons.
  $('#show-button').show();
  $('.next-button').attr('value', this.buttonValue);
  $('.submit-button').attr('value', this.submitButtonValue);
  // Display the instruction blurb.
  this.displayInstructions();
  // Show a number of elements that are common to the lessons.
  if (this.hasSubmit) {
    $('.response-content').empty();
    // Show the necessary elements for lesson.
    $('.menu-area').show();
    $('.request').show();
    // Update the label.
    $('.url .input-label').text(this.inputLabel);
    // Show inventory if needed.
    if (this.inventoryContents) {
      // Update the inventory contents.
      populateInventory(this.inventoryContents);
      $('.inventory').show();
    } else {
      $('.inventory').hide();
    }
    // Right aligned the green button.
    $('.next-button').addClass('lesson-button');
    // Make text on menu for active lesson red, and all others black.
    chapters.forEach(function(chapter) {
      chapter.lessons.forEach(function(lesson) {
        lesson.menuElement.removeClass('active');
      });
    });
    this.menuElement.addClass('active');
    // Store the current lesson.
    localStorage['currentLesson'] = activeLesson.elementId;
    // The previous input stored should be loaded and shown in the input area.
    // If the input is empty, user should not be allowed to submit.
    // Do this for the lessons with their own specific inputs.
    // Enabled/disabled the input based on the activeInput.
    if (this.inactiveInput) {
      // Disabled the inactive input.
      this.inactiveInput.disable();
      // Make the border black again.
      this.inactiveInput.removeRedBorder();
    }
    if (this.activeInput) {
      // Enabled the specific input area for each lesson.
      this.activeInput.enable(); 
      // Update the input (placeholder/saved URL/saved body).
      var storedInput = retrieveInput();
      this.activeInput.setInput(storedInput || '');
      // Make the border black again.
      this.activeInput.removeRedBorder();
    }
  }
  // Set up analytics for the page visited by the user (number of times the page
  // is visited).
  ga('send', {
    hitType: 'pageview',
    page: this.elementId
  });
};

/**
 * Handles the input the user has submitted.
 */
Lesson.prototype.submit = function() {
  // If the lesson is currently submitting, do not proceed.
  if (this.isSubmitting) return;
  // Else, hide the previous response.
  $('.feedback').hide();
  $('.next-button').hide();
  $('.response').hide();
  // Remove focus from the input area.
  this.activeInput.blur();
  // Show an overlay to stop user do something else.
  $('.overlay').show();
  // Update the submission status and check the answer.
  this.isSubmitting = true;
  var input = $.trim(this.activeInput.getInput());
  // Empty the output area.
  var data = $('.response-content');
  data.empty();
  // Change URL Template to a real URL with some data in local storage.
  if (this.testingURLTemplate) {
    // Change if there is table ID/project ID/API Key in the template URL.
    this.testingURL = replaceTemplate(this.testingURLTemplate);
  }
  // Check the correctness of user input.
  this.checkAnswer(input);
}

/**
 * Display instruction if there is any.
 * Replace any template in the instruction.
 */
Lesson.prototype.displayInstructions = function() {
  if (this.instructions) {
    var instruction = markdown.toHTML(this.instructions);
    instruction = replaceTemplate(instruction);
    $('.instructions').html(instruction);
  }
};

/**
 * Show answer for a lesson.
 */
Lesson.prototype.showAnswer = function() {
  if (this.answer) {
    // Change the markdown files to HTML and changed the template.
    var htmlAnswer = markdown.toHTML(this.answer);
    htmlAnswer = replaceTemplate(htmlAnswer);
    // Change the html of answer area.
    $('.answer').html(htmlAnswer);
    // Hide button once clicked.
    $('#show-button').hide();
    // Show the answer.
    $('.answer').fadeIn(fadeInTime);
    // Set up analytics for show answer button (how many times users click it).
    ga('send', {
      hitType: 'event',
      eventCategory: 'help',
      eventAction: 'show answer',
      eventLabel: this.elementId
    });
  }
};

/**
 * If the input is right, do the success responses.
 */
Lesson.prototype.displaySuccessMessage = function() {
  if (this.successMessage) {
    // The lesson is completed. Display the success message.
    this.complete();
    // Replace any templates, such as table/Project ID/API Key.
    var message = markdown.toHTML(this.successMessage);
    message = replaceTemplate(message);
    $('.message').html(message);
    // The submission has finished, update the submission status.
    this.isSubmitting = false;
    // Remove the overlay.
    $('.overlay').hide();
    // Display the success ribbon and message.
    $('.feedback').hide().fadeIn(fadeInTime)
        .removeClass('failure').addClass('success');
    $('.ribbon').show();
    // Automatically scroll to the success message.
    var successTop = $('.feedback').position().top;
    $('html, body').animate({scrollTop: successTop - 25}, 500);
    // Change border colour to black.
    if (this.activeInput) {
      this.activeInput.removeRedBorder();
    }
    // Show the output if there is any.
    showResponse();
    // Display the next button.
    $('.next-button').fadeIn(fadeInTime);
    // Set up analytics to indicate success (how many times).
    ga('send', {
      hitType: 'event',
      eventCategory: 'submit',
      eventAction: 'success',
      eventLabel: this.elementId
    });
  }
};

/**
 * If the input is wrong, do the error responses.
 */
Lesson.prototype.displayErrorMessage = function(errorMessage) {
  $('.message').html('Sorry, that is incorrect. ')
      .append(errorMessage).append(' Please try again.');
  // The submission has finished, update the submission status.
  this.isSubmitting = false;
  // Remove the overlay.
  $('.overlay').hide();
  // Display the message, hide the success ribbon.
  $('.feedback').hide().fadeIn(fadeInTime)
      .removeClass('success').addClass('failure');
  $('.ribbon').hide();
  // Append the attempt made on the lesson.
  if (!this.attempt) {
    // Initialize attempt to 0.
    this.attempt = 0;
  }
  this.attempt++;
  // If there have been 3 attempts or more, show the answer button.
  if ((this.attempt >= 3) && ($('.answer').is(':hidden')) && (this.answer)) {
    $('#show-button').css('visibility', 'visible');
  }
  // Automatically scroll to the error message.
  var errorTop = $('.feedback').position().top;
  $('html, body').animate({scrollTop: errorTop - 225}, 500);
  // Change border colour to red.
  if (this.activeInput) {
    this.activeInput.addRedBorder();
  }
  // Show the output if there is any.
  showResponse();
  // Set up analytics to indicate failure (how many times).
  ga('send', {
    hitType: 'event',
    eventCategory: 'submit',
    eventAction: 'failure',
    eventLabel: this.elementId
  });
};

/**
 * Display the response(output).
 */
function showResponse() {
  if ($('.response-content').text()) {
    // Only display output if there is response.
    $('.response').fadeIn(fadeInTime);
  }
}

/**
 * Unlock next lesson + add tick if the lesson is completed
 */
Lesson.prototype.complete = function() {
  this.done = true; 
  localStorage[this.elementId] = true;
  this.next.unlock();
  this.tick();
};

/**
 * Adding tick to the navigation menu.
 */
Lesson.prototype.tick = function() {
   this.tickImage.css('visibility', 'visible');
};

/**
 * Marks a lesson as unlocked.
 */
Lesson.prototype.unlock = function() {
  var me = this;
  this.unlocked = true;
  if (this.hasSubmit) {
    this.menuElement.removeClass('locked')
        .addClass('unlocked')
        .click(function() {
          me.update();
        });
    this.chapter.menuElement.removeClass('locked').addClass('unlocked');
  }
};

/**
 * Make the navigation menu for the lessons on the left side of the tutorial.
 */
Lesson.prototype.makeMenu = function() {
  var me = this;
  var menu = $('.lesson-menu');
  // Create lesson div.
  var newDiv = $('<div>')
      .addClass('menu locked');
  // Add tick image to div and object.
  var newTick = $('<img>')
      .addClass(this.elementId + 'tick tick-image')
      .attr('src', 'images/ic_check.png');
  newDiv.append(newTick);
  this.tickImage = newTick;
  // Add text.
  var newLink = $('<a>')
      .text(this.title)
      .addClass('lesson-link pointer');
  newDiv.append(newLink);
  menu.append(newDiv);
  // Add div to lesson object.
  this.menuElement = newDiv;
};

/**
 * Load lesson markdown.
 */
Lesson.prototype.loadInstruction = function() {
  var me = this;
  var filename = this.elementId + '.txt';
  tasksList.add(filename);
  $.get('resources/' + filename, function(response) {
    me.instructions = response;
    tasksList.remove(filename);
  });
};

/**
 * Load success message markdown.
 */
Lesson.prototype.loadSuccessMessage = function() {
  var me = this;
  var filename = this.elementId + '-success.txt';
  tasksList.add(filename);
  $.get('resources/' + filename, function(response) {
    me.successMessage = response;
    tasksList.remove(filename);
  });
};

/**
 * Load the answers markdown.
 */
Lesson.prototype.loadAnswer = function() {
  var me = this;
  var filename = this.elementId + '-answer.txt';
  tasksList.add(filename);
  $.get('resources/' + filename, function(response) {
    me.answer = response;
    tasksList.remove(filename);
  });
};

/**
 * Load the body markdown, where applicable.
 */
Lesson.prototype.loadBody = function() {
  var me = this;
  if (this.hasBodyFile) {
    var filename = this.elementId + '-body.txt';
    tasksList.add(filename);
    $.get('resources/' + filename, function(response) {
      me.body = JSON.parse(response);
      tasksList.remove(filename);
    });
  }
}

/**
 * Update and display the url of lesson.
 */
Lesson.prototype.displayUrl = function() {
  this.url = replaceTemplate(this.urlTemplate);
  this.inactiveInput.setInput(this.url);
}

/**
 * Update and display the header of lesson.
 */
Lesson.prototype.displayHeader = function() {
  this.header.Authorization = 'Bearer ' + userAuthorization;
  var header = JSON.stringify(this.header, null, 2);
  // Style the header, removing the JSON format in it.
  // Remove the first new line, remove {}, "", ,, and ''.
  // Remove all the spaces except spaces after : and Bearer.
  header = header.replace('\n', '');
  header = header.replace(/[{}, "']/g, '');
  header = header.replace(/:/g, ': ');
  header = header.replace('Bearer', 'Bearer ');
  $('.header .input').text(header);
  $('.header').show();
}

/**
 * Update and display the body of lesson.
 */
Lesson.prototype.displayBody = function() {
  if (this.body.projectId) {
    this.body.projectId = localStorage['projectID'];
  }
  if (this.body.features) {
    // Generate random number for gx_id.
    var randomNumber = Math.floor(Math.random() * 1000000001);
    this.body.features[0].properties.gx_id = randomNumber.toString();
  }
  var body = JSON.stringify(this.body, null, 2);
  this.inactiveInput.setInput(body);
}

/**
 * Create object to store chapter information.
 */
function Chapter(elementId, options) {
  this.elementId = elementId;
  this.lessons = options.lessons;
  this.title = options.title;
}

/**
 * Chapter update, call update for the first lesson in the chapter.
 */
Chapter.prototype.update = function() {
  this.lessons[0].update();
};

/**
 * Make the navigation menu for the chapters on the left side of the tutorial.
 */
Chapter.prototype.makeMenu = function() {
  var menu = $('.lesson-menu');
  var newHeader = $('<div>')
      .text(this.title)
      .addClass('menu chapter locked');
  this.menuElement = newHeader;
  menu.append(newHeader);
};

/**
 * Fill the chapters array with chapters and corresponding lessons.
 * Create introduction, resume, and finish page.
 */
function makeChaptersAndLessons(urlInput, bodyInput) {
  chapters = [
    new Chapter('chapter0-intro', {title: 'Introduction', lessons: [
      new Lesson('lesson1-gmeapi', {
        title: 'Google Maps Engine API',
        checkAnswer: getText,
        activeInput: urlInput
      }),
      new Lesson('lesson2-apikey', {
        title: 'API Key',
        checkAnswer: testAPIKey,
        submitButtonValue: 'Submit',
        activeInput: urlInput,
        inputLabel: 'Your API Key'
      })
    ]}),
    new Chapter('chapter1-read', {title: 'Reading Public Data', lessons: [
      new Lesson('lesson3-gettable', {
        title: 'Get Table',
        inventoryContents: [{
          label: 'Table ID: ',
          information: '15474835347274181123-14495543923251622067'
        }, {
          label: API_KEY_LABEL
        }],
        checkAnswer: checkCorrectness,
        activeInput: urlInput,
        testingURLTemplate: 'https://www.googleapis.com/mapsengine/v1/tables/' + 
                '15474835347274181123-14495543923251622067?' +
                'version=published&key=AIzaSyCXONe59phR2Id4yP-Im3E_AHN1vpHQdco'       
      }),
      new Lesson('lesson4-listfeatures', {
        title: 'List Features',
        inventoryContents: [{
          label: 'Table ID: ',
          information: '15474835347274181123-14495543923251622067'
        }, {
          label: API_KEY_LABEL
        }],
        checkAnswer: checkCorrectness,
        activeInput: urlInput,
        testingURLTemplate: 'https://www.googleapis.com/mapsengine/v1/tables/' +
                '15474835347274181123-14495543923251622067/features?' +
                'version=published&key=AIzaSyCXONe59phR2Id4yP-Im3E_AHN1v' +
                'pHQdco'
      }),
      new Lesson('lesson5-queries', {
        title: 'Queries',
        inventoryContents: [{
          label: 'Table ID: ',
          information: '15474835347274181123-14495543923251622067'
        }, {
          label: API_KEY_LABEL
        }],
        checkAnswer: checkCorrectness,
        activeInput: urlInput,
        testingURLTemplate: 'https://www.googleapis.com/mapsengine/v1/tables/' +
                '15474835347274181123-14495543923251622067/features?'+ 
                'version=published&key=AIzaSyCXONe59phR2Id4yP-Im3E_AHN1v' +
                'pHQdco&where=Population<2000000'
      })
    ]}),
    new Chapter('chapter2-private', {title: 'Accessing Private Data', lessons: [
      new Lesson('lesson6-login', {
        title: 'Login and Authorization', 
        submit: authorizeUser,
        submitButtonValue: 'Sign In',
        update: function() {
          Lesson.prototype.update.call(this);
          $('.url').hide();
          if (userAuthorization) {
            // Remove the 'Sign In' button.
            $('.request').hide();
            // Show a helpful message to the user and make sure the next lesson
            // is unlocked.
            this.displaySuccessMessage();
          }
        }
      }),
      new Lesson('lesson7-project', {
        title: 'Create a Free Project',
        submit: storeProjectID,
        submitButtonValue: 'Select',
        update: function() {
          Lesson.prototype.update.call(this);
          $('.url').hide();
          $('.project-menu').show();
          $('.submit-button').removeAttr('disabled');
          // List the projects once initially, then refresh every five seconds.
          (function loop() {
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
                // Stop looping when the user changes lesson.
                if (activeLesson.elementId == 'lesson7-project') {
                  setTimeout(loop, 5000);
                }
              }
            });
          })();
        }
      }), 
      new Lesson('lesson8-listprojects', {
        title: 'List Projects',
        checkAnswer: checkCorrectness,
        activeInput: urlInput,
        inactiveInput: bodyInput,
        header: HEADER_FOR_GET,
        testingURLTemplate: 'https://www.googleapis.com/mapsengine/v1/projects',
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayHeader();
        }
      })
    ]}),
    new Chapter('chapter3-table', {title: 'Making a Table', lessons: [
      new Lesson('lesson9-createtable1', {
        title: 'Create Table I',
        checkAnswer: checkCreateTable,
        submitButtonValue: 'Post',
        activeInput: urlInput,
        inactiveInput: bodyInput,
        hasBodyFile: true,
        header: HEADER_FOR_POST,
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayHeader();
          this.displayBody();
        }
      }),
      new Lesson('lesson10-createtable2', {
        title: 'Create Table II',
        inventoryContents: [{
          label: USER_PROJECT_ID
        }],
        checkAnswer: checkCreateTable,
        submitButtonValue: 'Post',
        activeInput: bodyInput,
        inactiveInput: urlInput,
        urlTemplate: TABLES_URL,
        header: HEADER_FOR_POST,
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayUrl();
          this.displayHeader();
        }
      }),
      new Lesson('lesson11-getprivatetable', {
        title: 'Get Private Table',
        inventoryContents: [{
          label: USER_TABLE_ID
        }],
        checkAnswer: checkCorrectness,
        activeInput: urlInput,
        inactiveInput: bodyInput,
        header: HEADER_FOR_GET,
        testingURLTemplate: 'https://www.googleapis.com/mapsengine/v1/' +
            'tables/{userTableId}',
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayHeader();
        }
      })
    ]}),
    new Chapter('chapter4-features', {title: 'Adding Features', lessons: [
      new Lesson('lesson12-createfeatures1', {
        title: 'Create Features I',
        inventoryContents: [{
          label: USER_TABLE_ID
        }],
        checkAnswer: checkCreateFeatures,
        submitButtonValue: 'Post',
        activeInput: urlInput,
        inactiveInput: bodyInput,
        hasBodyFile: true,
        header: HEADER_FOR_POST,
        testingURLTemplate:'https://www.googleapis.com/mapsengine/v1/' +
            'tables/{userTableId}/features',
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayHeader();
          this.displayBody();
        }
      }),
      new Lesson('lesson13-createfeatures2', {
        title: 'Create Features II',
        checkAnswer: checkCreateFeatures,
        submitButtonValue: 'Post',
        activeInput: bodyInput,
        inactiveInput: urlInput,
        urlTemplate: BATCH_INSERT_URL,
        header: HEADER_FOR_POST,
        testingURLTemplate:'https://www.googleapis.com/mapsengine/v1/' +
            'tables/{userTableId}/features',
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayUrl();
          this.displayHeader();
        }
      }),
      new Lesson('lesson14-listprivatefeatures', {
        title: 'List Private Features',
        inventoryContents: [{
          label: USER_TABLE_ID
        }],
        checkAnswer: checkCorrectness,
        activeInput: urlInput,
        inactiveInput: bodyInput,
        header: HEADER_FOR_GET,
        testingURLTemplate: 'https://www.googleapis.com/mapsengine/v1/' +
            'tables/{userTableId}/features',
        update: function() {
          Lesson.prototype.update.call(this);
          this.displayHeader();
        }
      })
    ]})
  ];
  // Introduction, resume, signin and final page lessons.
  introduction = new Lesson('introduction', {
    title: 'Welcome!',
    buttonValue: 'Yes, I am!',
    update: function() {
      Lesson.prototype.update.call(this);
      $('.next-button').removeClass('right-aligned').show();
    }
  });
  resume = new Lesson('resume', {
    title: 'Welcome back!',
    buttonValue: 'Resume',
    update: function() {
      Lesson.prototype.update.call(this);
      $('.next-button').removeClass('right-aligned').show();
    }
  });
  signin = new Lesson('signin', {
    title: 'Welcome back!',
    update: function() {
      Lesson.prototype.update.call(this);
      $('.signin-button').show();
    }
  });
  finish = new Lesson('finish', {
    title:'Congratulations!',
    update: function() {
      Lesson.prototype.update.call(this);
      // The finish page will not have next button, but it will have the menu &
      // go to documentation button.
      $('.menu-area').show();
      $('.documentation-button').show();
      // Make text on menu for active lesson red, and all others black.
      chapters.forEach(function(chapter) {
        chapter.lessons.forEach(function(lesson) {
          lesson.menuElement.removeClass('active');
        });
      });
    }
  });
  // Set the next lesson and chapter on each lesson.
  setNextLesson();
}

/**
 * Determining the next, and chapter for each lesson.
 */
function setNextLesson() {
  // Introduction page points to the first lesson.
  var prevLesson = chapters[0].lessons[0];
  introduction.next = prevLesson;
  // Make each lesson points to the next lesson.
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      lesson.chapter = chapter;
      prevLesson.next = lesson;
      prevLesson = lesson;
    });
  });
  // Last lesson points to the final page.
  prevLesson.next = finish;
  // The final page does not need to have a next.
}

/**
 * Object to manage tasks that need completing before the page is displayed.
 */
function newTasksList(firstTask, onFinished) {
  var me = {};
  var tasks = {};
  me.add = function(task) {
    tasks[task] = true;
  };
  me.remove = function(task) {
    delete tasks[task];
    if ($.isEmptyObject(tasks)) {
      onFinished();
    }
  };
  me.add(firstTask);
  return me;
}

var tasksList = newTasksList('callback', loadState);

/**
 * Function executed when the window is loading.
 */
$(window).load(function() {
  // Create textarea objects and events associated with the input changes.
  var urlInput = new ResizingTextarea($('.url .input'), 
      $('.url .hidden-input'), {
        enterSubmission: true,
        onChange: storeInput,
        textareaAndLabelElement: $('.url')
      });
  var bodyInput = new ResizingTextarea($('.body .input'), 
      $('.body .hidden-input'), {
        enterSubmission: false,
        onChange: storeInput,
        textareaAndLabelElement: $('.body')
      });
  // Create the chapters + lesson objects
  makeChaptersAndLessons(urlInput, bodyInput);
  // Create the chapter + lesson buttons + load markdown files for lessons.
  chapters.forEach(function(chapter) {
    chapter.makeMenu();
    chapter.lessons.forEach(function(lesson) {
      lesson.makeMenu();
    });
  });
  // Set up analytics to indicate how many times users go to the documentation 
  // page using the final page button.
  $('.documentation-button').on('click', function() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'readTheDocs',
      eventAction: 'finalPageButton',
    });
  });

  // Set up analytics to indicate how many times users go to the documentation 
  // page while visiting a specific lesson.
  $('.documentation-link').on('click', function() {
    ga('send', {
      hitType: 'event',
      eventCategory: 'readTheDocs',
      eventAction: 'navigationMenu',
      eventLabel: activeLesson.elementId
    });
  });
});

/**
 * Page-level callback to check if a user has an OAuth 2.0 token
 */
function checkIfUserIsAuthorized(authResult) {
  // The first time the callback is called, on page load, userAuthorization
  // has no value.
  var removeTask = false;
  if (userAuthorization == null) {
    removeTask = true;
  }
  if (authResult['status']['signed_in']) {
    // The user is signed in and has authorised the application.
    // We set a global variable with their authorization token.
    userAuthorization = authResult['access_token'];
  } else {
    userAuthorization = false;
  }
  if (removeTask) {
    tasksList.remove('callback');
  }
}

/**
 * Function called on signin page only, for users who sign out of their
 * Google account.
 */
function signinAndResume() {
  gapi.auth.signIn({
    'callback': function(authResult) {
      if (authResult['status']['signed_in']) {
        signin.next.update();
      } else {
        signin.displayErrorMessage('You need to grant this tutorial ' +
            'permissions if you wish to continue.');
      }
    }
  });
}

/**
 * Function to update the tutorial state based on the local storage.
 * Allows users to resume their work if they have ever done the tutorial before.
 */
function loadState() {
  // Enable the introduction page and first lesson on first load.
  introduction.unlock();
  chapters[0].lessons[0].unlock();
  // Make the active lesson the last opened page/default to introduction page.
  var activeLessonId = localStorage['currentLesson'] || 'introduction';
  // If the user left at the final page in v1, bring them to the login page.
  // NOTE: we don't leave people at the finish page anymore.
  if (activeLessonId == 'finish') {
    activeLessonId = 'lesson6-login';
  }
  chapters.forEach(function(chapter) {
    chapter.lessons.forEach(function(lesson) {
      // Restore user completion information.
      if (localStorage[lesson.elementId]) {
        lesson.complete();
      }
      // Add resume point.
      if (lesson.elementId == activeLessonId) {
        resume.next = lesson;
        signin.next = lesson;
      }
    });
  });
  if (activeLessonId == 'introduction') {
    // If the user has not started yet.
    introduction.update();
  } else if (localStorage['lesson6-login'] && !userAuthorization) {
    // If the user has completed the Sign In page but has no token,
    // i.e. if the user has logged out, return them to a signin page.
    signin.unlock();
    signin.update();
  } else {
    // Otherwise, resume as normal.
    resume.unlock();
    resume.update();
  }
}

/**
 * Updating the inventory box.
 */
function populateInventory(contents) {
  var inventory = $('.inventory');
  inventory.empty()
      .append('<h3>Helpful information</h3>');
  contents.forEach(function(item) {
    // Load the API key.
    if (item.label == API_KEY_LABEL) {
      item.information = localStorage['APIKey'];
    }
    // Load the user's project ID.
    if (item.label == USER_PROJECT_ID) {
      item.information = localStorage['projectID'];
    }
    // Load the user's 'World Famous Mountains' table ID.
    if (item.label == USER_TABLE_ID) {
      item.information = localStorage['tableID'];
    }
    // Add the item to the inventory element.
    inventory.append('<b>' + item.label + '</b>')
        .append('<code>' + item.information + '</code><br>');
  });
}

/**
 * Function to handle error response from Google Maps Engine server.
 */
function handleErrorResponse(response, input) {
  var errorMess;
  // Try parsing the error response.
  try {
    response = JSON.parse(response.responseText);
    errorMess = response.error.errors[0];
    // Append the response to the output area.
    var responseString = JSON.stringify(errorMess, null, 2);
    $('.response-content').text(responseString); 
  } catch (e) {
    errorMess = 'notJSONObject';
  }
  // Display the error with the message.
  activeLesson.displayErrorMessage(decideErrorMessage(errorMess, input));
}

/**
 * Function to choose error message to display.
 */
function decideErrorMessage(errorMess, input) {
  // Giving messages for different error reasons.
  var message;
  if (errorMess == 'notJSONObject') {
    message = 'The URL is not a valid Google Maps Engine API URL.';
  } else if (errorMess.reason == 'authError') {
    message = 'It appears that your authorization token is invalid. Make ' +
        'sure that you entered the correct header for this request.';
  } else if (errorMess.reason == 'keyInvalid') {
    // If it contains curly braces, ask user to remove them.
    if (input.indexOf('{') != -1 || 
        input.indexOf('}') != -1) {
      message = 'Check that you have removed the curly braces({ }) ' +
          'surrounding the API Key in your URL.';
    } else {
      message = 'The API Key used in the URL is invalid. Make sure that ' +
          'you entered your API Key correctly.';
    }
  } else if (errorMess.reason == 'dailyLimitExceededUnreg') {
    message = 'There might be something wrong with your \'key\' parameter. ' +
        'Make sure that you entered it correctly.';
  } else if (errorMess.reason == 'invalid') {
    var field = errorMess.location;
    // If the error is not in table ID, tell the error location.
    if (field != 'id') {
      message = 'Check whether you have given the right values for the ' +
          'parameters, in particular, the \''+field+'\' field.';
    } else {
      // If it contains curly braces, ask user to remove them.
      if (input.indexOf('{') != -1 || 
          input.indexOf('}') != -1) {
        message = 'Check that you have removed the curly braces({ }) ' +
            'surrounding the table ID in your URL.';
      } else {
        message = 'The table ID used in the URL is invalid. Check whether ' +
            'you have given the right table ID.';
      }
    }
  } else if (errorMess.reason == 'required') {
    message = 'A required parameter has been left out of the request. Make ' +
        'sure that you entered all parameters needed.';
  } else if (errorMess.reason == 'notFound') {
    message = 'No results were found for your request. The asset might not ' +
        'exist, not a public asset, or it has been deleted from the Google ' +
        'Maps Engine.';
  } else if (errorMess.reason == 'insufficientPermissions') {
    message = 'You do not have sufficient permissions for this request. Make ' +
        'sure you have specified version=published in the request.';
  } else if (errorMess.reason == 'limitExceeded') {
    message = 'The resource is too large to be accessed through the API.';
  } else if (errorMess.reason == 'duplicate') {
    message = 'The new feature you are trying to insert has an ID that ' +
        'already exists in the table. Try to use a different ' +
        '<code>gx_id</code> in the body of your request.';
  } else if (errorMess.reason == 'rateLimitExceeded' || 
             errorMess.reason == 'quotaExceeded') {
    message = 'You have exhausted the application\'s daily quota or its ' +
        'per-second rate limit. Please contact the Enterprise Support for ' +
        'higher limits.';
  } else if (errorMess.reason == 'unauthorized') {
    message = 'Make sure you have included the required authorization header ' +
        'with the request.';
  } else if (errorMess.reason == 'requestTooLarge') {
    message = 'This request contains too many features and/or vertices.';
  } else if (errorMess.reason == 'accessNotConfigured') {
    message = 'There is a per-IP or per-Referer restriction configured on ' +
        'the API Key and the request does not match these restrictions, or ' +
        'the Maps Engine API is not activated on the project ID.';
  } else if (errorMess.reason == 'parseError') {
    message = 'The body you entered is not a valid JSON object. Make sure ' +
        'that you format your data correctly.';
  } else {
    message = 'The data you requested cannot be processed. Check your ' +
        'request to ensure that it is correct.';
  }
  return message;
}

/**
 * Return string with templates replaced with local storage data.
 * The local storage data including API Key, table ID, and project Id.
 */
function replaceTemplate(template) {
  var string;
  string = template.replace(/{userAPIKey}/g, localStorage['APIKey']);
  string = string.replace(/{userTableId}/g, localStorage['tableID']);
  string = string.replace(/{userProjectId}/g, localStorage['projectID']);
  return string;
}

/**
 * GME API submit function.
 */
function getText(address) {
  var me = this;
  var data = $('.response-content');
  data.empty();
  var correctAddress = new RegExp('^(https?://)?mapsengine-api-tutorial' +
    '\.appspot\.com/resources/alice-in-wonderland\.txt');
  if (correctAddress.test(address)) {
    // The user entered the correct input.  
    $.ajax({
      url: 'resources/alice-in-wonderland.txt',
      dataType: 'text',
      success: function(resource) {
        $('.response-content').text(resource);
        me.displaySuccessMessage();
      }
    });
  } else {
    // The user entered incorrect input.
    me.displayErrorMessage('Make sure that the spelling is correct, ' + 
        'all letters are in lowercase, and there are no spaces between the ' +
        'text. Don\'t forget to add \'/\' between the path and the filename.');
  } 
}

/**
 * API Key submit function.
 */
function testAPIKey(userKey) {
  var me = this;
  // Use user's API Key to do a HTTP request.
  // If it works then it is a valid API Key.
  $.ajax({
    url: 'https://www.googleapis.com/mapsengine/v1/tables/' +
        '15474835347274181123-14495543923251622067/features?' +
        'version=published&key=' + userKey,
    dataType: 'json',
    success: function(resource) {
      localStorage['APIKey'] = userKey;
      me.displaySuccessMessage();
    },
    error: function(response) {
      me.displayErrorMessage('Make sure that you have created a browser key ' +
          'and copied it correctly.');
    }
  })
;}

/**
 * Checking the correctness of user's input by comparing the response.
 * This is used to check GET requests.
 */
function checkCorrectness(address) {
  var me = this;
  // Get the response with the correct URL.
  $.ajax({
    url: me.testingURL,
    headers: me.header,
    dataType: 'json',
    success: function(resource) {
      var correctResourceString = JSON.stringify(resource, null, 2);
      // Get the response with users's input.
      $.ajax({
        url: address,
        headers: me.header,
        dataType: 'json',
        success: function(resource2) {
          var resourceString = JSON.stringify(resource2, null, 2);
          $('.response-content').text(resourceString);
          // If the response is the correct response, then the user is right.
          if (resourceString == correctResourceString) {
            me.displaySuccessMessage();
          } else {
            me.displayErrorMessage('Be sure to read the instructions ' +
                'carefully and complete the exercise requirements.');
          } 
        },
        error: function(response) {
          handleErrorResponse(response, address);
        }
      });
    }
  });
}

/**
 * Login and authorization submit function.
 */
function authorizeUser() {
  var me = this;
  gapi.auth.signIn({
    'callback': function(authResult) {
      if (authResult['status']['signed_in']) {
        $('.request').hide();
        me.displaySuccessMessage();
      } else {
        me.displayErrorMessage('You need to grant this tutorial permissions ' +
            'if you wish to continue.');
      }
    }
  });
}

/**
 * Create a free project submit function.
 */
function storeProjectID() {
  var projectID = $('.project-list').val();
  if (projectID) {
    localStorage['projectID'] = projectID;
    this.displaySuccessMessage();
  } else {
    this.displayErrorMessage('You need to select a project from the dropdown ' +
        'list. It may take a few seconds for new projects to appear.');
  }
}

/**
 * Check whether a new table has been created or not.
 */
function checkCreateTable(input) {
  var me = this;
  $.ajax({
    headers: me.header,
    type: 'POST',
    url: me.url || input,
    data: JSON.stringify(me.body) || input,
    dataType: 'json',
    success: function(resource){
      // If the request returns a valid object, show the output.
      if (typeof resource == 'object') {
        var responseString = JSON.stringify(resource, null, 2);
        $('.response-content').text(responseString); 
      }
      // Check if they create a table in the right project.
      if (resource && resource.projectId == localStorage['projectID']) {
        // Store the table ID in local storage if it is the World Famous
        // Mountains table (lesson9-createtable1).
        if (me.elementId == 'lesson9-createtable1') {
          localStorage['tableID'] = resource.id;
        }
        me.displaySuccessMessage();
      } else {
        me.displayErrorMessage ('We cannot find a new table in the ' +
            'project with ID = ' + localStorage['projectID'] + '.');     
      }
    },
    error: function(response){
      handleErrorResponse(response, input);
    }
  });
}
  
/**
 * Check whether a new feature has been created or not.
 */
function checkCreateFeatures(input) {
  var me = this;
  // Find out the number of features the user has.
  $.ajax({
    headers: {'Authorization': 'Bearer ' + userAuthorization},
    type: 'GET',
    url: me.testingURL,
    // This request should always be successful.
    success: function(resource) {
      // Store the number of features the user has.
      var initialArray = resource.features;
      var initialCount = initialArray.length;
      // Attempt to create a feature with user's input.
      $.ajax({
        headers: me.header,
        type: 'POST',
        url: me.url || input,
        data: JSON.stringify(me.body) || input,
        dataType: 'json',
        success: function(resource2){
          // If the request returns a valid object, show the output.
          if (typeof resource2 == 'object') {
            var responseString = JSON.stringify(resource2, null, 2);
            $('.response-content').text(responseString); 
          }
          // Find out the number of features after the create request.
          $.ajax({
            headers: {'Authorization': 'Bearer ' + userAuthorization},
            type: 'GET',
            url: me.testingURL,
            success: function(resource3) {
              // Count the final number of features.
              var finalArray = resource3.features;
              var finalCount = finalArray.length;
              // If the number of feature increase, the user is right.
              if (finalCount > initialCount) {
                me.displaySuccessMessage();
              } else {
                me.displayErrorMessage ('We cannot find a new feature in ' +
                    'the table with ID = ' + localStorage['tableID'] + '.');
              }
            }
          });
        },
        error: function(response){
          handleErrorResponse(response, input);
        }
      });
    }
  });
}
