import { Alignment, Row } from '../etc/types';

declare var require: any;
const chalk: any = require('chalk');

const rocketBar = (): Row => ({
	padding: 1,
	draw: (elapsed, remaining) => [
		elapsed > 0 ? Array(elapsed).fill('💨') : [],
		['🚀'],
		remaining > 0 ? Array(remaining).fill(' ') : [],
	],
});

const trainBar = (): Row => ({
	padding: 1,
	draw: (elapsed, remaining) => [
		remaining > 0 ? Array(remaining).fill('_') : [],
		['🚂'],
		elapsed > 0 ? Array(elapsed).fill('🚋') : [],
	],
});

const dotProgressBar = (color = chalk.blue): Row => ({
	padding: 2,
	draw: (elapsed, remaining) => [
		Array(elapsed).fill(color('⣿')),
		remaining > 0 ? [chalk.white('⡇')] : [color('⣿')],
		remaining > 0 ? Array(remaining).fill(' ') : [],
		[chalk.white('⡇')],
	],
});

const asciiBar = (color = chalk.green, altColor = chalk.white): Row => ({
	padding: 3,
	draw: (elapsed, remaining) => [
		[altColor('[')],
		Array(elapsed).fill(color('=')),
		remaining > 0 ? [color('>')] : [color('=')],
		remaining > 0 ? Array(remaining).fill(' ') : [],
		[altColor(']')],
	],
});

const space = (size: number = 1) => ({
	size,
	draw: (e, r) => [],
});

const reporterBar = (): Row => ({
	draw: (e, r, { props }) => [(props.task || '').split('')],
});

const progressBar = (color = chalk.blue): Row => ({
	draw: (elapsed, remaining) => [
		Array(elapsed).fill(color('x')),
		remaining > 0 ? Array(remaining).fill('.') : [],
	],
});

const percentage = (): Row => ({
	align: Alignment.right,
	size: 6,
	draw: (elapsed, remaining, { props }) => [
		Math.round(props.progress * 100)
			.toString()
			.split(''),
		['%'],
	],
});

export {
	dotProgressBar,
	asciiBar,
	progressBar,
	rocketBar,
	percentage,
	trainBar,
	reporterBar,
	space,
};
