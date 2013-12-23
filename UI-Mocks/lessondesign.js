$(document).ready(function(){

  $(".url").keypress(function(event){
  	if(event.which == 13){
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
  	console.log($url.text().length);
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
    var content = "<br>You can see the response you got in the box below."+
     "The response you get from the list features command is a collection of features in the GeoJSON format."+
     "The response specified the type of the data(featuresCollection), followed by the array of features."+
     "Each feature has a type "Feature", a geometry, and properties.<br><br>"+
     "The response shown has a geomery type of \"Point\"."+
     " This means that the feature specifies a single point on the surface of the Earth,"+ 
     "with the longitude and latitude displayed respectively in the 'coordinates' array."+ 
     "The other attributes in the table are specified in 'properties' and are specific to the data set."+
     " For example, in this table the schema contains 'Name', 'Population', and 'gx_id'.<br>";
		$("#success-ribbon").fadeIn();
		$("#success-ribbon").css('display','block');
		$("#success-layer").fadeIn();
		$("#success-layer").css('display','block');
		$("#error-layer").fadeOut();
		$("#error-layer").css('display','none');
		var successTop = $("#success-layer").position().top;
		$("html, body").animate({scrollTop:successTop-25},500)
		$("#input").css('border-color', '#000000');

  	$("#output-success").fadeIn();
  	$("#output-success").css('display','block');
  	$("#next-button").fadeIn();
  	$("#next-button").css('display','block');
  	$("#output-error").fadeOut();
  	$("#output-error").css('display','none');

	} else {
		//console.log(text);
		$("#error-layer").fadeIn();
		$("#error-layer").css('display','block');
		$("#success-ribbon").fadeOut();
		$("#success-ribbon").css('display','none');
		$("#success-layer").fadeOut();
		$("#success-layer").css('display','none');
		var errorTop = $("#error-layer").position().top;
		$("html, body").animate({scrollTop:errorTop-225},500)
		$("#input").css('border-color', '#DD4B39'); 
		
		$("#output-error").fadeIn();
  	$("#output-error").css('display','block');
  	$("#output-success").fadeOut();
  	$("#output-success").css('display','none');
  	$("#next-button").fadeOut();
  	$("#next-button").css('display','none');
	}
}

function trimLeft(string){
  return string.replace(/^\s+/, '');
}
function trimRight(string){
  return string.replace(/\s+$/, '');
}