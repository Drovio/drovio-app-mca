/* 
 * Map Processor
 *
 * This file is responsible for loading a map into the memory,
 * pre-processing the map for the manhattan-cohesive areas and
 * search for a path between any two points.
 *
 */

MapProcessor = {
	map: new Array(),
	height: 0,
	width: 0,
	minHeight: 10,
	loadMap: function(map) {
		// Validate a given map for the right format
		var rows = map.trim().split("\n");
		
		// Check minimum size of rows
		if (rows.length < (this.minHeight + 2))
			return false;
		
		// First two rows must be dimensions
		this.height = parseInt(rows[0].match(/([0-9]+)/g));
		this.width = parseInt(rows[1].match(/([0-9]+)/g));
		if (this.height == NaN || this.height == 0 || this.width == NaN || this.width == 0) {
			mapLogViewer.log("There is an error in map dimensions.");
			return false;
		}
		
		// Remove first two rows
		rows.splice(0, 2);
		
		// Check map dimensions
		if (rows.length != this.height) {
			mapLogViewer.log("Map doesn't match given dimensions.");
			return false;
		}
		
		// Initialize map and parse rows
		this.map = new Array(this.height);
		for (n in rows) {
			// Create map line array
			var mapLine = new Array();
			for (i=0; i<this.width; i++)
				mapLine[i] = (rows[n][i] == "." ? 1 : 0);
			
			// Add map line
			this.map[n] = mapLine;
		}
		
		mapLogViewer.log("Map loaded successfully!");
		return true;
	},
	getMapPoint: function(x, y) {
		return this.map[y][x];
	}
}