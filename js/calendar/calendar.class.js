"use strict";

var Calendar;
!function($){

  var utils;
  var renderer;
  
  Calendar = function(options){
    var calendar = this,
      defaults = calendar.defaults = $.extend({}, calendarDefaults, options);

    calendar.utils = utils = new CalendarUtils(options);
    calendar.renderer = renderer = new CalendarRenderer(options);

    defaults.numViewMonths = 1;
    defaults.selectedDate = utils.newDate(defaults.selectedDate);
    defaults.minDate = utils.newDate(defaults.minDate);
    defaults.maxDate = utils.newDate(defaults.maxDate);

    var viewDate = defaults.selectedDate || new Date();
    if (!(defaults.hasOwnProperty('viewedMonth'))) {
      defaults.viewedMonth = viewDate.getMonth() + 1;
    }
    if (!(defaults.hasOwnProperty('viewedYear'))) {
      defaults.viewedYear = viewDate.getFullYear();
    }
  }

  var prototype = Calendar.prototype;

  prototype.selectDate = function(day, month, year){
    var calendar = this,
      defaults = calendar.defaults;

    if(defaults.disabled) return;

    var nDate = utils.newDate(year, month, day);
    if (nDate && isNaN(nDate.getFullYear())) return;

    if (nDate && (
        defaults.minDate && nDate.getTime() < defaults.minDate.getTime() ||
        defaults.maxDate && nDate.getTime() > defaults.maxDate.getTime()
      )) {
      return;
    }

    defaults.selectedDate = nDate;

    var firstDateTime = new Date(year, month - 1, 1).getTime(),
      lastDateTime = new Date(year, month - 1 + defaults.numViewMonths, 0).getTime(),
      selectedDateTime = defaults.selectedDate.getTime();

    if (selectedDateTime < firstDateTime || selectedDateTime > lastDateTime) {
      calendar.changeViewedYear(defaults.selectedDate.getFullYear());
      calendar.changeViewedMonth(defaults.selectedDate.getMonth() + 1);
    }
  }

  prototype.changeViewedMonth = function(month) {
    var calendar = this,
      defaults = calendar.defaults;

    if(defaults.disabled) return;

    var firstDateOfMonth = utils.newDate(defaults.viewedYear, month, 1),
      lastDateOfMonth = utils.newDate(defaults.viewedYear, month + 1, 0);

    if (defaults.minDate && lastDateOfMonth.getTime() < defaults.minDate.getTime() ||
        defaults.maxDate && firstDateOfMonth.getTime() > defaults.maxDate.getTime()) {
      return;
    }

    defaults.viewedMonth = firstDateOfMonth.getMonth() + 1;
    defaults.viewedYear = firstDateOfMonth.getFullYear();
  };

  prototype.changeViewedYear = function(year) {
    var calendar = this,
      defaults = calendar.defaults;

    if(defaults.disabled) return;

    var firstDateOfMonth = utils.newDate(year, defaults.viewedMonth, 1),
      lastDateOfMonth = utils.newDate(year, defaults.viewedMonth + 1, 0);

    if (defaults.minDate && lastDateOfMonth.getTime() < defaults.minDate.getTime() ||
        defaults.maxDate && firstDateOfMonth.getTime() > defaults.maxDate.getTime()) {
      return;
    }

    defaults.viewedMonth = firstDateOfMonth.getMonth() + 1;
    defaults.viewedYear = firstDateOfMonth.getFullYear();
  };

  prototype.setDisabled = function(disabled) {
    this.defaults.disabled = disabled;
  };

}(jQuery);