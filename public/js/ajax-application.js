/*
Questions:
  I can use ajax to submit user handle now, however, I still need to figure out in what way
  I can tell the user that his/her tweets scraping request has been finished.
  or say, how can I receive data from the server through ajax?
*/

(function($) {
  var tweetForm = $("#new-tweet-form");
  var newUserHandleInput = $("#userHandle");
  //var newLimitInput = $("#limit");
  
  tweetForm.submit(function(event) {
    event.preventDefault();

    var newUserHandle = newUserHandleInput.val();
    //var newLimit = newLimitInput.val();
    var newContent = $("#new-content");
    var insights = $("#insight-results");
    var insightButton = $("#get-insight");
    
    var requestConfig = {
      method: "POST",
      url: "/dashboard",
      contentType: "application/json",
      data: JSON.stringify({
        userHandle: newUserHandle,
        //limit: newLimit
      })
    };
    newContent.html("<p>Scraping started, it may take a while.</p><p>Please wait...</p>");
    $.ajax(requestConfig).then(function(responseMessage) {
      
      console.log("ajax, ", responseMessage);
      //setTimeout(function() {newContent.html("<p>Scraping started, it may take a while.</p><p>Please wait...</p>")},500);
      //var newElement = $(responseMessage);
      insights.html(responseMessage);
      insightButton.removeClass("invisible");
    });
  });
})(window.jQuery);