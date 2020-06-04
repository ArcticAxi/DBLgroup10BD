{//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
    var width = 2000;
    var height = 2000;

//css variables
    var dark_blue = getComputedStyle(document.documentElement).getPropertyValue('--dark-blue-color');
    var main_blue = getComputedStyle(document.documentElement).getPropertyValue('--main-blue-color');

//path variables
    var highlighted_users = [];
    var base_stroke_width = 1;
    var highlight_stroke_width = 5;
    var base_stroke_opacity = 0.5;
    var highlight_stroke_opacity = 1;
    var base_colour = dark_blue;
    var highlight_colour = "red";

//fixation dot variables
    var base_fixation_radius = 3;
    var highlight_fixation_radius = 6;
    var base_fixation_opacity = 0.7;
    var highlight_fixation_opacity = 1;

//slider variables
//base stroke
    var base_stroke_width_slider = document.getElementById("base_stroke_width_slider");
    var base_stroke_opacity_slider = document.getElementById("base_stroke_opacity_slider");
//highlight stroke
    var highlight_stroke_width_slider = document.getElementById("highlight_stroke_width_slider");
    var highlight_stroke_opacity_slider = document.getElementById("highlight_stroke_opacity_slider");
//base fixation
    var base_fixation_radius_slider = document.getElementById("base_fixation_radius_slider");
    var base_fixation_opacity_slider = document.getElementById("base_fixation_opacity_slider");
//highlight fixation
    var highlight_fixation_radius_slider = document.getElementById("highlight_fixation_radius_slider");
    var highlight_fixation_opacity_slider = document.getElementById("highlight_fixation_opacity_slider");

//button selection variables
//base colour
    var base_colour_button_db = document.getElementById("dark_blue_base")
    var base_colour_button_b = document.getElementById("black_base")
//highlighted users
    var highlighted_user_container = document.getElementById("highlighted_user")
//data used by buttons and sliders
    var buttonData;
    var numberButtons = 0;
    var sliderData;
    var numberScanpaths = -1;

//checkbox variables
    var userCheckboxes = [];

//passed variables
    var stimulus = "22_Venedig_S2.jpg"
}

//to be called by old_visualizations.js
//creates scanpath with given variables
function scanpath(content, name, sizeWidth, sizeHeight, idName) {
    stimulus = name;
    height = sizeHeight;
    width = sizeWidth;
    buttonData = JSON.parse(JSON.stringify(content));
    initialSetup(buttonData, idName);
    drawScanpath(buttonData);
    createDownloadButtonScanpath(name);
}

//creates an svg element and users array to work with
function initialSetup(data_scanpath, idName) {
    numberScanpaths += 1;
    //create canvas
    canvas = d3.select(idName)
        .append("svg")
        .attr("data-image", stimulus)
        .attr("data-name", idName)
        .attr("id", "scanpath_" + numberScanpaths)
        .attr("width", width)
        .attr("height", height);

    data_scanpath = data_scanpath.filter(function (d) {
        return (d.StimuliName == stimulus);
    });

    //creates a set containing all unique users
    var allUsers = data_scanpath.map(function (d) {
        return d.user
    });
    uniqueUsers = new Set(allUsers);

    //turns the set into an array and sorts said array
    arrayUsers = [...uniqueUsers];
    temp_users = [];

    for (i in arrayUsers) {
        temp_users[i] = arrayUsers[i].substr(1);
    }

    temp_users.sort(function (a, b) {
        return a - b
    });

    for (i in arrayUsers) {
        arrayUsers[i] = "p" + temp_users[i];
    }

    //creates buttons used to highlight users
    createUserButtons(arrayUsers);
    //})                
}

//interactions
{
//path sliders
//update base stroke width when moving slider
    base_stroke_width_slider.oninput = function () {
        base_stroke_width = this.value;
        redrawScanpath(buttonData)
    }

//update base stroke opacity when moving slider
    base_stroke_opacity_slider.oninput = function () {
        base_stroke_opacity = this.value / 10;
        redrawScanpath(buttonData)
    }

//update highlight stroke width when moving slider
    highlight_stroke_width_slider.oninput = function () {
        highlight_stroke_width = this.value;
        redrawScanpath(buttonData)
    }

//update highlight stroke opacity when moving slider
    highlight_stroke_opacity_slider.oninput = function () {
        highlight_stroke_opacity = this.value / 10;
        redrawScanpath(buttonData)
    }

//fixation sliders
//update base fixation radius when moving slider
    base_fixation_radius_slider.oninput = function () {
        base_fixation_radius = this.value;
        redrawScanpath(buttonData)
    }

//update highlight fixation radius when moving slider
    highlight_fixation_radius_slider.oninput = function () {
        highlight_fixation_radius = this.value;
        redrawScanpath(buttonData)
    }

//update base fixation opacity when moving slider
    base_fixation_opacity_slider.oninput = function () {
        base_fixation_opacity = this.value / 10;
        redrawScanpath(buttonData)
    }

//update highlight fixation opacity when moving slider
    highlight_fixation_opacity_slider.oninput = function () {
        highlight_fixation_opacity = this.value / 10;
        redrawScanpath(buttonData)
    }

//buttons
//update base colour when pressing main blue button
    base_colour_button_db.onclick = function () {
        base_colour = dark_blue;
        redrawScanpath(buttonData)
    }

//update base colour when pressing black button
    base_colour_button_b.onclick = function () {
        base_colour = "black";
        redrawScanpath(buttonData)
    }

//user buttons event
    function highlightButton(value, id) {
        button = document.getElementById(id)
        if (highlighted_users.indexOf(value) !== -1) {
            highlighted_users.splice(highlighted_users.indexOf(value), 1);
            button.style.backgroundColor = dark_blue;
        } else {
            highlighted_users.push(value);
            button.style.backgroundColor = highlight_colour;
        }
        for (iter=0; iter<numberButtons; iter++){
            identity = value+'_'+iter
            button_color = document.getElementById(identity)
            if (button_color !== null && button_color !== button) {
                if (highlighted_users.indexOf(value) !== -1) {
                    button_color.style.backgroundColor = highlight_colour;
                } else {
                    button_color.style.backgroundColor = dark_blue;
                }
            }
        }
        redrawScanpath(buttonData);
        userSelectionHeatmap(highlighted_users);
    }
}

//draw the scanpath visualisation
function drawScanpath(data_scanpath) {
    data_scanpath = data_scanpath.filter(function (d) {
        return (d.StimuliName == stimulus);
    });

    //creates a set containing all unique users
    var allUsers = data_scanpath.map(function (d) {
        return d.user
    });
    uniqueUsers = new Set(allUsers);

    //turns the set into an array
    arrayUsers = [...uniqueUsers];

    users = arrayUsers;

    data_scanpath = equalizaTime(data_scanpath, arrayUsers)
    //create the actual visualization
    createVis(data_scanpath, arrayUsers);

};

//creates the actual visualization
function createVis(data_scanpath, users) {

    //create group object            
    var group = canvas.append("g")
                        .attr("class", "paths");
    var fixation = canvas.append("g")
                        .attr("class", "fixations");

    //create line object
    var line = d3.line()
        .x(function (d) {
            return d.MappedFixationPointX
        })
        .y(function (d) {
            return d.MappedFixationPointY
        });

    //turn the users into an array of objects containing the data of the users
    for (i in users) {
        users[i] = data_scanpath.filter(function (d) {
            return d.user == users[i]
        });
    };

    //add the scanpath to the canvas
    group.selectAll("path")
        .data([...users])
        .enter()
        .append("path")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", function (d) {
            if (highlighted_users.indexOf(d[0].user) !== -1) {
                return highlight_colour
            } else {
                return base_colour
            }
        })
        .attr("stroke-width", function (d) {
            if (highlighted_users.indexOf(d[0].user) !== -1) {
                return highlight_stroke_width
            } else {
                return base_stroke_width
            }
        })
        .attr("stroke-opacity", function (d) {
            if (highlighted_users.indexOf(d[0].user) !== -1) {
                return highlight_stroke_opacity
            } else {
                return base_stroke_opacity
            }
        });

    fixation.selectAll("circle")
        .data(data_scanpath)
        .enter()
        .append("circle")
        .attr("opacity", function (d) {
            if (highlighted_users.indexOf(d.user) !== -1) {
                return highlight_fixation_opacity
            } else {
                return base_fixation_opacity
            }
        })
        .attr("cx", function (d) {
            return d.MappedFixationPointX
        })
        .attr("cy", function (d) {
            return d.MappedFixationPointY
        })
        .attr("r", function (d) {
            if (highlighted_users.indexOf(d.user) !== -1) {
                return highlight_fixation_radius
            } else {
                return base_fixation_radius
            }
        })
        .attr("fill", function (d) {
            if (highlighted_users.indexOf(d.user) !== -1) {
                return highlight_colour
            } else {
                return base_colour
            }
        });
}

//interactions draw
{
//draw scanpath after interactions
function redrawScanpath(data_scanpath) {
    for (j=0; j<=numberScanpaths; j++) {
        var svg = document.getElementById('scanpath_' + j)
        var temp_stim = svg.getAttribute('data-image')
        var temp_can = d3.select(svg)

        temp_data = data_scanpath.filter(function (d) {
            return (d.StimuliName == temp_stim);
        });

        var allUsers = temp_data.map(function (d) {
            return d.user
        });
        var uniqueUsers = new Set(allUsers);
    
        //turns the set into an array
        var arrayUsers = [...uniqueUsers];
    
        //create the actual visualization
        redraw(temp_data, arrayUsers, temp_can);
    }
};

//redraws visualization
function redraw(data_scanpath, users, temp_can) {
    
    //select the paths
    paths = temp_can.selectAll("g.paths")

    //turn the users into an array of objects containing the data of the users
    for (i in users) {
        users[i] = data_scanpath.filter(function (d) {
            return d.user == users[i]
        });
    };

    //transition the paths
    paths.selectAll("path")
            .transition()
            .duration(0)
            .attr("stroke", function (d) {
                if (highlighted_users.indexOf(d[0].user) !== -1) {
                    return highlight_colour
                } else {
                    return base_colour
                }
            })
            .attr("stroke-width", function (d) {
                if (highlighted_users.indexOf(d[0].user) !== -1) {
                    return highlight_stroke_width
                } else {
                    return base_stroke_width
                }
            })
            .attr("stroke-opacity", function (d) {
                if (highlighted_users.indexOf(d[0].user) !== -1) {
                    return highlight_stroke_opacity
                } else {
                    return base_stroke_opacity
                }
            }); 

    temp_can.selectAll("circle")
                .transition()
                .duration(0)
                .attr("fill", function (d) {
                    if (highlighted_users.indexOf(d.user) !== -1) {
                        return highlight_colour
                    } else {
                        return base_colour
                    }
                })
                .attr("r", function (d) {
                    if (highlighted_users.indexOf(d.user) !== -1) {
                        return highlight_fixation_radius
                    } else {
                        return base_fixation_radius
                    }
                })
                .attr("opacity", function (d) {
                    if (highlighted_users.indexOf(d.user) !== -1) {
                        return highlight_fixation_opacity
                    } else {
                        return base_fixation_opacity
                    }
                });  
}
}

//timeslider draw (needs one specific map instead of all)
{
function timerScanpath(idNum, data_scanpath) {
    var svg_0 = document.getElementById("scanpath_" + idNum)
    var svg = d3.select(svg_0)

    var allUsers = data_scanpath.map(function (d) {
        return d.user
    });
    var uniqueUsers = new Set(allUsers);

    //turns the set into an array
    var  arrayUsers = [...uniqueUsers];

    timerDraw(data_scanpath, arrayUsers, svg)
}

function timerDraw(data_scanpath, users, svg) {
    
    //clear svg
    svg.selectAll("g").remove();

    //create group object            
    var group = svg.append("g")
                        .attr("class", "paths");
    var fixation = svg.append("g")
                        .attr("class", "fixations");

    //create line object
    var line = d3.line()
        .x(function (d) {
            return d.MappedFixationPointX
        })
        .y(function (d) {
            return d.MappedFixationPointY
        });

    //turn the users into an array of objects containing the data of the users
    for (i in users) {
        users[i] = data_scanpath.filter(function (d) {
            return d.user == users[i]
        });
    };

    //add the scanpath to the canvas
    group.selectAll("path")
        .data([...users])
        .enter()
        .append("path")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", function (d) {
            if (highlighted_users.indexOf(d[0].user) !== -1) {
                return highlight_colour
            } else {
                return base_colour
            }
        })
        .attr("stroke-width", function (d) {
            if (highlighted_users.indexOf(d[0].user) !== -1) {
                return highlight_stroke_width
            } else {
                return base_stroke_width
            }
        })
        .attr("stroke-opacity", function (d) {
            if (highlighted_users.indexOf(d[0].user) !== -1) {
                return highlight_stroke_opacity
            } else {
                return base_stroke_opacity
            }
        });

    fixation.selectAll("circle")
        .data(data_scanpath)
        .enter()
        .append("circle")
        .attr("opacity", function (d) {
            if (highlighted_users.indexOf(d.user) !== -1) {
                return highlight_fixation_opacity
            } else {
                return base_fixation_opacity
            }
        })
        .attr("cx", function (d) {
            return d.MappedFixationPointX
        })
        .attr("cy", function (d) {
            return d.MappedFixationPointY
        })
        .attr("r", function (d) {
            if (highlighted_users.indexOf(d.user) !== -1) {
                return highlight_fixation_radius
            } else {
                return base_fixation_radius
            }
        })
        .attr("fill", function (d) {
            if (highlighted_users.indexOf(d.user) !== -1) {
                return highlight_colour
            } else {
                return base_colour
            }
        });
}
}

//create buttons to select highlighted user
function createUserButtons(users) {
    highlighted_user_container.innerHTML += '<p>' + stimulus + '</p>'
    for (user in users) {
        thisUser = users[user] + '_' + numberButtons.toString(10)
        highlighted_user_container.innerHTML += '<input type="button" id ="' + thisUser + 
                                                '" value =' + users[user] + ' name="highlighted_users" onclick="highlightButton(this.value, this.id)">';
        if (user % 4 == 3) {
            highlighted_user_container.innerHTML += "</br>";
        }
    }
    numberButtons += 1
}

function equalizaTime(data_scanpath, users) {
    test = data_scanpath;
    scanpathArray = [];
    for(i in users) {
        newData = test.filter(function(d){
            return d.user == users[i]
        });

        minTime = newData[0].Timestamp;

        for(stamp in newData){
            newData[stamp].Timestamp = newData[stamp].Timestamp - minTime;
        }

        scanpathArray.push(...newData);
    }
    return scanpathArray;
}

// creates download buttons for each individual visualization
// should move the creation of these buttons to old_visualizations.js since these are essentially the same for each vis
function createDownloadButtonScanpath(name) {
    // creates button
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    downloadButton.id = name + '.downloadButton_scanpath';
    downloadButton.value = 'Download scanpath of ' + name;

    // adds event listener which runs the actual download function
    downloadButton.addEventListener("click", function () {
        downloadScanpath(name)
    });

    // appends the newly created button to the div with all scanpath buttons
    var downloadDiv = document.querySelector('#downloadButtonsScanpath');
    downloadDiv.appendChild(downloadButton);
}

// IMAGE DOESN'T DISPLAY BEHIND SVG
// HAPPENS BECAUSE IMAGE IS EXTERNAL RELATIVE TO THE SVG
// FIX: ADD "<image href='path/to/image'(or callback containing image) width=width height=height/>"
// the image becomes part of the svg, which means that it should then be downloaded behind the svg
function downloadScanpath(name) {
    // downloads the scanpath visualization

    // hardcoded selection of the svg!! I did not know where to get the 0 from
    var svg = document.getElementById("scanpath_0");

    // I need to look into what XML does/is, but this gets some source of the svg
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    // as above, description said 'adds namespaces'
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    // actual bit which downloads the file passed in the url / URI data scheme
    var link = document.createElement("a");
    link.download = name.substring(0, name.lastIndexOf(".")) + "_scanpath";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
