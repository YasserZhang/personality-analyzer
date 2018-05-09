$(() => {
    var tweetForm = $("#new-tweet-form");
    var newUserHandleInput = $("#userHandle");
    var loader = $(".loader")
    var analyzeButton = $("#analyze-button")
    loader.hide()

    tweetForm.submit(function(event) {
        event.preventDefault();

        var newUserHandle = newUserHandleInput.val();
        var newContent = $("#new-content");
        var insights = $("#insight-results");
        var insightButton = $("#get-insight");

        var requestConfig = {
            method: "POST",
            url: "/dashboard",
            contentType: "application/json",
            data: JSON.stringify({
                userHandle: newUserHandle,
            })
        }

        loader.show()
        analyzeButton.prop("disabled",true)

        $.ajax(requestConfig).then(function(responseMessage) {
            loader.hide()
            console.log(responseMessage);
            analyzeButton.prop("disabled",false)
            createViz(responseMessage)
        });
    });
});

function createViz(d) {
    var viz = $("#viz")
    var title = $("#viz-title")
    title.text('Personality Analyzation for @' + d.target_handle)

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['"Openness"', 'Conscientiousness', 'Extraversion', 'Agreeableness', '"Emotional range"'],
            datasets: [{
                label: 'Personality',
                data: [0.8256042045085723, 0.613151636253752, 0.4003510441948985, 0.17798726661847952, 0.8668038137863614],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            }]
        }
    })

    viz.modal('show')
}
