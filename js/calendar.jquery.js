!function($){

  function updateDate(dateString, $calField){
    var calendar = $calField.data('calendar'),
      $calendar = $calField.data('$calendar');

    var fieldDate = calendar.utils.parseDate(dateString, 'dd-mm-yyyy');
    if(!fieldDate) {
      if(calendar.defaults.selectedDate) {
        $calField.val(calendar.utils.formatDate(calendar.defaults.selectedDate, 'dd-mm-yyyy'));
      }else{
        $calField.val('');
      }
      return;
    }
    var $td = $('.cal-timestamp-' + fieldDate.getTime(), $calendar),
      tdData = $td.data() || {};
    if(tdData.options && !tdData.options.inactive && !tdData.options.outbound){
      calendar.selectDate(fieldDate.getDate(), fieldDate.getMonth() + 1, fieldDate.getFullYear());
      $('.cal-day', $calendar).removeClass('cal-selected');
      $td.addClass('cal-selected');
    }else{
      if(calendar.defaults.selectedDate) {
        $calField.val(calendar.utils.formatDate(calendar.defaults.selectedDate, 'dd-mm-yyyy'));
      }else{
        $calField.val('');
      }
    }
  };

  jQuery.fn.calendar = function(options) {
    var defaults = {};
    var settings = $.extend({}, defaults, options);

    return this.each(function() {
      var $calField = $(this),
        calData = $calField.data('calendar'),
        today   = new Date();

      if(calData) settings = $.extend({}, settings, $calField.data('calendar'));

      var calendar = new Calendar(settings),
        $calendar  = calendar.renderer.render(today.getFullYear(), today.getMonth() + 1);

      $calField.data({
        calendar: calendar,
        $calendar: $calendar
      });
      
      $('body').append($calendar);
      $(document).on('click', function(e){
        var $target = $(e.target);
        if($target.is($calField) || $target.closest($calendar).length){
          $calendar.css({
            'top': $calField.offset().top + $calField.outerHeight() + 5,
            'left': $calField.offset().left,
            'display': 'block'
          });
        }else{
          $calendar.css('display', 'none');
        }
      });

      updateDate($calField.val(), $calField);

      $calField.on('change', function(e){
        updateDate($calField.val(), $calField);
      });

      $calendar.on('click', '.cal-active', function(e){
        e.preventDefault();
        var $this = $(this),
          timestamp = $this.data('timestamp'),
          date = new Date(timestamp);

        calendar.selectDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
        $('.cal-day', $calendar).removeClass('cal-selected');
        $this.addClass('cal-selected');
        $calField.val(calendar.utils.formatDate(date, 'dd-mm-yyyy'));
      });

      $('.cal-month-container', $calendar).on('scroll', function(e){
        var distance = 1000,
          date;
        $('.cal-flag-month', $calendar).each(function(){
          var $td = $(this).closest('td'),
            trTop = Math.abs($td.closest('tr').position().top);

          if(trTop < distance) {
            distance = trTop;
            date = new Date($td.data('timestamp'));
          }
          if(date) $('.cal-header', $calendar).replaceWith(calendar.renderer.renderHeader(date.getFullYear(), date.getMonth()+1));

        });
      });

    });

  };

}(jQuery);