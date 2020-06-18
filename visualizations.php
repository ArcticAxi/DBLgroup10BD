<?php ?>
<div class="sidebar">

        <p class="devider">User Selection</p>

        <div class="slidecontainer">
        <div class="buttoncontainer" id="highlighted_user">
            <p>Click on user to highlight</p>
            <p>Click again to undo</p>
        </div>
        </div>
        
        <p class="devider">Scanpath</p>
        <div class="slidecontainer">
            <div class="left_elem" id="base_stroke_width">
                 <p>Base path width:<div data-tooltip="Increase or decrease the width of the connections between fixations">
                    <i class="fa fa-question" style="font-size:20px"></i></div></p>
                <input type="range" min="1" max="10" value="1" class="slider" id="base_stroke_width_slider">
            </div>
            <div id="highlight_stroke_width">
                <p>Highlight Path Width:<div data-tooltip="Increase or decrease the width of highlighted paths for better clarity">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="1" max="10" value="3" class="slider" id="highlight_stroke_width_slider">
            </div>
        
            <div class="left_elem" id="base_stroke_opacity">
                <p>Base Path Opacity<div data-tooltip="Decrease if necessary to see both the background picture and the paths">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="10" value="7" class="slider" id="base_stroke_opacity_slider">
            </div>
            <div id="highlight_stroke_opacity">
                <p>Highlight Path Opacity:<div data-tooltip="Decrease if necessary to see both the background picture and the highlighted paths">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="10" value="10" class="slider" id="highlight_stroke_opacity_slider">
            </div>
        
            <div class="left_elem" id="base_fixation_radius">
                <p>Base Fixation Size:<div data-tooltip = "Increase or decrease the size of individual fixations">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="15" value="3" class="slider" id="base_fixation_radius_slider">
            </div>
            <div id="highlight_fixation_radius">
                <p>Highlight Fixation Size:<div data-tooltip = "Increase the size of individual highlighted fixations">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="15" value="6" class="slider" id="highlight_fixation_radius_slider">
            </div>
                
            <div class="left_elem" id="base_fixation_opacity">
                <p>Base Fixation Opacity:<div data-tooltip= "Decrease if necessary to see both the background picture and the fixations">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="10" value="7" class="slider" id="base_fixation_opacity_slider">
            </div>
            <div id="highlight_fixation_opacity">
                <p>Highlight Fixation Opacity:<div data-tooltip = "Decrease if necessary to see both the background picture and the highlighted fixations">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="10" value="10" class="slider" id="highlight_fixation_opacity_slider">
            </div>

            <div class="buttoncontainer" id = "base_colours">
                <p>Select base path and fixation color:</p>
                <input type="button" id = "dark_blue_base" value = "Blue" name="base_colour">
                <input type="button" id = "black_base" value = "Black" name="base_colour">
            </div>
        </div>
        

        <p class="devider">Bubblemap</p>
        <div class="slidecontainer">
            <div id="grid_size">
                <p> Change grid size: <div data-tooltip = "Increase for more and smaller bubbles, decrease for less and bigger bubbles">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="1" max="150" value="100" class="slider" id="grid_size_slider">
            </div>
        </div>

        <p class="devider">Heatmap</p>

        <div class="slidecontainer" id="all_heatmap_sliders">
            <div id="intensity_heatmap">
                <p>Intensity:<div data-tooltip = "Slide to the left for more intense colors, slide to the right for less intense colors">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="1" max="30" value="5" class="slider" id="intensity_slider_heatmap">
            </div>
            <div class="left_elem" id="radius_heatmap">
                <p>Radius:<div data-tooltip = "Increase or decrease size of each observation">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="1" max="10" value="6" class="slider" id="radius_slider_heatmap">
            </div>
            <div id="blur_heatmap">
                <p>Blur:<div data-tooltip = "Decrease the blur for more information on particular points or increase for a more general view">
                    <i class="fa fa-question" style="font-size:20px"></i>
                </div></p>
                <input type="range" min="0" max="10" value="10" class="slider" id="blur_slider_heatmap">
            </div>
            <p> Checking the checkbox next to the timestamp slider shows a 2-second interval of fixations around the selected timestamp. </p>
            <p> When the checkbox is unchecked it shows the cumulative fixations upto the selected timestamp. </p>
       

        <div class="buttoncontainer" id="heatmap_rainbow">
            <p> Click this button to turn the heatmap colors to those of a rainbow. </p>
            <p> For optimal effect, please lower the intensity and radius. </p>
            <input type="button" id="rainbow_button" value="Toggle Rainbow">
        </div>
    </div>

        <p class="devider">Download</p>

        <div id="downloadButtons" class="buttoncontainer">
            <div id="downloadVariables">
                <input type="button" id="downloadVarsButton" value="Download variables file">
                <a id="downloadVarsElement" style="display:none"></a>
            </div>
            <div id="downloadButtonsScanpath">
            </div>
            <div id="downloadButtonsBubblemap">
            </div>
            <div id="downloadButtonsHeatmap">
            </div>
            <div id="downloadButtonsBoxplot">
            </div>
            <div id="downloadButtonsAll">
            </div>
        </div>
    </div>
	
	<div id="xycoordinates" class="coordinate">
	</div>

    <div class="visualization" id="scanpath">
    </div>
	
    <div class="visualization" id="bubblemap">
    </div>

    <div class="visualization" id="heatmap">
    </div>

    <div class="visualization" id="boxplot">
    </div>

    <script src="visualizations/scanpath.js"></script>
    <script src="visualizations/simpleheat.js"></script>
    <script src="visualizations/heatmap.js"></script>
    <script src="visualizations/bubblemap.js"></script>
    <script src="visualizations/testBox.js"></script>
    <script src="visualizations/visualizations.js" charset="utf-8"></script>
	<script>
	document.getElementById('bubblemap').addEventListener('mousemove', printPosition)

    document.getElementById('heatmap').addEventListener('mousemove', printPosition)

	document.getElementById('scanpath').addEventListener('mousemove',printPosition)
	
	function getPosition(e) {
	var rect = e.target.getBoundingClientRect();
	var x = ~~(e.clientX - rect.left);
	var y = ~~(e.clientY - rect.top);
	document.getElementById("xycoordinates").innerHTML="Coordinates: (" + x + "," + y + ")";
	return {
		x,
		y
	}
	}

	function printPosition(e) {
	var position = getPosition(e);
	}
	</script>

