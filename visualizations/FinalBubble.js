var array_stimuli_bubblemap = [];
var numberBubblemaps = -1;

var array_bubblemap = [];							// make an array to store d.coordinates
var duplicates = [];					// count how many duplicates in array
var gridSize = 100;
var gridSizeSlider = document.getElementById("grid_size_slider");

var contentBubblemap;
var nameBubblemap;
var widthBubblemap;
var heightBubblemap;
var idNameBubblemap;
var hasImgBubblemap;

var image1;

function attachImgBubblemap(svg) {
    if (hasImgBubblemap) {
        var imageBackBubblemap = document.querySelector('#bubblemap');
        var childImageBubblemap = imageBackBubblemap.querySelectorAll("div");
        var numberFileBubblemap = -1;
        var width;
        var height;

        for (var i = 0; i < childImageBubblemap.length; i++) {
            if (childImageBubblemap[i].id.substring(1, childImageBubblemap[i].id.lastIndexOf('_')) + '.jpg' === nameBubblemap) {
                width = childImageBubblemap[i].style.width;
                height = childImageBubblemap[i].style.height;
                childImageBubblemap[i].style.backgroundImage = "";
                numberFileBubblemap = i;
            }
        }

        if (numberFileBubblemap > -1) {
            const imagesFile = document.querySelector('#stimuli-input').files[numberFileBubblemap];

            const imagesFileReader = new FileReader();

            imagesFileReader.addEventListener('load', function () {
                var image = svg.selectAll('image')
                    .data([0]);
                image.enter().append("svg:image").attr("xlink:href", imagesFileReader.result)
                    .attr('width', width)
                    .attr('height', height)
                    .attr('id', 'imageForDownload');

                const objectURL = URL.createObjectURL(imagesFile);

                image1 = svg.append("svg:image").attr("height", height)
                    .attr("width", width).attr("xlink:href", objectURL).attr('id', 'imageblob');

                createBubblemap(svg);
            }, false);

            if (imagesFile) {
                imagesFileReader.readAsDataURL(imagesFile)
            }

        }
    } else {
        createBubblemap(svg);
    }
}

function bubblemapInit() {
    // create svg
    var svg = d3.select(idNameBubblemap)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "bubblemap_" + numberBubblemaps);

    //.attr("transform", "translate(" + 100 + "," + 100 + ")");

    attachImgBubblemap(svg);
}

function bubbleMap(content, name, width, height, idName, hasImg, vars) {
    if (typeof vars == 'object') {
        updateVarsBubblemap(vars);
    }

    contentBubblemap = content;
    nameBubblemap = name;
    widthBubblemap = width;
    heightBubblemap = height;
    idNameBubblemap = idName;
    hasImgBubblemap = hasImg;

    array_stimuli_bubblemap.push(name);
    numberBubblemaps += 1;

    bubblemapInit();
}

function updateVarsBubblemap(vars) {
    if (typeof vars.gridsize == 'number') {
        gridSize = vars.gridsize;
        gridSizeSlider.value = vars.gridsize;
    }
}

function createBubblemap(svg) {
    svg.append('g');


    var div = d3.select("body").append("div")	// Define the div for the tooltip
        .attr("class", "tooltip")
        .style("opacity", 0);

    // read the data
    data_bubblemap = contentBubblemap.filter(function (d) {
        if (d.StimuliName !== nameBubblemap) {
            return false;
        }
        //   d.MappedFixationPointY = -d.MappedFixationPointY;
        return true;
    });

    data_bubblemap.forEach(function (d) {
        d.averageX = Math.round(d.MappedFixationPointX / gridSize) * gridSize;
        d.averageY = Math.round(d.MappedFixationPointY / gridSize) * gridSize;
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

    data_bubblemap.forEach(function (d) {							// average duration
        d.duration = d.FixationDuration;
        data_bubblemap.forEach(function (e) {
            if (d.coordinates == e.coordinates) {
                d.duration = +d.duration + +e.FixationDuration;
            }
        })
    });

    data_bubblemap.forEach(function (d) {							// round average duration
        d.duration = Math.round(d.duration / d.counts);
    });

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
        .domain([0, 200])
        .range([0, 100]);

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
            return "bubbles"
        })
        // required styling so that it is visible in the download
        .attr("stroke-width", '1px')
        .attr("opacity", .6)
        .attr("fill", '#7cc4f4')
        .attr("stroke", 'black')
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
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 1);
            div.html("Fixations: " + d.counts + '<br>' + "Average duration: " + d.duration + "ms")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    //zoom properties
    var zoom = d3.zoom()
        .scaleExtent([1, 5])  // This control how much you can unzoom (x0.5) and zoom (x10)
        .extent([[0, 0], [width, height]])
        .on("zoom", updateZoom)
        .on('end', function () {
            if (d3.event.transform !== d3.zoomIdentity) {
                console.log("zoom.end", d3.event.transform, d3.zoomIdentity);
                svg.transition()
                    .delay(2500)
                    .call(d3.event.target.transform, d3.zoomIdentity);
            }
        });

    svg.call(zoom);

    // .on("mousedown.zoom", null)

    function updateZoom() {
        const transform = d3.zoomTransform(svg.node());

        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);
        var newZ = d3.scaleSqrt()
            .domain([0, 200])
            .range([0, (100 * d3.event.transform.k)]); //multiply range by scale factor

        svg.selectAll("circle")
            .attr('cx', function (d) {
                return newX(d.averageX);
            })
            .attr('cy', function (d) {
                return newY(d.averageY);
            })
            .attr("r", function (d) {
                return newZ(d.counts);
            });

        svg.style("transform-origin", "50% 50% 0");
        if (hasImgBubblemap) {
            image1.attr("transform", d3.event.transform)
                .on("mousedown.zoom", null)
                .on("move.zoom", null);
        }
    }

//=========================================================================
//=========================================================================
// Redraw bubbles
// Same code, only different grid size!
//=========================================================================
//=========================================================================

    gridSizeSlider.oninput = function () {
        gridSize = this.value;
        array_bubblemap = [];							// make an array to store d.coordinates
        duplicates = [];					// count how many duplicates in array

        for (a = 0; a <= numberBubblemaps; a++) {
            var svg = d3.select(document.getElementById('bubblemap_' + a));

            // read the data
            data_bubblemap = contentBubblemap.filter(function (d) {
                if (d.StimuliName !== array_stimuli_bubblemap[a]) {
                    return false;
                }
                //   d.MappedFixationPointY = -d.MappedFixationPointY;
                return true;
            });

            data_bubblemap.forEach(function (d) {
                d.averageX = Math.round(d.MappedFixationPointX / gridSize) * gridSize;
                d.averageY = Math.round(d.MappedFixationPointY / gridSize) * gridSize;
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

            data_bubblemap.forEach(function (d) {							// average duration
                d.duration = d.FixationDuration;
                data_bubblemap.forEach(function (e) {
                    if (d.coordinates == e.coordinates) {
                        d.duration = +d.duration + +e.FixationDuration;
                    }
                })
            });

            data_bubblemap.forEach(function (d) {							// round average duration
                d.duration = Math.round(d.duration / d.counts);
            });

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
                .domain([0, 200])
                .range([0, 100]);

            //=========================================================================
            // Bubbles
            //=========================================================================
            svg.select('g').remove('g');

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
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 1);
                    div.html("Fixations: " + d.counts + '<br>' + "Average duration: " + d.duration + "ms")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function (d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            svg.call(zoom);
        }
    }
}

function createDownloadButtonsBubblemap(name) {
    // creates button
    var downloadButton = document.createElement('input');
    downloadButton.type = 'button';
    let correctNumBubblemap = numberBubblemaps + 1;
    downloadButton.id = name + '.downloadButton_bubblemap' + '/' + correctNumBubblemap;
    downloadButton.value = 'Download bubble chart of ' + name.substring(0, name.indexOf('.')) + " as .svg";

    // adds event listener which runs the actual download function
    downloadButton.addEventListener("click", function () {
        downloadBubblemap(downloadButton.id)
    });

    // appends the newly created button to the div with all bubblemap buttons
    var downloadDiv = document.querySelector('#downloadButtonsBubblemap');
    downloadDiv.appendChild(downloadButton);
}

function xmlSvgBubblemap(name, svg) {
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

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    // doesn't load the image attribute but just 'no image thumbnial'-thing
    // actual bit which downloads the file passed in the url / URI data scheme
    var link = document.createElement("a");
    link.download = name.substring(0, name.indexOf(".")) + "_bubblemap" + '.svg';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // d3.select('#bubblemap' + num_of_bubblemap).select('#backgroundImageBubblemapDownload').remove();
}

function downloadBubblemap(name) {
    var num_of_bubblemap = name.substring(name.indexOf('/') + 1, name.length);

    var removingImgBlob = d3.select('#bubblemap_' + num_of_bubblemap);
    removingImgBlob.select('#imageblob').attr('opacity', 0);

    var svgDownload = document.getElementById("bubblemap_" + num_of_bubblemap);

    xmlSvgBubblemap(name, svgDownload);

    removingImgBlob.select('#imageblob').attr('opacity', 1);
}
