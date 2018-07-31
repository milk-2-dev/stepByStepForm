(function() {
  /*
   *  Fields
   */

  var self = window.controllerBase || {};
  window.controllerBase = self;

  /*
   *  Fields
   */

  var currentTab = 0;

  /*
   *  Events
   */

  function onLoad() {
    showStep(currentTab);

    initInputValidation();

    cloneDataFromJson();
  }

  $(window).ready(onLoad());

  /*
   * Events
   */

  self.onClickStepControllButton = function(step){
    var allFormSteps = $(".steps_form_item");

    //todo: will be better if 'formStepInputs' was an array
    var formStepInputs = $(".steps_form_item.active").find('.input_validated')

    var test = isValidInputs(formStepInputs)

    if (!test) return false;

    $(allFormSteps[currentTab]).removeClass("active");

    currentTab = currentTab + step;

    if (currentTab >= allFormSteps.length) {

      $("#form").submit();
      return false;
    }

    showStep(currentTab);
  }

  function initInputValidation(){
    var $input = $('.input_validated')

    $input.on('focus', function(e){
      $(e.target).removeClass('is-invalid')
    })

    $input.on('blur', function(e){
      validateInput(e.target)
    })
  }

  function isValidInputs(inputsInStep){
    var isValid = true


    for (var i = 0; i < inputsInStep.length; i++) {
      var $item = $(inputsInStep[i])
      var test = validateInput($item)

      if(!test){
        isValid = false
      }
    }
    return isValid
  }

  function validateInput(input){
    var $input = $(input)
    var validType = ''
    var minValue = ''
    var maxValue = ''
    var $targetInput = ''
    var message = ""
    var validationResult = true

    if($input.attr('data-validation-type')){
      validType = $input.attr('data-validation-type')
      minValue = +$input.attr('data-min-value')
      maxValue = +$input.attr('data-max-value')
    }

    var inputValue = +$input.val()

    if(inputValue == ""){
      message = "This field is required"
      validationResult = false

      validationNotification(false, input, message)
      return
    }

    if(validType == "number" && inputValue != ""){
      if(isNaN(inputValue)){
        message = "The value of this field must be a number"
        validationResult = false
        validationNotification(false, $targetInput, message)
        return
      }
    }

    if(inputValue < minValue || inputValue > maxValue){
      message = "The value of this field must be less then "+ maxValue +" and more then "+ minValue +""

      validationResult = false
      validationNotification(false, $targetInput, message)
      return
    }

    return validationResult
  }

  function validationNotification(result, input, massage){
    var $input = $(input)
    if(result){
      return
    }

    $input.val('')
    $input.addClass('is-invalid')
    $input.parent().find('.invalid-feedback').text(massage)
  }

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

  //private
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

      if(i < step){
        $(allProgressBarSteps[i]).addClass("done");
      }
    }

    $(allProgressBarSteps[step]).addClass("active");
  }

})();

