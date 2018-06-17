/* 
 * Map Processor
 *
 * This file is responsible for loading a map into the memory,
 * pre-processing the map for the manhattan-cohesive areas and
 * search for a path between any two points.
 *
 */

MapProcessor = {
	busy: false,
	final_areas: null,
	final_nodes: null,
	initialize: function() {
		this.final_areas = new Array();
		this.final_nodes = new Array();
		return this;
	},
	preProcess: function(callback) {
		// Check busy status
		if (this.busy)
			return false;
		
		// Check map
		if (!Map.map)
			return false;
		
		// Set busy status
		this.busy = true;
			
		// Preprocess map
		
		// Initialize variables
		var width = Map.width;
		var height = Map.height;
		var map_nodes = new Array();
		
		// Here we preprocess the map.
		// We form Manhattan-cohesion areas, where any two points inside
		// an area can be connected with a straight line.
		// Straight line is when we can move from one point to other and
		// at each step, we decrease the Manhattan-distance.
		
		// This is the front of the search, the open areas to be expanded
		var front = new Array();
		
		// Log activity
		mapLogViewer.log("Map pre-process initiated.");
		
		// Counter for areas to be created
		var area_counter = 0;
		// Counter for nodes to be created
		var node_counter = 0;
		for (var y=0; y<height; y++) {
			// For each row, get row slices of free areas
			var current_slices = new Array();
			var slice_flag = false;
			// Initialize first slice
			var current = Object.create(MapSlice);
			for (var x=0; x<width; x++) {
				// Parse each line and search for free areas

				// If we are in a slice and next is wall or the above pattern has changed, break slice
				if ((!Map.getPoint(x, y)
				|| (y > 0 && Map.getPoint(x, y-1) != Map.getPoint(current.first, y-1)))
				&& slice_flag) {
					var idd = current_slices.length;
					current.ids = new Array()
					current.ids.push(idd);
					current_slices.push(current);
					slice_flag = false;
				}
				
				// In case it is a valid point
				if (Map.getPoint(x, y)) {
					// Check if it's already inside a slice
					// Create new slice if needed
					if (!slice_flag) {
						// If it's the first point of the slice,
						// create a new slice and set first point
						current = Object.create(MapSlice).initialize(y);
						current.setfirst(x);
						slice_flag = true;
					}
					// Set last point as the current point
					current.setLast(x);
				}
			}
			
			// If there is a last slice with no wall in the end
			// Insert it to the list
			if (slice_flag) {
				var idd = current_slices.length;
				current.ids = new Array()
				current.ids.push(idd);
				current_slices.push(current);
			}
			
			// Create inserted index for slices
			var inserted = new Array();
			// Check for every area in the front, which slice can be inserted into an area
			for (var f=0; f<front.length; f++)
			{
				front[f].to_close = true;
				// Initialize all candidate slices to be inserted (connected slices somehow)
				var connected = new Array();
				for (var j=0; j<current_slices.length; j++)
				{
					// If slice is out of range, break loop
					if (current_slices[j].first > front[f].last_right + 1)
						break;
	
					// A Connected slice may be in 6 positions:
					// - Exactly below and on the left (possibly connected) (take this slice only if area can go left)
					var below_left = (current_slices[j].last == front[f].last_left - 1 && front[f].can_go_left());
					// - Exactly below and left of the front (connected but not sure if area can go that way)
					var left_and_below = (current_slices[j].first < front[f].last_left && front[f].can_go_left() && current_slices[j].last > front[f].last_left && current_slices[j].last <= front[f].last_right);
					// - Exactly below (all areas can go downwards)
					var below = (current_slices[j].first >= front[f].last_left && current_slices[j].last <= front[f].last_right);
					// - Exactly below and on the right (possibly connected) (take this slice only if area can go right)
					var below_right = (current_slices[j].first == front[f].last_right + 1 && front[f].can_go_right());
					// - Exactly below and right of the front (connected but not sure if area can go that way)
					var right_and_below = (current_slices[j].first >= front[f].last_left && current_slices[j].first < front[f].last_right && current_slices[j].last > front[f].last_right && front[f].can_go_right());
					// - Exactly below and on the left and on the right of the front (connected but the front must be able to expand on both directions)
					var right_and_below_and_left = (current_slices[j].first < front[f].last_left && front[f].can_go_left() && current_slices[j].last > front[f].last_right && front[f].can_go_right());
	
					// If slice in one position of the above and not inserted yet, is connected
					if ((below_left || left_and_below || below || below_right || right_and_below || right_and_below_and_left) && !current_slices[j].inserted)
						connected.push(current_slices[j]);
				}
	
				// If no connected slices found
				// Proceed to the next front
				if (connected.length == 0)
					continue;
				
				
				// After getting the possibly connected slices
				// - Check if two slices can be merged
				// - Decide which slice can be inserted into the front
				//   - Take the slice with the biggest width
				//	 - Insert it only if width > 10% of last width of area
	
	
	
				// In Details:
				// - Check if two slices can be merged
				var connected_merged = new Array();
				var merged = Object.create(MapSlice);
				merged = connected[0];
				for (var i=0; i<connected.length-1; i++)
				{
					// If next slice is right next to current, merge
					if ((connected[i+1].first - connected[i].last) == 1)
						merged.merge_slice(connected[i+1]);
					else
					{
						// Else, insert merged slice to connected_merged
						// and set next slice as the new slice to be merged
						connected_merged.push(merged);
						
						// Get next connected slice as base
						merged = Object.create(MapSlice);
						merged = connected[i+1];
					}
				}
				// Insert merged slice
				connected_merged.push(merged);
				// - Decide which slice can be inserted into the front (actually connected slices)
				var actually_connected = new Array();
				for (var i=0; i<connected_merged.length; i++)
					if ((connected_merged[i].last >= front[f].last_left && connected_merged[i].last <= front[f].last_right)
					|| (connected_merged[i].first >= front[f].last_left && connected_merged[i].first <= front[f].last_right)
					|| (connected_merged[i].first <= front[f].last_left && connected_merged[i].last >= front[f].last_right)) {
						connected_merged[i].area_connected = front[f].id;
						actually_connected.push(connected_merged[i]);
					}
				
				// Reset area of connected and merged slices
				connected_merged = new Array();
				//   - Take the slice with the biggest width
				if (actually_connected.length == 0)
				     continue;
				var max_width = actually_connected[0].size;
				var indx = 0;
				for (var i=1; i<actually_connected.length; i++)
					if (actually_connected[i].size > max_width)
					{
						max_width = actually_connected[i].size;
						indx = i;
					}
				// - Insert it only if width > 10% of last width of area (It prevents from expanding areas with no reason)
				var perc = (max_width / front[f].last_width);
				if (perc > 0.1) {
					// Set wall guide of the front on both sides
					if (front[f].last_left < actually_connected[indx].first)
						front[f].close_left = true;
					else if (front[f].last_left > actually_connected[indx].first)
						front[f].open_left = true;
	
					if (front[f].last_right < actually_connected[indx].last)
						front[f].open_right = true;
					else if (front[f].last_right > actually_connected[indx].last)
						front[f].close_right = true;
	
					// Creating nodes before inserting slice to area
					if (f > 0 && ((front[f-1].to_close && front[f-1].last_right >= actually_connected[indx].first)
					|| (!front[f-1].to_close && front[f-1].blast_right >= actually_connected[indx].first))) {
						// If it's after the first front, check for connectivity with the previous front in order to create nodes
						var top_start = (front[f-1].last_left < front[f-1].blast_left && front[f-1].blast_left > -1 ? front[f-1].blast_left : front[f-1].last_left);
						top_start = (actually_connected[indx].first < top_start ? top_start : actually_connected[indx].first);
						var top_end = (front[f-1].last_right > front[f-1].blast_right && front[f-1].blast_right > -1 ? front[f-1].blast_right : front[f-1].last_right);
						top_end = (actually_connected[indx].last < top_end ? actually_connected[indx].last : top_end);
	
						var bottom_start = top_start;
						var bottom_end = top_end;
	
						// First node on the left
						if (top_end >= top_start)
						{
							var p1_x = top_start;
							var p1_y = actually_connected[indx].row - 2;
							if (!Map.getPoint(p1_x, p1_y))
								p1_y = actually_connected[indx].row - 1
							var n_left = this.getFullNode(node_counter, front[f-1].id, p1_x, p1_y, front[f].id, bottom_start, actually_connected[indx].row);
							// Add to node list
							map_nodes.push(n_left);
							node_counter++;
	
							// Last node on the right
							if (top_end > top_start)
							{
								var p1_x = top_end;
								var p1_y = actually_connected[indx].row - 2;
								if (!Map.getPoint(p1_x, p1_y))
									p1_y = actually_connected[indx].row - 1
								var n_right = this.getFullNode(node_counter, front[f-1].id, p1_x, p1_y, front[f].id, bottom_end, actually_connected[indx].row);
								// Add to node list
								map_nodes.push(n_right);
								node_counter++;
	
								// Node in the middle of the space between top_start-top_end or bottom_start-bottom_end (choose the smallest distance)
								if (top_end - top_start > 10)
								{
									var middle = (top_start - top_end < top_start - top_end) ? top_start + (top_end - top_start + 1)/2 : bottom_start + (bottom_end - bottom_start + 1)/2;
									var p1_x = middle;
									var p1_y = actually_connected[indx].row - 2;
									if (!Map.getPoint(p1_x, p1_y))
										p1_y = actually_connected[indx].row - 1
									var n_middle = this.getFullNode(node_counter, front[f-1].id, p1_x, p1_y, front[f].id, middle, actually_connected[indx].row);
									// Add node to list
									map_nodes.push(n_middle);
									node_counter++;
								}
							}
						}
					}
					// Initialize front
					var f1 = 1;
					// If there are still fronts to calculate, check if slice is connected with any of the next fronts in order to create nodes
					if (f < front.length - 1)
						while ((f+f1 < front.length) && front[f+f1].last_left <= actually_connected[indx].last)
						{
							var top_start = (front[f+f1].last_left < front[f+f1].blast_left && front[f+f1].blast_left > 0 ? front[f+f1].blast_left : front[f+f1].last_left);
							top_start = (actually_connected[indx].first < top_start ? top_start : actually_connected[indx].first);
							var top_end = (front[f+f1].last_right > front[f+f1].blast_right && front[f+f1].blast_right > 0 ? front[f+f1].blast_right : front[f+f1].last_right);
							top_end = (actually_connected[indx].last < top_end ? actually_connected[indx].last : top_end);
	
							var bottom_start = (front[f+f1].last_left < front[f+f1].blast_left && front[f+f1].blast_left > 0 ? front[f+f1].blast_left : front[f+f1].last_left);
							bottom_start = top_start;
							var bottom_end = (front[f+f1].last_right > front[f+f1].blast_right && front[f+f1].blast_right > 0 ? front[f+f1].blast_right : front[f+f1].last_right);
							bottom_end = top_end;
	
							// First node on the left
							if (top_end >= top_start)
							{
								var p1_x = top_start;
								var p1_y = actually_connected[indx].row - 2;
								if (!Map.getPoint(p1_x, p1_y))
									p1_y = actually_connected[indx].row - 1
								var n_left = this.getFullNode(node_counter, front[f+f1].id, p1_x, p1_y, front[f].id, bottom_start, actually_connected[indx].row);
								// Add node to list
								map_nodes.push(n_left);
								node_counter++;
	
								if (top_end > top_start)
								{
									var p1_x = top_end;
									var p1_y = actually_connected[indx].row - 2;
									if (!Map.getPoint(p1_x, p1_y))
										p1_y = actually_connected[indx].row - 1
									var n_right = this.getFullNode(node_counter, front[f+f1].id, p1_x, p1_y, front[f].id, bottom_end, actually_connected[indx].row);
									// Add node to list
									map_nodes.push(n_right);
									node_counter++;
	
									// Node in the middle of the space between top_start-top_end or bottom_start-bottom_end (choose the smallest distance)
									if (top_end - top_start > 10)
									{
										var middle = (top_start - top_end < top_start - top_end) ? top_start + (top_end - top_start + 1)/2 : bottom_start + (bottom_end - bottom_start + 1)/2;
										var n_middle = this.getFullNode(node_counter, front[f+f1].id, middle, actually_connected[indx].row - 1, front[f].id, middle, actually_connected[indx].row);
										// Add node to list
										map_nodes.push(n_middle);
										node_counter++;
									}
								}
							}
							f1++;
						}
					// Inserting slice to area
					front[f].addPoints(actually_connected[indx].row, actually_connected[indx].first, actually_connected[indx].last);
					front[f].to_close = false;
	
					// Store ids of inserted slices
					for (var i=0; i<actually_connected[indx].ids.length; i++)
					{
						inserted.push(actually_connected[indx].ids[i]);
						current_slices[actually_connected[indx].ids[i]].area_inserted = front[f].id;
						current_slices[actually_connected[indx].ids[i]].current_front = f;
					}
				}
				// Set boolean for the slices that already inserted
				for (var j=0; j<inserted.length; j++)
					current_slices[inserted[j]].inserted = true;
			}
			
			
			// For the slices which weren't inserted anywhere, create new areas
			// And insert them into the front
			for (i=0; i<current_slices.length; i++) {
				if (!current_slices[i].inserted) {
					// If slice didn't inserted anywhere, check for nodes and create them
					for (k=0; k<front.length; k++) {
						if (!(current_slices[i].last < front[k].last_left && current_slices[i].last < front[k].blast_left)
						&& !(current_slices[i].first > front[k].last_right && current_slices[i].first > front[k].blast_right)) {
							// Get some values
							var l_left = (front[k].to_close ? front[k].last_left : front[k].blast_left);
							var l_right = (front[k].to_close ? front[k].last_right : front[k].blast_right);
							var start = ((current_slices[i].first < l_left) ? l_left : current_slices[i].first);
							var end = ((current_slices[i].last > l_right) ? l_right : current_slices[i].last);
	
							// First node on the left
							if (end < start)
								continue;
							
							// Create new node
							// First node on the left
							var n_left = this.getFullNode(node_counter, front[k].id, start, current_slices[i].row - 1, area_counter, start, current_slices[i].row);
							// Add to node list
							map_nodes.push(n_left);
							node_counter++;
							
							// Check whether the slice is one point only
							if (end == start)
								continue;
							
							// First node on the right
							var n_right = this.getFullNode(node_counter, front[k].id, end, current_slices[i].row - 1, area_counter, end, current_slices[i].row);
							// Add to node list
							map_nodes.push(n_right);
							node_counter++;
	
	
							// We add an extra node in the middle of the slice (if slice length > 10)
							if (end - start < 10)
								continue;
							
							// We create a node in the middle of the space so when in search to choose
							// between top_start-top_end or bottom_start-bottom_end (choose the smallest distance)
							var middle = start + (end - start + 1)/2;
							var n_middle = this.getFullNode(node_counter, front[k].id, middle, current_slices[i].row - 1, area_counter, middle, current_slices[i].row);
							// Add to node list
							map_nodes.push(n_middle);
							node_counter++;
						}
					}
	
					// Create a new area and insert it into the front
					var temp = Object.create(MapArea).initialize(area_counter);
					temp.addPoints(current_slices[i].row, current_slices[i].first, current_slices[i].last);
					front.push(temp);
					current_slices[i].area_inserted = area_counter;
					area_counter++;
				}
	
				// If two slices are connected and inserted to different areas, create node
				if (i > 0 && current_slices[i-1].area_inserted != current_slices[i].area_inserted
				&& current_slices[i-1].last == current_slices[i].first - 1
				&& current_slices[i].row > 0) {
				
					// Create new node between the slices
					var node = this.getFullNode(node_counter, current_slices[i-1].area_inserted, current_slices[i-1].last, current_slices[i].row, current_slices[i].area_inserted, current_slices[i].first, current_slices[i].row);
					
					// Add to map node list
					map_nodes.push(node);
					node_counter++;
				}
			}
			
			// After expanding fronts or creating new
			// Remove the fronts that didn't append to any area and insert them to the final areas
			var temp = new Array();
			var f_to_close = 0;
			var f_not_to_close = 0;
			for (var i=0; i<front.length; i++) {
				if (!front[i].to_close) {
					temp.push(front[i]);
					f_not_to_close++;
				} else {
					this.final_areas.push(front[i]);
					f_to_close++;
				}
			}
			front = temp;
	
			// Reset all areas of the front to close on next loop
			for (var i=0; i<front.length; i++)
				front[i].to_close = true;
	
			// Sort fronts by last_left
			function sort_area_by_left(a, b) {
				return a.last_left < b.last_left;
			}
			front.sort(sort_area_by_left);
		}
		
		// Insert the last fronts
		for (var i=0; i<front.length; i++)
			this.final_areas.push(front[i]);
	
		// Sort final areas with id
		function sort_area_by_id(a, b) {
			return a.id < b.id;
		}
		front.sort(sort_area_by_id);
		mapLogViewer.log("Total areas created: "+this.final_areas.length);
		mapLogViewer.log("Total nodes created: "+map_nodes.length);
	
		// Creating real nodes and successors (Creating graph)
		mapLogViewer.log("Creating the map graph...\n");
		
		// Sort nodes
		function sort_nodes_by_id(a, b) {
			return a.id < b.id;
		}
		map_nodes.sort(sort_nodes_by_id);
		// Asserting nodes to areas
		for (var i=0; i<map_nodes.length; i++)
		{
			var area_id1 = map_nodes[i].areas[0];
			var area_id2 = map_nodes[i].areas[1];
			var node_id = map_nodes[i].id;
			this.final_areas[area_id1].nodes.push(node_id);
			this.final_areas[area_id2].nodes.push(node_id);
		}
	
		// Creating children and completing graph
		this.final_nodes = new Array()
		for (i=0; i<map_nodes.length; i++)
		{
			/*
			 * For every node, search the nodes of the connected areas.
			 * For every other node, create line
			 *
			 */
			var final_node = Object.create(MapNode);
			final_node = map_nodes[i];
			var area1 = Object.create(MapArea);
			area1 = this.final_areas[final_node.areas[0]];
			var area2 = Object.create(MapArea);
			area2 = this.final_areas[final_node.areas[1]];
	
			// Setting children from first area
			var node_count1 = area1.nodes.length;
			for (var j=0; j<node_count1; j++) {
				var temp_node = Object.create(MapNode);
				temp_node = map_nodes[area1.nodes[j]];
				if ((final_node.areas[0] == temp_node.areas[0] && final_node.areas[1] != temp_node.areas[1])
					|| (final_node.areas[0] == temp_node.areas[1] && final_node.areas[1] != temp_node.areas[0])
					|| (final_node.areas[1] == temp_node.areas[0] && final_node.areas[0] != temp_node.areas[1])
					|| (final_node.areas[1] == temp_node.areas[1] && final_node.areas[0] != temp_node.areas[0])) {
					
					var area_id;
					var start = Object.create(xyLoc);
					var end = Object.create(xyLoc);
					if (final_node.areas[0] == temp_node.areas[0] || final_node.areas[0] == temp_node.areas[1])
					{
						area_id = final_node.areas[0];
						start.setPosition(final_node.items[0].position.x, final_node.items[0].position.y);
						if (final_node.areas[0] == temp_node.areas[0])
							end.setPosition(temp_node.items[0].position.x, temp_node.items[0].position.y);
						else
							end.setPosition(temp_node.items[1].position.x, temp_node.items[1].position.y);
					}
					else
					{
						area_id = final_node.areas[1];
						start.setPosition(final_node.items[1].position.x, final_node.items[1].position.y);
						end = (final_node.areas[1] == temp_node.areas[0] ? temp_node.items[0].position : temp_node.items[1].position);
					}
					var mhPath = Object.create(MapPath).create(start, end, this.final_areas[area_id]);
					var real_distance = mhPath.distance;
					temp_node.distance = real_distance;
					final_node.children.push(temp);
				}
			}
	
			// Setting children from second area
			var node_count2 = area2.nodes.length;
			for (var j=0; j<node_count2; j++) {
				var temp_node = Object.create(MapNode);
				temp_node = map_nodes[area2.nodes[j]];
				if ((final_node.areas[0] == temp_node.areas[0] && final_node.areas[1] != temp_node.areas[1])
					|| (final_node.areas[0] == temp_node.areas[1] && final_node.areas[1] != temp_node.areas[0])
					|| (final_node.areas[1] == temp_node.areas[0] && final_node.areas[0] != temp_node.areas[1])
					|| (final_node.areas[1] == temp_node.areas[1] && final_node.areas[0] != temp_node.areas[0])) {
					
					var area_id;
					var start = Object.create(xyLoc);
					var end = Object.create(xyLoc);
					if (final_node.areas[0] == temp_node.areas[0] || final_node.areas[0] == temp_node.areas[1])
					{
						area_id = final_node.areas[0];
						start.setPosition(final_node.items[0].position.x, final_node.items[0].position.y);
						if (final_node.areas[0] == temp_node.areas[0])
							end.setPosition(temp_node.items[0].position.x, temp_node.items[0].position.y);
						else
							end.setPosition(temp_node.items[1].position.x, temp_node.items[1].position.y);
					}
					else
					{
						area_id = final_node.areas[1];
						start.setPosition(final_node.items[1].position.x, final_node.items[1].position.y);
						end = (final_node.areas[1] == temp_node.areas[0] ? temp_node.items[0].position : temp_node.items[1].position);
					}
					var mhPath = Object.create(MapPath).create(start, end, this.final_areas[area_id]);
					var real_distance = mhPath.distance;
					temp_node.distance = real_distance;
					final_node.children.push(temp);
				}
			}
			if (final_node.children.length > 0)
				this.final_nodes.push(final);
		}
		
		this.final_nodes.sort(sort_nodes_by_id);
		// Resize final_nodes in order to insert starting and goal nodes
		mapLogViewer.log("Graph successfully created!\n");
		
		// On complete or on finish call callback
		this.busy = false;
		mapLogViewer.log("Map pre-process finished.");
		callback.call(this);
	},
	searchPath: function(startPoint, endPoint) {
		// Check busy status
		if (this.busy)
			return false;
		
		// Set busy status
		this.busy = true;
			
		// Initialize finalPath
		var finalPath = new Array();
		
		// Search for path
		
		// Log activity
		mapLogViewer.log("Start searching for path.");
		
		// Return path found
		this.busy = false;
		mapLogViewer.log("Path search finished.");
		return finalPath;
	},
	// Get a full map node containing items from the two connected areas
	getFullNode: function(node_id, area1_id, p1_x, p1_y, area2_id, p2_x, p2_y) {
		// Create a new map node that covers two areas
		var map_node = Object.create(MapNode).initialize();
		map_node.id = node_id;
		
		// Create node item for the area 1
		var p1 = Object.create(MapNodeItem).initialize();
		p1.area = area1_id;//current_slices[i-1].area_inserted;
		p1.position.setPosition(p1_x, p1_y);//current_slices[i-1].last, current_slices[i].row);
		map_node.items.push(p1);
		map_node.areas.push(area1_id);//current_slices[i-1].area_inserted);
		
		// Create node item for the area 2
		var p2 = Object.create(MapNodeItem).initialize();
		p2.area = area2_id;//current_slices[i].area_inserted;
		p2.position.setPosition(p2_x, p2_y);//current_slices[i].first, current_slices[i].row);
		map_node.items.push(p2);
		map_node.areas.push(area2_id);//current_slices[i].area_inserted);
		
		return map_node;
	}
}