
/**
 * [InertiaLoadSegment description]
 * @param {[type]} t0       [description]
 * @param {[type]} tf       [description]
 * @param {[type]} loadPoly [description]
 */
var InertiaLoadSegment = function(t0,tf, loadPoly) {
	this.initialTime = t0;
	this.finalTime = tf;
	this.loadPoly = loadPoly;


	Object.defineProperty(this, "loadType", {
		value: "inertia",
		writable:false,
	});

};



InertiaLoadSegment.prototype.EvaluateLoadAt = function(x) {
	return this.loadPoly.EvaluateAt(x);
};


// for testing under node
if(typeof exports !== 'undefined'){
	module.exports = InertiaLoadSegment;
}