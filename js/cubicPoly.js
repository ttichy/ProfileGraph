var CubicPoly = function(coeffArray){
	this.A = coeffArray[3];
	this.B = coeffArray[2];
	this.C = coeffArray[1];
	this.D = coeffArray[0];
}


CubicPoly.prototype.EvaluateAt = function(x) {
	return this.A * Math.pow(x,3) + this.B * x *x + this.C*x + this.D;
}