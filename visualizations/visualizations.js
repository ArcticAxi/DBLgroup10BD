var initialRead;
var fileLocation;

var heatmaps = [];
var intensity_slider_heatmap = document.getElementById("intensity_slider_heatmap");
var intensity_heatmap = intensity_slider_heatmap.value;

var radius_slider_heatmap = document.getElementById("radius_slider_heatmap");
var radius_heatmap = radius_slider_heatmap.value * 4;

var blur_slider_heatmap = document.getElementById("blur_slider_heatmap");
var blur_heatmap = blur_slider_heatmap.value;


document.addEventListener("DOMContentLoaded", function () {
    loadCSV();
});

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
        });
        data = data.sort(sortByDateAscending);
        createVisualizations(data)
        // create localStorage with initialRead
        // max storage size is at least 5MB, however, initialRead probably greater than that
        // might want to just re-read it in visualizations.js, probably the easiest I think maybe presumably
    }, false);
}

function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}

function createVisualizations(data) {
    var selected = JSON.parse(localStorage.getItem("selectedStimuli"))

    for (var i = 0; i < selected.length; i++) {
        var stimuliBubblemap = document.createElement('div');
        stimuliBubblemap.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_bubblemap";
        var stimuliHeatmap = document.createElement('div');
        stimuliHeatmap.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_heatmap";

        var bubblemapImage = document.querySelector('#bubblemap');
        var heatmapImage = document.querySelector('#heatmap');

        bubblemapImage.appendChild(stimuliBubblemap);
        heatmapImage.appendChild(stimuliHeatmap);

        loadingImage(data, selected[i]);
    }
}

function loadingImage(content, name) {
    // turning this opacity down also turns down the opacity of the plot
    // attempted to fix by creating a div inside the div and overlaying the two
    // however, changing image width/height of background image is completely ignored for some reason
    // heatmapImage.style.opacity = '0.5';

    function getMeta(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            callback(this.width, this.height);
        }
    }

    getMeta(
        "./stimuli/" + name,
        function (width, height) {
            let sizeDecrease = 2;
            let sizeWidth = width / sizeDecrease;
            let sizeHeight = height / sizeDecrease;
            var stimuliLocationURL = "url(" + "'" + "./stimuli/" + name + "')";

            let idNameBubblemap = "#a" + name.substr(0, name.lastIndexOf('.')) + "_bubblemap";
            let idNameHeatmap = "#a" + name.substr(0, name.lastIndexOf('.')) + "_heatmap";

            var bubblemapImage = document.querySelector(idNameBubblemap);
            var heatmapImage = document.querySelector(idNameHeatmap);

            bubblemapImage.style.width = sizeWidth + "px";
            bubblemapImage.style.height = sizeHeight + "px";

            bubblemapImage.style.backgroundImage = stimuliLocationURL;
            bubblemapImage.style.backgroundRepeat = 'no-repeat';
            heatmapImage.style.backgroundImage = stimuliLocationURL;
            heatmapImage.style.backgroundRepeat = 'no-repeat';

            let background_size = sizeWidth + "px " + sizeHeight + "px";
            bubblemapImage.style.backgroundSize = background_size;
            heatmapImage.style.backgroundSize = background_size;

            bubbleMap(content, name, sizeWidth, sizeHeight, sizeDecrease, idNameBubblemap);
            heatmap(content, name, sizeWidth, sizeHeight, idNameHeatmap);
        });
}

// Convertes the timestamps into format of "%M:%S:%L"
function msToTime(timestamp) {
    var milliseconds = parseInt((timestamp % 1000) / 100),
        seconds = Math.floor((timestamp / 1000) % 60),
        minutes = Math.floor((timestamp / (1000 * 60)) % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // parsing as "%M:%S:%L"
    return minutes + ":" + seconds + "." + milliseconds;
}

//scanpath stuff
initialSetup();
drawScanpath();