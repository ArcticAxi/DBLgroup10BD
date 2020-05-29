

var stimulus = "01_Antwerpen_S1.jpg";
var gridSize = 100;


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


// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);



//==========================================================================
// Read the data
//===========================================================================
d3.tsv("https://raw.githubusercontent.com/AnnikaLarissa/MetroMap/master/all_fixation_data_cleaned_up.csv", function(error, data) {
	data = data.filter(function (d) {
		return (d.StimuliName == stimulus);
	});
			
	data.forEach(function(d) {
		d.averageX = Math.round( d.MappedFixationPointX/gridSize) *gridSize;
		d.averageY = Math.round( d.MappedFixationPointY/gridSize) *gridSize;
		d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
	});



//==========================================================================
// Count how many gazes at that coordinate
//===========================================================================

var arrayC = [];						// make an array to store d.coordinates
data.forEach(function(d) {
	arrayC.push(d.coordinates)
});

var duplicates = [];					// count how many duplicates in array
arrayC.forEach(function(i) {
	duplicates[i] = (duplicates[i]||0) + 1;
});

data.forEach(function(d) {				// add column counts to data
	d.counts = duplicates[d.coordinates]
})

data.forEach(function(d) {							// average duration
	d.duration = d.FixationDuration;
	data.forEach(function(e) {
		if (d.coordinates == e.coordinates) {
			d.duration = +d.duration + +e.FixationDuration;
		}
	})
})

data.forEach(function(d) {							// round average duration
	d.duration = Math.round(d.duration/d.counts);
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


        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("Fixations: " + d.counts + '<br>' + "Average duration: " + d.duration + "ms")
				.style('left', (d3.mouse(this)[0] + 'px'))	
				.style('top', (d3.mouse(this)[1] + 'px'));	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
})






	
	
	
	
	
	
//=========================================================================	
//=========================================================================
// Redraw bubbles
// Same code, only different grid size!
//=========================================================================
//=========================================================================




function change(){	
	var gridSize = document.getElementById("text1").value;
	
//==========================================================================
// Read the data
//===========================================================================
d3.tsv("https://raw.githubusercontent.com/AnnikaLarissa/MetroMap/master/all_fixation_data_cleaned_up.csv", function(error, data) {
	data = data.filter(function (d) {
		return (d.StimuliName == stimulus);
	});
			
	data.forEach(function(d) {
		d.averageX = Math.round( d.MappedFixationPointX/gridSize) *gridSize;
		d.averageY = Math.round( d.MappedFixationPointY/gridSize) *gridSize;
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

data.forEach(function(d) {							// average duration
	d.duration = d.FixationDuration;
	data.forEach(function(e) {
		if (d.coordinates == e.coordinates) {
			d.duration = +d.duration + +e.FixationDuration;
		}
	})
})

data.forEach(function(d) {							// round average duration
	d.duration = Math.round(d.duration/d.counts);
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

	// Remove previous dots
	d3.select("g").remove("*");
	d3.select("g").remove("*");



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
	  
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html("Fixations: " + d.counts + '<br>' + "Average duration: " + d.duration + "ms")
				.style('left', (d3.mouse(this)[0] + 'px'))	
				.style('top', (d3.mouse(this)[1] + 'px'));	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
})
}

