$(document).ready(function () {
  var template_html = $('#template').html();
  var template_function = Handlebars.compile(template_html);

  var startingDate = '2018-01-01';
  var date = moment(startingDate, 'YYYY-MM-DD');
  monthComplier(date);
  callApi(date);

  //vado avanti di mese
  $('.next_month').click(function () {
    nextMonth(date,this)
    callApi(date);
  });

  //vado indietro di mese
  $('.prev_month').click(function () {
    prevMonth(date)
    callApi(date);
  });

  //richiamo l'api in modo da marchiare i giorni festivi
  function callApi(date) {
    $.ajax({
      'url': 'https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0',
      'method': 'GET',
      'data':{
        'month': date.month()
      },
      'success': function (holidays) {
        $('li').each(function () {
          //console.log($(this).attr('data-giorno'));
          //console.log(holidays.response);
          var current_day = $(this).attr('data-giorno');
          for (var i = 0; i < holidays.response.length; i++) {
            if(current_day.includes(holidays.response[i].date)){
              $(this).addClass('red');
              $(this).find('.festività').text(holidays.response[i].name);
            };
          };
        });
      },
      'error': function () {
        alert('errore');
      }
    });
  }

  function nextMonth(date) {
    if ($('h1').text() != 'December 2018') {
      $('.next_month').show();
      date.add(1, 'months');
      //reimposto l'html di calendar vuoto in modo che la funzione chiama nella riga successiva va ad appendere poi i giorni del mese successivo
      $('.calendar').html('');
      monthComplier(date);
      $('.next_month').attr('disabled', false)
      $('.prev_month').attr('disabled', false)
    }else {
      $('.next_month').attr('disabled', true)
    }
  }

  function prevMonth(date) {
    if ($('h1').text() != 'January 2018') {
      date.subtract(1, 'months');
      //reimposto l'html di calendar vuoto in modo che la funzione chiama nella riga successiva va ad appendere poi i giorni del mese precedente
      $('.calendar').html('');
      monthComplier(date);
      $('.prev_month').attr('disabled', false)
      $('.next_month').attr('disabled', false)
    }else {
      $('.prev_month').attr('disabled', true)
    }
  }

  //funzione che mi genera il mese
  function monthComplier(date){
    var dayInMonth = date.daysInMonth();
    var month = date.format('MMMM');
    var year = date.format('YYYY');

    $('.current_month').text(month + ' ' + year);

    for (var i = 1; i <= dayInMonth; i++){
      var day = i + ' ' + month;

      //se la i < 10 aggiungo uno 0 davanti in modo da avere lo stesso formato dell'api
      if (i < 10) {
        var days = {
          'day_template': day,
          'data_day': date.format('YYYY-MM-0'+i)
        }
      }else {
        var days = {
          'day_template': day,
          'data_day': date.format('YYYY-MM-'+i)
        }
      }

      $('.calendar').append(template_function(days));
    }
  };
});
