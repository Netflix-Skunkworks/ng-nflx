/**
 * Copyright 2014 Netflix, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('nf.urlSync', [])
  .factory('UrlSync', ['$location', '$rootScope', '$log', function($location, $rootScope, $log) {
    var paramOptions = {};

    var loadFromUrl = function(urlParam) {
      var search = $location.search();
      var locationValue = search[urlParam];
      if (!locationValue) {
        var prefix = urlParam + '.';
        var locationValues = _.pick(search, function(value, key) {
          return key.indexOf(prefix) === 0
        });
        if (!_.isEmpty(locationValues)) {
          locationValue = _.transform(locationValues, function(result, value, key) {
            result[key.substring(prefix.length)] = value;
          });
        }
      }
      return locationValue;
    };

    var syncScope = function(urlParam, value, from, force) {
      var options = paramOptions[urlParam];
      var scope = options.scope;
      var expression = options.expression;
      var result = scope.$eval('__sync=' + value);
      if (force || !angular.equals(result, scope.$eval(expression))) {
        scope.$eval(expression + '=' + value);
        $log.debug('[UrlSync]', 'set scope.' + expression + ' to ' + value + ' from ' + from);
      }
    };

    var syncLocation = function(urlParam, value, from, force) {
      var options = paramOptions[urlParam];
      if (force || !angular.equals(value, loadFromUrl(urlParam))) {
        if (value === undefined || value === '') {
          value = null;
        }
        if (typeof value === 'object') {
          $location.search(angular.extend($location.search(), _.transform(value, function(result, value, key) {
            result[urlParam + '.' + key] = value;
          })));
        } else {
          $location.search(urlParam, value);
        }
        $log.debug('[UrlSync]', 'set $location.' + urlParam + ' to ' + JSON.stringify(value) + ' from scope.' + options.expression + ' ' + from
          + (options.suppressHistory ? ' (no history)' : ''));
        if (options.suppressHistory) {
          $location.replace();
        }
      }
    };

    var syncOrInit = function(urlParam) {
      var options = paramOptions[urlParam];
      var scope = options.scope;
      var locationValue = loadFromUrl(urlParam);
      if (locationValue) {
        syncScope(urlParam, JSON.stringify(locationValue), '$location');
      } else if (options.init) {
        syncScope(urlParam, 'undefined', '$watch set');
        var unwatch = scope.$watch(options.init, function(watchValue) {
          if (watchValue) {
            syncScope(urlParam, JSON.stringify(watchValue), options.init);
            syncLocation(urlParam, watchValue, options.init, true);
            unwatch();
          }
        });
      } else {
        syncScope(urlParam, 'undefined', 'no $location or init set');
      }
    };

    var UrlSync = {
      sync: function(scope, mapping) {
        angular.forEach(mapping, function(options, urlParam) {
          paramOptions[urlParam] = angular.extend(options, {scope: scope});
          syncOrInit(urlParam);
          scope.$watch(options.expression, function(value) {
            syncLocation(urlParam, value, options.expression);
          }, true);
        });
      }
    };

    $rootScope.$on('$locationChangeSuccess', function() {
      Object.keys(paramOptions).map(syncOrInit);
    });

    return UrlSync;
  }])
;

