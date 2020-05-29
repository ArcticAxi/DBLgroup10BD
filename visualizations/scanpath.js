{//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
    var width = 2000;
    var height = 2000;

//css variables
    var dark_blue = getComputedStyle(document.documentElement).getPropertyValue('--dark-blue-color');
    var main_blue = getComputedStyle(document.documentElement).getPropertyValue('--main-blue-color');

//path variables
    var highlighted_users = []
    var base_stroke_width = 1;
    var highlight_stroke_width = 5;
    var base_stroke_opacity = 0.5;
    var highlight_stroke_opacity = 1;
    var base_colour = dark_blue;
    var highlight_colour = "red";

//fixation dot variables
    var fixation_on = true;
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
    var buttonCounter = 0;
    var sliderData;
    var numberScanpaths = -1;

//checkbox variables
    var userCheckboxes = [];

//passed variables
    var stimulus = "22_Venedig_S2.jpg"
    var size_decrease = 2;
}

//to be called by visualizations.js
//creates scanpath with given variables
function scanpath(content, name, sizeWidth, sizeHeight, sizeDecrease, idName) {
    stimulus = name;
    height = sizeHeight;
    width = sizeWidth;
    buttonData = content;
    size_decrease = sizeDecrease;
    initialSetup(content, idName);
    drawScanpath(content)
}

//creates an svg element and users array to work with
function initialSetup(data, idName) {
    numberScanpaths += 1;
    //create canvas
    canvas = d3.select(idName)
        .append("svg")
        .attr("data-image", stimulus)
        .attr("data-name", idName)
        .attr("id", "scanpath_" + numberScanpaths)
        .attr("width", width)
        .attr("height", height);

    //d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
    data = data.filter(function (d) {
        return (d.StimuliName == stimulus);
    });

    //creates a set containing all unique users
    var allUsers = data.map(function (d) {
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
    buttonCounter += 1;
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
        redrawScanpath(buttonData)
    }
}

//draw the scanpath visualisation
function drawScanpath(data) {
    data = data.filter(function (d) {
        return (d.StimuliName == stimulus);
    });

    //creates a set containing all unique users
    var allUsers = data.map(function (d) {
        return d.user
    });
    uniqueUsers = new Set(allUsers);

    //turns the set into an array
    arrayUsers = [...uniqueUsers];

    users = arrayUsers;

    //create the actual visualization
    createVis(data, arrayUsers);

};

//creates the actual visualization
function createVis(data, users) {

    //clears the canvas
    canvas.selectAll("g").remove();

    //create group object            
    var group = canvas.append("g");

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
        users[i] = data.filter(function (d) {
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

    group.selectAll("circle")
        .data(data)
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
function redrawScanpath(data) {
    j = 0
    while(j<=numberScanpaths) {
        div = document.getElementById('scanpath_' + j)
        temp_stim = div.getAttribute('data-image')
        temp_can = d3.select(div)

        temp_data = data.filter(function (d) {
            return (d.StimuliName == temp_stim);
        });

        var allUsers = temp_data.map(function (d) {
            return d.user
        });
        uniqueUsers = new Set(allUsers);
    
        //turns the set into an array
        arrayUsers = [...uniqueUsers];
    
        //create the actual visualization
        redraw(temp_data, arrayUsers, temp_can);
        j += 1;
    }

    j = 0;
};

//redraws visualization
function redraw(data, users, temp_can) {
    
    //clears the canvas
    temp_can.selectAll("g").remove();

    //create group object            
    var group = temp_can.append("g");

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
        users[i] = data.filter(function (d) {
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

    group.selectAll("circle")
        .data(data)
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

//Create buttons to select highlighted user
function createUserButtons(users) {
    highlighted_user_container.innerHTML += '<p>' + stimulus + '</p>'
    for (user in users) {
        highlighted_user_container.innerHTML += '<input type="button" id =' + users[user]
            + ' value =' + users[user] + ' name="highlighted_users" onclick="highlightButton(this.value, this.id)">';

        if (user % 4 == 3) {
            highlighted_user_container.innerHTML += "</br>";
        }
    }
}