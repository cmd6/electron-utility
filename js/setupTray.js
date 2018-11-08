const {
	Menu,
	Tray
} = require('electron');
const path = require('path');

let appIcon = null;

module.exports = function setupTray() {
	appIcon = new Tray(path.resolve(__dirname, '../assets/mozilla_favicon.ico'));
	const contextMenu = Menu.buildFromTemplate([{
			label: 'Item1',
			type: 'radio'
		},
		{
			label: 'Item2',
			type: 'radio'
		}
	]);

	// Make a change to the context menu
	contextMenu.items[1].checked = false;

	// Call this again for Linux because we modified the context menu
	appIcon.setContextMenu(contextMenu);

}