const HostSetting = require('./HostSetting');

module.exports = class HostKeys {
	constructor(hostLines) {

		this.allKeys = new Map();

		const currentData = {
			currentKey: undefined,
			currentValue: undefined,
		};

		hostLines.forEach(line => this.parseLine(currentData, line));

		console.log(this.allKeys);

	}

	parseLine(currentData, line) {
		const directiveIndex = line.indexOf('##');

		if (!(currentData.currentKey && currentData.currentValue) && directiveIndex < 0) {
			return;
		}

		const tokenLine = HostKeys.rtokenize(line.substring(0, directiveIndex >= 0 ? directiveIndex : undefined));

		let isLine = false;
		if (directiveIndex < 0) {
			if (tokenLine.length > 0 && currentData.currentKey && currentData.currentValue) {

				const current = this.allKeys.get(currentData.currentKey).get(currentData.currentValue);

				if (tokenLine[0] !== '#') {
					current.activeLines++;
				}

				current.totalLines++;

			}

			return;
		} else if (directiveIndex > 0) {
			isLine = true; // line directive
		}

		const directives = line.substring(directiveIndex + 2).split(':');

		switch (directives[0].toLowerCase()) {
			case 'clear':
				currentData.currentKey = undefined;
				currentData.currentValue = undefined;
				break;

			case 'key':
				if (isLine) return; // keys can't be inline

				currentData.currentKey = directives[1];
				currentData.currentValue = undefined;

				if (currentData.currentKey && !this.allKeys.has(currentData.currentKey)) this.allKeys.set(currentData.currentKey, new Map());

				break;

			case 'value':
				if (currentData.currentKey && this.allKeys.has(currentData.currentKey)) {
					const thisKey = this.allKeys.get(currentData.currentKey);

					let thisValue = thisKey.get(directives[1]);
					if (!thisValue) {
						thisValue = new HostSetting(currentData.currentKey, directives[1]);
						thisKey.set(directives[1], thisValue);
					}

					if (directives[2] && directives[2].toLowerCase() === 'warn') {
						thisValue.warn = true;
					}

					if (!isLine) {
						currentData.currentValue = directives[1];
					} else {
						thisValue.totalLines++;
						if (tokenLine[0] !== '#') {
							thisValue.activeLines++;
						}
					}
				}
				break;
		}
	}

	static rtokenize(line) {
		return line.match(/(\#|\S*)/g).filter(l => l !== '');
	}

};