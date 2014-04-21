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

angular.module('nf.engNotation', [])
  // Returns a tuple of [s, e] where s is the digits in string form and e is a string indicating the order of
  // magnitude. When possible it will be a metric prefix (k = 1000, m = 0.001, M = 1000000, etc.), otherwise it
  // will use floating point exponential form, e.g. "e27" or "e-27".
  // If 'fixed' is set, it will use 1-3 whole digits followed by a decimal and one fractional digit: 1.0, 10.0, 100.0.
  // If not set, it will use three digits of precision: 1.00, 10.0, 100.
  // In either case, note that numbers are floored, not rounded.
  .constant('EngNotation', function(n, fixed) {
    var s = n.toString(); // work in string form to avoid floating error mucking up results
    var e = 0;
    var se = s.split('e');
    if (se.length === 2) {
      s = se[0];
      e = parseInt(se[1]);
    }
    var sign = '';
    if (s[0] === '-') {
      sign = '-';
      s = s.substring(1);
    }
    var sf = s.split('.');
    if (sf.length === 2) {
      s = sf[0] + sf[1];
      e = e + sf[0].length - 1;
      while (s[0] === '0') {
        s = s.substring(1);
        e--;
      }
    } else {
      e = e + s.length - 1;
    }
    var order = Math.floor(e / 3);
    var suffix;
    if (order >= -8 && order <= 8) {
      suffix = ['y', 'z', 'a', 'f', 'p', 'n', 'u', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'][order + 8];
    } else {
      suffix = 'e' + (order * 3);
    }
    var shift = e % 3;
    var s0 = s[0], s1 = s[1] || '0', s2 = s[2] || '0', s4 = s[3] || '0';
    var prefix;
    if (fixed) {
      if (shift === 0) {
        prefix = s0 + '.' + s1;
      } else if (shift === 1 || shift === -2) {
        prefix = s0 + s1 + '.' + s2;
      } else {
        prefix = s0 + s1 + s2 + '.' + s4;
      }
    } else {
      if (shift === 0) {
        prefix = s0 + '.' + s1 + s2;
      } else if (shift === 1 || shift === -2) {
        prefix = s0 + s1 + '.' + s2;
      } else {
        prefix = s0 + s1 + s2;
      }
    }
    return [sign + prefix, suffix];
  })
  .filter('eng', ['EngNotation', function(EngNotation) {
    return function(n, fixed) {
      if (n === null || !isFinite(n)) {
        return '';
      } else {
        var eng = EngNotation(n, fixed);
        return eng[0] + eng[1];
      }
    }
  }])
;
