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
    // this.svg = svg;  // a n svg object where the visualization is drawn
    // this.ps = ps;    // a point set of the points to be visualized
    // // create svg group for displaying vertices
    // this.pointGroup = document.createElementNS(SVG_NS, "g");
    // this.pointGroup.id = "graph-" + ps.id + "-vertices";
    // this.svg.appendChild(this.pointGroup);


   

    // this.svg.addEventListener("click", (e) => {
    //     // create a new vertex
    //     this.createPoint(e);
    // });

    // this.pointElts = [];   // svg elements for pointa

    // this.createPoint = function (e) {
    //     const rect = this.svg.getBoundingClientRect();
    //     const x = e.clientX - rect.left;
    //     const y = e.clientY - rect.top;
    //     const pt = ps.addNewPoint(x, y);
    //     this.addPoint(pt);
    //     this.ps.addPoint(vtx);
    //     }

    //     this.addPoint = function (pt) {
    //         const elt = document.createElementNS(SVG_NS, "circle");
    //         elt.classList.add("points");
    //         elt.setAttributeNS(null, "cx", pt.x);
    //         elt.setAttributeNS(null, "cy", pt.y);
        
    //         elt.addEventListener("click", (e) => {
    //             e.stopPropagation(); // don't create another vertex (i.e., call event listener for the svg element in addition to the vertex
    //         });
        
    //         this.pointGroup.appendChild (elt);
    //         this.pointElts[pt.id] = elt;
    //         }
    

    // COMPLETE THIS OBJECT

    this.svg = svg;  // a n svg object where the visualization is drawn
    this.ps = ps;
    

    // COMPLETE THIS OBJECT
    this.clickDraw = function (e) {
        // function to add and draw point; takes in event (user click), adds point w relevant coordinates to ps and DOM element to svg
        const rect = this.svg.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let toAdd = document.createElementNS(SVG_NS, "circle");
        toAdd.setAttributeNS(null, "cx", x);
        toAdd.setAttributeNS(null, "cy", y);
        toAdd.setAttributeNS(null, "r", 6);
        toAdd.setAttributeNS(null, "stroke", "black");
        toAdd.setAttributeNS(null, "cursor", "pointer"); //?

        //add event listeners so points highlight when mouseover 
        toAdd.addEventListener("mouseover", function () {
            toAdd.setAttributeNS(null, "fill", "white");
        })
        toAdd.addEventListener("mouseleave", function () {
            toAdd.setAttributeNS(null, "fill", "black");
        })


        this.svg.appendChild(toAdd);
        this.ps.addNewPoint(x,y);
    }
    // add event listener to this.svg to call addDraw upon user click
    this.svg.addEventListener("click", (event) => {
        this.clickDraw(event);
        console.log(this.ps.points);
    });

    

    // function to draw a line between two points 
    this.connect = function (p1, p2) {
        // line should connect from p1 to p2; essentially means x1, y1 of line are p1.x, p1.y and x2,y2 are p2.x, p2.y
        let line = document.createElementNS(SVG_NS, "line");
        line.setAttributeNS(null, "x1", p1.x);
        line.setAttributeNS(null, "y1", p1.y);
        line.setAttributeNS(null, "x2", p2.x);
        line.setAttributeNS(null, "y2", p2.y);
        line.setAttributeNS(null, "stroke", "black");
        line.setAttributeNS(null, "stroke-width", "2");
        this.svg.appendChild(line);
    }

    this.highlight = function (p1) {
        p1.setAttributeNS(null, "fill", "lightgrey");
    }


}
	
  /*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization
    this.stepCount = 1;
    this.started = false;
    this.curAnimation = null;

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
         console.log("start pressed");
         this.started = true;
	// COMPLETE THIS METHOD
	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
        console.log("step pressed");

        if(this.started ==true && this.stepCount <= this.ps.points.length){
            this.drawCH(this.stepCount);
            this.stepCount++;
        }
	// COMPLETE THIS METHOD

    }

    this.animate = function (){
        console.log("animate pressed");
       
            if (this.curAnimation == null) {
                this.start();
                this.curAnimation = setInterval(() => {
                this.step(); 

                if(this.stepCount > this.ps.points.length){
                    this.stopAnimation();
               } 
            
            
            }, 1000);

                
            }

        
    }

    this.animateStep = function (){
                this.step();
        if(this.stepCount <= this.ps.points.length){
             this.stopAnimation();
        }
        
    }

    this.stopAnimation = function () {
        clearInterval(this.curAnimation);
        this.curAnimation = null;
        console.log("animation completed");
        }

    this.finalCH = function (){
        console.log("animate pressed");
       
            if (this.curAnimation == null) {
                this.start();
                this.curAnimation = setInterval(() => {
                this.drawCH();
                }, 1000);
            }
            

    }




    this.drawCH = function (iters = this.ps.points.length) {
        // COMPLETE THIS METHOD
        // modify css variable --speed to scale w number of points (such that circles transition at appropriate speed)
        console.log(iters);
        let root = document.querySelector(":root");
        root.style.setProperty("--speed", String(.5/(this.ps.points.length/(10/this.spd))) + "s");
       
        // for each call to getConvexHull, ensure all previously drawn lines are removed 
            let svg = document.querySelector("#convex-hull-box");
            for(let i= 0; i < svg.children.length; i ++) {
                console.log("length = " + svg.children.length);
                if (svg.children[i].tagName === "line" | svg.children[i].getAttribute("fill") !=  "black") {
                    if ( ! svg.children[i].classList.contains("curCheck")) {
                        svg.children[i].remove();
                        i -= 1; 
                    }
                }
            }
            
            // one half; 
            this.ps.sort(); 
            pointsArr = this.ps.points;
            upperHalf = [];
            // sort the points and push first two onto stack
            // for every other point (after first two) in set:
            for (let i = 0; i < iters; i ++) {
                // this.updateUpper();
                // c = current point
                c = pointsArr[i];
                // upperC.setAttributeNS(null, "cx", c.x);
                // upperC.setAttributeNS(null, "cy", c.y);
                    // while not a right turn (not an obtuse angle) from a->b->c, pop from the stack (as this means we don't want to use that point),
                    //  b will always be the point that is popped (as it is midpoint of a-b-c)
                while (upperHalf.length > 1 &&  orientation(upperHalf[upperHalf.length-2],upperHalf[upperHalf.length-1],c) == 1) {
                    upperHalf.pop();
                    a = upperHalf[upperHalf.length-2];
                    b = upperHalf[upperHalf.length-1];
                    // upperB.setAttributeNS(null, "cx", b.x);
                    // upperB.setAttributeNS(null, "cy", b.y);
                    
                    // this.updateUpper();  
                    }
                    // having found right turn between a-b-c, push c to stack 
                    upperHalf.push(c);
                    // this.updateUpper();  
                }
            // other half
            this.ps.reverse();
            pointsArr = this.ps.points;
            lowerHalf = [];
            for (let i = 0; i < iters; i ++) {
                // this.updateLower();
                c = pointsArr[i];
                // lowerC.setAttributeNS(null, "cx", c.x);
                // lowerC.setAttributeNS(null, "cy", c.y);
                    while (lowerHalf.length > 1 && orientation(lowerHalf[lowerHalf.length-2],lowerHalf[lowerHalf.length-1],c) == 1) { //while not right turn
                        lowerHalf.pop();
                        a = lowerHalf[lowerHalf.length-2];
                        b = lowerHalf[lowerHalf.length-1];
                        // lowerB.setAttributeNS(null, "cx", b.x);
                        // lowerB.setAttributeNS(null, "cy", b.y);

                        // this.updateLower();
                    }
                    lowerHalf.push(c);
                    // this.updateLower();
            }
            // create set of all points in convex hull by adding upper and lower halfs 
            for (const p of lowerHalf) {
                if (upperHalf.includes(p)) {
                    let ind = lowerHalf.indexOf(p);
                    lowerHalf.splice(ind, 1);
                }
            }
            this.cvSet = upperHalf.concat(lowerHalf);
            console.log(this.cvSet);
            // for (const p of this.cvSet) {
            //     console.log(p + "ajsdhjh");
            //     if (upperHalf.includes(p)) {
            //         viewer.drawPoint(p, "red");
            //     } else {
            //         viewer.drawPoint(p, "blue");
            //     }
            // }
            if (iters < this.ps.points.length) {
                for (let i =0; i < upperHalf.length-1; i ++) {
                    if ( i >= upperHalf.length-3) {
                        viewer.connect(upperHalf[i], upperHalf[i+1], "rgb(220,220,220)");
                    } else {
                        viewer.connect(upperHalf[i], upperHalf[i+1]);
                    }
                   
                }
                for (let i =0; i < lowerHalf.length-1; i ++) {
                    if (i >= lowerHalf.length-3) {
                        viewer.connect(lowerHalf[i], lowerHalf[i+1], "rgb(220,220,220)");
                    }
                    else {
                        viewer.connect(lowerHalf[i], lowerHalf[i+1]);
                    }
                   
                }
            } else {
                //this.conceal();
                for (let i = 0; i < this.cvSet.length-1; i ++) {
                    viewer.connect(this.cvSet[i], this.cvSet[i+1]);
                }
                viewer.connect(this.cvSet[this.cvSet.length-1], this.cvSet[0]);
            }
            return this.cvSet;
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
       
        chSet = new PointSet();

        for(i = 0; i< convexSetTop.length; i++){
            chSet.addNewPoint(convexSetTop[i].x, convexSetTop[i].y);
        }
       
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
const ps = new PointSet();
const chv = new ConvexHullViewer(svg, ps)
const ch = new ConvexHull(ps, chv);

try {
    exports.PointSet = PointSet;
    exports.ConvexHull = ConvexHull;
  } catch (e) {
    console.log("not running in Node");
  }