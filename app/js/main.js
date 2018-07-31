(function() {
  /*
   *  Fields
   */

  var self = window.controllerBase || {};
  window.controllerBase = self;

  /*
   *  Constants
   */

  var currentTab = 0;


  /*
   *  Events
   */

  function onLoad() {
    showStep(currentTab);

    cloneDataFromJson();
  }

  function onClickFormControls(){
    $('#next_step').on('click', function() {
      onClickButtonNext()
    })

    $('#prev_step').on('click', function() {
      onClickButtonPrev()
    })
  }

  //function onClickButtonNext() {
  //  var stepsProgressBar = $('.steps_progress_bar');
  //  var activeProgressStep = stepsProgressBar.find('.steps_progress_bar_item.active');
  //  var nextProgressStep = activeProgressStep.next('.steps_progress_bar_item');
  //
  //  var stepsFormStage = $('.steps_form_stage');
  //  var activeFormStep = stepsFormStage.find('.steps_form_item.active');
  //  var nextFormStep = activeFormStep.next('.steps_form_item');
  //
  //  var formsStage = $('.steps_form_stage');
  //  var formsStageCurrentTranslate = parseInt(formsStage.css('transform').split(',')[4]);
  //  var nextFormStepWidth = nextFormStep.width();
  //  var resultTransform = null
  //
  //  debugger
  //
  //  if(isNaN(formsStageCurrentTranslate)){
  //    resultTransform = -1*(nextFormStepWidth)
  //  }
  //  else{
  //    resultTransform = formsStageCurrentTranslate - nextFormStepWidth
  //  }
  //
  //
  //  if(nextFormStep.length > 0){
  //    formsStage.css({'transform' : 'translate('+ resultTransform +'px, 0)'});
  //    activeFormStep.removeClass('active');
  //    nextFormStep.addClass('active');
  //
  //    activeProgressStep.removeClass('active');
  //    activeProgressStep.addClass('done');
  //    nextProgressStep.addClass('active');
  //  }
  //}
  //
  //function onClickButtonPrev() {
  //  var stepsProgressBar = $('.steps_progress_bar');
  //  var activeProgressStep = stepsProgressBar.find('.steps_progress_bar_item.active');
  //  var prevProgressStep = activeProgressStep.prev('.steps_progress_bar_item');
  //
  //
  //  var stepsFormStage = $('.steps_form_stage');
  //  var activeFormStep = stepsFormStage.find('.steps_form_item.active');
  //  var prevFormStep = activeFormStep.prev('.steps_form_item');
  //
  //  if(prevFormStep.length > 0){
  //    activeFormStep.removeClass('active');
  //    prevFormStep.addClass('active');
  //
  //    activeProgressStep.removeClass('active');
  //    prevProgressStep.removeClass('done');
  //    prevProgressStep.addClass('active');
  //  }
  //}


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


  function showStep(step) {
    var stepsStage = $('.steps_form_stage');
    var allFormSteps = $('.steps_form_item');

    for (var i = 0; i < allFormSteps.length; i++) {
      $(allFormSteps[i]).removeClass('active')
    }
    $(allFormSteps[step]).addClass('active');

    var translateCoficient = 100*step;
    stepsStage.css('transform', 'translate(-'+translateCoficient+'%, 0)');

    correctControlsButtons(step)

    fixStepIndicator(step)
  }

  function correctControlsButtons(step){
    if (step == 0) {
      $("#prev_step").addClass('hidden');
    } else {
      $("#prev_step").removeClass('hidden');
    }
    if (step == (step.length - 1)) {
      $("#next_step").text('Submit');
    } else {
      $("#next_step").text('Next');
    }
  }

  self.onClickStepControllButton = function(step){
    // This function will figure out which tab to display
    var allFormSteps = $(".steps_progress_bar_item");

    // Exit the function if any field in the current tab is invalid:
    if (step == 1 && !validateForm()) return false;
    // Hide the current tab:
    $(allFormSteps[currentTab]).removeClass("active");

    // Increase or decrease the current tab by 1:
    currentTab = currentTab + step;

    // if you have reached the end of the form...
    if (currentTab >= allFormSteps.length) {
      // ... the form gets submitted:
      $("#form").submit();
      return false;
    }

    // Otherwise, display the correct tab:
    showStep(currentTab);
  }

  function validateForm() {
    // This function deals with validation of the form fields
    var valid = true;
    var allFormSteps = $(".steps_form_item");
    var stepItemInputs = $(allFormSteps[currentTab]).find("input");
    // A loop that checks every input field in the current tab:
    for (var i = 0; i < stepItemInputs.length; i++) {
      if (stepItemInputs[i].required && stepItemInputs[i].value == "") {
        // add an "invalid" class to the field:
        $(stepItemInputs[i]).addClass("is-invalid");
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      $(allFormSteps[currentTab]).addClass("done");
    }
    return valid; // return the valid status
  }

  function fixStepIndicator(step) {
    var allProgressBarSteps = $(".steps_progress_bar_item");

    for (var i = 0; i < allProgressBarSteps.length; i++) {
      $(allProgressBarSteps[i]).removeClass("active");
    }

    $(allProgressBarSteps[step]).addClass("active");
  }

})();

