# Manhattan-Cohesive Areas Visualization

This project is a visual implementation of a path planning algorithm that uses Manhattan-Cohesive Areas in order to calculate paths between two points in text-based maps. The goal of this application is to show the steps of the algorithm in a visual way.

## Algorithm Description

Fast path planning within arbitrary maps, through segmentation of the map into Manhattan-cohesive areas. 
A Manhattan-cohesive area is a connected part of the map where the optimal distance between any two points in the area is equal to their Manhattan distance. 
We adopt a four directions Manhattan distance, where diagonal moves are allowed. 
In the implementation we present the method we adopted to fragmentize the map, as well the method to extract the paths. The proposed method produces nearly optimal plans quite efficiently.

You can read the full paper [here](http://www.aaai.org/ocs/index.php/SOCS/SOCS12/paper/viewFile/5399/5213).

Document updated 21 March, 2015 at 12:37
