const { start, prefabs } = require('../lib');

const longTask = (length, bar) => {
	let i = 0;
	bar.setTask('Ready');

	return new Promise(yay => {
		const waitFor = length;
		const interval = setInterval(() => {
			bar.setProgress(i / waitFor);
			if (i >= waitFor / 2) {
				bar.setTask('Reticulating splines');
			}
			if (i >= waitFor) {
				clearInterval(interval);
				bar.setTask('Done');
				bar.close();
				yay();
			}
			i++;
		}, 6);
	});
};

const main = async () => {
	console.log('doing stuff!');
	await longTask(50, start());
	console.log('more!');
	await longTask(
		100,
		start([
			prefabs.progressBar(),
			prefabs.space(),
			{ ...prefabs.percentage(), size: 10, align: 'left' },
		])
	);
	console.log('choo choo!');
	await longTask(
		100,
		start([
			prefabs.asciiBar(),
			prefabs.space(),
			{ ...prefabs.reporterBar(), span: 0.7 },
		])
	);
	console.log('done!');
	process.exit();
};

main();
