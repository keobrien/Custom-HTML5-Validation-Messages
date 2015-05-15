# Custom HTML5 Validation Messages
Plugin allows customizing HTML5 validation messages using data attributes on an element.  Simply use any of the validity states in the reference below as a data attribute on a form element. This will define the custom message that appears when that element is in that validity state. This is a jQuery plugin so jQuery is required.

https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms/Data_form_validation#Validating_forms_using_JavaScript

## Example Use:
`<form>
	<input type="text" required pattern="[0-9]+" data-patternMismatch="Input must be a number." data-valueMissing="This field is required." />
</form>
$('form').customValidationMsgs();`

## Supported validation States
* valueMissing
* typeMismatch
* patternMismatch
* tooLong
* rangeUnderflow
* rangeOverflow
* stepMismatch
* valid