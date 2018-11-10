const fs = require('fs');

const on = 'C:\\tfs\\elliottelectric_com\\development\\.git';
const off = 'C:\\tfs\\elliottelectric_com\\development\\.git.o';

module.exports = function gitToggle(turnOn, callbackHell){
	if (turnOn){
		fs.rename(off, on, function (err) {
			if (err) throw err;
			callbackHell();
		});
	}else{
		fs.rename(on, off, function (err) {
			if (err) throw err;
			callbackHell();
		});
	}
}
