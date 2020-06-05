function bubbleMap(content, name, width, height, sizeDecrease, idName) {
    var array_bubblemap = [];							// make an array to store d.coordinates
    var duplicates = [];					// count how many duplicates in array
    var gridSize = 100;

    // create svg

    var svg = d3.select(idName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g');
    //.attr("transform", "translate(" + 100 + "," + 100 + ")");

    var data_bubblemap = JSON.parse(JSON.stringify(content));

    // read the data
    data_bubblemap = data_bubblemap.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        //   d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    data_bubblemap.forEach(function (d) {
        d.averageX = Math.round(d.MappedFixationPointX / (100 / sizeDecrease)) * 100 / sizeDecrease;
        d.averageY = Math.round(d.MappedFixationPointY / (100 / sizeDecrease)) * 100 / sizeDecrease;
        d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
    });

    //==========================================================================
    // Count how many gazes at that coordinate
    //===========================================================================
    data_bubblemap.forEach(function (d) {
        array_bubblemap.push(d.coordinates)
    });

    array_bubblemap.forEach(function (i) {
        duplicates[i] = (duplicates[i] || 0) + 1;
    });

    data_bubblemap.forEach(function (d) {				// add column counts to data
        d.counts = duplicates[d.coordinates]
    });
    
    data_bubblemap.forEach(function(d) {							// average duration
	    d.duration = d.FixationDuration;
	    data_bubblemap.forEach(function(e) {
		    if (d.coordinates == e.coordinates) {
			    d.duration = +d.duration + +e.FixationDuration;
		    }
	    })
    })

    data_bubblemap.forEach(function(d) {							// round average duration
    	d.duration = Math.round(d.duration/d.counts);
    })

    var coord_bubblemap = [...new Set(data_bubblemap.map(function (d) {		// coordinates as array called coord
        return d.coordinates
    }))];

    var filtered_bubblemap = coord_bubblemap.map(function (d) {				// create array of objects without duplicates (coordinates)
        return data_bubblemap.find(function (e) {
            return e.coordinates === d
        })
    });

    //=========================================================================
    // Scale and axis
    //==========================================================================
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, width])							// What input is accepted (doesnt cause error if too small)
        .range([0, width]);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, height])
        .range([0, height]);

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([0, 200 / sizeDecrease])
        .range([0, 100 / sizeDecrease]);

    //=========================================================================
    // Bubbles
    //=========================================================================
    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(filtered_bubblemap)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return "bubbles "
        })
        .attr("cx", function (d) {
            return x(d.averageX);
        })
        .attr("cy", function (d) {
            return y(d.averageY);
        })
        .attr("r", function (d) {
            return z(d.counts);
        })

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







	
	
	
	
	
	
//=========================================================================	
//=========================================================================
// Redraw bubbles
// Same code, only different grid size!
//=========================================================================
//=========================================================================


function change(){	
	var gridSize = document.getElementById("text1").value;
   
   
   
    // read the data
    data_bubblemap = data_bubblemap.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        //   d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    data_bubblemap.forEach(function (d) {
        d.averageX = Math.round(d.MappedFixationPointX / (100 / sizeDecrease)) * 100 / sizeDecrease;
        d.averageY = Math.round(d.MappedFixationPointY / (100 / sizeDecrease)) * 100 / sizeDecrease;
        d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
    });

    //==========================================================================
    // Count how many gazes at that coordinate
    //===========================================================================
    data_bubblemap.forEach(function (d) {
        array_bubblemap.push(d.coordinates)
    });

    array_bubblemap.forEach(function (i) {
        duplicates[i] = (duplicates[i] || 0) + 1;
    });

    data_bubblemap.forEach(function (d) {				// add column counts to data
        d.counts = duplicates[d.coordinates]
    });
    
    data_bubblemap.forEach(function(d) {							// average duration
	    d.duration = d.FixationDuration;
	    data_bubblemap.forEach(function(e) {
		    if (d.coordinates == e.coordinates) {
			    d.duration = +d.duration + +e.FixationDuration;
		    }
	    })
    })

    data_bubblemap.forEach(function(d) {							// round average duration
    	d.duration = Math.round(d.duration/d.counts);
    })

    var coord_bubblemap = [...new Set(data_bubblemap.map(function (d) {		// coordinates as array called coord
        return d.coordinates
    }))];

    var filtered_bubblemap = coord_bubblemap.map(function (d) {				// create array of objects without duplicates (coordinates)
        return data_bubblemap.find(function (e) {
            return e.coordinates === d
        })
    });

    //=========================================================================
    // Scale and axis
    //==========================================================================
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, width])							// What input is accepted (doesnt cause error if too small)
        .range([0, width]);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, height])
        .range([0, height]);

    // Add a scale for bubble size
    var z = d3.scaleSqrt()
        .domain([0, 200 / sizeDecrease])
        .range([0, 100 / sizeDecrease]);

    //=========================================================================
    // Bubbles
    //=========================================================================
    
	// Remove previous dots
	d3.select("g").remove("*");
	d3.select("g").remove("*");
	
	
	// Add dots
    svg.append('g')
        .selectAll("dot")
        .data(filtered_bubblemap)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return "bubbles "
        })
        .attr("cx", function (d) {
            return x(d.averageX);
        })
        .attr("cy", function (d) {
            return y(d.averageY);
        })
        .attr("r", function (d) {
            return z(d.counts);
        })

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
} }; 
 