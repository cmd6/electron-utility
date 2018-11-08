const {
	Menu,
	Tray,
	app,
} = require('electron');
const path = require('path');

module.exports = function setupTray() {
	const trayIcon = new Tray(path.resolve(__dirname, '../assets/mozilla_favicon.ico'));
	trayIcon.setTitle('Toolbox');
	const contextMenu = Menu.buildFromTemplate(
		[
			{
				label: 'Show Window',
				type: 'normal',
				click: () => app.emit('activate'),
			},
			{
				label: 'Quit',
				type: 'normal',
				click: () => app.quit(),
			},
		]);

	// Call this again for Linux because we modified the context menu
	trayIcon.setContextMenu(contextMenu);
	trayIcon.on('click', () => app.emit('activate'));

	return trayIcon;

}