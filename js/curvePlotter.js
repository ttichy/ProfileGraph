/**
 * 
 * @param {MotionSegment} segments 
 * 
 */
 var CurvePlotter = function(segs,svgEl) {
	"use strict";
	
	var DRAWCURVES_LIMIT=100;

	// private variables
	var segments=segs;

  	var canvasContext; // store canvas.. prolly  not ideall...
  	var isDrawCurves;
  	var prevHiLitedSegment;	//stores the previously highlighted segment		

  	var that=this;

  	// public variables
  	this.graph={};
	this.svg=svgEl;


	/**
	 * [CalcBezierControlPoints Calculates 2 control points a curve defined by cubic polynomial
	 *                 in cubicPoly, starting at firstPoint and ending and lastPoint]
	 * @param {Point} firstPoint [point where the curve starts]
	 * @param {Point} lastPoint  [point where the curve ends]
	 * @param {CubicPoly} cubicPoly  [cubic polynomial that defines the curve]
	 * Returns an array of two points
	 */
	var CalcBezierControlPoints = function(firstPoint, lastPoint, cubicPoly) {
		// data checks
		// first point should be a point and firstPoint.X should be smaller then lastPoint.X
		// cubicPoly should be of type CubicPoly
		// 
		// 
		// Cubic Bezier is defined by 4 points. We already have two (firstPoint and lastPoint). 
		// We  need to calculate the two control points P2 and P3. But we also have the two x coordinates of P2 and P3,
		// because we are picking x at 1/3 and 2/3
		// So we only need to calculate the y coord of P2 and P3. This is accomplished by using the parametric equation
		// of bezier curve and setting up two equations and two unknowns
		// As much as possible is pre-calculated to speed things up

		// setup matrix B
		var xDiff = lastPoint.X - firstPoint.X;
		var x1 = firstPoint.X + xDiff / 3.0;
		var x2 = firstPoint.X + 2.0 * xDiff / 3.0;

		var y1 = cubicPoly.EvaluateAt(x1);
		var y2 = cubicPoly.EvaluateAt(x2);

		var f1 = 0.296296296296296296296; // (1-1/3)^3
		var f2 = 0.037037037037037037037; // (1-2/3)^3
		var f3 = 0.296296296296296296296; // (2/3)^3

		var b1 = y1 - firstPoint.Y * f1 - lastPoint.Y / 27.0;
		var b2 = y2 - firstPoint.Y * f2 - f3 * lastPoint.Y;

		var c1 = (-2 * b1 + b2) / -0.666666666666666666;
		var c2 = (b2 - 0.2222222222222 * c1) / 0.44444444444444444;

		//collect matrix results into points
		var p2 = {};
		var p3 = {};
		p2.X = x1;
		p2.Y = c1;

		p3.X = x2;
		p3.Y = c2;

		return ([p2, p3]);
	};


	/**
	 * [unHighlightPrevious description]
	 * @param  {[type]} segment the previous segment to unhighlight/erase
	 */
	var unHighlightPrevious = function(segment) {
		//simply remove all children of svg element
		while(that.svg.firstChild)
			that.svg.removeChild(that.svg.firstChild);

	}

var drawHighlightShape = function(segment){
	if(!!!segment)
		throw new Error("I need a segment to hightlight.");

	var graph=that.graph;


	var canvasInitx= graph.toDomXCoord(segment.initialTime);
	var canvasInity = graph.toDomYCoord(graph.yAxisRange()[0]);

	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'path'); //Create a path in SVG's namespace
	var pathMove="M "+canvasInitx + "," + canvasInity;
	var line1 = "L  "+canvasInitx +"," + graph.toDomYCoord(segment.EvaluatePositionAt(segment.initialTime));
	var pts = calculatePointsForCurve(segment);
	var curve="C "+ pts[2]+","+pts[3]+","+pts[4]+","+pts[5]+","+pts[6]+","+pts[7];
	var line2 ="L "+canvasInitx+","+canvasInity;

	newelement.setAttribute("d",pathMove+line1+curve+line2);

	newelement.style.fillStyle='#8ED6FF';
	that.svg.appendChild(newElement);
	



	// ctx.beginPath();
	
	// ctx.moveTo(canvasInitx,canvasInity);
	// ctx.lineTo(canvasInitx,graph.toDomYCoord(segment.EvaluatePositionAt(segment.initialTime)));
	// drawCurveForSegment(ctx,segment);
	// ctx.lineTo(graph.toDomXCoord(segment.finalTime), canvasInity);
	// ctx.lineTo(canvasInitx,canvasInity);
	// ctx.closePath();
	// ctx.fillStyle = '#8ED6FF';
	// ctx.fill();
	
	
}
	

/**
 * Draws a curve for the current segment, does not stroke path
 * @param  {Object} context        the context to draw path on
 * @param  {MotionSegment} currentSegment the current motion segment
 * @return {Array} array of eight integers (x and y coords) representing the init point, two control points and final point
 */
var calculatePointsForCurve=function( currentSegment){
	if( !!! currentSegment)
		throw new Error("I need current segment!");

	var firstP = {
		X: currentSegment.initialTime,
		Y: currentSegment.EvaluatePositionAt(currentSegment.initialTime)
	};
	var lastP = {
		X: currentSegment.finalTime,
		Y: currentSegment.EvaluatePositionAt(currentSegment.finalTime)
	}
	
	var cps = CalcBezierControlPoints(firstP,lastP,currentSegment.MotionPoly())
	
	var graph=that.graph;
	
	var cp0X=graph.toDomXCoord(firstP.X);
	var cp0Y=graph.toDomYCoord(firstP.Y);
	
	//convert back to canvas coord
	var cp1X = graph.toDomXCoord(cps[0].X);
	var cp1Y = graph.toDomYCoord(cps[0].Y);

	var cp2X = graph.toDomXCoord(cps[1].X);
	var cp2Y = graph.toDomYCoord(cps[1].Y);

	var cp3X=graph.toDomXCoord(currentSegment.finalTime);
	var cp3Y=graph.toDomYCoord(currentSegment.EvaluatePositionAt(currentSegment.finalTime));
	
	return [cp0X, cp0Y, cp1X,cp1Y,cp2X,cp2Y,cp3X,cp3Y];

}



	this.plotter = function(e) {

		var ctx = e.drawingContext;

		canvasContext=ctx;

		ctx.beginPath();

		var graph = e.dygraph;


		if (e.points.length < DRAWCURVES_LIMIT) {

			isDrawCurves = true;

			var i;
			for (i = 0; i < e.points.length - 1; i++) {

				var currentSegment = segments[e.points[i].idx];

				var pts=calculatePointsForCurve(currentSegment)

				ctx.moveTo(pts[0],pts[1]);
	
				ctx.bezierCurveTo(pts[2],pts[3],pts[4],pts[5],pts[6],pts[7]);

				ctx.stroke();
			}
		} else {
			isDrawCurves = false;
			Dygraph.Plotters.linePlotter(e);
		}

	};


	this.drawCallback = function(dygraph,is_initial){
		console.log('drawing...');
	};

  this.highlightCallback = function(event, x, points, row, seriesName)
  {

    if(!!! that.graph)  //graph must be assigned in order to highlight
      return;
    
    if(row===0)
      return; // nothing to highlight
    
    var domCoords = that.graph.eventToDomCoords(event);
      
    drawHighlightShape(domCoords[0],x,points,row,seriesName);
      
  };

  /**
   * When the mouse moves over the canvas, highlight the segment under mouse cursor
   * @param  {Object} event the mousemove event from the browser
   * @return {[type]}       [description]
   */
  this.mouseMove=function(event){
  	if(!isDrawCurves)
  		return;		//too many data points on the graph

  	var graph=that.graph;

  	if(!!! graph)
  		return;		// need graph

	var canvasCoords = graph.eventToDomCoords(event);
	var canvasx = canvasCoords[0];
	var canvasy = canvasCoords[1];

	//find segment under mouse pointer 
	//-> find the first x in segments that is greater than datax
	var dataX=graph.toDataXCoord(canvasx);
	
	var currentSegment;

	var isFound=false;

	//TODO binary search of the array, since it is sorted 
	for (var i = 0; i < segments.length; i++) {
		currentSegment = segments[i];
		if (currentSegment.finalTime > dataX) {
			isFound=true;
			break;
		}
	};
	if(isFound)
	{
		unHighlightPrevious(prevHiLitedSegment);
		drawHighlightShape(currentSegment);
		prevHiLitedSegment=currentSegment;
	}

	return false;
  };



};






CurvePlotter.prototype.Plotter = function() {
	return this.plotter;
};

CurvePlotter.prototype.setGraph = function(graph){
  this.graph = graph;
};



