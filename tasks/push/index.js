const colors = require('colors');
const exec = require('child_process').exec;
const fs = require('fs');
const root = require('app-root-path').path;

const [, , type, commit = false] = process.argv;

const VALID_TYPES = ['major', 'minor', 'patch'];
/**
 * Controls
 */
if (!type) {
	console.error('Type is not defined.'.yellow);
	pleaseFollowFormat();
}

if (!(new RegExp(VALID_TYPES.join('|')).test(type))) {
	console.error('Type is not one of '.yellow + '['+ VALID_TYPES.join(', ').bold +']');
	pleaseFollowFormat();
}

/**
 * Progress Start
 */
console.log('Starting ' + type.toUpperCase().green + ' progress');

if (!commit) {
	console.warn('Commit message is not defined, package.json version will be updated & will be committed as "version update"'.yellow);
}
else {
	console.log('Commit message is: ' + commit.green);
}

console.log('Checking branch ......');
once('git rev-parse --abbrev-ref HEAD')
	.then(res => {
		if (res.trim() === 'dev' || res.trim() === 'master') {
			return Promise.reject();
		}
		console.log('Getting tags ......');
		return once('git tag --merged');
	})
	.catch(err => {
		console.error('You can\'t use this on "dev" or "master"');
		process.exit();
	})
	.then(res => {
		const tags = res.trim().split("\n");

		if (!tags.every(checkRawTag)) {
			return Promise.reject();
		}
		return Promise.resolve(tags.map(tag => tag.split('.').map(val => parseInt(val))));
	})
	.catch(() => {
		console.error('tags are not valid, check them');
		process.exit();
	})
	.then(tags => {
		const lastTag = sortTags(tags).reverse()[0];
		console.log('Last tag on this branch is: ' + lastTag.join('.').green);
		return Promise.resolve(lastTag);
	})
	.then(lastTag => {
		console.log('Updating package.json ......');

		const versionIndex = type === 'major'
			? 0
			: type === 'minor'
			? 1
			: 2;
		
		lastTag.forEach((el, i) => {
			if (i === versionIndex)
				lastTag[i]++;
			else if (i > versionIndex)
				lastTag[i] = 0;
		});

		const newTag = lastTag.join('.');
		const package = require(root + '/package.json');
		
		package.version = newTag;
		fs.writeFileSync(root + '/package.json', JSON.stringify(package, null, 2));
		return Promise.resolve(newTag);
	})
	.then(newTag => {
		console.log('Committing Changes ......');
		return Promise.all([
			Promise.resolve(newTag),
			whenExecuted('git add .')
		]);
	})
	.then(([newTag]) => {
		return Promise.all([
			Promise.resolve(newTag),
			whenExecuted('git commit -m "'+(commit || 'version update')+'"')
		]);
	})
	.then(([newTag]) => {
		return Promise.all([
			Promise.resolve(newTag),
			whenExecuted('git tag ' + newTag)
		]);
	})
	.then(([newTag]) => {
		console.log('Inserted ' + newTag.green);
		return once('git rev-parse --abbrev-ref HEAD');
	})
	.then(branch => {
		branch = branch.trim();
		console.log('Merging "'+branch.green+'" branch into "dev"');
		return Promise.all([
			Promise.resolve(branch),
			whenExecuted('git checkout dev')
		]);
	})
	.then(([branch]) => {
		return Promise.all([
			Promise.resolve(branch),
			whenExecuted('git merge ' + branch)
		]);
	})
	.then(([branch]) => {
		return whenExecuted('git branch -d ' + branch);
	})
	.then(() => {
		return whenExecuted('git push origin dev');
	})
	.then(() => {
		return whenExecuted('git push --tags');
	})
	.then(() => {
		console.log('Pushed Successfully');
		process.exit();
	});


/**
 * Utils
 */
function pleaseFollowFormat() {
	console.error('Please follow the format '.yellow + '"npm run push'.gray +' [type] [commit?]'.bold + '"'.gray);
	process.exit();
}

function once(command) {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout);
		});
	}).catch(err => {
		console.error('Exec Error while executing "'+command+'"');
		process.exit();
	});
}

function whenExecuted(command) {
	return new Promise((resolve, reject) => {
		var child = exec(command, error => {
			error && reject(error);
		});
		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
		child.on('exit', resolve);
	}).catch(err => {
		console.error('Exec Error while executing "'+command+'"');
		process.exit();
	});
}

function checkRawTag(tag) {
	return /^[0-9]+\.[0-9]+\.[0-9]$/.test(tag);
}

function sortTags(tags) {
	return tags.sort((a, b) => {
		let retVal = 0;

		a.some((val, i) => {
			if (val !== b[i]) {
				retVal = val - b[i];
				return true;
			}
			return false;
		});

		return retVal;
	});
}