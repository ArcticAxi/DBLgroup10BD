//In this file, I'll try to only add code that directly deals with the html and the interactions
//The specific visualizations will be kept in their own files

var initialRead;
var fileLocation;


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
        // put "a" infront of the id's since d3.select uses document.querySelector, querySelector doesn't work if
        // things start with a numeric value, putting "a" in front ensures that the first symbol is a letter
        var stimuliBubblemap = document.createElement('div');
        stimuliBubblemap.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_bubblemap";
        var stimuliHeatmap = document.createElement('div');
        stimuliHeatmap.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_heatmap";
        var stimuliScatterplot = document.createElement('div');
        stimuliScatterplot.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_scatterplot";

        var bubblemapImage = document.querySelector('#bubblemap');
        var heatmapImage = document.querySelector('#heatmap');
        var scatterplotImage = document.querySelector('#scatterplot');

        bubblemapImage.appendChild(stimuliBubblemap);
        heatmapImage.appendChild(stimuliHeatmap);
        scatterplotImage.appendChild(stimuliScatterplot);

        loadingImage(data, selected[i]);
    }
}

function loadingImage(content, name) {
    // turning this opacity down also turns down the opacity of the plot
    // attempted to fix by creating a div inside the div and overlaying the two
    // however, changing image width/height of background image is completely ignored for some reason
    // heatmapImage.style.opacity = '0.5';

    // var sctrPlot = document.querySelector('#scatterplot');
    // sctrPlot.style.position = 'relative';
    // sctrPlot.style.display = 'block';

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
            let idNameScatterplot = "#a" + name.substr(0, name.lastIndexOf('.')) + "_scatterplot";

            var bubblemapImage = document.querySelector(idNameBubblemap);
            var heatmapImage = document.querySelector(idNameHeatmap);
            var scatterplotImage = document.querySelector(idNameScatterplot);

            bubblemapImage.style.width = sizeWidth + "px";
            bubblemapImage.style.height = sizeHeight + "px";

            bubblemapImage.style.backgroundImage = stimuliLocationURL;
            bubblemapImage.style.backgroundRepeat = 'no-repeat';
            heatmapImage.style.backgroundImage = stimuliLocationURL;
            heatmapImage.style.backgroundRepeat = 'no-repeat';
            scatterplotImage.style.backgroundImage = stimuliLocationURL;
            scatterplotImage.style.backgroundRepeat = 'no-repeat';

            let background_size = sizeWidth + "px " + sizeHeight + "px";
            bubblemapImage.style.backgroundSize = background_size;
            heatmapImage.style.backgroundSize = background_size;
            scatterplotImage.style.backgroundSize = background_size;

            bubbleMap(content, name, sizeWidth, sizeHeight, sizeDecrease, idNameBubblemap);
            heatmap(content, name, sizeWidth, sizeHeight, idNameHeatmap);
            scatterplot(content, name, sizeWidth, sizeHeight, idNameScatterplot);
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