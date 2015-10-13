"use strict";

var CalendarUtils;
!function(){

  CalendarUtils = function(options) {}
  var prototype = CalendarUtils.prototype;

  prototype.numDaysInMonth = function(year, month) {
    var utils = this;
    month = (year.getFullYear ? year.getMonth() + 1 : month);
    year = (year.getFullYear ? year.getFullYear() : year);
    return utils.newDate(year, month + 1, 0).getDate();
  };

  prototype.newDate = function(year, month, day) {
    var nDate = null;
    if (year) {
      if (year.getFullYear) {
        nDate = new Date(year.getTime());
      } else if (year.year !== undefined && year.month !== undefined && year.day !== undefined) {
        nDate = new Date(year.year, year.month - 1, year.day);
      } else {
        nDate = new Date(year, month - 1, day);
      }
    }
    return nDate;
  };

  prototype.add = function(date, amount, period) {
    var utils = this;
    if (period === 'd' || period === 'w') {
      date.setDate(date.getDate() + amount * (period === 'w' ? 7 : 1));
    }
    else {
      var year = date.getFullYear() + (period === 'y' ? amount : 0);
      var month = date.getMonth() + (period === 'm' ? amount : 0);
      date.setTime(utils.newDate(year, month + 1, Math.min(date.getDate(), utils.numDaysInMonth(year, month + 1))).getTime());
    }
    return date;
  }

  function parseFormat(format) {
    var separator = format.match(/[.\/\-\s].*?/);
    var parts = format.split(/\W+/);
    if (!separator || !parts || parts.length === 0){
      throw new Error("Invalid date format.");
    }
    return {separator: separator, parts: parts};
  }

  prototype.parseDate = function(dateString, format) {
    var utils = this,
      parsedFormat = parseFormat(format),
      parts = dateString ? dateString.split(parsedFormat.separator) : [],
      nDate = null,
      val;

    if (parts.length === parsedFormat.parts.length) {
      var today = new Date(),
        year = today.getFullYear(),
        day = today.getDate(),
        month = today.getMonth();

      for (var i = 0; i < parsedFormat.parts.length; i++) {
        val = parseInt(parts[i], 10);
        switch(parsedFormat.parts[i]) {
          case 'dd':
          case 'd':
            day = val; break;
          case 'mm':
          case 'm':
            month = val - 1; break;
          case 'yyyy':
            year = val < 40 ? 2000 + val : 1900 + val % 1900; break;
        }
      }

      if (!isNaN(year) && month >= 0 && month <= 11 && day >= 1 && day <= utils.numDaysInMonth(year, month + 1)) {
        nDate = new Date(year, month, day, 0 ,0 ,0);
      }
    }
    return nDate;
  };

  prototype.formatDate = function(date, format) {
    var parsedFormat = parseFormat(format),
      val = {d: date.getDate(), m: date.getMonth() + 1, yyyy: date.getFullYear()};
      
    val.dd = (val.d < 10 ? '0' : '') + val.d;
    val.mm = (val.m < 10 ? '0' : '') + val.m;
    var dateStrArray = [];
    for (var i=0, cnt = parsedFormat.parts.length; i < cnt; i++) {
      dateStrArray.push(val[parsedFormat.parts[i]]);
    }
    return dateStrArray.join(parsedFormat.separator);
  }
}();