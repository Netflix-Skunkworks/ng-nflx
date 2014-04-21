'use strict';

describe('EngNotation', function() {

  var EngNotation;

  beforeEach(function() {
    module('nf.engNotation');
    inject(function(_EngNotation_) {
      EngNotation = _EngNotation_;
    })
  });

  it('should format 0 to 999', function() {
    expect(EngNotation(0)).toEqual(['0.00', '']);
    expect(EngNotation(1)).toEqual(['1.00', '']);
    expect(EngNotation(9)).toEqual(['9.00', '']);
    expect(EngNotation(10)).toEqual(['10.0', '']);
    expect(EngNotation(99)).toEqual(['99.0', '']);
    expect(EngNotation(100)).toEqual(['100', '']);
    expect(EngNotation(999)).toEqual(['999', '']);
  });

  it('should format -0 to -999', function() {
    expect(EngNotation(-0)).toEqual(['0.00', '']);
    expect(EngNotation(-1)).toEqual(['-1.00', '']);
    expect(EngNotation(-9)).toEqual(['-9.00', '']);
    expect(EngNotation(-10)).toEqual(['-10.0', '']);
    expect(EngNotation(-99)).toEqual(['-99.0', '']);
    expect(EngNotation(-100)).toEqual(['-100', '']);
    expect(EngNotation(-999)).toEqual(['-999', '']);
  });

  it('should format 1000 to 999999', function() {
    expect(EngNotation(1000)).toEqual(['1.00', 'k']);
    expect(EngNotation(9990)).toEqual(['9.99', 'k']);
    expect(EngNotation(10000)).toEqual(['10.0', 'k']);
    expect(EngNotation(99990)).toEqual(['99.9', 'k']);
    expect(EngNotation(100000)).toEqual(['100', 'k']);
    expect(EngNotation(999000)).toEqual(['999', 'k']);
  });

  it('should format .001 to 0.999', function() {
    expect(EngNotation(0.001)).toEqual(['1.00', 'm']);
    expect(EngNotation(0.009)).toEqual(['9.00', 'm']);
    expect(EngNotation(0.010)).toEqual(['10.0', 'm']);
    expect(EngNotation(0.099)).toEqual(['99.0', 'm']);
    expect(EngNotation(0.100)).toEqual(['100', 'm']);
    expect(EngNotation(0.999)).toEqual(['999', 'm']);
  });

  it('should format 1000000 to 999999999', function() {
    expect(EngNotation(1000000)).toEqual(['1.00', 'M']);
    expect(EngNotation(9999999)).toEqual(['9.99', 'M']);
    expect(EngNotation(10000000)).toEqual(['10.0', 'M']);
    expect(EngNotation(99999999)).toEqual(['99.9', 'M']);
    expect(EngNotation(100000000)).toEqual(['100', 'M']);
    expect(EngNotation(999999999)).toEqual(['999', 'M']);
  });

  it('should format .000001 to 0.000999', function() {
    expect(EngNotation(0.000001)).toEqual(['1.00', 'u']);
    expect(EngNotation(0.000009)).toEqual(['9.00', 'u']);
    expect(EngNotation(0.000010)).toEqual(['10.0', 'u']);
    expect(EngNotation(0.000099)).toEqual(['99.0', 'u']);
    expect(EngNotation(0.000100)).toEqual(['100', 'u']);
    expect(EngNotation(0.000999)).toEqual(['999', 'u']);
  });

  it('should format 1e24 to 999e24', function() {
    expect(EngNotation(1e24)).toEqual(['1.00', 'Y']);
    expect(EngNotation(9.99e24)).toEqual(['9.99', 'Y']);
    expect(EngNotation(1e25)).toEqual(['10.0', 'Y']);
    expect(EngNotation(9.99e25)).toEqual(['99.9', 'Y']);
    expect(EngNotation(1e26)).toEqual(['100', 'Y']);
    expect(EngNotation(9.99e26)).toEqual(['999', 'Y']);
  });

  it('should format 1e-24 to 999e-24', function() {
    expect(EngNotation(1e-24)).toEqual(['1.00', 'y']);
    expect(EngNotation(9.99e-24)).toEqual(['9.99', 'y']);
    expect(EngNotation(1e-23)).toEqual(['10.0', 'y']);
    expect(EngNotation(9.99e-23)).toEqual(['99.9', 'y']);
    expect(EngNotation(1e-22)).toEqual(['100', 'y']);
    expect(EngNotation(9.99e-22)).toEqual(['999', 'y']);
  });

  it('should format 1e27 to 999e27', function() {
    expect(EngNotation(1e27)).toEqual(['1.00', 'e27']);
    expect(EngNotation(9.99e27)).toEqual(['9.99', 'e27']);
    expect(EngNotation(1e28)).toEqual(['10.0', 'e27']);
    expect(EngNotation(9.99e28)).toEqual(['99.9', 'e27']);
    expect(EngNotation(1e29)).toEqual(['100', 'e27']);
    expect(EngNotation(9.99e29)).toEqual(['999', 'e27']);
  });

  it('should format 1e-27 to 999e-27', function() {
    expect(EngNotation(1e-27)).toEqual(['1.00', 'e-27']);
    expect(EngNotation(9.99e-27)).toEqual(['9.99', 'e-27']);
    expect(EngNotation(1e-26)).toEqual(['10.0', 'e-27']);
    expect(EngNotation(9.99e-26)).toEqual(['99.9', 'e-27']);
    expect(EngNotation(1e-25)).toEqual(['100', 'e-27']);
    expect(EngNotation(9.99e-25)).toEqual(['999', 'e-27']);
  });

  it('should handle extra precision 0 to 999', function() {
    expect(EngNotation(1.001)).toEqual(['1.00', '']);
    expect(EngNotation(10.01)).toEqual(['10.0', '']);
    expect(EngNotation(100.1)).toEqual(['100', '']);
    expect(EngNotation(9.999)).toEqual(['9.99', '']);
    expect(EngNotation(99.99)).toEqual(['99.9', '']);
    expect(EngNotation(999.9)).toEqual(['999', '']);
  });

  it('should handle extra precision -0 to -999', function() {
    expect(EngNotation(-1.001)).toEqual(['-1.00', '']);
    expect(EngNotation(-10.01)).toEqual(['-10.0', '']);
    expect(EngNotation(-100.1)).toEqual(['-100', '']);
    expect(EngNotation(-9.999)).toEqual(['-9.99', '']);
    expect(EngNotation(-99.99)).toEqual(['-99.9', '']);
    expect(EngNotation(-999.9)).toEqual(['-999', '']);
  });

  it('should handle extra precision 1000 to 999999', function() {
    expect(EngNotation(1000.1)).toEqual(['1.00', 'k']);
    expect(EngNotation(9999.9)).toEqual(['9.99', 'k']);
    expect(EngNotation(10010)).toEqual(['10.0', 'k']);
    expect(EngNotation(99999)).toEqual(['99.9', 'k']);
    expect(EngNotation(100100)).toEqual(['100', 'k']);
    expect(EngNotation(999999)).toEqual(['999', 'k']);
  });

  it('should fixed format 0 to 999', function() {
    expect(EngNotation(0, true)).toEqual(['0.0', '']);
    expect(EngNotation(1, true)).toEqual(['1.0', '']);
    expect(EngNotation(9, true)).toEqual(['9.0', '']);
    expect(EngNotation(10, true)).toEqual(['10.0', '']);
    expect(EngNotation(99, true)).toEqual(['99.0', '']);
    expect(EngNotation(100, true)).toEqual(['100.0', '']);
    expect(EngNotation(999, true)).toEqual(['999.0', '']);
  });

  it('should fixed format -0 to -999', function() {
    expect(EngNotation(-0, true)).toEqual(['0.0', '']);
    expect(EngNotation(-1, true)).toEqual(['-1.0', '']);
    expect(EngNotation(-9, true)).toEqual(['-9.0', '']);
    expect(EngNotation(-10, true)).toEqual(['-10.0', '']);
    expect(EngNotation(-99, true)).toEqual(['-99.0', '']);
    expect(EngNotation(-100, true)).toEqual(['-100.0', '']);
    expect(EngNotation(-999, true)).toEqual(['-999.0', '']);
  });

  it('should fixed format 1000 to 999999', function() {
    expect(EngNotation(1000, true)).toEqual(['1.0', 'k']);
    expect(EngNotation(9990, true)).toEqual(['9.9', 'k']);
    expect(EngNotation(10000, true)).toEqual(['10.0', 'k']);
    expect(EngNotation(99990, true)).toEqual(['99.9', 'k']);
    expect(EngNotation(100000, true)).toEqual(['100.0', 'k']);
    expect(EngNotation(999000, true)).toEqual(['999.0', 'k']);
  });

  it('should fixed format .001 to 0.999', function() {
    expect(EngNotation(0.001, true)).toEqual(['1.0', 'm']);
    expect(EngNotation(0.009, true)).toEqual(['9.0', 'm']);
    expect(EngNotation(0.010, true)).toEqual(['10.0', 'm']);
    expect(EngNotation(0.099, true)).toEqual(['99.0', 'm']);
    expect(EngNotation(0.100, true)).toEqual(['100.0', 'm']);
    expect(EngNotation(0.999, true)).toEqual(['999.0', 'm']);
  });

});

describe('eng filter', function() {

  var filter;

  beforeEach(function() {
    module('nf.engNotation');
    inject(function($filter) {
      filter = $filter('eng');
    })
  });

  it('should not format null or undefined', function() {
    expect(filter(null)).toEqual('');
    expect(filter(undefined)).toEqual('');
  });

  it('should handle numbers and number-strings', function() {
    expect(filter(1)).toEqual('1.00');
    expect(filter('1')).toEqual('1.00');
  });

  it('should respect fixed parameter', function() {
    expect(filter(100)).toEqual('100');
    expect(filter(100, false)).toEqual('100');
    expect(filter(100, true)).toEqual('100.0');
  });

});

