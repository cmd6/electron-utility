const fs = require('fs');

const on = 'C:\\tfs\\elliottelectric_com\\development\\.git';
const off = 'C:\\tfs\\elliottelectric_com\\development\\.git.o';

module.exports = function gitCheck(){
	if (pathExists(on)){
		return true;
	}else if (pathExists(off)){
		return false;
	}else{
		throw new Error('Git path not found');
	}
}

function pathExists(path){
	try{
		fs.accessSync(path);
		return true;
	}catch(err){
		return false;
	}
}