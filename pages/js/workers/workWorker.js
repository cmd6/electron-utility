const fs = require('fs');
const path = require('path');
const getProjectTree = require('../../../js/getProjectTree');
const projectTreeStorageFile = path.resolve(__dirname, '../../../storage/projectTree.json');

onmessage = function getMessage(e) {
	if (e.data.command === 'getProjectTree') {
		runGetProjectTree();
	}
}

function runGetProjectTree() {

	try {
		const cache = fs.readFileSync(projectTreeStorageFile, 'utf8');

		if (cache) {
			const cacheData = JSON.parse(cache);
			const projectMap = new Map();
			cacheData.projects.forEach(p => {
				projectMap.set(p.key, p.value);
			});

			postMessage({
				command: 'getProjectTree',
				result: {
					unbranched: cacheData.unbranched,
					projectMap: projectMap,
				},
			});
			return;
		}
	} catch (err) {

	}

	const response = getProjectTree();
	postMessage({
		command: 'getProjectTree',
		result: response,
	});
	storeProjectTree(response);

}

function storeProjectTree(result) {

	const projects = [];

	result.projectMap.forEach((value, key) => {
		projects.push({
			key: key,
			value: value
		});
	});

	const write = {
		unbranched: result.unbranched,
		projects: projects,
	};

	fs.writeFile(projectTreeStorageFile, JSON.stringify(write), err => err ? console.error(err) : null);

}