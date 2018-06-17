/* 
 * Map Log Viewer
 *
 * Handles the logging interface for the entire application.
 * It interacts with the ui object and logs at will.
 *
 */

var jq = jQuery.noConflict();
jq(document).one("ready", function() {
	// Initialize mapLogViewer
	mapLogViewer.init();
});

mapLogViewer = {
	init: function() {
		// Set listeners for the ui object
		jq(document).on("click", ".mapLogViewer .objTool.clear", function() {
			// Get grid list
			var gridList = jq(".mapLogViewer .lglistContainer #logList");
			
			// Clear log list
		});
	},
	log: function(content) {
		// Create log viewer item
		this.addLogItem(content, "info");
		
		// Log content
		console.log(content);
	},
	warning: function(content) {
		// Create log viewer item
		this.addLogItem(content, "warning");
		
		// Log content
		console.warning(content);
	},
	error: function(content) {
		// Create log viewer item
		this.addLogItem(content, "error");
		
		// Log content
		console.error(content);
	},
	addLogItem: function(content, type) {
		// Create contents array
		var contents = new Array();
		
		// Add timestamp and content
		var timestamp = (new Date()).format("H:i:s.u");
		contents.push(timestamp);
		contents.push(content);
		
		// Add row to grid list
		var gridList = jq(".mapLogViewer .lglistContainer #logList");
		dataGridList.addRow(gridList, contents);
	}
}