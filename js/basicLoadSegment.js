
/**
 * Initializes a new object of BasicLoadSegment type.
 * Describes all the loads between initial time t0 and final time tf
 * @param {Array} timeArray        	array of initial and final times
 * @param {Array} polyArray 		array of polynomials that describe all the loads
 */
var BasicLoadSegment = function(timeArray, polyArray) {
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


