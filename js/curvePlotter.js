var CurvePlotter = function(segments) {
	"use strict";
	
	var that=this;
	that.segments=segments;
	


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
			// We  need to calculate the two control points
			// control points are calcualed by using the parametric definition of a cubic bezier curve,
			// picking two t values (1/3 and 2/3) and setting up a system of 4 equations and 4 unknowns
			// the 4 unknowns are the two control points P2x, P2y, P3x, P3y

			//define A matrix 
			var A = [
				[0.44444444444444, 0.222222222222222, 0, 0],
				[0.22222222222222, 0.444444444444444, 0, 0],
				[0, 0, 0.4444444444444444, 0.22222222222222],
				[0, 0, 0.2222222222222222, 0.4444444444444]
			];

			var Ainv = numeric.inv(A);

			// setup matrix B
			var xDiff = lastPoint.X - firstPoint.X;
			var x1 = xDiff / 3.0;
			var x2 = 2.0 * x1;

			var y1 = cubicPoly.EvaluateAt(x1);
			var y2 = cubicPoly.EvaluateAt(x2);

			var f1 = 0.296296296296296296296;
			var f2 = 0.037037037037037037037;

			var B = [
				[x1 - firstPoint.X * f1 - lastPoint.X / 27.0],
				[x2 - firstPoint.X * f2 - lastPoint.X / 27.0],
				[y1 - firstPoint.Y * f1 - lastPoint.Y / 27.0],
				[y2 - firstPoint.Y * f2 - lastPoint.Y / 27.0]
			];

			var C = numeric.dot(Ainv, B);

			//collect matrix results into points
			var p2 = {};
			var p3 = {};
			p2.X = C[0][0];
			p2.Y = C[2][0];

			p3.X = C[1][0];
			p3.Y = C[3][0];

			return ([p2, p3]);
		}



	this.plotter =  function (e) {




		var ctx = e.drawingContext;
		ctx.beginPath();

		var graph = e.dygraph;
		var path = new Path2D();
		var segments = {};
		var i;
		for (i = 0; i < e.points.length - 1; i++) {
			// prepare points.
			// need an begin and end point for each segment

			// move context to the first point
			path.moveTo(e.points[i].canvasx, e.points[i].canvasy);


			var currentSegment=that.segments[i];
			var poly = currentSegment.Polynomial();
		debugger;


			var firstP = {
				X: graph.toDataXCoord(e.points[i].canvasx),
				Y: graph.toDataYCoord(e.points[i].canvasy)
			};
			var lastP = {
				X: graph.toDataXCoord(e.points[i+1].canvasx),
				Y: graph.toDataYCoord(e.points[i+1].canvasy)
			};
			var cps = CalcBezierControlPoints(firstP, lastP, poly);

			//convert back to canvas coord
			var cp1X = graph.toDomXCoord(cps[0].X);
			var cp1Y = graph.toDomYCoord(cps[0].Y);

			var cp2X = graph.toDomXCoord(cps[1].X);
			var cp2Y = graph.toDomXCoord(cps[1].Y);

			ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y,e.points[i+1].canvasx, e.points[i+1].canvasy);
			ctx.stroke();

		}


		


	};

CurvePlotter.prototype.Plotter = function() {
	return this.plotter;
}

};