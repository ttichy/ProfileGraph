/**
 * BasicMotionSegment describes the smallest building block of any other segment.
 * It is defined by initial time, final time and the polynomial coefficients to calculate position
 * All other (vel, accel, jerk) are calculated by derivation.
 * @param {double} t0   [description]
 * @param {double}} tf   [description]
 * @param {Polynomial} poly [description]
 */
var BasicMotionSegment = function(t0,tf, poly) {
	this.initialTime = t0;
	this.finalTime = tf;
	this.positionPoly = poly;

	this.velocityPoly=this.positionPoly.Derivative();
	this.accelPoly = this.velocityPoly.Derivative();
	this.jerkPoly = this.accelPoly.Derivative();


};


BasicMotionSegment.prototype.EvaluatePositionAt = function(x) {
	return this.positionPoly.EvaluateAt(x);
};


BasicMotionSegment.prototype.EvaluateVelocityAt = function(x) {
	return this.velocityPoly.EvaluateAt(x);
};

BasicMotionSegment.prototype.EvaluateAccelAt = function(x) {
	return this.velocityPoly.EvaluateAt(x);
};


