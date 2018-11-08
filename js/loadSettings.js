const fs = require('fs');
const path = require('path');

const settingsPath = path.resolve(__dirname, '../storage/settings.json');

try {
	fs.accessSync(settingsPath);
} catch (err) {
	fs.writeFileSync(settingsPath, JSON.stringify({
		tfsPath: 'C:\\tfs'
	}), {
		encoding: 'utf8'
	});
}

const settings = fs.readFileSync(settingsPath, {
	encoding: 'utf8'
});

module.exports = JSON.parse(settings);