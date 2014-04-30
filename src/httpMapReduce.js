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

angular.module('nf.httpMapReduce', [])
  .factory('HttpMapReduce', ['$q', '$http', '$timeout', function($q, $http, $timeout) {
    return function(configs, map, reduce) {
      var deferred = $q.defer();
      var results = [];
      var reduceAndNotify = function() {
        if (results.length >= configs.length) {
          deferred.resolve(reduce(results, true));
        } else {
          deferred.notify(reduce(results, false));
        }
      };
      configs.forEach(function(config) {
        $http(config)
          .success(function(data, status) {
            results.push({config: config, data: map(data), status: status});
            reduceAndNotify();
          })
          .error(function(data, status) {
            results.push({config: config, error: data, status: status});
            reduceAndNotify();
          })
        ;
      });
      $timeout(reduceAndNotify);
      return deferred.promise;
    };
  }])
;
