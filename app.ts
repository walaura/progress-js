declare var process: any;
declare var require: any;
const width: any = require('cli-width');
const chalk: any = require('chalk');

import { solve as solveLayout } from './util/layout';
import { Row, UserRow, Alignment } from './util/types';

const smoosh = (arr: any[]): any[] =>
	arr
		.map(val => (Array.isArray(val) ? val : [val]))
		.reduce((acc, current) => [...acc, ...current], []);

const coolProgressBar = (color = chalk.blue) => ({
	padding: 2,
	draw: (elapsed, remaining, { progress }) => [
		Array(elapsed).fill(color('⣿')),
		remaining > 0 ? [chalk.white('⡇')] : [color('⣿')],
		remaining > 0 ? Array(remaining).fill(' ') : [],
		[chalk.white('⡇')],
	],
});

const progressBar = (color = chalk.blue) => ({
	draw: (elapsed, remaining, { progress }) => [
		Array(elapsed).fill(color('x')),
		remaining > 0 ? Array(remaining).fill('.') : [],
	],
});

const percentage = () => ({
	align: Alignment.right,
	size: 6,
	draw: (elapsed, remaining, { progress }) => [
		(progress * 100).toString().split(''),
		['%'],
	],
});

const draw = (rows: UserRow[], progress) => {
	const screenWidth = width({ defaultWidth: 80 });
	const fixedRows = solveLayout(rows, { screenWidth });

	const line = fixedRows.reduce((previous, row) => {
		const elapsed = Math.floor(progress * row.size);

		const drawn = smoosh(
			row.draw(elapsed, row.size - elapsed, {
				total: row.size,
				progress: progress,
			})
		).slice(0, row.size);
		if (row.align === 'right' && row.size - drawn.length > 0) {
			drawn.unshift(...Array(row.size - drawn.length).fill(' '));
		}

		return [...previous, ...drawn];
	}, []);

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(line.join(''));
};

const close = () => {
	process.stdout.write('\n');
};

const waitFor = 20;
let i = 0;

const rows = [
	{
		span: 0.3,
		...progressBar(),
	},
	{
		...progressBar(chalk.red),
	},
	{
		...percentage(),
	},
];

const ii = setInterval(() => {
	draw(rows, i / waitFor);
	if (i >= waitFor) {
		clearInterval(ii);
		close();
		process.exit();
	}
	i++;
}, 20);
