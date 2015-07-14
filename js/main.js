	
    var timeData=[0,0.33333333,0.666666666,1];

    var segmentData =[ [ 0,
    1.1102230246251565e-16,
    2.2500000449999997,
    1.3322676428728643e-15 ],
  [ 0.25, 1.5000000150000001, 0, 0 ],
  [ 0.75,
    1.5000000150000004,
    -2.2500001799999954,
    4.049999814450188e-7 ] ];



var calculateCubic=function(startX,x,coeffs) {
    var d=coeffs[0];
    var c=coeffs[1];
    var b=coeffs[2];
    var a=coeffs[3];
    return a*Math.pow(x-startX,3)+b*Math.pow(x-startX,2)+c*(x-startX) + d;
    
};

var calculatePositionDots=function() {
// need to get this out
    var result =[];
    
    var len = segmentData.length;




    for(var i=0;i<len;i++){
      result.push([timeData[i],segmentData[i][0],segmentData[i][0]] );
    }

    //last is manual
    var lastTime=timeData.length-1;
    var last=len-1;
    result.push([timeData[lastTime],calculateCubic(timeData[lastTime-1],timeData[lastTime],segmentData[last]),calculateCubic(timeData[lastTime-1],timeData[lastTime],segmentData[last])]);

    
    return result;
    
};


var data=calculatePositionDots();

/**
 * [CalcBezierControlPoints Calculates 2 control points a curve defined by cubic polynomial
 *                 in cubicPoly, starting at firstPoint and ending and lastPoint]
 * @param {Point} firstPoint [point where the curve starts]
 * @param {Point} lastPoint  [point where the curve ends]
 * @param {CubicPoly} cubicPoly  [cubic polynomial that defines the curve]
 * Returns an array of two points
 */
var  CalcBezierControlPoints = function(firstPoint, lastPoint, cubicPoly){
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
    [ 0.44444444444444, 0.222222222222222, 0             , 0                  ],
    [ 0.22222222222222, 0.444444444444444, 0             , 0                  ],
    [0,                   0             , 0.4444444444444444,0.22222222222222],
    [0,                   0             , 0.2222222222222222, 0.4444444444444]
    ] ;

    var Ainv=numeric.inv(A);

    // setup matrix B
    var xDiff = lastPoint.X - firstPoint.X;
    var x1 = xDiff * 3.0;
    var x2 = 2.0 * x1;

    var y1 = cubicPoly.EvaluateAt(x1);
    var y2 = cubicPoly.EvaluateAt(x2);

    var f1 = 0.296296296296296296296;
    var f2 = 0.037037037037037037037;

    var B = [
        [x1 - firstPoint.X * f1 - lastPoint.X / 27.0],
        [x2 - firstpoint.X * f2 - lastpoint.X / 27.0],
        [y1 - firstpoint.Y * f1 - lastpoint.Y / 27.0],
        [y2 - firstpoint.Y * f2 - lastpoint.Y / 27.0]
    ];

    var C = numeric.dot(Ainv,B);

    //collect matrix results into points
    var p2 = {};
    var p3 = {};
    p2.X = C[0][0];
    p2.Y = C[2][0];

    p3.X = C[1][0];
    p3.Y = C[3][0];

    return([p2,p3]);
}



function plot() {
g = new Dygraph(document.getElementById("graph"),
                data,
                 {
                     // options go here. See http://dygraphs.com/options.html
                     legend: 'always',
                     animatedZooms: true,
                     title: 'dygraphs chart template',
                    labels: [ "x", "PositionDots", "Position" ],
                    series: {
                        "PositionDots": {
                            strokeWidth: 2,
                            drawPoints: true,
                            fillGraph: true
                        },
                        "Position": {
                            strokeWidth: 1,
                            drawPoints: false,
                            fillGraph: false,
                            plotter: function(e) {
                                debugger;

                                var ctx = e.drawingContext;

                                var path = new Path2D();
                                var segments = {};
                                var i;
                                for (i = 0; i < e.points.length-1; i++) {
                                    // prepare points.
                                    // need an begin and end point for each segment
                                    
                                    // move context to the first point
                                    path.moveTo(e.points[i].canvasx,e.points[i].canvasy);
                                    
                                    var pt1 = e.points[i];
                                    var pt2 = e.points[i+1]
                                    var poly = new CubicPoly(segmentData[i]);
                                    var firstP = { X:pt1.x, Y: pt1.y };
                                    var lastP = { X: pt2.x, Y:pt2.y };
                                    var cps = CalcBezierControlPoints(firstP,lastP,poly); 
                                    path.bezierCurveTo(cps[0].X,cps[0].Y,pt2.canvasx,pt2.canvasy);
                                    path.stroke();
                                    
                                }

                            },
                        },
                    },


                 });
};