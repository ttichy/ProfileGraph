	
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

var calculatePosition=function() {
// need to get this out
    var result =[];
    debugger;
    var len = segmentData.length;




    for(var i=0;i<len;i++){
      result.push([timeData[i],segmentData[i][0]]);
    }

    //last is manual
    var lastTime=timeData.length-1;
    var last=len-1;
    result.push([timeData[lastTime],calculateCubic(timeData[lastTime-1],timeData[lastTime],segmentData[last])]);

    
    return result;
    
};

function plot() {
g = new Dygraph(document.getElementById("graph"),
                calculatePosition(),
                 {
                     // options go here. See http://dygraphs.com/options.html
                     legend: 'always',
                     animatedZooms: true,
                     title: 'dygraphs chart template',
                    labels: [ "x", "Position" ],
                     strokeWidth: 2,
                     drawPoints: true,
                     fillGraph: true
                 });
};