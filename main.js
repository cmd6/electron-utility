const {
	app,
	BrowserWindow,
	globalShortcut,
} = require('electron');

const firstInstance = app.requestSingleInstanceLock();

if (!firstInstance) {
	app.quit();
} else {

	require('./js/loadSettings');

	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	let windows = {
		main: null,
	};

	app.on('second-instance', () => {
		if (windows.main) {
			windows.main.focus();
		} else {
			createWindow();
		}
	})
	const setupTray = require('./js/setupTray');
	const setupHostsTray = require('./js/setupHostsTray');
	let mainTray;
	let hostsTray;

	function setup() {
		app.setName('Toolbox');
		globalShortcut.register('CmdOrCtrl+Shift+Q', () => app.quit());
		globalShortcut.register('CmdOrCtrl+Shift+W', () => app.emit('mainWindow-close'));
		globalShortcut.register('CmdOrCtrl+Shift+M', () => app.emit('mainWindow-minimize'));
		globalShortcut.register('CmdOrCtrl+Shift+T', () => windows.main && windows.main.isFocused() ? windows.main.close() : app.emit('activate'));
		mainTray = setupTray();
		hostsTray = setupHostsTray();
		createWindow();
	}

	function createWindow() {

		// Create the browser window.
		windows.main = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				nodeIntegrationInWorker: true
			}
		});

		windows.main.maximize();

		// and load the index.html of the app.
		windows.main.loadFile('./pages/work.html');
		// Open the DevTools.
		// windows.main.webContents.openDevTools()

		// Emitted when the window is closed.
		windows.main.on('closed', () => {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			windows.main = null;
		});

	}

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on('ready', setup);

	// Quit when all windows are closed.
	// app.on('window-all-closed', () => {
	// 	// On macOS it is common for applications and their menu bar
	// 	// to stay active until the user quits explicitly with Cmd + Q
	// 	// if (process.platform !== 'darwin') {
	// 	// 	app.quit();
	// 	// }
	// });

	app.on('activate', () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (windows.main === null) {
			createWindow();
		} else {
			windows.main.focus();
		}
	});

	app.on('mainWindow-minimize', () => {
		if (windows.main === null) {
			app.emit('activate');
		}else if (windows.main.isMinimized()){
			windows.main.restore();
		}else{
			windows.main.minimize();
		}
	});

	app.on('mainWindow-close', () => {
		if (windows.main !== null) {
			windows.main.close();
		}
	});

	// In this file you can include the rest of your app's specific main process
	// code. You can also put them in separate files and require them here.

	require('./js/setupMenu');
}