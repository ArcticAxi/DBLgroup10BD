//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
var width = 2000;
var height = 2000;

//path variables
var highlighted_user = "p1"
var base_stroke_width = 1;
var highlight_stroke_width = 5;
var base_stroke_opacity = 0.5;
var highlight_stroke_opacity = 1;
var base_colour = "steelblue";
var highlight_colour = "red";

//placeholders for users array
//var users = [];

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
var base_colour_button_sb = document.getElementById("steelblue_base")
var base_colour_button_b = document.getElementById("black_base")  
//highlighted users
var highlighted_user_container = document.getElementById("highlighted_user")

//checkbox variables
var userCheckboxes = [];

//map
var stimulus = "01_Antwerpen_S1.jpg"

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
                
                    data.forEach(function(d) { 
                        if (d.user == highlighted_user) {
                            d.highlighted = true;
                        } 
                        else {
                            d.highlighted = false;
                        }});
                
                    //creates a set containing all unique users
                    var allUsers = data.map( function (d) { return d.user} );
                    uniqueUsers = new Set(allUsers);
                
                    //turns the set into an array
                    arrayUsers = [...uniqueUsers];
                    
                    users = arrayUsers;
                
                    createUserButtons(users)})                
}

//update base stroke width when moving slider
base_stroke_width_slider.oninput = function() {
  base_stroke_width = this.value;
  load()
}

//update base stroke opacity when moving slider
base_stroke_opacity_slider.oninput = function() {
    base_stroke_opacity = this.value/10;
    load()
}

//update highlight stroke width when moving slider
highlight_stroke_width_slider.oninput = function() {
    highlight_stroke_width = this.value;
    load()
}

//update highlight stroke opacity when moving slider
highlight_stroke_opacity_slider.oninput = function() {
    highlight_stroke_opacity = this.value/10;
    load()
}


//update base fixation radius when moving slider
base_fixation_radius_slider.oninput = function() {
    base_fixation_radius = this.value;
    load()
}

//update highlight fixation radius when moving slider
highlight_fixation_radius_slider.oninput = function() {
    highlight_fixation_radius = this.value;
    load()
}

//update base fixation opacity when moving slider
base_fixation_opacity_slider.oninput = function() {
    base_fixation_opacity = this.value/10;
    load()
}

//update highlight fixation opacity when moving slider
highlight_fixation_opacity_slider.oninput = function() {
    highlight_fixation_opacity = this.value/10;
    load()
}

//Buttons incoming
//
//

//update base colour when pressing steel blue button
base_colour_button_sb.onclick = function() {
    base_colour = "steelblue";
    load()
}

//update base colour when pressing black button
base_colour_button_b.onclick = function() {
    base_colour = "black";
    load()
}

//user buttons event
function highlightButton(value){
    highlighted_user = value;
    load()
}

initialSetup()

//load data
function load(){
    d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
        data = data.filter(function (d) {
            return (d.StimuliName == stimulus);
        }); 
    
        data.forEach(function(d) { 
            if (d.user == highlighted_user) {
                d.highlighted = true;
            } 
            else {
                d.highlighted = false;
            }});
    
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
            .attr("stroke", function (d) { if (d[0].highlighted == true) {return highlight_colour}
                                                    else {return base_colour} })
            .attr("stroke-width", function (d) { if (d[0].highlighted == true) {return highlight_stroke_width}
                                                    else { return base_stroke_width} })
            .attr("stroke-opacity", function (d) { if (d[0].highlighted == true) {return highlight_stroke_opacity}
                                                    else { return base_stroke_opacity} });
     
    group.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("opacity", function (d) { if (d.highlighted == true) {return highlight_fixation_opacity}
                                            else {return base_fixation_opacity}})
            .attr("cx", function (d) { return d.MappedFixationPointX })
            .attr("cy", function (d) { return d.MappedFixationPointY })
            .attr("r", function (d) { if (d.highlighted == true) {return highlight_fixation_radius}
                                            else { return base_fixation_radius} })
            .attr("fill", function (d) { if (d.highlighted == true) {return highlight_colour}
                                            else { return base_colour} })}


//Create buttons to select highlighted user
function createUserButtons(users) {
    for (user in users) {
        highlighted_user_container.innerHTML += '<input type="button" id =' + users[user] + ' value =' + users[user] + ' name="highlighted_users" onclick="highlightButton(this.value)">'
        
        if (user%4 == 3) {
            highlighted_user_container.innerHTML += "</br>"
        }
    }
}

load()