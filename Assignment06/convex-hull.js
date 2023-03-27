const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;


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
    this.svg = svg;  // an svg object where the visualization is drawn
    this.ps = ps;    // the pointset we are adding points to 
    
    // function to add and draw point; takes in event (user click), adds point with relevant coordinates to ps and DOM element to svg
    this.drawPoint = function (e) {
        
        const rect = this.svg.getBoundingClientRect();
        let x = e.clientX - rect.left;              // get x value of click
        let y = e.clientY - rect.top;               // get y value of click

        // creating DOM element and assinging the attributed 
        let addPoint = document.createElementNS(SVG_NS, "circle");
        addPoint.setAttributeNS(null, "cx", x);
        addPoint.setAttributeNS(null, "cy", y);
        addPoint.setAttributeNS(null, "r", 6);
        addPoint.setAttributeNS(null, "stroke", "black");
        addPoint.setAttributeNS(null, "cursor", "pointer"); //?

        //add event listener so points highlight when mouseover 
        addPoint.addEventListener("mouseover", function () {
            addPoint.setAttributeNS(null, "fill", "red");
        })
        addPoint.addEventListener("mouseleave", function () {
            addPoint.setAttributeNS(null, "fill", "black");
        })

        this.svg.appendChild(addPoint);             
        this.ps.addNewPoint(x,y);               // Adds point to pointset
    }

    // adding event listener to this.svg to call drawPoint upon user click
    this.svg.addEventListener("click", (event) => {
        this.drawPoint(event);
        console.log(this.ps.points);
    });
   
    // function to draw a line between two points 
    this.connectPoints = function (p1, p2) {
        // line should connect from p1 to p2; 
        let line = document.createElementNS(SVG_NS, "line");
        line.setAttributeNS(null, "x1", p1.x);
        line.setAttributeNS(null, "y1", p1.y);
        line.setAttributeNS(null, "x2", p2.x);
        line.setAttributeNS(null, "y2", p2.y);
        line.setAttributeNS(null, "stroke", "black");
        line.setAttributeNS(null, "stroke-width", "2");
        this.svg.appendChild(line);
    }

}
	
/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization
    this.stepCount = 1;    // Counts how many steps are taken 
    this.started = false;  // Boolean to check if animation has started 
    this.curAnimation = null;

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
         console.log("start pressed");
         this.started = true;	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
        console.log("step pressed");

        // If statement to perform step animation as long as boolean is true AND number of steps is less than total length of points
        if(this.started == true && this.stepCount <= this.ps.points.length){
            this.drawCH(this.stepCount);    // calls draw function to visualize step
            this.stepCount++;               // increment step count
        }

    }

    // animate begins the animation
    this.animate = function (){
        console.log("animate pressed");
       
        if (this.curAnimation == null) {
            this.start();               // call function to begin animation

            // Animates the complete convex hull by stepping through one at a time until the step count is > # of points
            this.curAnimation = setInterval(() => {
            this.step();                // calls step function 

            // stops animation if statement is true 
            if(this.stepCount > this.ps.points.length){
                this.stopAnimation();
            } 
            }, 1000);
        }
    }

    // stopAnimation function stops animation once end of convex hull is reached 
    this.stopAnimation = function () {
        clearInterval(this.curAnimation);   // method to end the looping of the interval function 
        this.curAnimation = null;           // resets value
        console.log("animation completed");
    }

    // finalCH produces the complete Convex Hull when button is clicked 
    this.finalCH = function (){
        console.log("Here is the complete convex hull");
        
        if (this.curAnimation == null) {
            this.start();
            this.curAnimation = setInterval(() => {
            this.drawCH();      // Calls on function to draw complete animation 

            // stops animation if statement is true 
            if(this.stepCount > this.ps.points.length){
                this.stopAnimation();
            }
            }, 1000);
        }
    }


    this.drawCH = function (iters = this.ps.points.length) {
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
                        viewer.connectPoints(upperHalf[i], upperHalf[i+1], "rgb(220,220,220)");
                    } else {
                        viewer.connectPoints(upperHalf[i], upperHalf[i+1]);
                    }
                   
                }
                for (let i =0; i < lowerHalf.length-1; i ++) {
                    if (i >= lowerHalf.length-3) {
                        viewer.connectPoints(lowerHalf[i], lowerHalf[i+1], "rgb(220,220,220)");
                    }
                    else {
                        viewer.connectPoints(lowerHalf[i], lowerHalf[i+1]);
                    }
                   
                }
            } else {
                //this.conceal();
                for (let i = 0; i < this.cvSet.length-1; i ++) {
                    viewer.connectPoints(this.cvSet[i], this.cvSet[i+1]);
                }
                viewer.connectPoints(this.cvSet[this.cvSet.length-1], this.cvSet[0]);
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
        len = this.ps.size();           // len = total # of points in pointset 
        
        convexSetTop = [];              // Array to hold bottom of convex hull values
        this.ps.sort();                 

        // Finds the top of the convex hull of the pointset 
        for(i = 0; i< len; i++){
            // As Long as more than 2 points exist in the array AND a-b-c is a left turn 
            while(convexSetTop.length >= 2 && 
                orientation(convexSetTop[convexSetTop.length-2], convexSetTop[convexSetTop.length-1], this.ps.points[i]) == 1){

                convexSetTop.pop();                     // Remove the highest index from the array 
            }

            convexSetTop.push(this.ps.points[i]);       // Add the point to the array 
        }

        this.ps.reverse();              // Reverse array to repeat the same process but now to find the bottom of the convex hull 

        convexSetBot = [];              // Array to hold bottom of convex hull values

        // Finds the bottom of the convex hull of the pointset 
        for(i = 0; i< len; i++){
            // As Long as more than 1 point exists in the array AND a-b-c is a left turn
            while(convexSetBot.length >= 2 && 
                orientation(convexSetBot[convexSetBot.length-2], convexSetBot[convexSetBot.length-1], this.ps.points[i]) == 1){
                convexSetBot.pop();                     // Remove the highest index from the array
            }
                convexSetBot.push(this.ps.points[i]);   // Add the point to the array 
        }
       
        chSet = new PointSet();        // Creating a now pointset which will be the return value of this function

        // Iterating through array containing top convex hull points and adding them to chSet
        for(i = 0; i< convexSetTop.length; i++){
            chSet.addNewPoint(convexSetTop[i].x, convexSetTop[i].y);
        }
       
        // Iterating through array containing bottom convex hull points and adding them to chSet
        for(i = 1; i< convexSetBot.length; i++){
            chSet.addNewPoint(convexSetBot[i].x, convexSetBot[i].y);
        }
        
        return chSet;
    }

    // Determines whether it is a left turn or a right turn 
    function orientation(a, b, c){
        if ((c.y - b.y)*(b.x-a.x)-(b.y-a.y)*(c.x-b.x) >= 0){
            return 1;                   // is a left turn 
        } else {
            return 0;                   // is a right turn 
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