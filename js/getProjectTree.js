const getProjectTree = function getProjectTree() {
	const fs = require('fs');

	// const rootFolder = 'C:\\tfs\\elliottelectric_com';
	const rootFolder = 'C:\\tfs';
	const fileExtension = '.sln';

	const excludeDirectories = [
		'node_modules',
		'dist',
		'minified',
		'bin',
		'obj',
		'MyInventory-Beta',
		'WandPrograms',
		'MobileApplications',
		'Training',
		'ConsolePrograms',
		// 'Login',
		'StaticFiles',
		'Images',
		'ImagesCSS',
		'ImagesMarketing',
		'ImagesPrograms',
		'My Project',
		'Examples',
	].map(i => i.toLowerCase());

	function isValidDirectory(directoryName) {
		const lname = directoryName.toLowerCase();
		return !lname.startsWith('$') && !lname.startsWith('.') && !lname.startsWith('_') && !excludeDirectories.includes(lname)
	}

	class PathNode {
		constructor(fullPath, name, parent) {
			this.fullPath = fullPath;
			this.name = name;
			this.parent = parent;
			this.subs = [];
			this.files = [];

			const subFiles = fs.readdirSync(fullPath);
			subFiles.forEach(file => {
				const fullFilePath = fullPath + '\\' + file;
				if (fs.lstatSync(fullFilePath).isDirectory()) {
					if (isValidDirectory(file)) {
						this.subs.push(new PathNode(fullFilePath, file, this));
					}
				} else if (file.endsWith(fileExtension)) {
					this.files.push(file);
				}
			});

		}

	}

	class File {
		constructor(pathToFile, filename) {
			this.pathToFile = pathToFile;
			this.filename = filename;
			this.splitPath = pathToFile.split('\\');
			this.fullPath = pathToFile + '\\' + filename;
		}
	}

	const rootNode = new PathNode(rootFolder, 'root', null);

	let allFiles = [];

	function getAllFiles(node) {
		node.files.forEach(file => allFiles.push(new File(node.fullPath, file)));
		node.subs.forEach(sub => getAllFiles(sub));
	}

	getAllFiles(rootNode);

	const branchMap = new Map();

	const unbranched = [];

	let thisFile;

	while (thisFile = allFiles.pop()) {

		const branches = allFiles.filter(file => thisFile.filename === file.filename && thisFile.splitPath.length === file.splitPath.length);

		if (branches.length > 0) {
			branchMap.set(thisFile.filename, [thisFile, ...branches]);
			allFiles = allFiles.filter(file => !branches.includes(file));
		} else {
			unbranched.push(thisFile);
		}

	}

	const projects = [];
	const projectMap = new Map();

	branchMap.forEach(val => {

		for (project of projects) {
			if (val[0].fullPath.startsWith(project)) {
				projectMap.get(project).push(val);
				return;
			}
		}

		let shortestLength = 1000;
		val.forEach(file => {
			if (shortestLength > file.fullPath.length) {
				shortestLength = file.fullPath.length;
			}
		});

		let samePath;

		searchBlock: {
			for (let i = 0; i < shortestLength; i++) {
				const firstChar = val[0].fullPath[i];
				for (let j = 0; j < val.length; j++) {
					if (val[j].fullPath[i] !== firstChar) {
						samePath = val[0].fullPath.substr(0, i);
						samePath = samePath.substr(0, samePath.lastIndexOf('\\'));
						break searchBlock;
					}
				}
			}
		}

		projects.push(samePath);
		projectMap.set(samePath, [val]);

	});

	return {unbranched, projectMap};

}

module.exports = getProjectTree;