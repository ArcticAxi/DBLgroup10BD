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
            simpleGraph(data, selected[i]);
    }
}

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
    var svg = d3.select("body").append("svg")
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
        .attr("y", 0 - margin.left/(1.5))
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Fixation Duration (s)");

    // text label for the x axis
    svg.append("text")
    //.attr("transform",
    //    "translate(" + (width/2) + " ," +
    //                 (height + margin.top + 20) + ")")
        .attr("x", (width/2))
        .attr("y", height + margin.top/2)
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

