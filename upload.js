var initialRead;
var fileLocation;

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

        const files = document.querySelector('[type=file]').files[0];
        const formData = new FormData();

        formData.append('files[]', files);

       /* for (let i = 0; i < files.length; i++) {
            let file = files[i];
            formData.append('files[]', file);
        }*/

        fetch(url, {
            method: 'POST',
            body: formData,
        }).then(response => {
            var filename = files.name.substr(0, files.name.lastIndexOf('.'));
            settingFilename(filename,0);
        });
        //setDataFileName();
    });

    formSelection.addEventListener('submit', e => {
        e.preventDefault();

        stimuliNames(initialRead);
        window.location.href = "/visualizations.html";
    })
});

var testingNames = 0;
function settingFilename(filename, i) {
    $.ajax({
        url: "./uploads/" + filename + "_" + i + ".csv",
        type: 'HEAD',
        error: function()
        {
            let current = i - 1;
            localStorage.setItem("dataFilename", filename + "_" + current + ".csv");
            testingNames = 0;
            loadCSV();
        },
        success: function()
        {
            testingNames++;
            settingFilename(filename, testingNames);
        }
    });
}

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

function createCheckboxes(dataset) {
    var selectionForm = document.getElementById("formSelectionData");

    for (var i = 0; i < dataset.length; i++) {
        // creating checkbox element
        var checkbox = document.createElement('input');

        // Assigning the attributes
        // to created checkbox
        checkbox.type = "checkbox";
        checkbox.name = "stimuli";

        // retrieves the StimuliName from nested object array
        checkbox.id = dataset[i].key;
        checkbox.checked = Boolean(false);

        // creating label for checkbox
        var label = document.createElement('label');

        // assigning attributes for
        // the created label tag
        label.htmlFor = dataset[i].key;
        label.name = "stimuliLabel";

        // appending the created text to
        // the created label tag
        label.appendChild(document.createTextNode(dataset[i].key));

        // appending the checkbox
        // and label to div
        selectionForm.appendChild(checkbox);
        selectionForm.appendChild(label);

        linebreak = document.createElement("br");
        selectionForm.appendChild(linebreak);

        checkboxesArray.push(label);
        checkboxesArray.push(checkbox);
        checkboxesArray.push(linebreak)
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

function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}

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
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    //console.log(lines)
}
