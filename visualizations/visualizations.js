var dataAll;
var downloadVarsButton = document.getElementById('downloadVarsButton')
var basicJSON = {
    "scanpath": {
        "base_stroke_width": 1,
        "highlight_stroke_width": 3,
        "base_stroke_opacity": 7,
        "highlight_stroke_opacity": 10,
        "base_fixation_radius": 3,
        "highlight_fixation_radius": 6,
        "base_fixation_opacity": 8,
        "highlight_fixation_opacity": 10,
        "highlighted_users": [],
        "base_colour": "blue"
    },
    "bubblemap": {
        "gridsize": 100
    },
    "heatmap": {
        "rainbow": false,
        "intensity_heatmap": 5,
        "radius_heatmap": 6,
        "blur_heatmap": 10
    }
}

function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}

dataAll = initialRead.sort(sortByDateAscending);

for (var iMainLoop = 0; iMainLoop < selected.length; iMainLoop++) {
    let stimuliName = selected[iMainLoop];
    let specificStimuliName = stimuliName.substr(0, stimuliName.lastIndexOf('.'));
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
    var boxplotImage = document.querySelector('#boxplot');

    bubblemapImage.appendChild(stimuliBubblemap);
    heatmapImage.appendChild(stimuliHeatmap);
    scanpathImage.appendChild(stimuliScanpath);
    boxplotImage.appendChild(stimuliBoxplot);

    loadingImage(dataAll, stimuliName);
    createDownloadButtons(stimuliName, iMainLoop);
}

createDownloadButtonEverything();

var background;

function createDownloadButtonEverything() {
    // creates button
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    downloadButton.id = 'downloadButton_every';
    downloadButton.value = 'Download every vis.';

// adds event listener which runs the actual download function
    downloadButton.addEventListener("click", function () {
        downloadEverything();
    });

// appends the newly created button to the div with all scanpath buttons
    var downloadDiv = document.querySelector('#downloadButtonsAll');
    downloadDiv.appendChild(downloadButton);
}

function downloadEverything() {
    var zip = new JSZip();

    for (var iLooping = 0; iLooping < selected.length; iLooping++) {
        var currentSelected = selected[iLooping];
        let scanpathURI = downloadScanpath(currentSelected + 'downloadButton_scanpath/' + iLooping, true);
        let bubblemapURI = downloadBubblemap(currentSelected + 'downloadButton_bubblemap/' + iLooping, true);
        let boxplotURI = downloadBoxplot(currentSelected + '/svg', true);

        var div = 'a' + currentSelected.substring(0, currentSelected.lastIndexOf(".")) + "_heatmap";
        div = document.getElementById(div);

        let withoutJPG = currentSelected.substring(0, currentSelected.indexOf('.'));

        var heatmapURI;
        window.scrollTo(0, 0);
        html2canvas(div).then(function (canvas) {
            heatmapURI = canvas.toDataURL();
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

            heatmapURI = getBase64String(heatmapURI);

            zip.file(withoutJPG + '_heatmap.png', heatmapURI, {base64: true});
            zip.file(withoutJPG + '_scanpath.svg', scanpathURI, {base64: true});
            zip.file(withoutJPG + '_bubblemap.svg', bubblemapURI, {base64: true});
            zip.file(withoutJPG + '_boxplot.svg', boxplotURI, {base64: true});

            if (iLooping === selected.length) {
                zip.generateAsync({type: "blob"})
                    .then(function (content) {
                        var link = document.createElement("a");
                        link.download = "iFish visualizations" + '.zip';
                        link.href = window.URL.createObjectURL(content);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
            }
        });
    }
}

function createDownloadButtons(selected, current) {
    // removed the buttons below because these are for individual visualizations
    // they cluttered too much
    //createDownloadButtonsScanpath(selected);
    //createDownloadButtonsBubblemap(selected);
    //createDownloadButtonsHeatmap(selected);
    //createDownloadButtonsBoxplot(selected);

    createDownloadButtonAll(selected, current);
}

function createDownloadButtonAll(selected, current) {
    // creates button
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    downloadButton.id = selected + '.downloadButton_all' + '/' + current;
    downloadButton.value = 'Download all vis. of ' + selected.substring(0, selected.indexOf('.'));

// adds event listener which runs the actual download function
    downloadButton.addEventListener("click", function () {
        downloadAll(selected, current);
    });

// appends the newly created button to the div with all scanpath buttons
    var downloadDiv = document.querySelector('#downloadButtonsAll');
    downloadDiv.appendChild(downloadButton);
}

function downloadAll(selected, current) {
    let scanpathURI = downloadScanpath(selected + 'downloadButton_scanpath/' + current, true);
    let bubblemapURI = downloadBubblemap(selected + 'downloadButton_bubblemap/' + current, true);
    let boxplotURI = downloadBoxplot(selected + '/svg', true);

    var div = 'a' + selected.substring(0, selected.lastIndexOf(".")) + "_heatmap";
    div = document.getElementById(div);

    var heatmapURI;
    window.scrollTo(0, 0);
    html2canvas(div).then(function (canvas) {
        heatmapURI = canvas.toDataURL();
        window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);

        heatmapURI = getBase64String(heatmapURI);

        var zip = new JSZip();
        let withoutJPG = selected.substring(0, selected.indexOf('.'));
        zip.file(withoutJPG + '_scanpath.svg', scanpathURI, {base64: true});
        zip.file(withoutJPG + '_bubblemap.svg', bubblemapURI, {base64: true});
        zip.file(withoutJPG + '_heatmap.png', heatmapURI, {base64: true});
        zip.file(withoutJPG + '_boxplot.svg', boxplotURI, {base64: true});

        zip.generateAsync({type: "blob"})
            .then(function (content) {
                var link = document.createElement("a");
                link.download = withoutJPG + "_visualizations" + '.zip';
                link.href = window.URL.createObjectURL(content);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    });
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], {type: mimeString});
    return blob;

}

function getBase64String(dataURL) {
    var idx = dataURL.indexOf('base64,') + 'base64,'.length;
    return dataURL.substring(idx);
}

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

            if (hasImage) {
                var stimuliLocationURL = "url(" + imageDataURI + ")";

                bubblemapImage.style.backgroundImage = stimuliLocationURL;
                bubblemapImage.style.backgroundRepeat = 'no-repeat';

                heatmapImage.style.backgroundImage = stimuliLocationURL;
                heatmapImage.style.backgroundRepeat = 'no-repeat';

                scanpathImage.style.backgroundImage = stimuliLocationURL;
                scanpathImage.style.backgroundRepeat = 'no-repeat';
            }
			else{
				var stimuliLocationURL = "url(stimuli/grid.jpg)";

                bubblemapImage.style.backgroundImage = stimuliLocationURL;
                bubblemapImage.style.backgroundRepeat = 'no-repeat';

                heatmapImage.style.backgroundImage = stimuliLocationURL;
                heatmapImage.style.backgroundRepeat = 'no-repeat';

                scanpathImage.style.backgroundImage = stimuliLocationURL;
                scanpathImage.style.backgroundRepeat = 'no-repeat';
				
			}

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

            if (typeof json == "object") {
                //takes the variable settings for specific visualizations from json
                var scanpathVars = json.scanpath;
                var bubblemapVars = json.bubblemap;
                var heatmapVars = json.heatmap;

                scanpath(copyContent, name, sizeWidth, sizeHeight, idNameScanpath, sizeDecrease, hasImage, scanpathVars);
                bubbleMap(copyContent, name, sizeWidth, sizeHeight, idNameBubblemap, hasImage, bubblemapVars);
                heatmap(copyContent, name, sizeWidth, sizeHeight, idNameHeatmap, heatmapVars);
                boxplot(copyContent, name, idNameBoxplot);
            } else {
                scanpath(copyContent, name, sizeWidth, sizeHeight, idNameScanpath, sizeDecrease, hasImage);
                bubbleMap(copyContent, name, sizeWidth, sizeHeight, idNameBubblemap, hasImage);
                heatmap(copyContent, name, sizeWidth, sizeHeight, idNameHeatmap);
                boxplot(copyContent, name, idNameBoxplot);
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

downloadVarsButton.onclick = function () {
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

    if (base_colour == "black") {
        json.scanpath.base_colour = "black";
    } else {
        //does not matter what this is changed to here (as long as it is not black) 
        //but using blue makes this look like it actually does something when loaded
        json.scanpath.base_colour = "blue";
    }

    //updates the bubblemap variables
    json.bubblemap.gridsize = parseInt(gridSizeSlider.value)

    //updates the heatmap variables
    json.heatmap.intensity_heatmap = parseInt(intensity_slider_heatmap.value)
    json.heatmap.radius_heatmap = parseInt(radius_slider_heatmap)
    json.heatmap.blur_heatmap = parseInt(blur_slider_heatmap)
    json.heatmap.highlighted_users_heatmap = highlighted_users;

    //bit that does the actual downloading, directly copied from StackOverflow, cause why not
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var downloadThing = document.getElementById('downloadVarsElement');
    downloadThing.setAttribute("href", dataStr);
    downloadThing.setAttribute("download", "variables.json");
    downloadThing.click();
}
