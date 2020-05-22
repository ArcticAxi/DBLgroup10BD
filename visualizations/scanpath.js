//variables
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

//checkbox variables
var userCheckboxes = [];

//map
var stimulus = "22_Venedig_S2.jpg"

//creates an svg element and users array to work with
function initialSetup() {

    //create canvas
    canvas = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    //adds the map to the canvas            
    canvas.append("svg:image")
                .attr("xlink:href", "stimuli/" + stimulus);

                d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
                    data = data.filter(function (d) {
                        return (d.StimuliName == stimulus);
                    }); 
                
                    //creates a set containing all unique users
                    var allUsers = data.map( function (d) { return d.user} );
                    uniqueUsers = new Set(allUsers);
                
                    //turns the set into an array and sorts said array
                    arrayUsers = [...uniqueUsers];
                    temp_users = [];

                    for (i in arrayUsers) {
                        temp_users[i] = arrayUsers[i].substr(1);
                    }

                    temp_users.sort(function(a, b){return a-b});

                    for (i in arrayUsers) {
                        arrayUsers[i] = "p" + temp_users[i];
                    }

                    //creates buttons used to highlight users
                    createUserButtons(arrayUsers);
                })                
}

//update base stroke width when moving slider
base_stroke_width_slider.oninput = function() {
    base_stroke_width = this.value;
    drawScanpath()
}

//update base stroke opacity when moving slider
base_stroke_opacity_slider.oninput = function() {
    base_stroke_opacity = this.value/10;
    drawScanpath()
}

//update highlight stroke width when moving slider
highlight_stroke_width_slider.oninput = function() {
    highlight_stroke_width = this.value;
    drawScanpath()
}

//update highlight stroke opacity when moving slider
highlight_stroke_opacity_slider.oninput = function() {
    highlight_stroke_opacity = this.value/10;
    drawScanpath()
}


//update base fixation radius when moving slider
base_fixation_radius_slider.oninput = function() {
    base_fixation_radius = this.value;
    drawScanpath()
}

//update highlight fixation radius when moving slider
highlight_fixation_radius_slider.oninput = function() {
    highlight_fixation_radius = this.value;
    drawScanpath()
}

//update base fixation opacity when moving slider
base_fixation_opacity_slider.oninput = function() {
    base_fixation_opacity = this.value/10;
    drawScanpath()
}

//update highlight fixation opacity when moving slider
highlight_fixation_opacity_slider.oninput = function() {
    highlight_fixation_opacity = this.value/10;
    drawScanpath()
}

//Buttons incoming
//
//

//update base colour when pressing main blue button
base_colour_button_db.onclick = function() {
    base_colour = dark_blue;
    drawScanpath()
}

//update base colour when pressing black button
base_colour_button_b.onclick = function() {
    base_colour = "black";
    drawScanpath()
}

//user buttons event
function highlightButton(value, id){
    button = document.getElementById(id)
    if (highlighted_users.indexOf(value) !== -1) {
        highlighted_users.splice(highlighted_users.indexOf(value), 1);
        button.style.backgroundColor = dark_blue;
    } else {
        highlighted_users.push(value);
        button.style.backgroundColor = highlight_colour;
    }
    drawScanpath()
}



//draw the scanpath visualisation
function drawScanpath(){
    d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
        data = data.filter(function (d) {
            return (d.StimuliName == stimulus);
        }); 

        //creates a set containing all unique users
        var allUsers = data.map( function (d) { return d.user} );
        uniqueUsers = new Set(allUsers);
    
        //turns the set into an array
        arrayUsers = [...uniqueUsers];
        
        users = arrayUsers;

    //create the actual visualization
    createVis(data, arrayUsers);

})};

//creates the actual visualization
function createVis(data, users) {

    //clears the canvas
    canvas.selectAll("g").remove();

    //create group object            
    var group = canvas.append("g");

    //create line object
    var line = d3.line()
                .x(function (d) { return d.MappedFixationPointX })
                .y(function (d) { return d.MappedFixationPointY });

    //turn the users into an array of objects containing the data of the users
    for (i in users) {
        users[i] = data.filter(function (d) { return d.user == users[i]});
    };

    //add the scanpath to the canvas
    group.selectAll("path")
            .data([...users])
            .enter()
            .append("path")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", function (d) { if (highlighted_users.indexOf(d[0].user) !== -1) {return highlight_colour}
                                                    else {return base_colour} })
            .attr("stroke-width", function (d) { if (highlighted_users.indexOf(d[0].user) !== -1) {return highlight_stroke_width}
                                                    else { return base_stroke_width} })
            .attr("stroke-opacity", function (d) { if (highlighted_users.indexOf(d[0].user) !== -1) {return highlight_stroke_opacity}
                                                    else { return base_stroke_opacity} });

    group.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("opacity", function (d) { if (highlighted_users.indexOf(d.user) !== -1) {return highlight_fixation_opacity}
                                            else {return base_fixation_opacity}})
            .attr("cx", function (d) { return d.MappedFixationPointX })
            .attr("cy", function (d) { return d.MappedFixationPointY })
            .attr("r", function (d) { if (highlighted_users.indexOf(d.user) !== -1) {return highlight_fixation_radius}
                                            else { return base_fixation_radius} })
            .attr("fill", function (d) { if (highlighted_users.indexOf(d.user) !== -1) {return highlight_colour}
                                            else { return base_colour} });
                                }


//Create buttons to select highlighted user
function createUserButtons(users) {
    for (user in users) {
        highlighted_user_container.innerHTML += '<input type="button" id =' + users[user] 
        + ' value =' + users[user] + ' name="highlighted_users" onclick="highlightButton(this.value, this.id)">';
        
        if (user%4 == 3) {
            highlighted_user_container.innerHTML += "</br>";
        }
    }
}