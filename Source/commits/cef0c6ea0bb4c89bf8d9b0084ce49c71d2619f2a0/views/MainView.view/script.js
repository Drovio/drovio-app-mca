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
			var mapContent = e.target.result;
			
			// Try to load it with the map processor
			var loadStatus = Map.loadMap(mapContent);
			if (loadStatus) {
				mapLogViewer.log("The map file is valid.");
				
				// Build map
				MapCanvas.build("mapCanvas", Map.width, Map.height).get().addClass("mapCanvas").appendTo(jq(".processView.panel .mapContainer"));
				jq(".processView.panel").addClass("selected");
				jq(".startView.panel").removeClass("selected");
				
				// Print map to canvas
				mapLogViewer.log("Printing the map.");
				MapCanvas.printMap(Map.map);
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
		// Log activity and clear map canvas
		mapLogViewer.log("Restarting process. Go to map selection.");
		MapCanvas.clear();
		
		// Reset panels
		jq(".startView.panel").addClass("selected");
		jq(".processView.panel").removeClass("selected");
	});
	
	// Restart process
	jq(document).on("click", ".actionContainer .action.preprocess:not(.disabled)", function() {
		// Disable button
		var jqThisButton = jq(this);
		jqThisButton.addClass("disabled");
		
		// Preprocess map
		MapProcessor.initialize().preProcess(function() {
			// Enable button of pre-process
			jqThisButton.removeClass("disabled");
		});
	});
	
	// Search path
	jq(document).on("click", ".actionContainer .action.search", function() {
		// Disable button
		var jqThisButton = jq(this);
		jqThisButton.addClass("disabled");
		
		// Create a path between two points
		var startPoint = Object.create(xyLoc);
		startPoint.x = 90;
		startPoint.y = 15;
		var endPoint = Object.create(xyLoc);
		endPoint.x = 110;
		endPoint.y = 33;
		var area = null;
		var mp = Object.create(MapPath);
		var status = mp.create(startPoint, endPoint, area);
		if (status)
			MapCanvas.printPath(mp.path, "#0D5E92");
		
		// Reset button
		jqThisButton.removeClass("disabled");
	});
});