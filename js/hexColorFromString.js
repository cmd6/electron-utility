// from https://stackoverflow.com/a/3426956

function hashCode(str) { // java String#hashCode
	let hash = 0;
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
}

function intToRGB(i) {
	const c = (i & 0x00FFFFFF)
		.toString(16)
		.toUpperCase();

	return "00000".substring(0, 6 - c.length) + c;
}

function getInverse(i) {
	const r = 255 -parseInt(i.substr(0, 2), 16);
	const g = 255 - parseInt(i.substr(2, 2), 16);
	const b = 255 - parseInt(i.substr(4, 2), 16);
	return (('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2)).toUpperCase();
}

module.exports = {
	stringToColor: input => intToRGB(hashCode(input.toLowerCase())),
	stringToColorInverse: input => getInverse(intToRGB(hashCode(input.toLowerCase()))),
};