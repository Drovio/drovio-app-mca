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
				MapCanvas.printMap();
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
		
		// Reset objects
		MapProcessor.initialize();
		MapCanvas.clear();
		Map.clear();
		
		// Reset form values
		jq("input.point_input[name='start_point']").val("");
		jq("input.point_input[name='end_point']").val("");
		
		// Reset panels
		jq(".startView.panel").addClass("selected");
		jq(".processView.panel").removeClass("selected");
	});
	
	// Restart process
	jq(document).on("click", ".actionContainer .action.preprocess:not(.disabled)", function() {
		
	});
	
	// Display start and end points
	jq(document).on("keyup", "input.point_input", function(ev) {
		// Get values from both inputs
		var startVal = jq("input.point_input[name='start_point']").val();
		var endVal = jq("input.point_input[name='end_point']").val();
		
		// Create start point
		var startXY = startVal.split(",", 2);
		var startPoint = Object.create(xyLoc);
		if (startXY.length == 2) {
			startPoint.x = parseInt(startXY[0]);
			startPoint.y = parseInt(startXY[1]);
			startPoint.y = (isNaN(startPoint.y) ? 0 : startPoint.y);
		}
		MapProcessor.startPoint = startPoint;
		
		// Create end point
		var endXY = endVal.split(",", 2);
		var endPoint = Object.create(xyLoc);
		if (endXY.length == 2) {
			endPoint.x = parseInt(endXY[0]);
			endPoint.y = parseInt(endXY[1]);
			endPoint.y = (isNaN(endPoint.y) ? 0 : endPoint.y);
		}
		MapProcessor.endPoint = endPoint;
		
		// Reprint map
		MapCanvas.printMap();
		
		// Show start and goal point
		MapCanvas.printPoint(MapProcessor.startPoint);
		MapCanvas.printPoint(MapProcessor.endPoint);
	});
	
	// Search path
	jq(document).on("click", ".actionContainer .action.search", function() {
		// Disable button
		var jqThisButton = jq(this);
		jqThisButton.addClass("disabled");
		
		// Check if map is pre-processed and pre-process if necessary
		if (!MapProcessor.processed)
			MapProcessor.initialize().preProcess();
		
		// Get path from MapProcessor startPoint to endPoint
		var path = MapProcessor.searchPath(MapProcessor.startPoint, MapProcessor.endPoint);
		MapCanvas.printPath(path, "#0D5E92");
		
		// Reset button
		jqThisButton.removeClass("disabled");
	});
	
	// Search path
	jq(document).on("maptemplate.load", function(ev, mapContent) {
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
			MapCanvas.printMap();
		}
		else {
			mapLogViewer.log("The map file is not valid.");
		}
	});
});