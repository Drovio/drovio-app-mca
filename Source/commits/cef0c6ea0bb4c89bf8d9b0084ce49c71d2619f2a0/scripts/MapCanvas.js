/* 
 * Map Canvas Manager
 *
 * Creates and draws a canvas to represent the map.
 *
 */

var jq = jQuery.noConflict();
MapCanvas = {
	canvas: null,
	build: function(id, width, height) {
		// Create map canvas
		this.canvas = jq("<canvas />").attr("id", id).attr("width", width).attr("height", height);
		return this;
	},
	get: function() {
		return this.canvas;
	},
	printMap: function(map) {
		// Print the given map to the canvas
		var cDrawer = this.canvas.get(0).getContext("2d");
		
		// The map is given in a two dimensions bit array
		cDrawer.fillStyle = "#999";
		for (y=0; y<Map.height; y++)
			for (x=0; x<Map.width; x++)
				if (!Map.getPoint(x, y))
					cDrawer.fillRect(x, y , 1, 1);
		
		return this;
	},
	printPath: function(path, color) {
		// Print the given map to the canvas
		var cDrawer = this.canvas.get(0).getContext("2d");
		
		// The map is given in a two dimensions bit array
		cDrawer.fillStyle = color;
		for (i in path)
			cDrawer.fillRect(path[i].x, path[i].y , 1, 1);
		
		return this;
	},
	clear: function() {
		// Remove canvas from parent
		this.canvas.remove();
		
		// nullify canvas object to reset
		this.canvas = null;
	}
}