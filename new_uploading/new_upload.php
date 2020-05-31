<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
    <link rel="stylesheet" href="../style.css">

    <script src="https://d3js.org/d3.v5.js" charset="utf-8"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" charset="utf-8"></script>

    <title>Upload Files</title>
    <link rel="icon" href="../photos_homepage/logosmall.svg">
</head>

<body>

<div class="upload">
    <div class="title">

        <div class="homelink">
            <a href="../index.html"> <img src="../photos_homepage/logoiFish.png" height="70"> </a>
        </div>

        <div class="vizlink">
            <a href='../visualizations.html' style="color:black">Visualizations</a>
        </div>

        <div class="uploadlink">
            <a href="../upload.html" style="color:black">Upload data</a>
        </div>

    </div>

    <div class="emptytitle"></div>

    <div class="submitlink">
        <form class="uploadData" method="post" enctype="multipart/form-data">
            <div>
                <input type="button" id="fileButton" value="Upload Data">
                <input type="file" id="dataset-input" name="name"/>
                <label for="dataset-input" id="label_file"> No file selected</label>
            </div>

            <div>
                <input type="button" id="imageButton" value="Upload Stimuli Images">
                <input type="file" id="stimuli-input"/>
                <label for="stimuli-input" id="label_image"> No file selected</label>
            </div>

            <input type="submit" value="Submit" name="submit"/>
        </form>

    </div>

    <div class="selectingdata">
        <p> Select datasets (based on StimuliName): </p>
        <form class="selectionData">
            <label class="containerLabel"> Toggle All
                <input type="checkbox" onClick="selectAllData(this)"/>
                <span class="checkmark"></span>
            </label>
            <div id="formSelectionData" class="scroll">
            </div>
            <input type="submit" value="Confirm Selection" name="submit-selection">
        </form>

     </div>
</div>

    <div class="visualizationpage" id="visualizationPHP">
    </div>

    <script src="new_upload.js" charset="utf-8"></script>
</body>
</html>