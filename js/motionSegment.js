var MotionSegment = function(t0,tf, poly) {
	this.initialTime = t0;
	this.finalTime = tf;
	this.motionEquation = poly;
};


MotionSegment.prototype.MotionPoly = function() {
	return this.motionEquation;
}

MotionSegment.prototype.EvaluatePositionAt = function(x) {
	return this.motionEquation.EvaluateAt(x);
}


