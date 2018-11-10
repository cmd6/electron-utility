window.jQuery = window.$ = require('jquery');

(function IndexInit() {

	const {
		exec
	} = require('child_process');

	const TreeNode = require('./js/lib/TreeNode');
	const bindEvents = require('./js/lib/bindEvents');

	const commands = {
		code: 'C:\\Program Files\\Microsoft VS Code\\code',
		explorer: 'C:\\Windows\\explorer.exe',
	};

	const paths = {
		toolbox: 'C:\\Projects\\Electron\\Toolbox\\resources\\app',
		projects: 'C:\\Projects',
		kids: 'C:\\Work\\kids',
		kidsapi: 'C:\\Work\\kidsapi',
		makegoodtech: 'C:\\MakeGoodTech',
		'makegood.tech': 'C:\\makegood.tech',
		code: 'C:\\Code',
		webapps: 'C:\\WebApps',
		development: 'C:\\Development',
	};

	const projectsTree = new TreeNode('Projects', null, {
		path: 'C:\\Projects',
	});
	const learningTree = new TreeNode('Learning', projectsTree);
	new TreeNode('.NET', learningTree, {
		path: 'dotnet',
	});
	const expressTree = new TreeNode('ExpressJS', learningTree);
	new TreeNode('LocalLibrary', expressTree, {
		commands: ['explorer', 'code'],
	});
	new TreeNode('MyApp', expressTree, {
		commands: ['explorer', 'code'],
	});
	const herokuTree = new TreeNode('Heroku', learningTree);
	new TreeNode('Getting Started', herokuTree, {
		path: 'node-js-getting-started',
		commands: ['explorer', 'code'],
	});

	const eventFunctions = {
		run: (ev, elem) => {
			const dataCommand = elem.getAttribute('data-command');
			const dataPath = elem.getAttribute('data-path');

			const command = commands[dataCommand] ? commands[dataCommand] : dataCommand;
			const path = paths[dataPath] ? paths[dataPath] : dataPath;

			exec(`"${command}" "${path}"`);
		},
	};

	// window.addEventListener('keypress', event => event.ctrlKey && event.code === 'KeyR' ? window.location.reload() : null);

	document.addEventListener('DOMContentLoaded', () => {
		document.getElementById('autogenerated-div').innerHTML = getTieredContent(projectsTree);
		bindEvents(document, eventFunctions);
	});

	function getTieredContent(treeNode) {
		const thisContent = getContent(treeNode);
		return '<div class="button-tier">' + treeNode.subs.reduce((r, i) => r + getTieredContent(i), thisContent) + '</div>\n';
	}

	function getContent(treeNode) {
		const treePath = treeNode.getPath();
		if (treeNode.commands.length > 1) {
			return `<div class="btn-group">
			<button data-function="click:run" data-command="code" data-path="${treePath}"
			 class="btn btn-secondary border-dark">${treeNode.label}</button>
			<button data-function="click:run" data-command="explorer" data-path="${treePath}"
			 class="btn btn-secondary border-dark"><i class="fas fa-folder-open"></i></button>
		</div>`;
		} else {
			return `<div class="btn-group">
			<button data-function="click:run" data-command="explorer" data-path="${treePath}" class="btn btn-secondary border-dark">${treeNode.label}
				&nbsp; <i class="fas fa-folder-open"></i></button>
		</div>`;
		}
	}

}());