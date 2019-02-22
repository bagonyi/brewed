(function ($) {
    var $input = $("#package-input"),
        $commits = $("#commits"),
        $commitsBody = $commits.find("tbody"),
        copyCell = ClipboardJS.isSupported() ?
            "<td class='text-right copy-cell'>" +
                "<button class='btn btn-success btn-xs copy-url'>📋 Copy</button>" +
            "</td>" : "";

    $input.typeahead({
        source: formulas,
        autoSelect: true,
        highlight: false,
        hint: false,
        fitToElement: true,
        afterSelect: function (formula) {
            $.getJSON("api/commits/" + formula)
                .done(function (commits) {
                    $commitsBody.html("");
                    $commits.addClass("hidden");

                    for (var key in commits) {
                        if (commits.hasOwnProperty(key)) {
                            $commitsBody.append(
                                "<tr>" +
                                    "<td class='text-left hash'>" +
                                        "<a href='https://raw.githubusercontent.com/Homebrew/homebrew-core/" + key + "/Formula/" + formula + ".rb' target='_blank'>" + key + "</a>" +
                                    "</td>" +
                                    "<td class='text-left'>" + commits[key] + "</td>" +
                                    copyCell +
                                "</tr>"
                            )
                        }
                    }

                    $commits.removeClass("hidden");
                })

                .fail(function () {
                    $commits.addClass("hidden");
                });

            $input.select();
        }
    });

    $input.focus();

    $input.on("blur", function () {
        if ($(this).val() === "") {
            $commits.addClass("hidden");
        }
    }).on("keyup", function (e) {
        if (e.keyCode === 27) {
            $(this).blur();
            return true;
        }

        if (e.keyCode === 13 && $(this).val() === "") {
            $(this).blur();
            return true;
        }

        if ($(this).val() === "") {
            $("ul.typeahead").css("display", "none");
        }
    });

    $(document.body).on("keyup", function (e) {
        if (e.key === "/") {
            $input.focus();
            return true;
        }
    });

    var clipboard = new ClipboardJS('.copy-url', {
        text: function(trigger) {
            return $(trigger).parents("tr").find("a").attr('href');
        }
    });

    clipboard.on('success', function(e) {
        $(e.trigger).text("📋 Copied!").prop("disabled", true);

        setTimeout(function () {
            $(e.trigger).text("📋 Copy").prop("disabled", false);
        }, 2000);

        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        $(e.trigger).text("📋 Failed!").prop("disabled", true);

        setTimeout(function () {
            $(e.trigger).text("📋 Copy").prop("disabled", false);
        }, 2000);
    });

    $("button.what-is-this").on("click", function () {
        $(this).addClass("hidden");
        $("div.what-is-this").removeClass("hidden");
    });

    $("div.what-is-this button").on("click", function () {
        $("div.what-is-this").addClass("hidden");
        $("button.what-is-this").removeClass("hidden");
    });

}(window.jQuery));
