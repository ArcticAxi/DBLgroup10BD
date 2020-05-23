function bubbleMap(content, name, width, height, sizeDecrease, idName) {
    // create svg
    var svg = d3.select(idName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g');
    //.attr("transform", "translate(" + 100 + "," + 100 + ")");

    // read the data
    data = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        //   d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    data.forEach(function (d) {
        d.MappedFixationPointX = d.MappedFixationPointX / sizeDecrease;
        d.MappedFixationPointY = d.MappedFixationPointY / sizeDecrease;
        d.averageX = Math.round(d.MappedFixationPointX / (100 / sizeDecrease)) * 100 / sizeDecrease;
        d.averageY = Math.round(d.MappedFixationPointY / (100 / sizeDecrease)) * 100 / sizeDecrease;
        d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
    });

    //==========================================================================
    // Count how many gazes at that coordinate
    //===========================================================================
    var array = [];							// make an array to store d.coordinates
    data.forEach(function (d) {
        array.push(d.coordinates)
    });

    var duplicates = [];					// count how many duplicates in array
    array.forEach(function (i) {
        duplicates[i] = (duplicates[i] || 0) + 1;
    });

    data.forEach(function (d) {				// add column counts to data
        d.counts = duplicates[d.coordinates]
    });

    var coord = [...new Set(data.map(function (d) {		// coordinates as array called coord
        return d.coordinates
    }))];

    var filtered = coord.map(function (d) {				// create array of objects without duplicates (coordinates)
        return data.find(function (e) {
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
        .data(filtered)
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
        // Mouseover
        .on("mouseover", function () {
            tooltip.style("display", null);
        })

        // Mousemove
        .on("mousemove", function (d) {
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 30;
            tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
            tooltip.select("text").text("Gazes: " + d.counts + "");
            // reduce opacity of all groups
            d3.selectAll(".bubbles").style("opacity", .2);
            // expect the one that is hovered
            d3.selectAll(".bubbles:hover").style("opacity", 1)

        })

        // Mouseout
        .on("mouseout", function () {
            tooltip.style("display", "none");
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

}