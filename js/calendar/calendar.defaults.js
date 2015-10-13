"use strict";

var calendarDefaults = {
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  currentFormat: "{{month}} {{year}}",
  holidays: [0], // Index for dayNames
  firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
  dateFormat: "dd-mm-yyyy",
  daysLimit: 180,
  minDate: new Date()
};