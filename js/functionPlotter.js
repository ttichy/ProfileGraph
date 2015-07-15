var FunctionPlotter = function(segments) {
	"use strict";
	
	var that=this;
	that.segments=segments;
	
	this.plotter =  function (e) {

		var ctx = e.drawingContext;
		ctx.beginPath();

		var graph = e.dygraph;

		var segments = {};
		var i;
		for (i = 0; i < e.points.length - 1; i++) {
			// prepare points.
			// need an begin and end point for each segment

			var currentSegment= that.segments[e.points[i].idx];
			var poly = currentSegment.MotionPoly();



			var firstP = {
				X: graph.toDataXCoord(e.points[i].canvasx),
				Y: graph.toDataYCoord(e.points[i].canvasy)
			};
			var lastP = {
				X: graph.toDataXCoord(e.points[i+1].canvasx),
				Y: graph.toDataYCoord(e.points[i+1].canvasy)
			};



			// move context to the first point
			ctx.moveTo(e.points[i].canvasx, e.points[i].canvasy);

			ctx.lineTo(e.points[i+1].canvasx, e.points[i+1].canvasy);
			ctx.stroke();

		}


		


	};

CurvePlotter.prototype.Plotter = function() {
	return this.plotter;
}

};