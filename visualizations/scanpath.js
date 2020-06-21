{//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
    var width = 2000;
    var height = 2000;

    var size_decrease = 2;

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
    var sliderData;
    var numberScanpaths = -1;

//checkbox variables
    var userCheckboxes = [];

//passed variables
    var stimulus;
    var has_image = false;
    var timecalled = false;
    var canvas;
}

//creates scanpath with given variables
function scanpath(content, name, sizeWidth, sizeHeight, idName, sizeDecrease, hasImage, vars) {
    //checks if vars is a valid input
    if (typeof vars == 'object') {
        if (typeof vars.base_stroke_width == 'number') {
            updateVarsScanpath(vars);
        }
    }
    stimulus = name;
    height = sizeHeight;
    width = sizeWidth;
    size_decrease = sizeDecrease;
    has_image = hasImage;
    drawScanpath(content, idName, vars);
}

//interactions
{
//path sliders
//update base stroke width when moving slider
    base_stroke_width_slider.oninput = function () {
        base_stroke_width = this.value;
        redrawScanpath()
    }

//update base stroke opacity when moving slider
    base_stroke_opacity_slider.oninput = function () {
        base_stroke_opacity = this.value / 10;
        redrawScanpath()
    }

//update highlight stroke width when moving slider
    highlight_stroke_width_slider.oninput = function () {
        highlight_stroke_width = this.value;
        redrawScanpath()
    }

//update highlight stroke opacity when moving slider
    highlight_stroke_opacity_slider.oninput = function () {
        highlight_stroke_opacity = this.value / 10;
        redrawScanpath()
    }

//fixation sliders
//update base fixation radius when moving slider
    base_fixation_radius_slider.oninput = function () {
        base_fixation_radius = this.value;
        redrawScanpath()
    }

//update highlight fixation radius when moving slider
    highlight_fixation_radius_slider.oninput = function () {
        highlight_fixation_radius = this.value;
        redrawScanpath()
    }

//update base fixation opacity when moving slider
    base_fixation_opacity_slider.oninput = function () {
        base_fixation_opacity = this.value / 10;
        redrawScanpath()
    }

//update highlight fixation opacity when moving slider
    highlight_fixation_opacity_slider.oninput = function () {
        highlight_fixation_opacity = this.value / 10;
        redrawScanpath()
    }

//buttons
//update base colour when pressing main blue button
    base_colour_button_db.onclick = function () {
        base_colour = dark_blue;
        redrawScanpath()
    }

//update base colour when pressing black button
    base_colour_button_b.onclick = function () {
        base_colour = "black";
        redrawScanpath()
    }
}

//draw the scanpath visualisation
function drawScanpath(original_data_scanpath, idName, vars) {
    numberScanpaths += 1;
    //create canvas
    var canvas = d3.select(idName)
        .append("svg")
        .attr("data-image", stimulus)
        .attr("data-name", idName)
        .attr("id", "scanpath_" + numberScanpaths)
        .attr("width", width)
        .attr("height", height)
        .attr('xmlns', "http://www.w3.org/2000/svg");

    let data_scanpath = original_data_scanpath.filter(function (d) {
        return (d.StimuliName == stimulus);
    });

    data_scanpath.forEach(function (d) {
        d.MappedFixationPointX1 = d.MappedFixationPointX / size_decrease;
        d.MappedFixationPointY1 = d.MappedFixationPointY / size_decrease;
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

    //create the actual visualization
    //createVis(data_scanpath, arrayUsers);
    attachImage(data_scanpath, arrayUsers, canvas, vars);
};

function attachImage(data_scanpath, users, canvas, vars) {
    if (has_image) {
        var imageBackScanpath = document.querySelector('#scanpath');
        var childImageScanpath = imageBackScanpath.querySelectorAll("div");
        var numberFileScanpath = -1;
        var width;
        var height;

        for (var i = 0; i < childImageScanpath.length; i++) {
            if (childImageScanpath[i].id.substring(1, childImageScanpath[i].id.lastIndexOf('_')) + '.jpg' === stimulus) {
                width = childImageScanpath[i].style.width;
                height = childImageScanpath[i].style.height;
                childImageScanpath[i].style.backgroundImage = "";
                numberFileScanpath = i;
            }
        }

        if (numberFileScanpath > -1) {
            const imagesFile = document.querySelector('#stimuli-input').files[numberFileScanpath];
            const imagesFileReader = new FileReader();

            imagesFileReader.addEventListener('load', function () {
                var image = canvas.append("svg:image").attr("xlink:href", imagesFileReader.result)
                    .attr('width', width)
                    .attr('height', height);

                createVis(data_scanpath, users, canvas, vars);
            }, false);

            if (imagesFile) {
                imagesFileReader.readAsDataURL(imagesFile)
            }
        }
    } else {
        createVis(data_scanpath, users, canvas, vars);
    }
}

//creates the actual visualization
function createVis(data_scanpath, users, canvas, vars) {
    //clears canvas
    canvas.selectAll("g").remove()

    //create group object
    var group = canvas.append("g")
        .attr("class", "paths");
    var fixation = canvas.append("g")
        .attr("class", "fixations");

//create line object
    var line = d3.line()
        .x(function (d) {
            return d.MappedFixationPointX1
        })
        .y(function (d) {
            return d.MappedFixationPointY1
        });

//turn the users into an array of objects containing the data of the users
    for (i in users) {
        users[i] = data_scanpath.filter(function (d) {
            return d.user == users[i]
        });
    }
    ;

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
                console.log(highlight_stroke_opacity)
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
            return d.MappedFixationPointX1
        })
        .attr("cy", function (d) {
            return d.MappedFixationPointY1
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
        if (typeof vars == 'object') {
            if (typeof vars.base_stroke_width == 'number') {
                redrawAllHeatmaps();
            }
        }
}

//interactions draw

//draw scanpath after interactions
    function redrawScanpath() {
        for (j = 0; j <= numberScanpaths; j++) {
            var svg = d3.select(document.getElementById('scanpath_' + j))
            //var temp_can = d3.select(svg)

            //select the paths
            paths = svg.selectAll("g.paths")

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

            svg.selectAll("circle")
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
    };

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
        var arrayUsers = [...uniqueUsers];

        timerDraw(data_scanpath, arrayUsers, svg)
    }

    function timerDraw(data_scanpath, users, svg) {
        //clear svg
        svg.selectAll("g.paths").remove();
        svg.selectAll("g.fixations").remove();

        //create group object
        var group = svg.append("g")
            .attr("class", "paths");
        var fixation = svg.append("g")
            .attr("class", "fixations");

        //create line object
        var line = d3.line()
            .x(function (d) {
                return d.MappedFixationPointX1
            })
            .y(function (d) {
                return d.MappedFixationPointY1
            });

        //turn the users into an array of objects containing the data of the users
        for (i in users) {
            users[i] = data_scanpath.filter(function (d) {
                return d.user == users[i]
            });
        }
        ;

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
                return d.MappedFixationPointX1
            })
            .attr("cy", function (d) {
                return d.MappedFixationPointY1
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
    //creates a div to store the buttons in
    var userContainer = document.createElement('div');
    userContainer.id = "users_" + numberScanpaths;
    userContainer.class = "buttoncontainer";

    //creates a button for every user in the users array and adds it to the container
    for (user in users) {
        button = document.createElement('input');
        thisUser = users[user] + '_' + numberScanpaths.toString(10);

        button.type = 'button';
        button.id = thisUser;
        button.value = users[user];
        button.name = "highlighted_users";
        button.onclick = function() {
            if (highlighted_users.indexOf(this.value) !== -1) {
                highlighted_users.splice(highlighted_users.indexOf(this.value), 1);
                this.style.backgroundColor = dark_blue;
            } else {
                highlighted_users.push(this.value);
                this.style.backgroundColor = highlight_colour;
            }
            for (i = 0; i <= numberScanpaths; i++) {
                identity = this.value + '_' + i
                button_color = document.getElementById(identity)
                if (button_color !== null && button_color !== this.button) {
                    if (highlighted_users.indexOf(this.value) !== -1) {
                        button_color.style.backgroundColor = highlight_colour;
                    } else {
                        button_color.style.backgroundColor = dark_blue;
                    }
                }
            }
            redrawScanpath();
            userSelectionHeatmap(highlighted_users);
            drawUserSelectionBoxplot();
        };
        if(highlighted_users.indexOf(users[user]) != -1) {
            button.style.backgroundColor = highlight_colour;
        }

        userContainer.appendChild(button);
    }

    //adds the container to the container for containers
    highlighted_user_container.appendChild(userContainer);
}

function createDownloadButtonsScanpath(name) {
// creates button
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    let currentNumScanpath = numberScanpaths + 1;
    downloadButton.id = name + '.downloadButton_scanpath' + '/' + currentNumScanpath;
    downloadButton.value = 'Download scanpath of ' + name.substring(0, name.indexOf('.')) + " as .svg";

// adds event listener which runs the actual download function
    downloadButton.addEventListener("click", function () {
        downloadScanpath(downloadButton.id, false)
    });

// appends the newly created button to the div with all scanpath buttons
    var downloadDiv = document.querySelector('#downloadButtonsScanpath');
    downloadDiv.appendChild(downloadButton);
}

function xmlSvg(name, svg, multiple) {
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

    var encodedData = window.btoa(source);

//add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;


//convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

// doesn't load the image attribute but just 'no image thumbnial'-thing
// actual bit which downloads the file passed in the url / URI data scheme
    if (multiple) {
        return encodedData;
    } else {
        var link = document.createElement("a");
        link.download = name.substring(0, name.indexOf(".")) + "_scanpath" + '.svg';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // d3.select('#scanpath_' + num_of_scanpath).select('#backgroundImageScanpathDownload').remove();
}

// downloads the scanpath visualization
function downloadScanpath(name, multiple) {
    var num_of_scanpath = name.substring(name.indexOf('/') + 1, name.length);
    var svg = document.getElementById("scanpath_" + num_of_scanpath);

    if (multiple) {
        return xmlSvg(name, svg, multiple)
    } else {
        xmlSvg(name, svg, multiple)
    }
}

//sets the vars to those in the provided json file
function updateVarsScanpath(variables) {
    base_stroke_width = variables.base_stroke_width;
    base_stroke_width_slider.value = variables.base_stroke_width;

    highlight_stroke_width = variables.highlight_stroke_width;
    highlight_stroke_width_slider.value = variables.highlight_stroke_width;

    base_stroke_opacity = variables.base_stroke_opacity / 10;
    base_stroke_opacity_slider.value = variables.base_stroke_opacity;

    highlight_stroke_opacity = variables.highlight_stroke_opacity / 10;
    highlight_stroke_opacity_slider.value = variables.highlight_stroke_opacity;

    base_fixation_radius = variables.base_fixation_radius;
    base_fixation_radius_slider.value = variables.base_fixation_radius;

    highlight_fixation_radius = variables.highlight_fixation_radius;
    highlight_fixation_radius_slider.value = variables.highlight_fixation_radius;

    base_fixation_opacity = variables.base_fixation_opacity /  10;
    base_fixation_opacity_slider.value = variables.base_fixation_opacity;

    highlight_fixation_opacity = variables.highlight_fixation_opacity / 10;
    highlight_fixation_opacity_slider.value = variables.highlight_fixation_opacity;

    highlighted_users = variables.highlighted_users;

    if (variables.base_colour == "black") {
        base_colour = variables.base_colour;
    }
}

function updateButtons() {
    for (x in highlighted_users) {
        var value = highlighted_users[x]
        for (i = 0; i <= numberScanpaths; i++) {
            var identity = value + '_' + i
            var button_color = document.getElementById(identity)
            if (button_color !== null && button_color !== button) {
                if (highlighted_users.indexOf(value) !== -1) {
                    button_color.style.backgroundColor = highlight_colour;
                } else {
                    button_color.style.backgroundColor = dark_blue;
                }
            }
        }
    }
}