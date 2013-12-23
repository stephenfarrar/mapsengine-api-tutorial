$(document).ready(function(){
  $(".url").keypress(function(event){
  	if(event.which == 13){
      event.preventDefault();
  	  evaluateInput();
    }
  });

  $(".get-button").click(function(){
  	evaluateInput();
  });
  
  var placeholder = "Enter your input here, press enter or click 'Get' to submit.";
  var $url = $(".url");
  $url.text(placeholder);
  $url.focus(function(){
  	if($url.text()===placeholder){
  		$url.text("");
  		$url.css("color","black");
  	}
  })
  .focusout(function(){
  	if(!$url.text().length){
  		$url.css("color","gray");
  		$url.text(placeholder);
  	}
  }); 	

});

function evaluateInput(){
	var text = $(".url").text();
	text = trimLeft(text);
	text = trimRight(text);
	if(text === "cat"){
    var content = "You can see the response you got in the box below."+
     "The response you get from the list features command is a collection of features in the GeoJSON format."+
     "The response specified the type of the data(featuresCollection), followed by the array of features."+
     "Each feature has a type \"Feature\", a geometry, and properties.<br><br>"+
     "The response shown has a geomery type of \"Point\"."+
     " This means that the feature specifies a single point on the surface of the Earth,"+ 
     "with the longitude and latitude displayed respectively in the 'coordinates' array."+ 
     "The other attributes in the table are specified in 'properties' and are specific to the data set."+
     " For example, in this table the schema contains 'Name', 'Population', and 'gx_id'.<br>";
		$(".feedback").css('display','none');
    $(".feedback").fadeIn();
    $(".feedback").css('display','block');
    $(".feedback").removeClass("failure");
    $(".feedback").addClass("success");

		$(".ribbon").css('display','block');
    $(".message").html(content);
		$(".message").css('display','block');
		
		var successTop = $(".feedback").position().top;
		$("html, body").animate({scrollTop:successTop-25},500)
		$(".url").css('border-color', '#000000');

    $(".response").css('display','none');
  	$(".response").fadeIn();
  	$(".response").css('display','block');

    $(".general-button").css('display','none');
  	$(".general-button").fadeIn();
  	$(".general-button").css('display','block');

	} else {
		var content = "Looks like you entered the wrong URL<br>"+
       "Make sure that you read the question again and try once more! Don't give up :)<br>"+
       "Below you can see the error returned by the server:<br>";
    $(".feedback").css('display','none');
    $(".feedback").fadeIn();
    $(".feedback").css('display','block');
    $(".feedback").removeClass("success");
    $(".feedback").addClass("failure");

    $(".ribbon").css('display','none');
    $(".message").html(content);
    $(".message").css('display','block');

		var errorTop = $(".feedback").position().top;
		$("html, body").animate({scrollTop:errorTop-225},500)
		$(".url").css('border-color', '#DD4B39'); 
		
		$(".response").css('display','none');
    $(".response").fadeIn();
    $(".response").css('display','block');

  	$(".general-button").fadeOut();
  	$(".general-button").css('display','none');
	}
}

function trimLeft(string){
  return string.replace(/^\s+/, '');
}
function trimRight(string){
  return string.replace(/\s+$/, '');
}