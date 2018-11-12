const {
	Menu,
	Tray,
	app,
	nativeImage,
} = require('electron');
const fs = require('fs');
const path = require('path');

const HostKeys = require('./HostKeys');

const hostsFilePath = 'C:\\Projects\\Electron\\Toolbox\\resources\\app\\localtests\\hoststest';
const redIcon = nativeImage.createFromPath(path.resolve(__dirname, '../assets/red_network_32.ico')).resize({
	width: 16,
	height: 16
});
const greenIcon = nativeImage.createFromPath(path.resolve(__dirname, '../assets/green_network_32.ico')).resize({
	width: 16,
	height: 16
});

let hostsTrayIcon;

function getIcon() {
	const groups = new HostKeys(fs.readFileSync(hostsFilePath, 'utf8').split('\n'));
	return shouldUseRed(groups) ? redIcon : greenIcon;
}

function shouldUseRed(hostKeys) {
	let shouldI = false;
	hostKeys.allKeys.forEach((v, k) => {
		v.forEach((v1, k1) => {
			if (v1.warn && v1.activeLines > 0) {
				shouldI = true;
			}
		});
	});

	return shouldI;

}

function updateHostsFile(key, value) {
	//##key:DB Server
	const hostsContents = fs.readFileSync(hostsFilePath, 'utf8');
	const restStart = hostsContents.indexOf('##key:' + key);
	const hostsStart = hostsContents.substring(0, restStart);
	const hostsRest = hostsContents.substring(restStart);

	const nextKey = hostsRest.indexOf('##key:');
	const clear = hostsRest.indexOf('##clear');

	let stop = 0;
	if (nextKey >= 0 && clear === -1 || clear > nextKey) {
		stop = nextKey;
	} else if (clear >= 0) {
		stop = clear;
	} else {
		stop = hostsRest.length;
	}

	const hostsEnd = hostsRest.substring(stop);
	const hostsSection = hostsRest.substring(0, stop);
	// const groups = new HostKeys(fs.readFileSync(hostsFilePath, 'utf8').split('\n'));
}

function buildContextMenu() {
	const groups = new HostKeys(fs.readFileSync(hostsFilePath, 'utf8').split('\n'));
	const newTemplate = [];
	newTemplate.push({
		label: stuff,
		type: 'normal',
	});
	groups.allKeys.forEach((val, key) => {
		const newSub = [];
		let useRed = false;
		val.forEach((val1, key1) => {
			newSub.push({
				label: key1,
				sublabel: val1.activeLines > 0 && val1.activeLines !== val1.totalLines ? `${val1.activeLines} of ${val1.totalLines}` : undefined,
				type: 'checkbox',
				checked: val1.activeLines > 0,
				click: () => hostsTrayIcon.emit('updateHosts', key, key1),
			});
			if (val1.warn && val1.activeLines > 0) useRed = true;
		});
		newSub.push({
			type: 'separator',
		});
		newSub.push({
			label: 'Off',
			type: 'checkbox',
			checked: false,
			click: hostsTrayIcon.emit('updateHosts', key, null),
		});
		newTemplate.push({
			label: key,
			submenu: newSub,
			icon: useRed ? redIcon : greenIcon,
		})
	});
	return Menu.buildFromTemplate(newTemplate);
}

module.exports = function setupHostsTray() {
	hostsTrayIcon = new Tray(getIcon());

	hostsTrayIcon.setTitle('Hosts');
	hostsTrayIcon.setToolTip('Hosts');

	hostsTrayIcon.on('click', () => {
		hostsTrayIcon.setContextMenu(buildContextMenu());
		hostsTrayIcon.popUpContextMenu();
	});

	hostsTrayIcon.on('updateHosts', (key, value) => {
		updateHostsFile(key, value);
		hostsTrayIcon.setImage(getIcon());
	});
	// trayIcon.on('click', () => trayIcon.setImage(getIcon()));
	// trayIcon.on('click', () => trayIcon.popUpContextMenu());
	// trayIcon.on('click', () => app.emit('activate'));

	return hostsTrayIcon;

}