//==========================================================================
// Add to svg
//==========================================================================
var svg = d3.select("svg"),				
            margin = 0,
            width = svg.attr("width") - margin,
            height = svg.attr("height");

// append the svg object to the body of the page
var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");
			

//==========================================================================
// Read the data
//===========================================================================
d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv", function(data) {


//=========================================================================
// Scale and axis
//==========================================================================

// Add X axis
  var x = d3.scaleLinear()
    .domain([0, 45000])
    .range([ 0, width ]);


// Add Y axis
  var y = d3.scaleLinear()
    .domain([35, 90])
    .range([ height, 0]);


// Add a scale for bubble size
  var z = d3.scaleSqrt()
    .domain([200000, 1310000000])
    .range([ 2, 30]);


//=========================================================================
// Bubbles
//=========================================================================

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", function(d) { return "bubbles " })
      .attr("cx", function (d) { return x(d.gdpPercap); } )
      .attr("cy", function (d) { return y(d.lifeExp); } )
      .attr("r", function (d) { return z(d.pop); } )

	  
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
		var yPos = d3.mouse(this)[1] -55;
		tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
		tooltip.select("text").text("It works!")
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
