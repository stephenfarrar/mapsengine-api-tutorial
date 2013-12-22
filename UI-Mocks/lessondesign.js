$(document).ready(function(){

  $("#input").keypress(function(event){
  	if(event.which == 13){
  	  evaluateInput();
    }
  });
  $("#go-button").click(function(){
  	evaluateInput();
  });
  
  var placeholder = "Enter your input here, press enter or click 'Go' to submit.";
  $("#input").text(placeholder);
  $("#input").focus(function(){
  	if($("#input").text()===placeholder){
  		$("#input").text("");
  		$("#input").css("color","black");
  	}
  })
  .focusout(function(){
  	console.log($("#input").text().length);
  	if(!$("#input").text().length){
  		$("#input").css("color","gray");
  		$("#input").text(placeholder);
  	}
  }); 	

});

function evaluateInput(){
	var text = $("#input").text();
	text = trimLeft(text);
	text = trimRight(text);
	if(text === "cat"){
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