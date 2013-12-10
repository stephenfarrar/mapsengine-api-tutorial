So far, you have learned to generate a URL to request public data. Using JavaScript and jQuery you can create a function that will send this URL in a HTTP request and display the results. There are a few ways that this can be achieved, but this lesson will demonstrate using the jQuery AJAX (Asynchronous JavaScript and XML) method.

Within a function, create a request structured in the following way: 

    jQuery.ajax({  
      url: 'your-url',  
      dataType: 'json'
      success: function(resource) {
        //what will happen if the request is successful, e.g. display the JSON results
        //NOTE: the two last parameters specify a nicer formatting for the output
        console.log(JSON.stringify(resource, null, 4));
      },
      error: function(response) {
        //what will happen if the request is unsuccessful, e.g. display error
        console.log('Error: ', response.error.errors[0]);
      }
    })  

Once you have the function created you will need to call it using:
jQuery(document).ready(functionName);

Test your AJAX syntax in the input box below. Create a request with the basic list features URL from the previous lesson (i.e. without any parameters) and press enter to see the results.