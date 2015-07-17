/**
 * 
 * @param {[MotionSegment]} segments 
 * 
 */
 var CurvePlotter = function(segments) {
	"use strict";


	var that = this;
	that.segments = segments;

  	this.graph={};

  	var DRAWCURVES_LIMIT=200;


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


  var drawHighlightShape=function(mouseCanvasx, x,points,row,seriesName){
    	
      var g=that.graph; //less typing
      

      //find segment to highlight. By default Dygraphs highlights the closes point to mouse pointer
      var dataX=g.toDataXCoord(mouseCanvasx);
      
      // dataX will be either left or right of the x value of row
      var segmentAtRow = that.segments[row];      
      
      
      
    	
    	// draw shape between row and row-1
    	
    	// calculate canvas coordinates
    	
  //   	var canvasYzero = graph.toDomYCoord(0);
  //   	var p1x= that.segments[row].EvaluateAt()
			

		// 	ctx.lineTo(e.points[i + 1].canvasx,canvasYzero);
		// 	ctx.lineTo(e.points[i].canvasx, canvasYzero);
		// 	ctx.lineTo(e.points[i].canvasx,e.points[i].camvasy);
			
			
		// 	        // complete custom shape
  //       ctx.closePath();
  //       ctx.lineWidth = 0;
  //       ctx.fillStyle = '#8ED6FF';
  //       ctx.fill();
  //       ctx.strokeStyle = 'blue';
			
  };


	this.plotter = function(e) {

		var ctx = e.drawingContext;
		ctx.beginPath();

		var graph = e.dygraph;


		if (e.points.length < DRAWCURVES_LIMIT) {


			var segments = {};
			var i;
			for (i = 0; i < e.points.length - 1; i++) {
				// prepare points.
				// need an begin and end point for each segment

				var currentSegment = that.segments[e.points[i].idx];
				var poly = currentSegment.MotionPoly();


				var firstP = {
					X: graph.toDataXCoord(e.points[i].canvasx),
					Y: graph.toDataYCoord(e.points[i].canvasy)
				};
				var lastP = {
					X: graph.toDataXCoord(e.points[i + 1].canvasx),
					Y: graph.toDataYCoord(e.points[i + 1].canvasy)
				};
				var cps = CalcBezierControlPoints(firstP, lastP, poly);

				//convert back to canvas coord
				var cp1X = graph.toDomXCoord(cps[0].X);
				var cp1Y = graph.toDomYCoord(cps[0].Y);

				var cp2X = graph.toDomXCoord(cps[1].X);
				var cp2Y = graph.toDomYCoord(cps[1].Y);

				// move context to the first point
				ctx.moveTo(e.points[i].canvasx, e.points[i].canvasy);

				ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, e.points[i + 1].canvasx, e.points[i + 1].canvasy);
				
        ctx.stroke();


			}
		} else {
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


  this.mouseMove=function(event, g, context){
  	console.log("in mousemove");
  }



};






CurvePlotter.prototype.Plotter = function() {
	return this.plotter;
};

CurvePlotter.prototype.setGraph = function(graph){
  this.graph = graph;
};



