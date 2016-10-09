var hero = "trump"
function runMain() {
  $("body").empty();
  $.getScript("main.js", function() {
    console.log("Running main.js");
  });
}
$( function() {
    $( "#Trump" ).click( function( event ) {
      event.preventDefault();
      hero = "trump";
      runMain();
    } );
    $( "#Clinton" ).click( function( event ) {
      event.preventDefault();
      hero = "clinton";
      runMain();
    } );
  } );
