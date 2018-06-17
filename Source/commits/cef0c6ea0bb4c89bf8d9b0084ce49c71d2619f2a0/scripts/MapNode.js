/* 
 * Map Node
 *
 * This object represents a map node.
 * A map node consists of a number of point locations and connects areas.
 * For creating the graph later, we are going to need all the connected nodes (neighbors).
 *
 */

MapNode = {
	// The unique node id
	id: -1,
	//
	depth: 0,
	// The parent area id ?
	parent: -1,
	// The total distance from the goal?
	total_distance: 0,
	// The distance so far
	distance: 0,
	// Whether we visited this node or not
	visited: false,
	temp: false,
	// The area ids that it connect
	areas: new Array(),
	// The xyloc points that this node contains
	items: new Array(),
	// All the connected nodes as children
	children: new Array(),
	// Initialize function
	initialize: function() {
		// Initialize map node object
		this.total_distance = 0;
		this.parent = -1;
		this.visited = false;
		this.temp = false;
		this.depth = 0;
		return this;
	}
}

/* 
 * Map Node Item
 *
 * This object represents a map node item as part of a node inside an area that connects.
 *
 */

MapNodeItem = {
	// Area id
	area: -1,
	// The xyLoc position
	position: null,
	// Initialize the map node item
	initialize: function() {
		// Initialize position as a point
		this.position = Object.create(xyLoc);
		return this;
	}
}