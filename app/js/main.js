(function() {
  /*
   *  Fields
   */

  var self = window.controllerBase || {};
  window.controllerBase = self;

  /*
   *  Events
   */

  function onLoad() {
    cloneDataFromJson();
    onClickFormControls();
  }

  function onClickFormControls(){
    $('#next_step').on('click', function() {
      onClickButtonNext()
    })

    $('#prev_step').on('click', function() {
      onClickButtonPrev()
    })
  }

  function onClickButtonNext() {
    var stepsStage = $('.steps_form-stage');
    var activeStep = stepsStage.find('.steps_form_item.active');
    var nextStep = activeStep.next('.steps_form_item');


    if(nextStep.length > 0){
      activeStep.removeClass('active');
      nextStep.addClass('active');
    }
  }

  function onClickButtonPrev() {
    var stepsStage = $('.steps_form-stage');
    var activeStep = stepsStage.find('.steps_form_item.active');
    var prevStep = activeStep.prev('.steps_form_item');

    if(prevStep.length > 0){
      activeStep.removeClass('active');
      prevStep.addClass('active');
    }
  }


  $(window).ready(onLoad());

  /*
   * Methods
   */

  function cloneDataFromJson() {
    $.getJSON('teachers.json', function(data) {
      for (var key in data){
        clone[ key ] = data[ key ];
      }
    });
  }

  function getDataToModal(modalId, teacher) {
    var modal = $('#' + modalId);
    var teacherId = teacher;
    var NameBlock = modal.find('[data-name]');
    var DescriptionBlock = modal.find('[data-description]');
    var CertificatesBlock = modal.find('[data-certificates]');

    NameBlock.html(clone[ teacherId ].name);
    DescriptionBlock.html(clone[ teacherId ].description);

    for (var i = 0; i < clone[ teacherId ].certificates.length; i++){
      CertificatesBlock.append('<div class="col-md-6"><img src="' + clone[ teacherId ].certificates[ i ] + '" alt=""></div>');
    }

    showCloneModal(modal);
  }

})();

