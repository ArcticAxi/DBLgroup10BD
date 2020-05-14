//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
var width = 2000;
var height = 2000;

//path variables
var highlighted_user = "p10"
var base_stroke_width = 1;
var highlight_stroke_width = 10;
var base_stroke_opacity = 0.5;
var highlight_stroke_opacity = 1;
var base_colour = "black";
var highlight_colour = "purple";

//fixation dot variables
var fixation_on = true;
var base_fixation_colour = "black";
var highlight_fixation_colour = "purple";
var base_fixation_radius = 3;
var highlight_fixation_radius = 30;

//checkbox variables
var userCheckboxes = [];

//map
var stimulus = "11_Bologna_S2.jpg"

//creates an svg element to work with
function initialSetup() {

    //create canvas
    canvas = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);
}

initialSetup()

//load data
function load(){
d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
    data = data.filter(function (d) {
        return (d.StimuliName == stimulus);
    }); 

    //creates a set containing all unique users
    var allUsers = data.map( function (d) { return d.user} );
    uniqueUsers = new Set(allUsers);

    data.forEach(function(d) { 
        if (d.user == highlighted_user) {
            d.highlighted = true;
        } 
        else {
            d.highlighted = false;
        }});

    //turns the set into an array and sorts said array
    arrayUsers = [...uniqueUsers];
    arrayUsers.sort()

    //create checkboxes to select users
    createCheckboxes(arrayUsers);

    //create the actual visualization
    createVis(data, arrayUsers);

})};

//creates the actual visualization
function createVis(data, users) {

    //clears the canvas
    canvas.selectAll("*").remove();

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
            .attr("stroke", function (d) { if (d[0].highlighted == true) {return highlight_colour}
                                            else {return base_colour} })
            .attr("stroke-width", function (d) { if (d[0].highlighted == true) {return highlight_stroke_width}
                                            else { return base_stroke_width} })
            .attr("stroke-opacity", function (d) { if (d[0].highlighted == true) {return highlight_stroke_opacity}
                                            else { return base_stroke_opacity} });

    if (fixation_on == true) {        
        group.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return d.MappedFixationPointX })
                .attr("cy", function (d) { return d.MappedFixationPointY })
                .attr("r", function (d) { if (d.highlighted == true) {return highlight_fixation_radius}
                else { return base_fixation_radius} })
                .attr("fill", function (d) { if (d.highlighted == true) {return highlight_fixation_colour}
                else { return base_fixation_colour} })}
}

function createCheckboxes(dataset) {

    var selectionForm = document.getElementById("formSelectionData");

    if (userCheckboxes.length > 0) {
        for (var i = userCheckboxes.length - 1; i >= 0; i--) {
            selectionForm.removeChild(userCheckboxes[i]);
        }
        userCheckboxes = [];
    }

    for (var i = 0; i < dataset.length; i++) {
        // creating checkbox element
        var checkbox = document.createElement('input');

        // Assigning the attributes
        // to created checkbox
        checkbox.type = "checkbox";
        checkbox.name = "user";

        // retrieves the StimuliName from nested object array
        checkbox.id = dataset[i];
        checkbox.checked = Boolean(false);

        // creating label for checkbox
        var label = document.createElement('label');

        // assigning attributes for
        // the created label tag
        label.htmlFor = dataset[i];
        label.name = "userLabel";

        // appending the created text to
        // the created label tag
        label.appendChild(document.createTextNode(dataset[i]));

        // appending the checkbox
        // and label to div
        selectionForm.appendChild(checkbox);
        selectionForm.appendChild(label);

        linebreak = document.createElement("br");
        selectionForm.appendChild(linebreak);

        userCheckboxes.push(label);
        userCheckboxes.push(checkbox);
        userCheckboxes.push(linebreak)
    }
}

//makes toggle all data work
function selectAllData(source) {
    checkboxes = document.getElementsByName("user");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = source.checked;
    }
}

load()