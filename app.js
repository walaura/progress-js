const { start, prefabs } = require('./lib');

const longTask = (length, bar) => {
	let i = 0;

	return new Promise(yay => {
		const waitFor = length;
		const interval = setInterval(() => {
			bar.setProgress(i / waitFor);
			if (i >= waitFor) {
				clearInterval(interval);
				bar.close();
				yay();
			}
			i++;
		}, 6);
	});
};

const main = async () => {
	console.log('doing stuff!');
	await longTask(100, start());
	console.log('more!');
	await longTask(
		100,
		start([
			{ ...prefabs.percentage(), size: 10, align: 'left' },
			prefabs.progressBar(),
		])
	);
	console.log('choo choo!');
	await longTask(100, start([prefabs.trainBar()]));
	console.log('done!');
	process.exit();
};

main();
