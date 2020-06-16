//Brackets are added for the very convenient collapse option Visual Studio provides :)
//old_heatmap variables
{
    var preset_timestamps = [];
    var preset_checkboxes = [];
    var flatten_data = [];
    var timestamp_slider_heatmap = [];
    var heatmaps = [];
    var data_stimuli = [];
    var names_heatmap = [];
    var widths_heatmap = [];
    var heights_heatmap = [];
    var highlightedUsers_heatmap = [];
    var id_num_add = -1;

    var intensity_slider_heatmap = document.getElementById("intensity_slider_heatmap");
    var intensity_heatmap = intensity_slider_heatmap.value;

    var radius_slider_heatmap = document.getElementById("radius_slider_heatmap");
    var radius_heatmap = radius_slider_heatmap.value * 4;

    var blur_slider_heatmap = document.getElementById("blur_slider_heatmap");
    var blur_heatmap = blur_slider_heatmap.value * 3;

    var rainbowButton = document.getElementById('rainbow_button')
    var rainbow = false
}

//basic sliders and button
{
    intensity_slider_heatmap.oninput = function () {
        intensity_heatmap = this.value;
        for (var i = 0; i <= id_num_add; i++) {
            heatmaps[i].max(intensity_heatmap);
            heatmaps[i].draw();
        }
    };

    radius_slider_heatmap.oninput = function () {
        radius_heatmap = this.value * 4;
        for (var i = 0; i <= id_num_add; i++) {
            heatmaps[i].radius(radius_heatmap, blur_heatmap);
            heatmaps[i].draw();


        }
    };

    blur_slider_heatmap.oninput = function () {
        blur_heatmap = this.value * 3;

        for (var i = 0; i <= id_num_add; i++) {
            heatmaps[i].radius(radius_heatmap, blur_heatmap);
            heatmaps[i].draw();
        }
    };

    rainbowButton.onclick = function () {
        if (rainbow) {
            rainbow = false;
        } else {
            rainbow = true;
        }

        for (var i = 0; i <= id_num_add; i++) {
            heatmaps[i].draw();
        }
    }
}

function addBackgroundImage (i) {
    canvas = document.getElementById('canvas'+names_heatmap[i]);

    ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    background = new Image();
    background.src = '../stimuli/' + names_heatmap[i];

    ctx.globalCompositeOperation="destination-over";

    background.onload = function() {
        ctx.drawImage(background,0,0, widths_heatmap[i], heights_heatmap[i]);
    };
}

// creates the slider for the old_heatmap based on the max timestamp value
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
    input.id = "'timestamp_slider_heatmap." + id + "/" + id_num_add + "'";
    div.appendChild(input);

    all_sliders.appendChild(div);

    // creates the checkbox for the slider
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = "'timestamp_slider_checkbox." + id + "/" + id_num_add + "'";
    div.appendChild(checkbox);

    // adds listener to the slider
    input.addEventListener("input", timestamp_slider_input, false);
    checkbox.addEventListener('input', timestamp_slider_checkbox, false);

    timestamp_slider_heatmap.push(input);
}

// nests the array by user
function nestUsers(data) {
    var users = d3.nest()
        .key(function (d) {
            return d.user;
        })
        .entries(data);
    return users;
}

function getTimestamps(data) {
    flatten_data = [];

    for (var i = 0; i < data.length; i++) {
        var minTimestamp = d3.min(d3.values(data[i])[1], function (d) {
            return +d.Timestamp;
        });

        d3.values(data[i])[1].forEach(function (d) {
            d.Timestamp = d.Timestamp - minTimestamp;
        });

        for (var j = 0; j < d3.values(data[i])[1].length; j++) {
            flatten_data.push(d3.values(data[i])[1][j]);
        }
    }

    return flatten_data;
}

function timestamp_slider_input(e, num) {
    // the if statements are for when it is callled from the heatmap function and not the slider
    if(typeof num != "undefined" && num <= (preset_timestamps.length - 1)){
        var timestamp_heatmap = preset_timestamps[num];
    } else {
        var timestamp_heatmap = this.value;
    }

    // gets the checkbox linked to the slider
    if(typeof num != "undefined" && num <= preset_timestamps.length){
        var id = names_heatmap[num];
        id = id.substring(0, id.lastIndexOf('.'));
        id = "#a" + id + "_heatmap/" + num;
    } else {
        var id = this.id;
        id = id.substring(id.lastIndexOf('.') + 1, id.length - 1);
    }

    id = "'timestamp_slider_checkbox." + id + "'";
    var checkbox = document.getElementById(id);

    if(typeof num != "undefined" && num <= preset_checkboxes.length -1) {
        checkbox.checked = preset_checkboxes[num]
    }

    // links slider to the old_heatmap
    if(typeof num != "undefined" && num <= preset_timestamps.length -1){
        var idNum = num;
    } else {
        var idNum = this.id;
        idNum = id.substring(id.lastIndexOf('/') + 1, id.length - 1);
    }

    var startingZero = getTimestamps(nestUsers(data_stimuli[idNum]));

    // had some weird issues with timestamp_heatmap being interpreted as a string so I added parseInt everywhere
    // might clean this up later but who knows at this point
    timestamp_heatmap = parseInt(timestamp_heatmap);

    var filteredTimestamp;

    // when the checkbox is checked, it loads the heatmap between a (currently 2 sec) interval
    if (checkbox.checked) {
        filteredTimestamp = startingZero.filter(function (d) {
            // data is given in ms, so 1 second before and after heatmap is 1000ms
            var max_timestamp = parseInt(timestamp_heatmap) + 1000;
            var min_timestamp = parseInt(timestamp_heatmap) - 1000;
            if (+d.Timestamp > min_timestamp && +d.Timestamp < max_timestamp) {
                return true;
            }
            return false;
        })
        // if the checkbox is not checked, it loads the heatmap time cumulatively
    } else {
        filteredTimestamp = startingZero.filter(function (d) {
            if (+d.Timestamp > timestamp_heatmap) {
                return false;
            }
            return true;
        });
    }

    // draws scanpath
    timerScanpath(idNum, filteredTimestamp);

    filteredTimestamp = timestampUsers(filteredTimestamp);

    // creates new data for the old_heatmap based on filter with timestamp
    heatmaps[idNum].data(filteredTimestamp.map(function (d) {
        return [d.MappedFixationPointX, d.MappedFixationPointY, 1]
    }));

    // draws old_heatmap
    heatmaps[idNum].draw();
}

function timestamp_slider_checkbox(e) {
    let checkboxBool = this.checked;

    let id = this.id;
    id = id.substring(id.lastIndexOf('.') + 1, id.length - 1);
    id = "'timestamp_slider_heatmap." + id + "'";
    var input = document.getElementById(id);

    // links slider to the old_heatmap
    let idNum = this.id;
    idNum = id.substring(id.lastIndexOf('/') + 1, id.length - 1);
    var startingZero = getTimestamps(nestUsers(data_stimuli[idNum]));

    var timestamp_heatmap = input.value;
    var filteredTimestamp;
    if (checkboxBool) {
        filteredTimestamp = startingZero.filter(function (d) {
            // data is given in ms, so 1 second before and after old_heatmap is 1000ms
            var max_timestamp = parseInt(timestamp_heatmap) + 1000;
            var min_timestamp = parseInt(timestamp_heatmap) - 1000;
            if (+d.Timestamp > min_timestamp && +d.Timestamp < max_timestamp) {
                return true;
            }
            return false;
        })
        // if the checkbox is not checked, it loads the old_heatmap time cumulatively
    } else {
        filteredTimestamp = startingZero.filter(function (d) {
            if (+d.Timestamp > timestamp_heatmap) {
                return false;
            }
            return true;
        });
    }

    timerScanpath(idNum, filteredTimestamp);

    // draws scanpath
    filteredTimestamp = timestampUsers(filteredTimestamp);

    // creates new data for the old_heatmap based on filter with timestamp
    heatmaps[idNum].data(filteredTimestamp.map(function (d) {
        return [d.MappedFixationPointX, d.MappedFixationPointY, 1]
    }));

    // draws old_heatmap
    heatmaps[idNum].draw();
}

function timestampUsers(filteredTimestamp) {
    if (highlightedUsers_heatmap.length === 0) {
        filteredTimestamp = filteredTimestamp;
    } else {
        filteredTimestamp = filteredTimestamp.filter(function (d) {
            if (!highlightedUsers_heatmap.includes(d.user)) {
                return false;
            }
            return true;
        });
    }

    return filteredTimestamp;
}

function userSelectionHeatmap(users_array) {
    highlightedUsers_heatmap = users_array;

    for (var i = 0; i < heatmaps.length; i++) {
        if (highlightedUsers_heatmap.length == 0) {
            var userFiltered = getTimestamps(nestUsers(data_stimuli[i]));
        } else {
            var userFiltered = getTimestamps(nestUsers(data_stimuli[i])).filter(function (d) {
                if (!highlightedUsers_heatmap.includes(d.user)) {
                    return false;
                }
                return true;
            });
        }

        heatmaps[i].data(userFiltered.map(function (d) {
            return [d.MappedFixationPointX, d.MappedFixationPointY, 1]
        }));
        heatmaps[i].draw();
    }
}

function createDownloadButtonsHeatmap(name) {
    // <input type="button" id="fileButton" value="Download Heatmap">
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    downloadButton.id = name + '.downloadButton_heatmap';
    downloadButton.value = 'Download heat map of ' + name.substring(0, name.indexOf('.')) + " as .png";

    downloadButton.addEventListener("click", function() {
        downloadHeatmap(name, false)
    });

    var downloadDiv = document.querySelector('#downloadButtonsHeatmap');
    downloadDiv.appendChild(downloadButton);
}

function heatmap(content, name, width, height, idName, vars) {
    if (typeof vars == 'object'){
        if (typeof vars.intensity_heatmap == 'number') {
            updateVarsHeatmap(vars);
        }
    };

    addToIdNum();
    names_heatmap.push(name);
    widths_heatmap.push(width);
    heights_heatmap.push(height);

    var div = d3.select(idName);
    canvasLayer = div.append('canvas').attr('id', 'canvas' + name).attr('class', 'heatmapCanvas').attr('width', width).attr('height', height);

    var heat = simpleheat('canvas' + name);
    heatmaps.push(heat);

    var dataHeat = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        return true;
    });

    data_stimuli.push(dataHeat);

    // passes the data into nestUsers which nests the array by users
    // getTimestamps then gets the minimum timestamp per user and subtracts it from all timestamps
    // nested array are annoying so to flatten it the user column is lost
    // I figure we don't need the user column anyway but i can always flatten the array in another way and add it back
    var timestampsPerStimuli = getTimestamps(nestUsers(data_stimuli[data_stimuli.length - 1]));

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
    // I messed with it anyway ~Tobias
    if (rainbow) {
        heat.gradient({0.48: '#86007D', 0.55: '#0000F9', 0.60 : '#008018', 0.7 : '#FFFF41', 0.75 : '#FFA52C', 1: '#FF0018'});
    }

    if(id_num_add <= preset_timestamps.length -1){
        timestamp_slider_heatmap[id_num_add].value = preset_timestamps[id_num_add];
    }

    // draws the heatmap
    heat.draw();

    // updates heatmap if variables are provided
    if (typeof vars == 'object'){
        if (vars.preset_timestamps.length >= heatmaps.length) {
            userSelectionHeatmap(highlightedUsers_heatmap)
            timestamp_slider_input(true, id_num_add)
        }
    };
}

function downloadHeatmap(name, multiple) {
    var div = 'a' + name.substring(0, name.lastIndexOf(".")) + "_heatmap";
    div = document.getElementById(div);
    //divWidth = div.style.backgroundSize.substring(0, div.style.backgroundSize.indexOf(' ') -2);
    //divHeight = div.style.backgroundSize.substring(div.style.backgroundSize.indexOf(' ') + 1, div.style.backgroundSize.length-2);

    window.scrollTo(0,0);
    html2canvas(div).then(function(canvas) {
        var img = canvas.toDataURL();
        //document.body.appendChild(canvas);

        if (multiple) {
            return img;
        } else {
            //download popup
            // call this entire function upon button click
            var link = document.createElement("a");
            link.download = name.substring(0, name.lastIndexOf(".")) + "_heatmap";
            link.href = img;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        }
    });
}

function addToIdNum() {
    id_num_add += 1;
};

function updateVarsHeatmap(variables, num) {
    rainbow = variables.rainbow;

    intensity_heatmap = variables.intensity_heatmap;
    intensity_slider_heatmap.value = variables.intensity_heatmap;

    radius_heatmap = variables.radius_heatmap * 4;
    radius_slider_heatmap = variables.radius_heatmap;

    blur_heatmap = variables.blur_heatmap *3;
    blur_slider_heatmap = variables.blur_heatmap;

    highlightedUsers_heatmap = variables.highlightedUsers_heatmap;

    preset_timestamps = variables.preset_timestamps;

    preset_checkboxes = variables.preset_checkboxes;
}