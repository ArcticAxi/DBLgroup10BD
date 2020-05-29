//Brackets are added for the very convenient collapse option Visual Studio provides :)

//heatmap variables
{
var flattenData = [];
var timestamp_slider_heatmap = [];
var heatmaps = [];

var intensity_slider_heatmap = document.getElementById("intensity_slider_heatmap");
var intensity_heatmap = intensity_slider_heatmap.value;

var radius_slider_heatmap = document.getElementById("radius_slider_heatmap");
var radius_heatmap = radius_slider_heatmap.value * 4;

var blur_slider_heatmap = document.getElementById("blur_slider_heatmap");
var blur_heatmap = blur_slider_heatmap.value * 3;
}

//basic sliders
{
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
}

// nests the array by user
function nestUsers(data) {
    var users = d3.nest()
        .key(function(d) { return d.user; })
        .entries(data);
    return users;
}

function getTimestamps(data) {
    for (var i = 0; i < data.length; i++) {
        var minTimestamp = d3.min(d3.values(data[i])[1], function(d) {
            return +d.Timestamp;
        });
        d3.values(data[i])[1].forEach(function(d) {
            d.Timestamp = d.Timestamp - minTimestamp;
        });
        for (var j = 0; j < d3.values(data[i])[1].length; j++) {
            flattenData.push(d3.values(data[i])[1][j]);
        }
    }
    return flattenData;
}

function timestamp_slider_input(e) {
    var timestamp_heatmap = this.value;
    // had some weird issues with timestamp_heatmap being interpreted as a string so I added parseInt everywhere
    // might clean this up later but who knows at this point
    timestamp_heatmap = parseInt(timestamp_heatmap);

    // gets the checkbox linked to the slider
    id = this.id;
    id = id.substr(id.lastIndexOf('.') + 1, id.length - 1);
    id = "'timestamp_slider_checkbox." + id;
    checkbox = document.getElementById(id);

    var filteredTimestamp;

    // when the checkbox is checked, it loads the heatmap between a (currently 2 sec) interval
    if (checkbox.checked) {
        filteredTimestamp = flattenData.filter(function (d) {
            // data is given in ms, so 1 second before and after heatmap is 1000ms
            var max_timestamp = parseInt(timestamp_heatmap) + 1000;
            var min_timestamp = parseInt(timestamp_heatmap) - 1000;
            if (+d.Timestamp > min_timestamp && +d.Timestamp < max_timestamp) {
                return true;
            }
            /* if (+d.Timestamp < timestamp_heatmap - 1000) {
                 return false;
             }
             if (+d.Timestamp > timestamp_heatmap + 1000) {

                 return false;
             }*/
            return false;
        })
        // if the checkbox is not checked, it loads the heatmap time cumulatively
    } else {
        filteredTimestamp = globalData.filter(function (d) {
            if (+d.Timestamp > timestamp_heatmap) {
                return false;
            }
            return true;
        });
    }
    // creates new data for the heatmap based on filter with timestamp
    heatmaps[0].data(filteredTimestamp.map(function (d) {
        return [d.MappedFixationPointX, d.MappedFixationPointY, 1]
    }));

    // draws heatmap
    heatmaps[0].draw();
}

// creates the slider for the heatmap based on the max timestamp value
function createHeatmapTime(timestamp, id) {
    var all_sliders = document.getElementById("all_heatmap_sliders");
    var div = document.createElement('div');
    div.id = "'timestamp_heatmap" + id + "'";
    var par = document.createElement('p');
    var par_node = document.createTextNode("Timestamp:");
    par.appendChild(par_node);
    div.appendChild(par);

    var input = document.createElement('input');
    input.type = 'range';
    input.min = '0';
    input.max = timestamp;
    input.value = timestamp;
    input.classList.add('slider');
    input.classList.add('timestamp_slider_heatmap');
    // id created this way so that when there are multiple maps it is possible to find corresponding checkbox
    // using this id
    input.id = "'timestamp_slider_heatmap." + id + "'";
    div.appendChild(input);

    all_sliders.appendChild(div);

    // creates the checkbox for the slider
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = "'timestamp_slider_checkbox." + id + "'";
    div.appendChild(checkbox);

    // adds listener to the slider
    input.addEventListener("input", timestamp_slider_input, false);

    timestamp_slider_heatmap.push(input);
}

function heatmap(content, name, width, height, idName) {
    var div = d3.select(idName);
    canvasLayer = div.append('canvas').attr('id', 'canvas' + name).attr('class', 'heatmapCanvas').attr('width', width).attr('height', height);

    var heat = simpleheat('canvas' + name);
    heatmaps.push(heat);

    var dataHeat = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        globalData = data;
        return true;
    });

    flattenData = [];

    // passes the data into nestUsers which nests the array by users
    // getTimestamps then gets the minimum timestamp per user and subtracts it from all timestamps
    // nested array are annoying so to flatten it the user column is lost
    // I figure we don't need the user column anyway but i can always flatten the array in another way and add it back
    var timestampsPerStimuli = getTimestamps(nestUsers(data));

    // gets the total max. timestamp
    var maxTimestamp = d3.max(timestampsPerStimuli, function (d) {
        return +d.Timestamp;
    });

    createHeatmapTime(maxTimestamp, idName);

    // converts data in to the [[x1,y1,val],...,[xn,yn,valn]] format
    heat.data(dataHeat.map(function (d) {
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