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
  var formData = {}

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
    var allFormStepsLength = allFormSteps.length;

    var formStepInputs = $(".steps_form_item.active").find('.input_validated')

    if (!isValidInputs(formStepInputs)) return false;

    $(allFormSteps[currentTab]).removeClass("active");

    currentTab = currentTab + step;
    if (currentTab >= allFormStepsLength) {
      $("#form").submit();
      return false;
    }

    if(currentTab >= (allFormStepsLength - 1)){
      showAllData()
      changeButtonNext('submit')
    }else{
      changeButtonNext('next')
    }

    showStep(currentTab);
  }

  function showAllData(){
    var $lastStepBlock = $('#last_step ul')
    $lastStepBlock.html('')

    for(var key in formData){
      var item = '<li><span class="title">'+ key +':</span>'+ formData[key] +'</li>'

      $lastStepBlock.append(item)

    }
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

      if(!validateInput($item)){
        isValid = false
      }else{
        var $itemId = $item[0].id
        var $itemValue = $item.val()

        formData[$itemId] = $itemValue
      }
    }
    return isValid
  }

  function validateInput(input){
    var $input = $(input)
    var validType = ''
    var isRequired = false;
    var validationResult = true;

    if($input.attr('data-validation-type')){
      validType = $input.attr('data-validation-type')
    }

    if($input.attr('required')){
      isRequired = true
    }

    var inputValue = $input.val()

    if(inputValue == "" && isRequired){
      message = "This field is required"
      validationResult = false

      validationNotification(false, input, message)
      return
    }

    if(validType == "number"){
      var minValue = ''
      var maxValue = ''
      var message = ""

      if(!isValueNumber(inputValue) && !isValueInteger(inputValue)){
        message = "The value of this field must be an integer number"
        validationResult = false
        validationNotification(false, $input, message)
        return
      }else{
        inputValue = +inputValue
        minValue = +$input.attr('data-min-value')
        maxValue = +$input.attr('data-max-value')
      }

      if(!isValueInBeth(minValue, maxValue, inputValue)){
        message = "The value of this field must be less then "+ maxValue +" and more then "+ minValue +""

        validationResult = false
        validationNotification(false, $input, message)
        return
      }
    }

    if(validType == "inn"){
      if(!isValueNumber(inputValue) && !isValueInteger(inputValue)){
        message = "The value of this field must be an integer number"
        validationResult = false
        validationNotification(false, $input, message)
        return
      }else{
        inputValue = +inputValue
      }

      if(!isAdulthood(inputValue)){
        message = "Sorry, your age must be at least 21 years old"
        validationResult = false
        validationNotification(false, $input, message)
        return
      }

      if(!isValueLength(inputValue)){
        message = "The value length of this field must be 10 digits"

        validationResult = false
        validationNotification(false, $input, message)
        return
      }
    }

    return validationResult
  }

  function isValueNumber(value){
    var valueToNumber = +value;
    var result = true;

    if(isNaN(valueToNumber)){
      result = false
    }

    return result
  }

  function isValueInBeth(minValue, maxValue, value){
    var result = true

    if(value < minValue || value > maxValue){
      result = false
    }

    return result
  }

  function isValueInteger(value){
    var result = false

    if(Number.isInteger(value)){
      result = true
    }

    return result
  }

  function isValueLength(value){
    var result = false
    var valueLength = Math.floor( Math.log(value) / Math.LN10 ) + 1

    if(valueLength == 10){
      result = true
    }

    return result
  }

  function isAdulthood(value){
    var result = true
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var valueToString = ''+value
    var innDayCount = valueToString.substring(0, 5) * 1 - 1;
    var startDate = new Date(1900,00,01);
    startDate.setDate(startDate.getDate() + innDayCount);

    var birthYear = startDate.getFullYear()
    var userYears = currentYear - birthYear

    if(userYears <= 21){
      result = false
    }

    return result

  }

  function validationNotification(result, input, massage){
    var $input = $(input)
    if(result){
      return
    }

    if($input.hasClass('is-invalid')){
      $input.removeClass('is-invalid')

      setTimeout(function(){
        $input.addClass('is-invalid')
      }, 1)
    }else{
      $input.addClass('is-invalid')
    }

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

    toggleButtonPrev(step)

    fixStepIndicator(step)
  }

  function toggleButtonPrev(step){
    if (step > 0) {
      $("#prev_step").removeClass('hidden');
    } else {
      $("#prev_step").addClass('hidden');
    }
  }

  function changeButtonNext(buttonText){
    var $buttonNext =  $("#next_step");

    if (buttonText == 'submit') {
      $buttonNext.text('submit');
      $buttonNext.removeClass('bg_green');
      $buttonNext.addClass('bg_blue');
    }else if($buttonNext.hasClass('bg_blue')){
      $buttonNext.text('next');
      $buttonNext.removeClass('bg_blue');
      $buttonNext.addClass('bg_green');
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

