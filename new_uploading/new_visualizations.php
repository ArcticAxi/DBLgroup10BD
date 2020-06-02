<div class="slidecontainer">
        <div class="left_elem" id="base_stroke_width">
            <p> Base Path Width: </p>
            <input type="range" min="1" max="10" value="1" class="slider" id="base_stroke_width_slider">
        </div>
        <div id="highlight_stroke_width">
            <p> Highlight Path Width: </p>
            <input type="range" min="1" max="10" value="3" class="slider" id="highlight_stroke_width_slider">
        </div>
    </div>

    <div class="slidecontainer">
        <div class="left_elem" id="base_stroke_opacity">
            <p> Base Path Opacity: </p>
            <input type="range" min="0" max="10" value="7" class="slider" id="base_stroke_opacity_slider">
        </div>
        <div id="highlight_stroke_opacity">
            <p> Highlight Path Opacity: </p>
            <input type="range" min="0" max="10" value="10" class="slider" id="highlight_stroke_opacity_slider">
        </div>
    </div>

    <div class="slidecontainer">
        <div class="left_elem" id="base_fixation_radius">
            <p> Base Fixation Size: </p>
            <input type="range" min="0" max="15" value="3" class="slider" id="base_fixation_radius_slider">
        </div>
        <div id="highlight_fixation_radius">
            <p> Highlight Fixation Size: </p>
            <input type="range" min="0" max="15" value="6" class="slider" id="highlight_fixation_radius_slider">
        </div>
    </div>

    <div class="slidecontainer">
        <div class="left_elem" id="base_fixation_opacity">
            <p> Base Fixation Opacity: </p>
            <input type="range" min="0" max="10" value="7" class="slider" id="base_fixation_opacity_slider">
        </div>
        <div id="highlight_fixation_opacity">
            <p> Highlight Fixation Opacity: </p>
            <input type="range" min="0" max="10" value="10" class="slider" id="highlight_fixation_opacity_slider">
        </div>
    </div>

    <div class="buttoncontainer" id = "base_colours">
        <p>Select base path and fixation color:</p>
        <input type="button" id = "dark_blue_base" value = "Blue" name="base_colour">
        <input type="button" id = "black_base" value = "Black" name="base_colour">
    </div>

    <div class="buttoncontainer" id="highlighted_user">
        <p> User selection here is linked to the heat map. </p>
        <p>Click on user to highlight</p>
        <p>Click again to undo</p>
    </div>

    <div class="visualization" id="scanpath">
    </div>

    <p> The 'Gazes: x' should say 'Fixations: x'</p>
    <div class="visualization" id="bubblemap">
    </div>

    <div class="slidecontainer" id="all_heatmap_sliders">
        <div id="intensity_heatmap">
            <p>Intensity:</p>
            <input type="range" min="1" max="30" value="5" class="slider" id="intensity_slider_heatmap">
        </div>
        <div class="left_elem" id="radius_heatmap">
            <p>Radius:</p>
            <input type="range" min="1" max="10" value="6" class="slider" id="radius_slider_heatmap">
        </div>
        <div id="blur_heatmap">
            <p>Blur:</p>
            <input type="range" min="0" max="10" value="10" class="slider" id="blur_slider_heatmap">
        </div>
        <p> Checking the checkbox next to the timestamp slider shows a 2-second interval of fixations around the selected timestamp. </p>
        <p> When the checkbox is unchecked it shows the cumulative fixations upto the selected timestamp. </p>
    </div>

    <div class="visualization" id="heatmap">
    </div>

    <div id="downloadButtons">

    </div>

    <script scr="../visualizations/html2canvas.js"></script>
    <script src="../visualizations/simpleheat.js"></script>
    <script src="../visualizations/new_heatmap.js"></script>
    <script src="../visualizations/bubblemap.js"></script>
    <script src="../visualizations/scanpath.js"></script>
    <script src="new_visualizations.js" charset="utf-8"></script>

