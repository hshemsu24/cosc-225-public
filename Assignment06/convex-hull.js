const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

//test comment 

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}


// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}


function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // a n svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized
    // create svg group for displaying vertices
    this.pointGroup = document.createElementNS(SVG_NS, "g");
    this.pointGroup.id = "graph-" + ps.id + "-vertices";
    this.svg.appendChild(this.pointGroup);


   

    this.svg.addEventListener("click", (e) => {
        // create a new vertex
        this.createPoint(e);
    });

    this.pointElts = [];   // svg elements for pointa

    this.createPoint = function (e) {
        const rect = this.svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pt = ps.addNewPoint(x, y);
        this.addPoint(pt);
        this.ps.addPoint(vtx);
        }

        this.addPoint = function (pt) {
            const elt = document.createElementNS(SVG_NS, "circle");
            elt.classList.add("points");
            elt.setAttributeNS(null, "cx", pt.x);
            elt.setAttributeNS(null, "cy", pt.y);
        
            elt.addEventListener("click", (e) => {
                e.stopPropagation(); // don't create another vertex (i.e., call event listener for the svg element in addition to the vertex
            });
        
            this.pointGroup.appendChild (elt);
            this.pointElts[pt.id] = elt;
            }
    

    // COMPLETE THIS OBJECT
}


// ps = new PointSet() ;
// ps.addNewPoint(2,1) ;
// ps.addNewPoint(1,2) ;
// ps.addNewPoint(1,0) ;
// ps.addNewPoint(0,1) ; 
// let ch = new ConvexHull(ps, null);
// ch.getConvexHull();
	
  /*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
	

	// COMPLETE THIS METHOD
	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
	
	// COMPLETE THIS METHOD
	
    }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
   

    this.getConvexHull = function () {
        len = this.ps.size();
        
        convexSetTop = [];
        this.ps.sort();

        for(i = 0; i< len; i++){
            while(convexSetTop.length >= 2 && 
                orientation(convexSetTop[convexSetTop.length-2], convexSetTop[convexSetTop.length-1], this.ps.points[i]) == 1){

                convexSetTop.pop();
            }
            convexSetTop.push(this.ps.points[i]);  
        }

        this.ps.reverse();

        convexSetBot = [];

        for(i = 0; i< len; i++){

            while(convexSetBot.length >= 2 && 
                orientation(convexSetBot[convexSetBot.length-2], convexSetBot[convexSetBot.length-1], this.ps.points[i]) == 1){
                convexSetBot.pop();
            }
                convexSetBot.push(this.ps.points[i]); 
        }
       

	// COMPLETE THIS METHOD
        chSet = new PointSet();


        for(i = 0; i< convexSetTop.length; i++){
            chSet.addNewPoint(convexSetTop[i].x, convexSetTop[i].y);
        }
        
    //    chSet.addNewPoint(808,808);
       
        for(i = 1; i< convexSetBot.length; i++){
            chSet.addNewPoint(convexSetBot[i].x, convexSetBot[i].y);
        }

        return chSet;
        
        
    }

    function orientation(a, b, c){
    
        if ((c.y - b.y)*(b.x-a.x)-(b.y-a.y)*(c.x-b.x) >= 0){
            return 1;
        } else {
            return 0;
        }
    }
}

const svg = document.querySelector("#convex-hull-box");
//const text = document.querySelector("#graph-text-box");
const ps = new PointSet();
const chv = new ConvexHullViewer(svg, ps)
//const dfs = new Dfs(graph, gv);





try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }