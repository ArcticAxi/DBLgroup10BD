//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
var width = 2000;
var height = 2000;
var stroke_width = 1;
var stroke_opacity = 0.5;
var base_colour = "black";
var highlight_colour = "red";
var fixation_on = true;
var fixation_color = "black";
var fixation_radius = 3;
var stimulus = "11_Bologna_S2.jpg"

//load data
d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
    data = data.filter(function (d) {
        return (d.StimuliName == stimulus);
    }); 

    //creates a set containing all unique users
    var allUsers = data.map( function (d) { return d.user} )
    uniqueUsers = new Set(allUsers)

    //turns the set into an array
    arrayUsers = [...uniqueUsers]

    //create the actual visualization
    createVis(data, arrayUsers)

});

//creates the actual visualization
function createVis(data, users) {

//create canvas
var canvas = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

//adds the map to the canvas            
canvas.append("svg:image")
            .attr("xlink:href", "stimuli/" + stimulus);

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
        .attr("stroke", base_colour)
        .attr("stroke-width", stroke_width)
        .attr("stroke-opacity", stroke_opacity);

if (fixation_on == true) {        
    group.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return d.MappedFixationPointX })
            .attr("cy", function (d) { return d.MappedFixationPointY })
            .attr("r", fixation_radius)
            .attr("fill", fixation_color)}
}

