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
  var clone = {}

  /*
   *  Events
   */

  function onLoad() {
    showStep(currentTab);

    initInputValidation();
  }

  $(window).ready(onLoad());

  /*
   * Events
   */

  self.onClickStepControllButton = function(step){
    var allFormSteps = $(".steps_form_item");

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
    var message = ""
    var validationResult = true



    if($input.attr('data-validation-type')){
      validType = $input.attr('data-validation-type')
      minValue = +$input.attr('data-min-value')
      maxValue = +$input.attr('data-max-value')
    }

    var inputValue = $input.val()

    if(inputValue == ""){
      message = "This field is required"
      validationResult = false

      validationNotification(false, input, message)
      return
    }

    if(validType == "number"){
      inputValue = +$input.val()

      if(isNaN(inputValue)){
        message = "The value of this field must be a number"
        validationResult = false
        validationNotification(false, $input, message)
        return
      }

      if(inputValue < minValue || inputValue > maxValue){
        message = "The value of this field must be less then "+ maxValue +" and more then "+ minValue +""

        validationResult = false
        validationNotification(false, $input, message)
        return
      }
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
    if (step > 0) {
      $("#prev_step").removeClass('hidden');
    } else {
      $("#prev_step").addClass('hidden');
    }
    if (step == (step.length - 1)) {
      $("#next_step").text('Submit');
    } else {
      $("#next_step").text('Next');
    }
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

