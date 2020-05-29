In order to effectively (and successfully) use the tool, the following instructions should be followed.

Setting up a local server
-------------------------
Disclaimer: Since our web-based tool has not yet been implemented on a server, one needs to run their own local server in order to use the tool. If you already have a local server (with PHP) set up, skip to step 3. 
	1. On Windows 7, 8.1, 10 and macOS 10.10+ this can be easily done by installing MAMP, which can be downloaded from their website: https://www.mamp.info/en/downloads/. Because setting up a local server is a bit more complicated on Linux and differs between distros, we recommend users on Linux machine to use the Internet to see how they can set up a local server on their machine. After Linux users have set up a local server (with PHP), they can go to step 3.
	2. In MAMP, go to the tab "MAMP" -> "Preferences" -> "Web Server" and change "Document Root" to the path which contains the server files.
	3. We need to ensure that the server is able to accept large enough files. When using MAMP, go to localhost/phpinfo.php in your address bar. When using another programme, go to the locally hosted server in your browser and append the address with "/phpinfo.php". 
	4. Copy the path in "Loaded Configuration File" and open the php.ini file with a text editor (such as notepad, notepad++, notepadqq, etc.)
	5. In this file, find "upload_max_filesize" and "post_max_size", these are given in MBs. Change it to the desired size. In order to avoid accidentally uploading files which are too big, it is recommended that you set the size to e.g. 50M. Also ensure that "file_uploads" is set to 'On'.
	6. Restart the server to implement the changes to the php.ini file.

Loading the visualizations
--------------------------
	7. Go to "localhost" (or equivalent) in the address bar of your browser. This is the homepage of the web-based tool, iFish.
	8. Press "Upload data" in the rop right corner. This redirects you to the upload page.
	9. Select any file in your computer that is a Tab Separated Values file, it can be extended with either .csv or .tsv (though not recommended, even .txt is possible) but it must be Tab Separated. After selecting your file, press the submit button.
	10. Select the stimuli you want to visualize and press the confirm selection button.
	
Adding images behind the visualizations
---------------------------------------
Disclaimer: while it is possible to use the tool without adding images, this will not be very informative, since the visualizations do not yet include axes.
	11. It is not yet possible to upload images. In order to put an image behind a visualization, make sure the image has the same filename as the stimuli in step 9. Put this image in the "stimuli" folder in the root of the server and go through steps 7 to 9 again.

Interacting with the visualizations
-----------------------------------
	12. The scanpath visualization offers a lot of customization for how the paths are displayed.
		1. There are a couple of sliders to regulate the opacity and size of the regular paths and fixations.
		2. There are a couple of sliders to regulate the same attributes of the highlighted variant.
		3. There are buttons to select which users are highlighted, clicking once will highlight the user and clicking a second time will undo the selection.
	13. The bubble map visualization does not have its own sliders yet, but does show how many fixations are represented by a bubble, when hovering over it with the cursor.
	14. The heatmap visualization offers some sliders to customize it's layout and filter the data shown based on timestamps.
		1. The intensity slider changes at which concentration a part of the heat map becomes another color. Sliding it to the left sets a lower concentration limit to change colour and to the right a higher limit. 
		2. The blur and radius sliders work similarly to the scanpath sliders.
		3. When the checkbox next to the timestamp slider is unchecked, the slider filters the data shown upto the selected timestamp. When the checkbox is checked, it shows the data one second before and one second after the selected timestamp.