const {
	Menu,
	Tray,
	app,
} = require('electron');
const path = require('path');

module.exports = function setupTray() {
	const trayIcon = new Tray(path.resolve(__dirname, '../assets/gear.ico'));
	trayIcon.setTitle('Toolbox');
	const contextMenu = Menu.buildFromTemplate(
		[
			{
				label: 'Show Window',
				type: 'normal',
				click: () => app.emit('activate'),
			},
			{
				label: 'Minimize Window',
				type: 'normal',
				click: () => app.emit('mainWindow-minimize'),
				accelerator: 'CommandOrControl+M'
			},
			{
				label: 'Close Window',
				type: 'normal',
				click: () => app.emit('mainWindow-close'),
				accelerator: 'CommandOrControl+W'
			},
			{
				type: 'separator'
			},
			{
				label: 'Exit Toolbox',
				type: 'normal',
				click: () => app.quit(),
				accelerator: 'CommandOrControl+Q'
			},
		]);

	// Call this again for Linux because we modified the context menu
	trayIcon.setContextMenu(contextMenu);
	trayIcon.on('click', () => trayIcon.popUpContextMenu());
	// trayIcon.on('click', () => app.emit('activate'));

	return trayIcon;

}