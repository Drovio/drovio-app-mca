/* 
 * Map Area - Manhattan-Cohesive Area
 *
 * This is a Manhattan-Cohesive Area.
 * All points inside this area can be connected with a manhattan line.
 * For more information on what is a Manhattan-Cohesive Area, look at the application's ReadMe.
 *
 */

MapArea = {
	// Area id
	id: null,
	// Whether it should close after the next iteration
	to_close: false,
	// Last slice width
	last_width: 1,
	// Whether it is open to the left (no wall)
	open_left: false,
	// Whether it is open to the right (no wall)
	open_right: false,
	// Whether it is closed to the left (wall)
	close_left: false,
	// Whether it is closed to the right (wall)
	close_right: false,
	// Left position of the last slice inserted
	last_left: 0,
	// Right position of the last slice inserted
	last_right: 0,
	blast_left: -1,
	blast_right: -1,
	// Row number whether the area begins
	start_row: -1,
	// The number of rows it covers
	row_count: 0,
	// All the start points (position x) for each slice, as index is the row from the start_row
	start_points: new Array(),
	// All the end points (position x) for each slice, as index is the row from the start_row
	end_points: new Array(),
	// All the node ids that this area is connected to
	nodes: new Array(),
	// Initialize the map area with the id
	initialize: function(id) {
		this.id = id;
		this.to_close = false;
		this.last_width = 1;
		this.open_left = false;
		this.open_right = false;
		this.close_left = false;
		this.close_right = false;
		this.last_left = 0;
		this.last_right = 0;
		this.blast_left = -1;
		this.blast_right = -1;
		this.start_row = -1;
		this.row_count = 0;
		this.start_points = new Array();
		this.end_points = new Array();
		this.nodes = new Array();
		return this;
	},
	// Add a list of points to the area (as a number of indexes)
	addPoints: function(row, start, end) {
		// Set start row if empty
		if (this.start_row == -1)
			this.start_row = row;
		// Increase row count
		this.row_count++;
		
		// Add start and end points
		this.start_points.push(start);
		this.end_points.push(end);
		
		// Set blast points
		this.blast_left = this.last_left;
		this.blast_right = this.last_right;
		
		// Set new last left and right positions
		this.last_left = start;
		this.last_right = end;
		
		// Set last width
		this.last_width = end - start + 1;
	},
	can_go_left: function() {
		return !this.close_left;
	},
	can_go_right: function() {
		return !this.close_right;
	},
	contains: function(point) {
		// Check if the point is between start and end rows
		if (point.y < this.start_row || point.y >= (this.start_row + this.row_count))
			return false;
		
		// Get index row and check whether is in the slice
		var point_row = point.y - this.start_row;
		return (point.x >= this.start_points[point_row] && point.x <= this.end_points[point_row]);
	}
}


/* 
 * Map Area Slice
 *
 * This is a map slice containing an amount points in a single row (like a slice).
 *
 */

MapSlice = {
	// Slice row
	row: -1,
	// The first point x index
	first: 0,
	// The last point x index
	last: 0,
	// Whether the slice has been inserted into an area
	inserted: false,
	// The area id that the slice is connected to
	area_connected: -1,
	// The area id that the slice is inserted to
	area_inserted: -1,
	// The slice size
	size: 0,
	// 
	ids: new Array(),
	// Initialize the slice
	initialize: function(row) {
		this.row = row;
		this.first = 0;
		this.last = 0;
		this.inserted = false;
		this.area_connected = -1;
		this.area_inserted = -1;
		this.ids = new Array();
		return this;
	},
	setfirst: function(firstX) {
		this.first = firstX;
	},
	setLast: function(lastX) {
		this.last = lastX;
		this.size = this.last - this.first + 1;
	},
	merge_slice: function(newSlice) {
		this.setLast(newSlice.last);
	}
}