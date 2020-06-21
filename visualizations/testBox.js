var highlighted_user_box = []

// set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 50, left: 120},
        width_boxplot = 460 - margin.left - margin.right,
        height_boxplot = 400 - margin.top - margin.bottom;

function userSelectionBoxplot(highlighted_users) {
    var highlighted_user_box = highlighted_users;

    initBoxplot();
}

function initBoxplot() {

    // append the svg object to the body of the page
    var svg = d3.select(boxplot_div_name)
        .append("svg")
        .attr("width", width_boxplot + margin.left + margin.right)
        .attr("height", height_boxplot + margin.top + margin.bottom)
        .attr('id', name + '/svg')
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    createBoxplot(svg);

}

function boxplot(content, name, idName) {

    stimulus = name;
    data_boxplot = JSON.parse(JSON.stringify(content));
    boxplot_div_name = idName;

    

    initBoxplot();
}


function createBoxplot(svg) {
    // create a tooltip
    var tooltip = d3.select(boxplot_div_name)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px")


// Read the data and compute summary statistics for each specie
    data_boxplot = data_boxplot.filter(function (d) {
        return (d.StimuliName == stimulus);

    });

    data_boxplot.forEach(function (d) {                         // calculates total duration per user
        d.totalDuration = d.FixationDuration;
        data_boxplot.forEach(function (e) {
            if (d.user == e.user && d.StimuliName == e.StimuliName) {
                d.totalDuration = +d.totalDuration + +e.FixationDuration;
            }
        })
        d.stimuliUser = d.StimuliName.toString() + " " + d.user.toString()
    })

    var dubbles = [...new Set(data_boxplot.map(function (d) {       // collecting all dubble entries
        return d.stimuliUser;
    }))]

    var noDubbles = dubbles.map(function (d) {              // create array of objects without duplicates (coordinates)
        return data_boxplot.find(function (e) {
            return e.stimuliUser === d
        })
    });

    selectedUsersDraw = noDubbles.filter(function (d) {
        return highlighted_user_box.includes(d.user);

    })

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.StimuliName;
        })
        .rollup(function (d) {
            q1 = d3.quantile(d.map(function (g) {
                return g.totalDuration;
            }).sort(d3.ascending), .25)
            median = d3.quantile(d.map(function (g) {
                return g.totalDuration;
            }).sort(d3.ascending), .5)
            q3 = d3.quantile(d.map(function (g) {
                return g.totalDuration;
            }).sort(d3.ascending), .75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange
            return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
        })
        .entries(noDubbles)

        // Show the Y scale
    var y = d3.scaleBand()
        .range([height_boxplot, 0])
        .domain([stimulus])
        .padding(.4);
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()


    // Show the X scale
    var max = d3.max(data_boxplot, function (d) {
        return d.totalDuration;
    });
    var x = d3.scaleLinear()
        .domain([1, max + 1000])
        .range([100, width_boxplot])
    svg.append("g")
        .attr("transform", "translate(0," + height_boxplot + ")")
        .call(d3.axisBottom(x).ticks(5))
        .select(".domain").remove()


    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width_boxplot)
        .attr("y", height_boxplot + margin.top + 30)
        .text("Duration (ms)");


    // Show the main horizontal line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return (x(d.value.min))
        })
        .attr("x2", function (d) {
            return (x(d.value.max))
        })
        .attr("y1", function (d) {
            return (y(d.key) + y.bandwidth() / 2)
        })
        .attr("y2", function (d) {
            return (y(d.key) + y.bandwidth() / 2)
        })
        .attr("stroke", "black")
        .style("width", 40)


    // rectangle for the main box
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return (x(d.value.q1))
        }) // console.log(x(d.value.q1)) ;
        .attr("width", function (d) {
            ;
            return (x(d.value.q3) - x(d.value.q1))
        }) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function (d) {
            return y(d.key);
        })
        .attr("height", y.bandwidth())
        .attr("stroke", "black")
        .style("fill", "#7cc4f4")


    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) {
            return (y(d.key))
        })
        .attr("y2", function (d) {
            return (y(d.key) + y.bandwidth())
        })
        .attr("x1", function (d) {
            return (x(d.value.median))
        })
        .attr("x2", function (d) {
            return (x(d.value.median))
        })
        .attr("stroke", "black")
        .style("width", 80)

    //adding the minmum and maximum lines
    svg
        .selectAll("endLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) {
            return (y(d.key) + y.bandwidth() / 4)
        })
        .attr("y2", function (d) {
            return (y(d.key) + 3 * (y.bandwidth() / 4))
        })
        .attr("x1", function (d) {
            return (x(d.value.min))
        })
        .attr("x2", function (d) {
            return (x(d.value.min))
        })
        .attr("stroke", "black")
        .style("width", 80)

    svg
        .selectAll("endLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function (d) {
            return (y(d.key) + y.bandwidth() / 4)
        })
        .attr("y2", function (d) {
            return (y(d.key) + 3 * (y.bandwidth() / 4))
        })
        .attr("x1", function (d) {
            return (x(d.value.max))
        })
        .attr("x2", function (d) {
            return (x(d.value.max))
        })
        .attr("stroke", "black")
        .style("width", 80)

    drawUserSelection(svg, selectedUsersDraw);
}

function drawUserSelection(svg, selectedUsersDraw) {


    // Add individual points with jitter
    var jitterWidth = 50
    svg
        .selectAll("indPoints")
        .data(selectedUsersDraw)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return (x(d.totalDuration))
        })
        .attr("cy", function (d) {
            return (9 * (y.bandwidth() / 8) - jitterWidth / 2 + Math.random() * jitterWidth)
        })
        .attr("r", 5)
        .style("fill", "#4477BD")
        .attr("stroke", "black")
        .on("mouseover", function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 1)
            tooltip
                .html("<span>" + "User: " + d.user + '<br>' + "Total Duration: " + d.totalDuration + " ms </span>")
                .style("left", (d3.mouse(this)[0] + 30) + "px")
                .style("top", (d3.mouse(this)[1] + 30) + "px")
        })
        .on("mouseleave", function (d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        })
}



function createDownloadButtonsBoxplot(name) {
    // creates button
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    downloadButton.id = name + '.downloadButton_boxplot';
    downloadButton.value = 'Download boxplot of ' + name.substring(0, name.indexOf('.')) + " as .svg";

    // adds event listener which runs the actual download function
    downloadButton.addEventListener("click", function () {
        downloadBoxplot(downloadButton.id.substring(0, downloadButton.id.lastIndexOf('.')) + '/svg', false);
    });

    // appends the newly created button to the div with all scanpath buttons
    var downloadDiv = document.querySelector('#downloadButtonsBoxplot');
    downloadDiv.appendChild(downloadButton);
}

function downloadBoxplot(name, multiple) {
    var svg = document.getElementById(name);

    // I need to look into what XML does/is, but this gets some source of the svg
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    // as above, description said 'adds namespaces'
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    var encodedData = window.btoa(source);

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    if (multiple) {
        return encodedData;
    } else {
        // actual bit which downloads the file passed in the url / URI data scheme
        var link = document.createElement("a");
        link.download = name.substring(0, name.indexOf(".")) + "_boxplot" + '.svg';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

   // d3.select('#'+ name).select('#backgroundImageBoxplotDownload').remove();
}
