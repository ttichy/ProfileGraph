	
    // *************** this data comes from the server **********
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
//******************************************************************


var CreateSegmentsFromData = function(timeData,segmentData){
    var i;
    var segments = [];

    var len = segmentData.length;
    var poly;
    for(i=0;i<len;i++){
        poly = new CubicPoly(segmentData[i],timeData[i]);
        segments.push(new MotionSegment(timeData[i],timeData[i+1],poly));
    }
    return segments;

};





var CreatePlotDataFromSegments = function(segments){
    // need to make an array in format:
    // [x,y1,y2] y1 and y2 are two different series
    // y1 series will be used to display dots
    // y2 series will be used to draw cubic
    var t;
    var y;
    var i;
    var len=segments.length;

    var result=[];

    for (i = 0; i < len; i++) {
        
        t=segments[i].InitialTime();
        y=segments[i].EvaluateAt(t);
        result.push([t,y,y]);
    };

    // then have to add the final point
    var lastTime=segments[len-1].FinalTime();
    var lastY = segments[len-1].EvaluateAt(lastTime);
    result.push([lastTime,lastY,lastY]);

    return result;
 
};


var segments = CreateSegmentsFromData(timeData,segmentData);


var data=CreatePlotDataFromSegments(segments);

var curvePlotter = new CurvePlotter(segments);


function plot() {
    g = new Dygraph(document.getElementById("graph"),
        data, {
            // options go here. See http://dygraphs.com/options.html
            legend: 'always',
            animatedZooms: true,
            title: 'dygraphs chart template',
            labels: ["x", "PositionDots", "Position"],
            series: {
                "PositionDots": {
                    strokeWidth: 0,
                    drawPoints: true,
                    fillGraph: false
                },
                "Position": {
                    strokeWidth: 1,
                    drawPoints: false,
                    fillGraph: false,
                    plotter: curvePlotter.plotter,
                },
            },


        });
}