var data;

function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}


    data = initialRead.sort(sortByDateAscending);

    for (var i = 0; i < selected.length; i++) {
        var stimuliBubblemap = document.createElement('div');
        stimuliBubblemap.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_bubblemap";
        var stimuliHeatmap = document.createElement('div');
        stimuliHeatmap.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_heatmap";
        var stimuliScanpath = document.createElement('div');
        stimuliScanpath.id = "a" + selected[i].substr(0, selected[i].lastIndexOf('.')) + "_scanpath";

        var bubblemapImage = document.querySelector('#bubblemap');
        var heatmapImage = document.querySelector('#heatmap');
        var scanpathImage = document.querySelector('#scanpath');

        bubblemapImage.appendChild(stimuliBubblemap);
        heatmapImage.appendChild(stimuliHeatmap);
        scanpathImage.appendChild(stimuliScanpath);

        loadingImage(data, selected[i]);
    }

function loadingImage(content, name) {
    // turning this opacity down also turns down the opacity of the plot
    // attempted to fix by creating a div inside the div and overlaying the two
    // however, changing image width/height of background image is completely ignored for some reason
    // heatmapImage.style.opacity = '0.5';

    getMeta(content, name,
        "../stimuli/" + name,
        function (width, height, hasImage) {
            let sizeDecrease = 2;
            let sizeWidth = width / sizeDecrease;
            let sizeHeight = height / sizeDecrease;

            let idNameBubblemap = "#a" + name.substr(0, name.lastIndexOf('.')) + "_bubblemap";
            let idNameHeatmap = "#a" + name.substr(0, name.lastIndexOf('.')) + "_heatmap";
            let idNameScanpath = "#a" + name.substr(0, name.lastIndexOf('.')) + "_scanpath";

            var bubblemapImage = document.querySelector(idNameBubblemap);
            var heatmapImage = document.querySelector(idNameHeatmap);
            var scanpathImage = document.querySelector(idNameScanpath);

            if (hasImage) {
                var stimuliLocationURL = "url(" + "'" + "../stimuli/" + name + "')";

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

            bubbleMap(content, name, sizeWidth, sizeHeight, sizeDecrease, idNameBubblemap);
            heatmap(content, name, sizeWidth, sizeHeight, idNameHeatmap);
            scanpath(content, name, sizeWidth, sizeHeight, sizeDecrease, idNameScanpath);
        });

}

function getMeta(content, name, url, callback) {
    var imageExists = UrlExists(url);
    // if an image exists, load width and height of the image into visualizations
    if (imageExists) {
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