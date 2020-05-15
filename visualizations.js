var initialRead;
var fileLocation;

document.addEventListener("DOMContentLoaded", function () {
    loadCSV();
});

// d3.tsv reads csv (commas) but with tabs from an URL, data is the result
function loadCSV() {
    fileLocation = "./uploads/" + localStorage.getItem("dataFilename");
    d3.tsv(fileLocation).then(function (data) {
        data.forEach(function (d) {
            var output = "";
            var input = d.StimuliName;
            for (var i = 0; i < d.StimuliName.length; i++) {
                var charCode = input.charCodeAt(i);
                if (charCode <= 127 || (charCode >= 161 && charCode <= 255)) {
                    output += input.charAt(i);
                }
            }
            d.StimuliName = output;
            d.Timestamp = +d.Timestamp;
            d.FixationIndex = +d.FixationIndex;
            d.FixationDuration = +d.FixationDuration;
            d.MappedFixationPointX = +d.MappedFixationPointX;
            d.MappedFixationPointY = +d.MappedFixationPointY;
        });
        data = data.sort(sortByDateAscending);
        createVisualizations(data)
        // create localStorage with initialRead
        // max storage size is at least 5MB, however, initialRead probably greater than that
        // might want to just re-read it in visualizations.js, probably the easiest I think maybe presumably
    }, false);
}

function sortByDateAscending(a, b) {
    return a.Timestamp - b.Timestamp;
}

function createVisualizations(data) {
    var selected = JSON.parse(localStorage.getItem("selectedStimuli"))

    for (var i = 0; i < selected.length; i++) {
        //simpleGraph(data, selected[i]);
        //scatterplot(data, selected[i]);
        //heatmaps(data, selected[i]);
        loadingImage(data, selected[i]);
    }
}

function loadingImage(content, name) {
    var stimuliLocationURL = "url(" + "'" + "./stimuli/" + name + "')";

    var bubblemapImage = document.querySelector('#bubblemap');
    var heatmapImage = document.querySelector('#heatmap');
    var scatterplotImage = document.querySelector('#scatterplot');

    bubblemapImage.style.backgroundImage = stimuliLocationURL;
    bubblemapImage.style.backgroundRepeat = 'no-repeat';
    heatmapImage.style.backgroundImage = stimuliLocationURL;
    heatmapImage.style.backgroundRepeat = 'no-repeat';
    scatterplotImage.style.backgroundImage = stimuliLocationURL;
    scatterplotImage.style.backgroundRepeat = 'no-repeat';

    // turning this opacity down also turns down the opacity of the plot
    // attempted to fix by creating a div inside the div and overlaying the two
    // however, changing image width/height of background image is completely ignored for some reason
    // heatmapImage.style.opacity = '0.5';

    // var sctrPlot = document.querySelector('#scatterplot');
    // sctrPlot.style.position = 'relative';
    // sctrPlot.style.display = 'block';

    function getMeta(url, callback) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            callback(this.width, this.height);
        }
    }

    getMeta(
        "./stimuli/" + name,
        function (width, height) {
            let styleWidth = "'" + width + "'";
            let styleHeight = "'" + height + "'";
            bubblemapImage.style.width = styleWidth;
            bubblemapImage.style.height = styleHeight;
            heatmapImage.style.width = styleWidth;
            heatmapImage.style.height = styleHeight;
            scatterplotImage.style.width = styleWidth;
            scatterplotImage.style.height = styleHeight;

            bubbleMap(content, name, width, height);
            heatmaps(content, name, width, height);
            scatterplot(content, name, width, height);
        });
}

function bubbleMap(content, name, width, height) {

    // create svg
    var svg = d3.select("#bubblemap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append('g')
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
        d.averageX = Math.round(d.MappedFixationPointX / 100) * 100;
        d.averageY = Math.round(d.MappedFixationPointY / 100) * 100;
        d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
    });

    /*d3.tsv("https://raw.githubusercontent.com/AnnikaLarissa/MetroMap/master/all_fixation_data_cleaned_up.csv", function(error, data) {
    data = data.filter(function (d) {
        return (d.StimuliName == stimulus);
    });

    data.forEach(function(d) {
        d.averageX = Math.round( d.MappedFixationPointX/100) *100;
        d.averageY = Math.round( d.MappedFixationPointY/100) *100;
        d.coordinates = d.averageX.toString() + " " + d.averageY.toString()
    });*/

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
        .domain([0, 200])
        .range([0, 100]);

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

function heatmaps(content, name, width, height) {
    div = d3.select('#heatmap');
    canvasLayer = div.append('canvas').attr('id', 'canvas').attr('width', width).attr('height', height);

    var heat = simpleheat('canvas');

    dataHeat = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        //   d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    // creates d3 file thing with only the coordinates
    // not necessary but figured it might make things easier
    var coords = dataHeat.map(function (d) {
        return {
            MappedFixationPointX: d.MappedFixationPointX,
            MappedFixationPointY: d.MappedFixationPointY,
        }
    });

    // converts data in to the [[x1,y1,val],...,[xn,yn,valn]] format
    heat.data(coords.map(function (d) {
        return [d.MappedFixationPointX, d.MappedFixationPointY, 1]
    }));

    var concentration = 5;

    // changes how red things are
    // add slider or value insertion for this because maps differ a lot in concentration
    heat.max(concentration);

    // set point radius and blur radius (25 and 15 by default)
    heat.radius(25, 15);

    // optionally customize gradient colors, e.g. below
    // (would be nicer if d3 color scale worked here)
    // not all colours seem to work
    //heat.gradient({0: '#0000FF', 0.5: '#00FF00', 1: '#FF0000'});

    // draws the heatmap
    heat.draw();
}

function scatterplot(content, name, width, height) {
    // set the dimensions and margins of the graph
    //var margin = {top: 0, right: 0, bottom: 0, left: 0};
    // var margin = {top: 10, right: 30, bottom: 30, left: 60},
    //   width = 1650 - margin.left - margin.right,
    //    height = 1200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#scatterplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    data = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, width])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-height, 0])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x(d.MappedFixationPointX);
        })
        .attr("cy", function (d) {
            return y(d.MappedFixationPointY);
        })
        .attr("r", 5)
        .style("fill-opacity", "1")
        .style("fill", "#FF0000");

    var clusterPoints = [];
    var clusterRange = 45;

    svg.append('g')
        .attr('class', 'grid');

    for (var x = 0; x <= width; x += clusterRange) {
        for (var y = 0; y <= height; y += clusterRange) {
            svg.append('g').append('rect')
                .attr({
                    x: x,
                    y: y,
                    width: clusterRange,
                    height: clusterRange,
                    class: "grid"
                });
        }
    }
}

//                background: url('./stimuli/01_Antwerpen_S1.jpg') no-repeat;

// THIS GRAPH DOES NOT ACTUALLY DISPLAY ANYTHING THAT MAKES SENSE!
// LINE GRAPH OF FixationDuration VS. Timestamp
// HOWEVER, THE SETTINGS FOR THE DATA READING, TIME PARSING, TIME FORMATTING,
// X-AXIS TICKS, LABELS, TITLE ARE USEFUL
function simpleGraph(content, name) {
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 20, bottom: 50, left: 70},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%M:%S.%L");
    var formatTime = d3.timeFormat("%M:%S.%L");

    // set the ranges
    // .nice() makes the range look better
    var x = d3.scaleTime().range([0, width]).nice();
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.Timestamp);
        })
        .y(function (d) {
            return y(d.FixationDuration);
        });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#useless")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data = content.filter(function (d) {
        if (d.StimuliName !== name) {
            return false;
        }
        d.Timestamp = parseTime(msToTime(+d.Timestamp));
        //d.Timestamp = parseTime(d.Timestamp);
        d.FixationDuration = (+d.FixationDuration / 1000);
        return true;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.Timestamp;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.FixationDuration;
    })]);

    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the x Axis
    //the .tickFormat remove the hours and .ticks decides spacing
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%M"))
            .ticks(d3.timeMinute.every(2)));

    // Add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left / (1.5))
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Fixation Duration (s)");

    // text label for the x axis
    svg.append("text")
    //.attr("transform",
    //    "translate(" + (width/2) + " ," +
    //                 (height + margin.top + 20) + ")")
        .attr("x", (width / 2))
        .attr("y", height + margin.top / 2)
        .style("text-anchor", "middle")
        .text("Timestamp (mins)");

    // graph title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - 20)
        //.attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Useless visualization of " + name + ", but can use parsing/labels/text settings");
}

// Convertes the timestamps into format of "%M:%S:%L"
function msToTime(timestamp) {
    var milliseconds = parseInt((timestamp % 1000) / 100),
        seconds = Math.floor((timestamp / 1000) % 60),
        minutes = Math.floor((timestamp / (1000 * 60)) % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // parsing as "%M:%S:%L"
    return minutes + ":" + seconds + "." + milliseconds;
}

