const form = document.querySelector('form')

// adds listener to the submit button
// when the button is clicked the .csv file is read as a text file

// INTERNET EXPLORER GIVES A SYNTAX ERROR HERE, CHANGE THIS TO NORMAL
// FUNCTION/EVENT CALL SO THAT THERE IS HOPE FOR INTERNET EXPLORER
form.addEventListener('submit', e => {
	e.preventDefault()

	const file = document.querySelector('[type=file]').files[0];
	const reader = new FileReader();

	// since our file is uploaded by the user we don't have an URL
	// below is a workaround for this, which loads it during the callback
	reader.onload = function(){ simpleGraph(reader.result) };

	if (file) {
		reader.readAsDataURL(file);
		}
})

// d3.tsv reads csv (commas) but with tabs from an URL, data is the result
function loadCSV(content) {
	d3.tsv(content).then(function(data) {
		data.forEach(function(d) {
			d.Timestamp = +d.Timestamp;
			d.FixationIndex = +d.FixationIndex;
			d.FixationDuration = +d.FixationDuration;
			d.MappedFixationPointX = +d.MappedFixationPointX;
			d.MappedFixationPointY = +d.MappedFixationPointY;
		});

		groupingStimuli(data);
}, false);
}

// groupedByStimuli is an array of objects. each object has the
// StimuliName as a key and the others are values
// can use this for counting, means, sums, multi-level indexing
function groupingStimuli(data) {
	var groupedByStimuli = d3.nest()
		.key(function(d) { return d.StimuliName; })
		.entries(data);
}

// THIS GRAPH DOES NOT ACTUALLY DISPLAY ANYTHING THAT MAKES SENSE!
// LINE GRAPH OF FixationDuration VS. Timestamp
// HOWEVER, THE SETTINGS FOR THE DATA READING, TIME PARSING, TIME FORMATTING,
// X-AXIS TICKS, LABELS, TITLE ARE USEFUL
function simpleGraph(content) {
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
	    .x(function(d) { return x(d.Timestamp); })
	    .y(function(d) { return y(d.FixationDuration); });

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");

	// Get the data
	d3.tsv(content).then(function(data) {

	  // format the data
	  data = data.filter(function(d) {
				if(isNaN(d.FixationDuration) || isNaN(d.Timestamp)){
            return false;
        }
				d.Timestamp = parseTime(msToTime(+d.Timestamp));
				//d.Timestamp = parseTime(d.Timestamp);
	      d.FixationDuration = (+d.FixationDuration/1000);
				return true;
	  });

	  // Scale the range of the data
	  x.domain(d3.extent(data, function(d) { return d.Timestamp; }));
	  y.domain([0, d3.max(data, function(d) { return d.FixationDuration; })]);

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
        .text("Useless visualization, but can use parsing/labels/text settings");
	});
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
