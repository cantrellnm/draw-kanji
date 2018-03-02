$(document).on('turbolinks:load', filterSetup);

function filterSetup() {
  var levelOptions = {joyo: [1,2,3,4,5,6,9], jlpt: ['N5','N4','N3','N2','N1'], wk: []};
  for (var i=1;i < 61;i++) {
    levelOptions.wk.push(i);
  }
  
  $('#filter-form').on('change', ':input', inputChange);
  $('#filter-form').on('keyup change', 'input[type="text"]', inputChange);
  $('#filter-form').on('click', '#reset', resetForm)
  
  function inputChange(e) {
    $('#kanji-page').val(1);
    if (e.target.id === 'filter') {
      if ( levelOptions[$('#filter').val()] ) {
        setLevels();
      } else {
        $('select[name="level"]').html('').hide();
      }
    }
    submitFilterForm();
  }
  
  function resetForm() {
    $('#kanji-page').val(1);
    $('input[name="query"]').val('')
    $('select[name="filter"]').val('')
    $('select[name="level"]').html('').hide();
    submitFilterForm();
  }
  
  function setLevels() {
    var txt = '';
    levelOptions[$('select#filter').val()].forEach(function(lvl) {
      txt += '<option value="'+lvl+'">'+lvl+'</option>';
    });
    // $('select[name="category"]').html('').hide();
    $('select[name="level"]').html(txt).show();
  }
  
  function submitFilterForm() {
     var form = $('#filter-form'),
        url = form.attr("action");
    // Submit ajax request
    $.ajax({
      url: url,
      data: form.serialize(),
      type: 'GET',
      dataType: 'script'
    });
  }
}