'use strict';

describe('UrlSync', function() {

  var UrlSync;
  var $location;
  var $browser;
  var $rootScope;
  var scope;

  beforeEach(function() {
    module('nf.urlSync');
    inject(function(_UrlSync_, _$rootScope_, _$location_, _$browser_) {
      UrlSync = _UrlSync_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $location = _$location_;
      $browser = _$browser_;
    })
  });

  it('should initialize from $location (string)', function() {
    $location.search('foo', 'bar');
    UrlSync.sync(scope, {
      foo: {expression: 'foo'}
    });
    expect(scope.foo).toBe('bar');
    expect($location.search().foo).toBe('bar');
  });

  it('should initialize from init function (string)', function() {
    scope.initFoo = function() {
      return 'bar';
    };
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: 'initFoo()'}
    });
    scope.$digest();
    expect(scope.foo).toBe('bar');
    expect($location.search().foo).toBe('bar');
  });

  it('should initialize from init constant (string)', function() {
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"bar"'}
    });
    scope.$digest();
    expect(scope.foo).toBe('bar');
    expect($location.search().foo).toBe('bar');
  });

  it('should prefer $location to init (string)', function() {
    $location.search('foo', 'location');
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toBe('location');
    expect($location.search().foo).toBe('location');
  });

  it('should update $location from scope (string)', function() {
    $location.search('foo', 'location');
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toBe('location');
    expect($location.search().foo).toBe('location');
    scope.foo = 'changed';
    scope.$digest();
    expect(scope.foo).toBe('changed');
    expect($location.search().foo).toBe('changed');
  });

  it('should update scope from $location (string)', function() {
    $location.search('foo', 'location');
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toBe('location');
    expect($location.search().foo).toBe('location');
    $location.search('foo', 'changed');
    $rootScope.$broadcast('$locationChangeSuccess');
    expect(scope.foo).toBe('changed');
    expect($location.search().foo).toBe('changed');
  });

  it('should clear parameter when scope value is null', function() {
    $location.search('foo', 'location');
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toBe('location');
    expect($location.search().foo).toBe('location');
    scope.foo = null;
    scope.$digest();
    expect(scope.foo).toBe(null);
    expect($location.search().foo).toBe(undefined);
  });

  var locationObj = {
    'foo.a': 'A',
    'foo.b': 'B',
    'foo.c': 'C'
  };

  var scopeObj = {
    'a': 'A',
    'b': 'B',
    'c': 'C'
  };

  it('should initialize from $location (object)', function() {
    $location.search(locationObj);
    UrlSync.sync(scope, {
      foo: {expression: 'foo'}
    });
    expect(scope.foo).toEqual(scopeObj);
    expect($location.search()).toEqual(locationObj);
  });

  it('should initialize from init function (object)', function() {
    scope.initFoo = function() {
      return scopeObj;
    };
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: 'initFoo()'}
    });
    scope.$digest();
    expect(scope.foo).toEqual(scopeObj);
    expect($location.search()).toEqual(locationObj);
  });

  it('should initialize from init constant (object)', function() {
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: JSON.stringify(scopeObj)}
    });
    scope.$digest();
    expect(scope.foo).toEqual(scopeObj);
    expect($location.search()).toEqual(locationObj);
  });

  it('should prefer $location to init (object)', function() {
    $location.search(locationObj);
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toEqual(scopeObj);
    expect($location.search()).toEqual(locationObj);
  });

  it('should update $location from scope (object)', function() {
    $location.search(locationObj);
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toEqual(scopeObj);
    expect($location.search()).toEqual(locationObj);
  });

  it('should update scope from $location (object)', function() {
    $location.search(locationObj);
    UrlSync.sync(scope, {
      foo: {expression: 'foo', init: '"init"'}
    });
    scope.$digest();
    expect(scope.foo).toEqual(scopeObj);
    expect($location.search()).toEqual(locationObj);
  });

});
