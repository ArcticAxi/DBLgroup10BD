
var stimulus = "01_Antwerpen_S1.jpg";


//==========================================================================
// Add to svg
//==========================================================================
var svg = d3.select("svg"),				
            margin = 0,
            width = svg.attr("width") - margin,
            height = svg.attr("height") - margin;



// append the svg object to the body of the page
var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");
			

//==========================================================================
// Read the data
//===========================================================================
d3.tsv("https://raw.githubusercontent.com/AnnikaLarissa/MetroMap/master/all_fixation_data_cleaned_up.csv", function(error, data) {
	data = data.filter(function (d) {
		return (d.StimuliName == stimulus);
	});
			
	data.forEach(function(d) {
		d.averageX = Math.round( d.MappedFixationPointX/100) *100;
		d.averageY = Math.round( d.MappedFixationPointY/100) *100;
		d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
	});


	
//==========================================================================
// Count how many gazes at that coordinate
//===========================================================================

var array = [];							// make an array to store d.coordinates
data.forEach(function(d) {
	array.push(d.coordinates)
});

var duplicates = [];					// count how many duplicates in array
array.forEach(function(i) {
	duplicates[i] = (duplicates[i]||0) + 1;
});

data.forEach(function(d) {				// add column counts to data
	d.counts = duplicates[d.coordinates]
})

var coord = [...new Set(data.map(function(d) {		// coordinates as array called coord
  return d.coordinates
}))]

var filtered = coord.map(function(d) {				// create array of objects without duplicates (coordinates)
	return data.find(function(e) {
		return e.coordinates === d
	})
});




//=========================================================================
// Scale and axis
//==========================================================================

// Add X axis
  var x = d3.scaleLinear()
    .domain([0, 1650])							// What input is accepted (doesnt cause error if too small)
    .range([ 0, width ]);


// Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 1200])
    .range([ 0, height ]);


// Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([0, 200])
    .range([ 0, 100]);


//=========================================================================
// Bubbles
//=========================================================================

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(filtered)
    .enter()
    .append("circle")
    .attr("class", function(d) { return "bubbles " })
    .attr("cx", function (d) { return x(d.averageX); } )
    .attr("cy", function (d) { return y(d.averageY); } )
    .attr("r", function (d) { return z(d.counts); } )

	  
//==========================================================================
// Interaction with tooltip
//==========================================================================
	  
    // Mouseover
    .on("mouseover", function()
	{
		tooltip.style("display",null);
	})
	
	// Mousemove
    .on("mousemove", function(d)
	{
		var xPos = d3.mouse(this)[0] -15;
		var yPos = d3.mouse(this)[1] -30;
		tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
		tooltip.select("text").text("Gazes: " + d.counts + "")
		// reduce opacity of all groups
		d3.selectAll(".bubbles").style("opacity", .2)
		// expect the one that is hovered
		d3.selectAll(".bubbles:hover").style("opacity", 1)

	})
	
	// Mouseout
    .on("mouseout", function()
	{
		tooltip.style("display", "none")
		d3.selectAll(".bubbles").style("opacity", .6);
	});


// Tooltip basics
var tooltip = svg.append("g")
	.attr("class", tooltip)
	.style("display", "none");
	
tooltip.append("text")
	.attr("x", 15)
	.attr("dy", "1.2em")
	.style("font-size", "1.25em")
	.attr("font-weight", "bold");
  })
