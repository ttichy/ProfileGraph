var MotionSegment = function(t0,tf, poly) {
	this.initialTime = t0;
	this.finalTime = tf;
	this.motionEquation = poly;
}

MotionSegment.prototype.EvaluateAt = function(x) {
	return this.motionEquation.EvaluateAt(x);
}

MotionSegment.prototype.InitialTime = function() {
	return this.initialTime;
}

MotionSegment.prototype.FinalTime = function() {
	return this.finalTime;
}
