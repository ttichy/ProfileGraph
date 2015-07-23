/**
 * Polynomial of max 3rd degree
 * @param {Array} coeffArray [description]
 * @param {double} startPoint Point on the X-axis where to start evaluating
 */
var Polynomial = function(coeffArray,startPoint){

	if(!Array.isArray(coeffArray))
		throw new Error('Expecting coefficients to be in an array');

	if(coeffArray.length !=4)
		throw new Error('Length of coefficient array should be 4');

	if(startPoint===undefined)
		throw new Error('start point is needed!, got  '+startPoint);

	this.A = coeffArray[3];
	this.B = coeffArray[2];
	this.C = coeffArray[1];
	this.D = coeffArray[0];
	this.startPoint=startPoint;
};


Polynomial.prototype.EvaluateAt = function(x) {
	if(x < this.startPoint)
		throw new Error('Trying to evalute polynomial with x value less than the start point');
	return this.A * Math.pow(x-this.startPoint,3) + this.B * Math.pow(x-this.startPoint,2) + this.C*(x-this.startPoint) + this.D;
};


/**
 * Takes derivative of this polynomial and returns a new polynomial
 * @returns {Polynomial} a new polynomial
 */
Polynomial.prototype.Derivative = function() {
	var b = 3*this.A;
	var c = 2*this.B;
	var d = this.C;
	
	return new Polynomial([d,c,b,0],this.startPoint);
};



Polynomial.prototype.toPrettyString = function() {
	return this.A+'x^3 + '+this.B+'x^2 + '+this.C+'x + '+this.D;
};




// for testing under node
if(typeof exports !== 'undefined'){
	module.exports = Polynomial;
}