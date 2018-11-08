function getFunctions(attributeValue) {
	const each = attributeValue.split(',');
	const eachArray = each.map(item => {
		const split = item.split(':');
		return {
			event: split[0],
			function: split[1]
		};
	});
	return eachArray;
}

const bindEvents = function bindEvents(eventFunctions, errorOnMissingFunction = true) {
	document.querySelectorAll('[data-function]').forEach(element => {
		const functionAttrVal = element.getAttribute('data-function');
		const bindings = getFunctions(functionAttrVal);
		bindings.forEach(binding => {
			if (eventFunctions[binding.function]) {
				element.addEventListener(binding.event, event => eventFunctions[binding.function](event, element));
			}else if (errorOnMissingFunction){
				throw new Error('Function not found in bindEvents: ' + binding.function);
			}
		});
	});
};

module.exports = bindEvents;
