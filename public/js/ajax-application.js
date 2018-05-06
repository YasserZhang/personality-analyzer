(function($) {
  var tweetForm = $("#get-tweets");
  var newUserHandleInput = $("#userHandle");
  var newLimitInput = $("#limit");
  tweetForm.submit(function(event) {
    event.preventDefault();

    var newUserHandle = newUserHandleInput.val();
    var newLimit = newLimitInput.val();
    var newContent = $("#new-content");
    var requestConfig = {
      method: "POST",
      url: "/tweetInsight",
      contentType: "application/json",
      data: JSON.stringify({
        userHandle: newUserHandle,
        limit: newLimit
      })
    };

  })
})(window.jQuery);