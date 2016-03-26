$(document).ready(function(){

  $('.header-menu__menu').on('click', function(e){
    e.preventDefault();
    $('body').toggleClass('normal small');
  });

});

