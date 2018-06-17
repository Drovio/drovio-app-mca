jq = jQuery.noConflict();
jq(document).one("ready", function() {
	// Welcome message
	mapLogViewer.log("Welcome to Manhattan-Cohesive Areas Visualization!");

	// Drop area listeners
	jq(document).on("dragenter, dragover", ".drop-area", function(ev){
		// Event actions
		ev.stopPropagation();
		ev.preventDefault();
		
		// Drop effect
		ev.originalEvent.dataTransfer.dropEffect = 'copy';
	});
	
	jq(document).on("dragleave", ".drop-area", function(ev){
		// Event actions
		ev.stopPropagation();
		ev.preventDefault();
		
		// Drop effect
		ev.originalEvent.dataTransfer.dropEffect = 'none';
	});
	
	// Drop files
	jq(document).on("drop", ".drop-area", function(ev){
		// Event actions
		ev.stopPropagation();
		ev.preventDefault();
		
		// Get the first file dropped as the map file
		var mapFile = ev.originalEvent.dataTransfer.files[0];
		if (!mapFile) {
			// Log error
		}
		
		// Check File support
		if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
			mapLogViewer.error('The File APIs are not fully supported in this browser.');
			return false;
		}
		
		// Prepare reader to read the file
		var reader = new FileReader();
		reader.onload = function(e) {
			// Get map contents
			var map = e.target.result;
			
			// Try to load it with the map processor
			var loadStatus = MapProcessor.loadMap(map);
			if (loadStatus) {
				mapLogViewer.log("The map file is valid.");
				
				// Build map
				MapCanvas.build("mapCanvas", MapProcessor.width, MapProcessor.height).get().addClass("mapCanvas").appendTo(jq(".processView.panel .mapContainer"));
				jq(".processView.panel").addClass("selected");
				jq(".startView.panel").removeClass("selected");
				
				// Print map to canvas
				mapLogViewer.log("Printing the map.");
				MapCanvas.printMap(MapProcessor.map);
			}
			else {
				mapLogViewer.log("The map file is not valid.");
			}
		}
		
		// Read file as text
		mapLogViewer.log('Reading map file...');
		reader.readAsText(mapFile);
	});
	
	
	// Restart process
	jq(document).on("click", ".actionContainer .action.restart", function() {
		// Clear map
		MapCanvas.clear();
		
		// Reset panels
		jq(".startView.panel").addClass("selected");
		jq(".processView.panel").removeClass("selected");
	});
});