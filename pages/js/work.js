window.jQuery = window.$ = require('jquery');

(function IndexInit() {

	const {
		exec
	} = require('child_process');

	const bindEvents = require('./js/lib/bindEvents');

	const {
		unbranched,
		projectMap
	} = require('../js/getProjectTree');

	const commands = {
		code: 'C:\\Program Files\\Microsoft VS Code\\code',
		explorer: 'C:\\Windows\\explorer.exe',
		vs: 'C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\Common7\IDE\devenv.exe'
	};

	const eventFunctions = {
		run: (ev, elem) => {
			const dataCommand = elem.getAttribute('data-command');
			const dataPath = elem.getAttribute('data-path');

			const command = commands[dataCommand] ? commands[dataCommand] : dataCommand;
			const path = dataPath;

			exec(`"${command}" "${path}"`);
		},
	};

	document.addEventListener('DOMContentLoaded', () => {
		const contentDiv = document.getElementById('autogenerated-div');
		let newContent = '';
		newContent += `<div class="button-tier clearfix"><h2 class="small">Unbranched</h2>`;
		unbranched.forEach(file => {
			const name = file.filename.substr(0, file.filename.indexOf('.'));
			newContent += `<div class="float-left" style="margin-right: 8px; margin-bottom: 8px;"><div class="btn-group">
			<button data-function="click:run" data-command="code" data-path="${file.fullPath}"
			 class="btn btn-secondary btn-sm border-dark">${name}</button>
			<button data-function="click:run" data-command="explorer" data-path="${file.pathToFile}"
			 class="btn btn-secondary btn-sm border-dark"><i class="fas fa-folder-open"></i></button>
		</div></div>\n`;
		});
		newContent += '</div>';


		projectMap.forEach((programs, projectPath) => {
			const projectName = projectPath.substr(projectPath.lastIndexOf('\\') + 1);
			const projectPathLength = projectPath.length + 1;
			const branches = [];

			programs.sort((a,b) => {
				const la = a[0].filename.toLowerCase();
				const lb = b[0].filename.toLowerCase();
				if (la > lb){
					return 1;
				}else if(lb > la){
					return -1;
				}else{
					return 0;
				}
			});

			programs[0].forEach(programBranch => {
				const trimmedPath = programBranch.pathToFile.substr(projectPathLength);
				const branchName = trimmedPath.substr(0, trimmedPath.indexOf('\\'));
				branches.push({
					name: branchName,
					path: programBranch.pathToFile.substr(0, projectPathLength + branchName.length)
				});
			});

			newContent += `<div class="button-tier"><h2 class="small">${projectName}</h2><div class="row">`;

			programs.forEach(program => {
				const programName = program[0].filename.substr(0, program[0].filename.indexOf('.'));
				newContent += `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"><h3 class="small">${programName}</h3>`;
				program.forEach(programBranch => {
					for (let i = 0; i < branches.length; i++) {
						if (programBranch.pathToFile.startsWith(branches[i].path)) {
							newContent += `<div class="btn-group">
							<button data-function="click:run" data-command="code" data-path="${programBranch.fullPath}"
							 class="btn btn-secondary btn-sm border-dark">${branches[i].name}</button>
							<button data-function="click:run" data-command="explorer" data-path="${programBranch.pathToFile}"
							 class="btn btn-secondary btn-sm border-dark"><i class="fas fa-folder-open"></i></button>
						</div>\n`;
							break;
						}
					}
				});
				newContent += '</div>\n';
			});

			newContent += '</div></div>';

		});

		contentDiv.innerHTML += newContent;

		bindEvents(eventFunctions);
	});

}());