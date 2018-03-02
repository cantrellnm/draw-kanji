$(document).on('click', '.link', linkToPage);
function linkToPage() {
  window.location = $(this).attr('data-url');
}

$( document ).ajaxStart(function() {
  $('#loading').show();
});
$(document).ajaxComplete(function() {
  $('#loading').hide();
});