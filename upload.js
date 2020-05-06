var initialRead;

const url = 'processUpload.php';

document.addEventListener("DOMContentLoaded", function () {
    const formUpload = document.querySelector('form.uploadData');
    const formSelection = document.querySelector('form.selectionData');

// adds listener to the submit button
// when the button is clicked the .csv file is read as a text file

// INTERNET EXPLORER GIVES A SYNTAX ERROR HERE, CHANGE THIS TO NORMAL
// FUNCTION/EVENT CALL SO THAT THERE IS HOPE FOR INTERNET EXPLORER
    formUpload.addEventListener('submit', e => {
        e.preventDefault();

        const files = document.querySelector('[type=file]').files;
        const firstFile = document.querySelector('[type=file]').files[0];
        const formData = new FormData();
        const reader = new FileReader();

        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            formData.append('files[]', file);
        }

        fetch(url, {
            method: 'POST',
            body: formData,
        }).then(response => {
            //console.log(response)
            var fullPath = document.getElementById('dataset-input').value;
            if (fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1, filename.lastIndexOf('.'));
                    //filename = filename.substring(1);
                }
            }
            settingFilename(filename, 0);
        });
    });
});

var testingNames = 0;

function settingFilename(filename, i) {
    $.get("/uploads/" + filename + "_" + i + ".csv")
        .done(function() {
            testingNames++;
            settingFilename(filename, testingNames);
        }).fail(function() {
            // if ie. _1 exists, then _2 won't exist but we want to set it to _1
            let current = i - 1
            localStorage.setItem("dataFilename", filename + "_" + current + ".csv");
            testingNames = 0;
            window.location.href = "/visualizations.html";
    });
   /* const fs = require("fs");
    if (fs.existsSync("/uploads/" + filename + "_" + i + ".csv")) {
        testingNames++;
        settingFilename(filename, testingNames);
    } else {
        localStorage.setItem("dataFilename", filename + "_" + i + ".csv");
        testingNames = 0;
        window.location.href = "/visualizations.html";
    }*/
}

