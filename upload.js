const form = document.querySelector('form')

// adds listener to the submit button
// when the button is clicked the .csv file is read as a text file
form.addEventListener('submit', e => {
	e.preventDefault()

	const file = document.querySelector('[type=file]').files[0];

	const formData = new FormData();

	// reads .csv as text
	var reader = new FileReader();
	reader.readAsText(file, 'UTF-8');

	reader.onload = readerEvent => {
		var content = readerEvent.target.result;
		processCSV(content);
	}
})

// splits the tabs of the text file into array elements
function processCSV(allText) {
	var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split('	');
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split('	');
        if (data.length == headers.length) {
            var tarr = [];
            for (var j = 0; j < headers.length; j++) {
                tarr.push(headers[j] + ":" + data[j]);
            }
            lines.push(tarr);
        }
    }
	parseCSV(lines);
}

// sorts the array elements to be grouped by same StimuliName
// if they have the same StimuliName they are added to grouped
// if not, then grouped is added to groupedArray
function parseCSV(arrayText) {
	var prevMap = "NULL";
	var groupedArray = [];
	var sameStimuli = [];
	var j = 0;

	for (var i = 0; i < arrayText.length; i++) {
		if (arrayText[i][1] == prevMap) {
			var temp = [];
			for (var k = 0; k < arrayText[i].length; k++) {
                temp.push(arrayText[i][k]);
            }
			sameStimuli.push(temp);
		}
		else if (arrayText[i][1] !== prevMap) {
			if (sameStimuli.length !== 0) {
				groupedArray[j] = sameStimuli;
				sameStimuli = [];
				j++;
			}
			var temp = [];
            for (var k = 0; k < arrayText[i].length; k++) {
                temp.push(arrayText[i][k]);
            }
			sameStimuli.push(temp);
			prevMap = arrayText[i][1];
		}
	}
	console.log(groupedArray);
}
