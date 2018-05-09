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
        analyzeButton.prop("disabled", true)

        $.ajax(requestConfig).then(function(responseMessage) {
            loader.hide()
            analyzeButton.prop("disabled", false)
            createViz(responseMessage)
        });
    });
});

function createHistoryViz(id) {
    var loader = $(".loader")
    loader.show()
    console.log(id);

    var requestConfig = {
        method: "GET",
        url: "/history/" + id,
        contentType: "application/json",
    }

    $.get("/history/" + id).then(function(d) {
        loader.hide()
        console.log(d);
        createViz(d)
    });
}

function createViz(d) {
    console.log("Starting Viz...");
    console.log(d);
    var viz = $("#viz")
    var title = $("#viz-title")
    var button = $("#flag-button")
    title.text('Personality Insights for @' + d.target_handle)

    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['"Openness"', 'Conscientiousness', 'Extraversion', 'Agreeableness', '"Emotional range"'],
            datasets: [{
                label: 'Personality',
                data: [
                    d.insights.personality[0].percentile,
                    d.insights.personality[1].percentile,
                    d.insights.personality[2].percentile,
                    d.insights.personality[3].percentile,
                    d.insights.personality[4].percentile
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            }]
        }
    })

    if (d.is_flagged) {

    }

    viz.modal('show')
}