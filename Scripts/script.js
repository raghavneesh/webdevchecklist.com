﻿
(function () {

    var checkboxes = [],
        details = [],
        progress, bonus, fallback;

    function findCheckboxes() {

        var inputs = document.getElementsByTagName('input');

        for (var i = 0; i < inputs.length; i++) {

            if (inputs[i].type === 'checkbox') {
                checkboxes.push(inputs[i]);
            }
        }

        details = document.getElementsByTagName('em');
    }

    function initialize() {

        bonus = document.getElementsByTagName("mark")[0];
        progress = document.getElementsByTagName("progress")[0];
        fallback = (progress.firstElementChild || progress.firstChild);

        var max = 0;

        for (var i = 0; i < checkboxes.length; i++) {

            var checkbox = checkboxes[i];
            var value = localStorage.getItem(checkbox.id) === "true";
            checkbox.checked = value;
            checkbox.onchange = calculateProgress;

            if (checkbox.parentNode.className !== "optional")
                max++;
        }

        for (var d = 0; d < details.length; d++) {
            details[d].onclick = openDetails;
        }

        progress.max = max;
    }

    function openDetails(e) {

        if (!e) e = window.event;
        var detail = (e.target || e.srcElement);
        var ul = (detail.nextElementSibling || detail.nextSibling);

        if (ul.style.maxHeight !== '100px')
            ul.style.maxHeight = '100px';
        else
            ul.style.maxHeight = '0';
    }

    function calculateProgress() {

        var count = 0,
            optional = 0;

        for (var i = 0; i < checkboxes.length; i++) {

            var checkbox = checkboxes[i];
            localStorage.setItem(checkbox.id, checkbox.checked);

            if (checkbox.parentNode.className !== "optional") {

                if (checkbox.checked) {
                    count++;
                }
            }
            else {
                if (checkbox.checked) {
                    optional++;
                }
            }
        }

        bonus.innerHTML = optional.toString();
        setProgressValue(count);
    }

    function setProgressValue(value) {
        progress.value = value;

        var max = parseInt(progress.max, 10);
        fallback.style.width = (value * 100 / max) + "%";
    }

    function clearAll() {

        document.getElementById("clearall").onclick = function () {

            for (var i = 0; i < details.length; i++) {

                var d = (details[i].nextElementSibling || details[i].nextSibling);
                d.style.maxHeight = "0";
            }

            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = false;
            }

            localStorage.clear();
            calculateProgress();

            return false;
        };
    }

    if (localStorage) {

        findCheckboxes();
        initialize();
        calculateProgress();
        clearAll();
    }

})();