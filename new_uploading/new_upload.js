var initialRead;
var selected = [];

document.addEventListener("DOMContentLoaded", function () {
    const formUpload = document.querySelector('form.uploadData');
    const formSelection = document.querySelector('form.selectionData');

    //changing default buttons
    var fileButton = document.getElementById('fileButton');
    var file = document.getElementById('dataset-input');
    const defaultLabelText = "No file selected";

    var imageButton = document.getElementById('imageButton');
    var fileImages = document.getElementById('stimuli-input');

    fileButton.addEventListener('click', function () {
        file.click();
    });

    file.addEventListener('change', function () {
        const file = document.querySelector('#dataset-input').files[0];
        var filenameButton = file.name.substr(0, file.name.lastIndexOf('.'));
        document.getElementById('label_file').innerHTML = filenameButton || defaultLabelText;
    });

    imageButton.addEventListener('click', function() {
        fileImages.click();
    });

    fileImages.addEventListener('change', function() {
       const filesImages = document.querySelector('#stimuli-input').files;
       var imagename;
       if (filesImages.length > 1) {
           imagename = "Multiple images selected";
       } else {
           imagename = filesImages[0].name.substr(0, filesImages[0].name.lastIndexOf('.'));
       }
       document.getElementById('label_image').innerHTML = imagename || defaultLabelText;
    });

// INTERNET EXPLORER GIVES A SYNTAX ERROR HERE, CHANGE THIS TO NORMAL
// FUNCTION/EVENT CALL SO THAT THERE IS HOPE FOR INTERNET EXPLORER
    formUpload.addEventListener('submit', function (e) {
        e.preventDefault();

        const file = document.querySelector('#dataset-input').files[0];
        const reader = new FileReader();

        reader.onload = function(){ loadCSV(reader.result) };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    formSelection.addEventListener('submit', e => {
        e.preventDefault();

        stimuliNames(initialRead);

        let visualizationsPHP = document.querySelector('#visualizationPHP');
        if (selected.length > 0) {
            visualizationsPHP.innerHTML = '';
            $("#visualizationPHP").load('new_visualizations.php');
        } else {
            visualizationsPHP.innerHTML = '<h3> Please select a stimulus! </h3>';
        }
    })
});

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
    selectionForm.style.height = '400px';
    selectionForm.style.padding = '20px 20px';

    for (var i = 0; i < dataset.length; i++) {
        // creating checkbox element
        var checkbox = document.createElement('input');
        var containerLabel = document.createElement('label');
        var span = document.createElement('span');

        // assigned correct attributes
        checkbox.type = "checkbox";
        checkbox.name = "stimuli";
        checkbox.id = dataset[i];
        checkbox.checked = Boolean(false);

        containerLabel.classList.add("containerLabel");
        containerLabel.name = "stimuliLabel";
       // containerLabel.htmlFor = dataset[i].key;

        span.classList.add("checkmark");

        // adding label text
        containerLabel.appendChild(document.createTextNode(dataset[i]));
        containerLabel.appendChild(checkbox);
        containerLabel.appendChild(span);

        selectionForm.appendChild(containerLabel);

        checkboxesArray.push(containerLabel);
    }
}

// d3.tsv reads csv (commas) but with tabs from an URL, data is the result
function loadCSV(data) {
    d3.tsv(data).then(function (data) {
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
    selected = [];

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            // create new localStorage containing array with names of the stimuli
            selected.push(checkboxes[i].id);
        }
    }
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

    let stimuliArray = [];
    for (let i = 0; i < groupedByStimuli.length; i++) {
        stimuliArray.push(groupedByStimuli[i].key);
    }

    let sortedStimuli = stimuliArray.sort((a, b) => d3.ascending(a.toLowerCase(), b.toLowerCase()));
    return sortedStimuli;
}

// toggle button which selects all the data
function selectAllData(source) {
    checkboxes = document.getElementsByName("stimuli");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
}