

var stimulus = "01_Antwerpen_S1.jpg";


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 50, left: 120},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



// Read the data and compute summary statistics for each specie
d3.tsv("https://raw.githubusercontent.com/AnnikaLarissa/MetroMap/master/all_fixation_data_cleaned_up.csv", function(error, data) {
	data = data.filter(function (d) {
		return (d.StimuliName == stimulus);
		
	});
	
	data.forEach(function(d) {							// average duration
		d.totalDuration = d.FixationDuration;
		data.forEach(function(e) {
			if (d.user == e.user && d.StimuliName == e.StimuliName) {
				d.totalDuration = +d.totalDuration + +e.FixationDuration;
			}
		})
		d.stimuliUser = d.StimuliName.toString() + " " + d.user.toString()
	})

	var dubbles = [...new Set(data.map(function(d) {		// coordinates as array called coord
		return d.stimuliUser;
	}))]

	var noDubbles = dubbles.map(function(d) {				// create array of objects without duplicates (coordinates)
		return data.find(function(e) {
			return e.stimuliUser === d
		})
	});
	console.log(noDubbles)


  // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.StimuliName;})
    .rollup(function(d) {
      q1 = d3.quantile(d.map(function(g) { return g.noDubbles;}).sort(d3.ascending),.25)
      median = d3.quantile(d.map(function(g) { return g.noDubbles;}).sort(d3.ascending),.5)
      q3 = d3.quantile(d.map(function(g) { return g.noDubbles;}).sort(d3.ascending),.75)
      interQuantileRange = q3 - q1
      min = q1 - 1.5 * interQuantileRange
      max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
    })
    .entries(data)



  // Show the Y scale
  var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain([stimulus])
    .padding(.4);
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()



  // Show the X scale
  var max = d3.max(data, function(d) { return d.totalDuration; } );
  var x = d3.scaleLinear()
    .domain([4,max])
    .range([0, width])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5))
    .select(".domain").remove()



  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text("Duration");



  // Show the main vertical line
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.value.min))})
      .attr("x2", function(d){return(x(d.value.max))})
      .attr("y1", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("stroke", "black")
      .style("width", 40)



  // rectangle for the main box
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.value.q1))}) // console.log(x(d.value.q1)) ;
        .attr("width", function(d){ ; return(x(d.value.q3)-x(d.value.q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function(d) { return y(d.key); })
        .attr("height", y.bandwidth() )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)



  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("y1", function(d){return(y(d.key))})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("x1", function(d){return(x(d.value.median))})
      .attr("x2", function(d){return(x(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80)

})
