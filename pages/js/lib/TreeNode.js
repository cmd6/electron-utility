module.exports = class TreeNode {
	constructor(label, parent = null, options = null) {
		this.label = label;

		if (parent) {
			parent.push(this);
		} else {
			this.parent = null;
		}

		if (options) {
			this.commands = options.commands || ['explorer'];
			this.path = options.path || label.toLowerCase();
			this.subs = options.subs || [];
		} else {
			this.commands = ['explorer'];
			this.path = label.toLowerCase();
			this.subs = [];
		}
		this.subs.forEach(sub => sub.parent = this);
	}

	push(newSub) {
		this.subs.push(newSub);
		newSub.parent = this;
		return newSub;
	}

	getPath() {
		if (this.parent) {
			return `${this.parent.getPath()}\\${this.path}`;
		} else {
			return this.path;
		}
	}
}