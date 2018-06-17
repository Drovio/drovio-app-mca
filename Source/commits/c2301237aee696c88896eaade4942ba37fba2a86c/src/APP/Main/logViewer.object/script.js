/* 
 * Map Log Viewer
 *
 * Handles the logging interface for the entire application.
 * It interacts with the ui object and logs at will.
 *
 */

mapLogViewer = {
	logListContainer: null,
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
		// Initialize log list container
		this.logListContainer = jq(".mapLogViewer .lglist");
			
		// Create log item and append to list container
		var logItem = jq("<li />").addClass("logItem").addClass(type).appendTo(this.logListContainer);
		
		// Add timestamp
		var timestamp = (new Date()).format("H:i:s.u");
		jq("<span />").addClass("time").html("["+timestamp+"]").appendTo(logItem);
		
		// Add content
		jq("<span />").addClass("logContent").html(content).appendTo(logItem);
	}
}