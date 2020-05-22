//heatmap variables
var heatmaps = [];
var intensity_slider_heatmap = document.getElementById("intensity_slider_heatmap");
var radius_slider_heatmap = document.getElementById("radius_slider_heatmap");
var blur_slider_heatmap = document.getElementById("blur_slider_heatmap");

intensity_slider_heatmap.oninput = function () {
    intensity_heatmap = this.value;
    heatmaps.forEach(function(heat) {
        heat.max(intensity_heatmap);
        heat.draw();
    });
};

radius_slider_heatmap.oninput = function () {
    radius_heatmap = this.value*4;
    heatmaps.forEach(function(heat) {
        heat.radius(radius_heatmap, blur_heatmap);
        heat.draw();
    });
};

blur_slider_heatmap.oninput = function () {
    blur_heatmap = this.value*3;
    heatmaps.forEach(function(heat) {
        heat.radius(radius_heatmap, blur_heatmap);
        heat.draw();
    });
};

function heatmap(content, name, width, height, idName) {
    div = d3.select(idName);
    canvasLayer = div.append('canvas').attr('id', 'canvas' + name).attr('class', 'heatmapCanvas').attr('width', width).attr('height', height);

    var heat = simpleheat('canvas' + name);
    heatmaps.push(heat);

    dataHeat = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        //   d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    // creates d3 file thing with only the coordinates
    // not necessary but figured it might make things easier
    var coords = dataHeat.map(function (d) {
        return {
            MappedFixationPointX: d.MappedFixationPointX,
            MappedFixationPointY: d.MappedFixationPointY,
        }
    });

    // converts data in to the [[x1,y1,val],...,[xn,yn,valn]] format
    heat.data(coords.map(function (d) {
        return [d.MappedFixationPointX, d.MappedFixationPointY, 1]
    }));

    // changes how red things are
    // add slider or value insertion for this because maps differ a lot in concentration
    heat.max(intensity_heatmap);

    // set point radius and blur radius (25 and 15 by default)
    heat.radius(radius_heatmap, blur_heatmap);

    // optionally customize gradient colors, e.g. below
    // (would be nicer if d3 color scale worked here)
    // default uses 5 different colours I believe, doesn't seem like a good idea to mess with this
    //heat.gradient({0.4: '#0000FF', 0.65: '#00FF00', 1: '#FF0000'});

    // draws the heatmap
    heat.draw();
}