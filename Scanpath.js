//variables
//width and height are chosen so there is always enough room for the maps, could probably be done more efficient
var width = 2000;
var height = 2000;
var map = "01_Antwerpen_S1.jpg"

//load data
d3.tsv("/all_fixation_data_cleaned_up.csv").then(function (data) {
    data = data.filter(function (d) {
        return (d.StimuliName == map);
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
            .attr("xlink:href", "js/data/stimuli/" + map);

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
        .attr("marker-end", "url(#triangle)")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1);
}

