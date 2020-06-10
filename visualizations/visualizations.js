var dataAll;
var downloadVarsButton = document.getElementById('downloadVarsButton')
var basicJSON = {
                    "scanpath" : {
                            "base_stroke_width" : 1,
                            "highlight_stroke_width" : 3,
                            "base_stroke_opacity" : 7,
                            "highlight_stroke_opacity" : 10,
                            "base_fixation_radius" : 3,
                            "highlight_fixation_radius" : 6,
                            "base_fixation_opacity" : 8,
                            "highlight_fixation_opacity" : 10,
                            "highlighted_users" : ["p5"],
                            "base_colour" : "something else"
                            },
                    "bubblemap" : {},
                    "heatmap" : {}
                }

function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}

dataAll = initialRead.sort(sortByDateAscending);

for (var i = 0; i < selected.length; i++) {
    let specificStimuliName = selected[i].substr(0, selected[i].lastIndexOf('.'));
    var stimuliBubblemap = document.createElement('div');
    stimuliBubblemap.id = "a" + specificStimuliName + "_bubblemap";

    var stimuliHeatmap = document.createElement('div');
    stimuliHeatmap.id = "a" + specificStimuliName + "_heatmap";

    var stimuliScanpath = document.createElement('div');
    stimuliScanpath.id = "a" + specificStimuliName + "_scanpath";

    var stimuliBoxplot = document.createElement('div');
    stimuliBoxplot.id = "a" + specificStimuliName + "_boxplot";

    var bubblemapImage = document.querySelector('#bubblemap');
    var heatmapImage = document.querySelector('#heatmap');
    var scanpathImage = document.querySelector('#scanpath');

    bubblemapImage.appendChild(stimuliBubblemap);
    heatmapImage.appendChild(stimuliHeatmap);
    scanpathImage.appendChild(stimuliScanpath);

    loadingImage(dataAll, selected[i]);
}

var background;

function loadingImage(content, name) {
    // turning this opacity down also turns down the opacity of the plot
    // heatmapImage.style.opacity = '0.5';

    let imageDataURI;
    if (imageNames.includes(name)) {
        let matchingName = imageNames.indexOf(name);
        imageDataURI = imageURLS[matchingName];
    }

    getMeta(content, name,
        imageDataURI,
        function (width, height, hasImage) {
            let sizeDecrease = 2;
            let sizeWidth = width / sizeDecrease;
            let sizeHeight = height / sizeDecrease;

            let idNameBubblemap = "#a" + name.substr(0, name.lastIndexOf('.')) + "_bubblemap";
            let idNameHeatmap = "#a" + name.substr(0, name.lastIndexOf('.')) + "_heatmap";
            let idNameScanpath = "#a" + name.substr(0, name.lastIndexOf('.')) + "_scanpath";
            let idNameBoxplot = "#a" + name.substr(0, name.lastIndexOf('.')) + "_boxplot";

            var bubblemapImage = document.querySelector(idNameBubblemap);
            var heatmapImage = document.querySelector(idNameHeatmap);
            var scanpathImage = document.querySelector(idNameScanpath);
            var boxplotImage = document.querySelector(idNameBoxplot);

            if (hasImage) {
                var stimuliLocationURL = "url(" + imageDataURI + ")";

                bubblemapImage.style.backgroundImage = stimuliLocationURL;
                bubblemapImage.style.backgroundRepeat = 'no-repeat';

                heatmapImage.style.backgroundImage = stimuliLocationURL;
                heatmapImage.style.backgroundRepeat = 'no-repeat';

                scanpathImage.style.backgroundImage = stimuliLocationURL;
                scanpathImage.style.backgroundRepeat = 'no-repeat';
            }

           /* var heatmapCanvas = document.createElement('canvas');

            heatmapCanvas.id = 'canvas' + name;
            heatmapCanvas.classList.add('heatmapCanvas');
            heatmapCanvas.width = sizeWidth;
            heatmapCanvas.height = sizeHeight;

            ctx = heatmapCanvas.getContext("2d");
            ctx.globalAlpha = 1;
            background = new Image();
            background.src = '../stimuli/' + name;

            ctx.globalCompositeOperation = "destination-over";

            background.onload = function () {
                ctx.drawImage(background, 0, 0, sizeWidth, sizeHeight);
            };

            heatmapImage.appendChild(heatmapCanvas);*/

            bubblemapImage.style.width = sizeWidth + "px";
            bubblemapImage.style.height = sizeHeight + "px";
            heatmapImage.style.width = sizeWidth + "px";
            heatmapImage.style.height = sizeHeight + "px";
            scanpathImage.style.width = sizeWidth + "px";
            scanpathImage.style.height = sizeHeight + "px";

            let background_size = sizeWidth + "px " + sizeHeight + "px";
            bubblemapImage.style.backgroundSize = background_size;
            heatmapImage.style.backgroundSize = background_size;
            scanpathImage.style.backgroundSize = background_size;

            let copyContent = JSON.parse(JSON.stringify(content));

            if (typeof json == "object"){
                //takes the variable settings for specific visualizations from json
            var scanpathVars = json.scanpath;
            var bubblemapVars = json.bubblemap;
            var heatmapVars = json.heatmap;

            scanpath(copyContent, name, sizeWidth, sizeHeight, idNameScanpath, sizeDecrease, scanpathVars);
            bubbleMap(copyContent, name, sizeWidth, sizeHeight, idNameBubblemap, bubblemapVars);
            heatmap(copyContent, name, sizeWidth, sizeHeight, idNameHeatmap, heatmapVars);
            boxplot(copyContent, name);
            } else {
            scanpath(copyContent, name, sizeWidth, sizeHeight, idNameScanpath, sizeDecrease);
            bubbleMap(copyContent, name, sizeWidth, sizeHeight, idNameBubblemap);
            heatmap(copyContent, name, sizeWidth, sizeHeight, idNameHeatmap);
            boxplot(copyContent, name);
            }
        });

}

function getMeta(content, name, url, callback) {
    //var imageExists = UrlExists(url);
    // if an image exists, load width and height of the image into visualizations
    if (url !== undefined) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            callback(this.width, this.height, true);
        }

        // if no image exists, simply take the max width and height
        // in this case, it would be useful if axis are added to the plots
        // maybe add an extra parameter which is true or false
    } else {
        // read the max. width and height from svg
        var dataMax = content.filter(function (d) {
            if (d.StimuliName !== name) {
                return false;
            }
            return true;
        });

        var maxWidth = d3.max(dataMax, function (d) {
            return +d.MappedFixationPointX;
        });

        var maxHeight = d3.max(dataMax, function (d) {
            return +d.MappedFixationPointY;
        });

        maxWidth += 100;
        maxHeight += 100;

        // it loads the visualization all the way to the left which cuts off circles and such
        callback(maxWidth, maxHeight, false)
    }
}

function UrlExists(url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status != 404;
}

downloadVarsButton.onclick = function() {
    //makes sure that json is defined and an object and uses basicJSON if it is not
    if (typeof json != 'object') {
        json = basicJSON;
    }

    //makes sure json is the object we want it to be and uses basicJSON if it is not
    if (typeof json == 'object') {
        if (typeof json.scanpath == 'object') {
            json = basicJSON;
        }
    }

    //updates vars of scanpath in the json object
    json.scanpath.base_stroke_width = parseInt(base_stroke_width_slider.value);
    json.scanpath.highlight_stroke_width = parseInt(highlight_stroke_width_slider.value);
    json.scanpath.base_stroke_opacity = parseInt(base_stroke_opacity_slider.value);
    json.scanpath.highlight_stroke_opacity = parseInt(highlight_stroke_opacity_slider.value);

    json.scanpath.base_fixation_radius = parseInt(base_fixation_radius_slider.value);
    json.scanpath.highlight_fixation_radius = parseInt(highlight_fixation_radius_slider.value);
    json.scanpath.base_fixation_opacity = parseInt(base_fixation_opacity_slider.value);
    json.scanpath.highlight_fixation_opacity = parseInt(highlight_fixation_opacity_slider.value);

    json.scanpath.highlighted_users = highlighted_users;

    if (base_colour == "black"){
        json.scanpath.base_colour = "black";
    } else {
        //does not matter what this is changed to here (as long as it is not black) 
        //but using blue makes this look like it actually does something when loaded
        json.scanpath.base_colour = "blue";
    }

    //bit that does the actual downloading, directly copied from StackOverflow, cause why not
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var downloadThing = document.getElementById('downloadVarsElement');
    downloadThing.setAttribute("href",     dataStr     );
    downloadThing.setAttribute("download", "variables.json");
    downloadThing.click();
}