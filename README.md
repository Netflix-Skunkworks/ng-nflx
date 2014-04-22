# ng-nflx

A miscellaneous collection of AngularJS services and directives that may be of general interest.

## UrlSync

Keeps URL parameters in sync with scope variables. Simply call ```UrlSync.sync()``` with a mapping of the parameter names to the sync options for that parameter. Options are:

* __expression__: A writable Angular expression to sync with the param. This could just be the name of a field in the scope, like ```'name'```, but could also be nested such as ```'user.name'```.
* __init__: An Angular expression to initialize the param if the URL does not contain a value. This is evaluated in the given scope, so constant strings must be quoted. If the expression evaluates to null, empty string, or undefined, it will be watched and the first value other than these will be used instead. (If you want to initialize to one of these values, simply set it in the scope manually.)
* __suppressHistory__: If truthy, ```$location.replace()``` will be called after any changes to this param, preventing additions to the history.

Two types of values are supported: strings, which are synced directly with the value of the param, and objects with string values, which are mapped with a period and the names of the fields. For example, ```{a:1,b:2}``` mapped to param ```p``` will result in a URL containing ```p.a=1&p.b=2```.

#### Example

```
UrlSync.sync($scope, {
  username: {expression: 'username', init: '"New User"'},
  search: {expression: 'search.filter', suppressHistory: true}
});

// URL: ...?username=New%20User
$scope.username = 'jdoe';
// URL: ...?username=jdoe
$location.search(username, 'anon');
// URL: ...?username=anon
// $scope.username === 'anon'
$scope.search.filter = 'angular';
// URL: ...?username=anon&search=angular
$scope.search.filter = null;
// URL: ...?username=anon
```

## EngNotation

Formats numbers using [Engineering Notation](http://en.wikipedia.org/wiki/Engineering_notation). The numbers are returned as a two-element array of strings in which the first element is the formatted number and the second is the SI prefix associated with the magnitude of the number. For example, 1000000 (one million) would be returned as ```['1.00', 'M']```.

By default it always returns three significant digits; note that they are floored rather than rounded. Passing a truthy value as the second argument will instead cause it to use a fixed point with one digit after the radix and thus a variable precision of 2 - 4 digits, but better alignment for table views.

A filter ```eng``` is also defined, for simple access in page templates.

#### Example

An illustration of the fixed vs floating point results:

```
EngNotation(1e3, false); // [ '1.00', 'k']
EngNotation(1e3, true);  // [  '1.0', 'k']
EngNotation(1e4, false); // [ '10.0', 'k']
EngNotation(1e4, true);  // [' 10.0', 'k']
EngNotation(1e5, false); // [  '100', 'k']
EngNotation(1e5, true);  // ['100.0', 'k']
```

Turn distance ```1324``` into ```1.32 km```:
```
var eng = EngNotation(distance, false);
return eng[0] + ' ' + eng[1] + 'm';

```

Render a list ```nums``` in fixed-point engineering notation:

```
<div ng-repeat="num in nums">{{num | eng:true}}</div>
```

## HttpMapReduce

The asynchronous nature of the ```$http``` service (and of course the underlying network calls) makes it a little complicated to handle operations that depend on multiple requests. This service can be used for tasks as simple as waiting for a few HTTP requests to complete up to performing a full map-reduce operation on multiple URLs. Simply pass it a list of ```$http``` config objects, a map function, and a reduce function. In simple cases, either or both of these functions could simply be the identity function ```f(x) -> x``` which is conveniently defined in Underscore or Lodash as ```_.identity```.

The function returns a promise, which it will resolve when all calls are complete. Since some ```$http``` calls may return errors while others do not, the combined response will always come back to the ```successCallback``` of the promise. It is up to the map and reduce functions to handle errors.

The map function receives an object of the form ```{configuration, data, status}``` where ```configuration``` is the object passed to ```$http```, ```data``` is the response data, and ```status``` is the HTTP status code in the response. If ```$http``` returns an error instead, the object will contain ```{configuration, error, status}``` instead.

The reduce function receives an array containing all of the values returned by the map function, and an additional ```finished``` flag. If this flag is true, all responses have been received and the return value of this function will be passed to the ```successCallback``` of the promise. If not, this is a partial list of responses and the return value will be passed to the ```notifyCallback``` instead. If no ```notifyCallback``` is used this function could simply return fast  instead.

#### Example

```
var configs = [
  {method: 'GET', url: '/data1'}, // returns {value: 1}
  {method: 'GET', url: '/data2'}, // returns {value: 2}
  {method: 'GET', url: '/data3'}  // returns {value: 3}
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
var error = function(_result_) {throw 'should not be called!'};
var notification = function(_result_) {notifications.push(angular.copy(_result_));};

HttpMapReduce(configs, map, reduce).then(success, error, notification);

// Assuming the configs are returned in order (for illustrative purposes only!):
// map function returns:
//   {incremented: 2}
//   {incremented: 3}
//   {incremented: 4}
// reduce function returns:
//   {total: 0, errors: 0}
//   {total: 2, errors: 0}
//   {total: 5, errors: 0}
//   {total: 9, errors: 0}
// success is now: 
//   {total: 9, error: 0}
// notifications is: 
// [
//   {total: 0, errors: 0},
//   {total: 2, errors: 0},
//   {total: 5, errors: 0},
// ]
```

## Testing

A number of unit tests have been included, using Karma and Jasmine. To run them, first make sure all the dependencies are installed:

```
npm install
bower install
```

Then run:

```
gulp test
```

or

```
karma start karma.conf.js --single-run
```

