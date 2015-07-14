var CubicPoly = function(coeffArray,startPoint){
	this.A = coeffArray[3];
	this.B = coeffArray[2];
	this.C = coeffArray[1];
	this.D = coeffArray[0];
	this.startPoint=startPoint;
}


CubicPoly.prototype.EvaluateAt = function(x) {
	return this.A * Math.pow(x-this.startPoint,3) + this.B * Math.pow(x-this.startPoint,2) + this.C*(x-this.startPoint) + this.D;
}