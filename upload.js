const form = document.querySelector('form')

// adds listener to the submit button
// when the button is clicked the .csv file is read as a text file
form.addEventListener('submit', e => {
	e.preventDefault()

	const file = document.querySelector('[type=file]').files[0];
	const reader = new FileReader();

  // d3.tsv reads csv (commas) but with tabs from an URL
	// since our file is uploaded by the user we don't have an URL
	// below is a workaround for this, which loads it during the callback
	// can't seem to move it to separate function call
	reader.addEventListener("load", function() {
			d3.tsv(reader.result).then(function(data) {
				data.forEach(function(d) {
					d.Timestamp = +d.Timestamp;
					d.FixationIndex = +d.FixationIndex;
					d.FixationDuration = +d.FixationDuration;
					d.MappedFixationPointX = +d.MappedFixationPointX;
					d.MappedFixationPointY = +d.MappedFixationPointY;
				});

				groupingStimuli(data);
	}, false);

	if (file) {
		reader.readAsDataURL(file);
	}
})

// groupedByStimuli is an array of objects. each object has the
// StimuliName as a key and the others are values
// can use this for counting, means, sums, multi-level indexing
function groupingStimuli(data) {
	var groupedByStimuli = d3.nest()
		.key(function(d) { return d.StimuliName; })
		.entries(data);
	console.log(groupedByStimuli)
}
