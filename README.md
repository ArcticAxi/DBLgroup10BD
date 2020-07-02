# DBLgroup10BD
DBL HTI + Webtech project of group 10BD, a project for eye tracking visualizations.
This is an interactive, web-based tool for creating eye tracking visualizations.

# Usage instructions
In order to effectively (and successfully) use the tool, the following instructions should be followed.

#### Connecting to the website
1. Connect to the TU/e VPN
2. Go to dblserver.win.tue.nl:2006/~20193572 in your browser (we recommend Chrome, but the tool is also compatible with Microsoft Edge, Firefox, Opera, and some Chromium based browsers)

#### Loading the visualizations
3. Press "Visualizations page" in the top right corner. 
4. In "Upload data", select any file on your computer that is .csv, .tsv, .dsv or .txt in Tab Separated Values format. (Required)
5. In "Upload stimuli images", select stimuli images to show behind visualizations. Make sure the image filenames match the names in the stimuliName column! The tool automatically selects the matching names. The supported image file formats are .png, .jpg, and .jpeg. (Recommended)
6. If you have previously used our tool and downloaded the .json file with variable values, this file can be uploaded again in "Upload previous settings". (Recommended)
7. After you have selected all your files, press the submit button. This loads the stimuli.
8. Select the stimuli you want to visualize and press the confirm selection button.

#### Interacting with the visualizations
9. Interactions for multiple visualizations
	1. Hovering over any visualization shows the stimuli name in the top left corner.
	2. User selection, reflected in the scanpath, heat map, and boxplot. Clicking once will select the user and clicking a second time will undo the selection.
	3. Timestamp, reflected in the scanpath and heat map. When the checkbox next to the timestamp slider is unchecked, the slider filters the data shown upto the selected timestamp. When the checkbox is checked, it shows the data one second before and one second after the selected timestamp.
10. The scanpath visualization offers a lot of customization for how the saccades are displayed.
	1. There are a couple of sliders to regulate the opacity and size of the regular saccades and fixations.
	2. There are a couple of sliders to regulate the same attributes of the highlighted variant.	
11. The bubble map has some customization to change the gridsize and a hover interactions.
	1. The gridsize slider groups the bubbles using a smaller or larger size of grid.
	2. Hovering over a bubble shows how many fixations are grouped into that bubble.
12. The heatmap visualization offers some sliders to customize its layout.
	1. The intensity slider changes at which concentration limit the heat map gradient changes colour. Sliding it to the left sets a lower concentration limit to change colour and to the right a higher limit. 
	2. The blur and radius sliders work similarly to the scanpath sliders.
	3. There is a button named 'Toggle Rainbow', this changes the gradient to the colours of the pride flag.
