var initialRead;
var fileLocation;

const url = 'processUpload.php';

document.addEventListener("DOMContentLoaded", function () {
    const formUpload = document.querySelector('form.uploadData');
    const formSelection = document.querySelector('form.selectionData');

    //changing default buttons
    var button = document.getElementById('fileButton');
    var file = document.getElementById('dataset-input');
    const defaultLabelText = "No file selected";

    button.addEventListener('click', function () {
        file.click();
    });

    file.addEventListener('change', function () {
        const files = document.querySelector('[type=file]').files[0];
        var filenameButton = files.name.substr(0, files.name.lastIndexOf('.'));
        document.getElementById('label_file').innerHTML = filenameButton || defaultLabelText;
    });

// INTERNET EXPLORER GIVES A SYNTAX ERROR HERE, CHANGE THIS TO NORMAL
// FUNCTION/EVENT CALL SO THAT THERE IS HOPE FOR INTERNET EXPLORER
    formUpload.addEventListener('submit', function (e) {
        e.preventDefault();

        const files = document.querySelector('[type=file]').files[0];
        const formData = new FormData();

        formData.append('files[]', files);

        /* for (let i = 0; i < files.length; i++) {
             let file = files[i];
             formData.append('files[]', file);
         }*/

        // go to localhost/phpinfo.php, open folder containing file in 'Loaded Configuration File'
        // change post_max_file and upload_max_filesize to larger numbers
        fetch(url, {
            method: 'POST',
            body: formData,
        }).then(response => {
            var filename = files.name.substr(0, files.name.lastIndexOf('.'));
            settingFilename(filename, 0);
        });
        //setDataFileName();
    });

    formSelection.addEventListener('submit', e => {
        e.preventDefault();

        stimuliNames(initialRead);
        window.location.href = "/visualizations.html";
    })
});

// checks which filename processUpload.php uploaded and stores it in localStorage
var testingNames = 0;

function settingFilename(filename, i) {
    $.ajax({
        url: "./uploads/" + filename + "_" + i + ".csv",
        type: 'HEAD',
        error: function () {
            let current = i - 1;
            localStorage.setItem("dataFilename", filename + "_" + current + ".csv");
            testingNames = 0;
            loadCSV();
        },
        success: function () {
            testingNames++;
            settingFilename(filename, testingNames);
        }
    });
}

// deletes existing checkboxes when uploading another file
var checkboxesArray = [];

function removePrevCheckboxes() {
    var selectionForm = document.getElementById("formSelectionData");

    if (checkboxesArray.length > 0) {
        for (var i = checkboxesArray.length - 1; i >= 0; i--) {
            selectionForm.removeChild(checkboxesArray[i]);
        }
        checkboxesArray = [];
    }
}

// creates checkboxes
function createCheckboxes(dataset) {
    var selectionForm = document.getElementById("formSelectionData");

    for (var i = 0; i < dataset.length; i++) {
        // creating checkbox element
        var checkbox = document.createElement('input');
        var containerLabel = document.createElement('label');
        var span = document.createElement('span');

        // assigned correct attributes
        checkbox.type = "checkbox";
        checkbox.name = "stimuli";
        checkbox.id = dataset[i].key;
        checkbox.checked = Boolean(false);

        containerLabel.classList.add("containerLabel");
        containerLabel.name = "stimuliLabel";
       // containerLabel.htmlFor = dataset[i].key;

        span.classList.add("checkmark");

        // adding label text
        containerLabel.appendChild(document.createTextNode(dataset[i].key));
        containerLabel.appendChild(checkbox);
        containerLabel.appendChild(span);

        selectionForm.appendChild(containerLabel);

        checkboxesArray.push(containerLabel);
    }
}

// d3.tsv reads csv (commas) but with tabs from an URL, data is the result
function loadCSV() {
    fileLocation = "./uploads/" + localStorage.getItem("dataFilename");
    d3.tsv(fileLocation).then(function (data) {
        data.forEach(function (d) {
            var output = "";
            var input = d.StimuliName;
            for (var i = 0; i < d.StimuliName.length; i++) {
                var charCode = input.charCodeAt(i);
                if (charCode <= 127 || (charCode >= 161 && charCode <= 255)) {
                    output += input.charAt(i);
                } else {
                    // seems like they are all '665533' which sucks because then I can't change it ;-;
                    //console.log(charCode);
                }
            }
            d.StimuliName = output;
            d.Timestamp = +d.Timestamp;
            d.FixationIndex = +d.FixationIndex;
            d.FixationDuration = +d.FixationDuration;
            d.MappedFixationPointX = +d.MappedFixationPointX;
            d.MappedFixationPointY = +d.MappedFixationPointY;
        });
        data = data.sort(sortByDateAscending);
        initialRead = data;
        // create localStorage with initialRead
        // max storage size is at least 5MB, however, initialRead probably greater than that
        // might want to just re-read it in visualizations.js, probably the easiest I think maybe presumably

        // Nests the data based on StimuliName and creates checkboxes using the names
        removePrevCheckboxes();
        createCheckboxes(groupingStimuli(initialRead));
    }, false);
}

// sorts the timestamps
function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}

// stores the stimuliNames in local storage
function stimuliNames(data) {
    var checkboxes = document.getElementsByName('stimuli');
    var selected = [];

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // create new localStorage containing array with names of the stimuli
            selected.push(checkboxes[i].id);
        }
    }
    localStorage.setItem("selectedStimuli", JSON.stringify(selected));
}

// groupedByStimuli is an array of objects. each object has the
// StimuliName as a key and the others are values
// can use this for counting, means, sums, multi-level indexing
function groupingStimuli(data) {
    var groupedByStimuli = d3.nest()
        .key(function (d) {
            return d.StimuliName;
        })
        .entries(data);
    return groupedByStimuli;
}

// toggle button which selects all the data
function selectAllData(source) {
    checkboxes = document.getElementsByName("stimuli");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
}

// unused but what if everything quits working and we need it anyway?
function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split('\t');
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split('\t');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                tarr.push(headers[j] + ":" + data[j]);
            }
            lines.push(tarr);
        }
    }
    //console.log(lines)
}
