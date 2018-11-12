module.exports = class HostSetting {
	constructor(key, value) {
		this.key = key;
		this.value = value;
		this.warn = false;
		this.totalLines = 0;
		this.activeLines = 0;
	}
};