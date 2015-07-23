/**
 * Polynomial of max 3rd degree
 * @param {Array} coeffArray [description]
 * @param {double} startPoint Point on the X-axis where to start evaluating
 */
var Polynomial = function(coeffArray,startPoint){
	this.A = coeffArray[3];
	this.B = coeffArray[2];
	this.C = coeffArray[1];
	this.D = coeffArray[0];
	this.startPoint=startPoint;
};


Polynomial.prototype.EvaluateAt = function(x) {
	if(x<this.startPoint)
		throw new Error('Trying to evalute polynomial with x value less than the start point');
	return this.A * Math.pow(x-this.startPoint,3) + this.B * Math.pow(x-this.startPoint,2) + this.C*(x-this.startPoint) + this.D;
};


/**
 * Takes derivative of this polynomial and returns a new polynomial
 * @returns {Polynomial} a new polynomial
 */
Polynomial.prototype.Derivative = function() {
	var B = 3*this.A;
	var C = 2*this.B;
	var D = C;

	return new Polynomial([D,C,B]);
};


// for testing under node
if(typeof exports !== 'undefined'){
	module.exports = Polynomial;
}