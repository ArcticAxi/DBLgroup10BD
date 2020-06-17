# DBLgroup10BD
DBL HTI + Webtech project of group 10BD, project for eye tracking visualizations.
This is an interactive, web-based tool for creating eye tracking visualizations.

# Usage instructions
In order to effectively (and successfully) use the tool, the following instructions should be followed.

#### Setting up a local server
Disclaimer: Since our web-based tool has not yet been implemented on a server, one needs to run their own local server in order to use the tool. If you already have a local server (with PHP) set up, skip to step 3. 

1. On Windows 7, 8.1, 10 and macOS 10.10+ this can be easily done by installing MAMP, which can be downloaded from their website: https://www.mamp.info/en/downloads/. Because setting up a local server is a bit more complicated on Linux and differs between distros, we recommend users on Linux machine to use the Internet to see how they can set up a local server on their machine. After Linux users have set up a local server (with PHP), they can go to step 3.
2. In MAMP, go to the tab "MAMP" -> "Preferences" -> "Web Server" and change "Document Root" to the path which contains the server files.

#### Loading the visualizations
3. Go to "localhost" (or equivalent) in the address bar of your browser. This is the homepage of the web-based tool, iFish. 
4. Press "Visualizations page" in the rop right corner. 
5. In "Upload data", select any file in your computer that is .csv or .txt in Tab Separated Values format. (Required)
6. In "Upload stimuli images", select stimuli images to show behind visualizations. Make sure the image filenames match the names in the stimuliName column! The tool automatically selects the matching names. The support image file formats are .png, .jpg, and .jpeg. (Recommended)
7. If you have previously used our tool and downloaded thee .json file with variable values, this file can be uploaded again in "Upload previous settings". (Optional)
8. After you have selected all your files, press the submit button. This loads the stimuli.
9. Select the stimuli you want to visualize and press the confirm selection button.

#### Interacting with the visualizations
11. The scanpath visualization offers a lot of customization for how the paths are displayed.
	1. There are a couple of sliders to regulate the opacity and size of the regular paths and fixations.
	2. There are a couple of sliders to regulate the same attributes of the highlighted variant.
	3. There are buttons to select which users are highlighted, clicking once will highlight the user and clicking a second time will undo the selection.
12. The bubble map has some customization regarding the gridsize using a slider and a hover interactions
	1. The gridsize slider groups the bubbles using a smaller or larger grid.
	2. Hovering over a bubble shows how many fixations are grouped into that bubble.
13. The heatmap visualization offers some sliders to customize it's layout and filter the data shown based on timestamps.
	1. The intensity slider changes at which concentration a part of the heat map becomes another color. Sliding it to the left sets a lower concentration limit to change colour and to the right a higher limit. 
	2. The blur and radius sliders work similarly to the scanpath sliders.
	3. When the checkbox next to the timestamp slider is unchecked, the slider filters the data shown upto the selected timestamp. When the checkbox is checked, it shows the data one second before and one second after the selected timestamp.
