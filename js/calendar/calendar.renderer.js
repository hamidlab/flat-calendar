"use strict";

var CalendarRenderer;
!function($){

  // Constant CLASSes
  var DAY_CLASS       = 'cal-day',
    SELECTED_CLASS    = 'cal-selected ',
    INACTIVE_CLASS    = 'cal-inactive',
    ACTIVE_CLASS      = 'cal-active',
    CAL_HEADER_CLASS  = 'cal-header',
    OUTSIDE_DAY_CLASS = 'cal-na',
    OUTBOUND_CLASS    = 'cal-outbound',
    DAY_LABEL_CLASS   = 'cal-day-label';

  var calendarUtils;
  
  CalendarRenderer = function(options){
    var renderer = this;
    calendarUtils = new CalendarUtils(options);
    renderer.defaults = $.extend({}, calendarDefaults, options);
  }

  var prototype = CalendarRenderer.prototype;

  prototype.renderMonth = function(year, month) {

    var renderer        = this,
      defaults          = renderer.defaults,
      days              = [],
      firstDay          = defaults.firstDay,
      selectedTimeStamp = defaults.selectedDate ? defaults.selectedDate.getTime() : null,
      drawDate          = calendarUtils.newDate(year, month, 1),
      firstDayCurMonth  = drawDate.getDay(),
      minDateTimeStamp  = defaults.minDate ? defaults.minDate.getTime() : null,
      maxDateTimeStamp  = defaults.maxDate ? defaults.maxDate.getTime() : null,
      leadDays          = (firstDayCurMonth - firstDay + 7) % 7;

    calendarUtils.add(drawDate, -leadDays, "d");

    for (var leadDay = 0; leadDay < leadDays; leadDay++) {
      days.push(renderer.renderDayOutsideMonth(drawDate));
      calendarUtils.add(drawDate, 1, "d");
    }

    for (var day = 0; day < defaults.daysLimit; day++) {
      var drawTimeStamp = drawDate.getTime();
      var isSelected = defaults.selectedDate && (drawTimeStamp === selectedTimeStamp);
      var isOutBound = maxDateTimeStamp && drawTimeStamp > maxDateTimeStamp ||
                       minDateTimeStamp && drawTimeStamp < minDateTimeStamp;
      var isInActive = defaults.holidays.indexOf(drawDate.getDay()) > -1;
      days.push(renderer.renderDay(drawDate, {
        selected: isSelected,
        outbound: isOutBound,
        inactive: isInActive
      }));
      calendarUtils.add(drawDate, 1, "d");
    }

    var trailDays = (Math.ceil(days.length / 7) * 7) - days.length;
    for (var trailDay = 0; trailDay < trailDays; trailDay++) {
      days.push(renderer.renderDayOutsideMonth(drawDate));
      calendarUtils.add(drawDate, 1, "d");
    }

    var weeks = [];
    while(days.length){
      var $tr = $('<tr></tr>').append(days.splice(0, 7));
      weeks.push($tr);
    }
    return weeks;
  };

  prototype.renderDay = function(dateToRender, options) {
    var renderer = this,
      timestamp = dateToRender.getTime(),
      date = dateToRender.getDate(),
      classes = [
        DAY_CLASS,
        'cal-timestamp-' + timestamp,
        (options.selected ? SELECTED_CLASS : ""),
        (options.inactive ? INACTIVE_CLASS : (!options.outbound ? ACTIVE_CLASS : '')),
        (options.outbound ? OUTBOUND_CLASS : "")
      ],
      flags = [
        (date == 1 ? 
          '<div class="cal-flag cal-flag-month">' + 
            renderer.defaults.monthNamesShort[dateToRender.getMonth()].split('').join('<br>') + 
          '</div>'
        : '')
      ];

    var dayCell = $('<td class="' + classes.join(' ') + '">'+
      '<div class="cal-cell-w">' +
        flags.join('') +
        '<div class="cal-cell-text">' +
          date +
        '</div>' +
      '</div>' +
    '</td>');

    dayCell.data({
      'options'  : options,
      'cal-date' : dateToRender.getDate(),
      'timestamp': timestamp
    });

    return dayCell;
  };

  prototype.renderHeader = function(year, month) {
    var renderer       = this,
      monthName        = renderer.defaults.monthNames[(month - 1 + 12) % 12],
      currentMonthYear = renderer.defaults.currentFormat.replace('{{month}}', monthName).replace('{{year}}', year);

    return $('<div class="' + CAL_HEADER_CLASS + '">' +
      currentMonthYear +
    '</div>');
  };

  prototype.renderWeekRow = function(){
    var renderer = this,
      headerDays = $('<tr></tr>');

    for (var day = 0; day < 7; day++) {
      var dow = (day + renderer.defaults.firstDay) % 7;
      headerDays.append($('<th class="' + DAY_LABEL_CLASS + '">' + 
        '<div class="cal-cell-w">' +
          '<div class="cal-cell-text">' +
            renderer.defaults.dayNamesMin[dow] + 
          '</div>' +
        '</div>' +
      '</th>'));
    }
    return headerDays;
  }

  prototype.renderDayOutsideMonth = function(dateToRender) {
    return $('<td class="' + OUTSIDE_DAY_CLASS + '"></td>');
  };

  prototype.render = function(year, month){
    var renderer = this,
      $container = $('<div class="cal-container"></div>'),
      $calWeekRow= $('<thead class="cal-week-row"></thead>'),
      $calDays   = $('<tbody class="cal-days-list"></tbody>'),
      $months    = $('<table cellspacing=0 cellpadding=0></table>').append([
        $calWeekRow.append(renderer.renderWeekRow()),
        $calDays.append(renderer.renderMonth(year, month))
      ]),
      $monthsContainer = $('<div class="cal-month-container"></div>').append($months);

    return $container.append([
      renderer.renderHeader(year, month),
      $('<table cellspacing=0 cellpadding=0 class="cal-week-labels"></table>').append($calWeekRow),
      $monthsContainer
    ]);
  };


}(jQuery);