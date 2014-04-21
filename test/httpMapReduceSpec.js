'use strict';

describe('HttpMapReduce', function() {

  var HttpMapReduce;
  var $httpBackend;
  var $timeout;
  var notifications;
  var result;

  beforeEach(function() {
    module('nf.httpMapReduce');
    inject(function(_HttpMapReduce_, _$httpBackend_, _$timeout_) {
      HttpMapReduce = _HttpMapReduce_;
      $httpBackend = _$httpBackend_;
      $timeout = _$timeout_;
      $httpBackend.when('GET', /data?/).respond(function(method, url) {
        return [200, {value: parseInt(url[5])}];
      });
      notifications = [];
      result = null;
    })
  });

  var configs = [
    {method: 'GET', url: '/data1'},
    {method: 'GET', url: '/data2'},
    {method: 'GET', url: '/data3'}
  ];

  var map = function(o) {
    return {incremented: o.value + 1};
  };

  var reduce = function(list) {
    return list.reduce(function(accumulator, element) {
      if (element.error) {
        accumulator.errors++;
      } else {
        accumulator.total += element.data.incremented;
      }
      return accumulator;
    }, {total: 0, errors: 0});
  }

  var identity = function(any) {return any;};

  var success = function(_result_) {result = _result_;};
  var error = function(_result_) {error = _result_;};
  var notification = function(_result_) {notifications.push(angular.copy(_result_));};

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should handle an empty config list', function() {
    HttpMapReduce([], identity, identity).then(success, error, notification);
    $timeout.flush();
    expect(notifications.length).toBe(0);
    expect(result).toEqual([]);
  });

  it('should handle a single config', function() {
    HttpMapReduce(configs.slice(0, 1), identity, identity).then(success, error, notification);
    $timeout.flush();
    $httpBackend.flush();
    expect(notifications.length).toBe(1);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      config: configs[0],
      data: {value: 1},
      status: 200
    });
  });

  it('should handle a single config with map function', function() {
    HttpMapReduce(configs.slice(0, 1), map, identity).then(success, error, notification);
    $timeout.flush();
    $httpBackend.flush();
    expect(notifications.length).toBe(1);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      config: configs[0],
      data: {incremented: 2},
      status: 200
    });
  });

  it('should handle multiple configs with map function', function() {
    HttpMapReduce(configs, map, identity).then(success, error, notification);
    $timeout.flush();
    $httpBackend.flush();
    expect(result.length).toBe(3);
    expect(result).toContain({
      config: configs[0],
      data: {incremented: 2},
      status: 200
    });
    expect(result).toContain({
      config: configs[1],
      data: {incremented: 3},
      status: 200
    });
    expect(result).toContain({
      config: configs[2],
      data: {incremented: 4},
      status: 200
    });
    expect(notifications.length).toBe(3);
    expect(notifications[0]).toEqual([]);
    expect(notifications[1]).toEqual(result.slice(0, 1));
    expect(notifications[2]).toEqual(result.slice(0, 2));
  });

  it('should handle multiple configs with map and reduce functions', function() {
    HttpMapReduce(configs, map, reduce).then(success, error, notification);
    $timeout.flush();
    $httpBackend.flush();
    expect(result).toEqual({total: 9, errors: 0});
    expect(notifications.length).toEqual(3);
  });

  it('should handle no configs with map and reduce functions', function() {
    HttpMapReduce([], map, reduce).then(success, error, notification);
    $timeout.flush();
    expect(result).toEqual({total: 0, errors: 0});
    expect(notifications).toEqual([]);
  });

  it('should handle http errors', function() {
    var configs = [
      {method: 'GET', url: '/data1'},
      {method: 'GET', url: '/missing'},
      {method: 'GET', url: '/data3'}
    ];
    $httpBackend.when('GET', '/missing').respond(404, 'Not Found');
    HttpMapReduce(configs, map, reduce).then(success, error, notification);
    $timeout.flush();
    $httpBackend.flush();
    expect(result).toEqual({total: 6, errors: 1});
    expect(notifications.length).toEqual(3);
  });

});

