var Polynomial = require('../polynomial.js');
var should=require('should');

describe('Polynomial', function() {
	it('Should have a reference to polynomial.js', function() {
		Polynomial.should.be.ok();
	});

	it('Should create a new polynomial 4x^3+3x^2+2x+1 with startPoint=0 and evaluate correctly at 0,1,2', function(){
		var poly = new Polynomial([1,2,3,4],0);

		poly.EvaluateAt(0).should.equal(1);
		poly.EvaluateAt(1).should.equal(10);
		poly.EvaluateAt(2).should.equal(49);
	});

	it('Should create a new polynomial -0.5x^3+0x^2+-1.5x+1 with startPoint=1 and evaluate correctly at 1,2', function(){
		var poly = new Polynomial([1,1.5,0,-0.5],1);

		poly.EvaluateAt(1).should.equal(1);
		poly.EvaluateAt(2).should.equal(2);

	});

	it('Should throw with a polynomial -0.5x^3+0x^2+-1.5x+1 with startPoint=1 when evaluating at 0', function(){
		var poly = new Polynomial([1,1.5,0,-0.5],1);

		// (poly.EvaluateAt(0)).should.throw();

		(function() {
			poly.EvaluateAt(0);
		}).should.throw();

	});


});

