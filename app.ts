declare var process: any;
declare var require: any;
const width: any = require('cli-width');
const chalk: any = require('chalk');

import { solve as solveLayout } from './util/layout';
import { Row, RowWithAbsoluteSize, Alignment } from './etc/types';
import { smoosh } from './util/etc';
import {
	progressBar,
	percentage,
	dotProgressBar,
	rocketBar,
	trainBar,
} from './lib/prefabs';

const draw = (rows: Row[], progress) => {
	const screenWidth = width({ defaultWidth: 80 });
	const fixedRows: RowWithAbsoluteSize[] = solveLayout(rows, { screenWidth });

	const line = fixedRows.reduce((previous, row) => {
		const padding = row.padding || 0;
		const elapsed = Math.floor(progress * (row.size - padding));

		const drawn = smoosh(
			row.draw(elapsed, row.size - elapsed - padding, {
				total: row.size - padding,
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

const waitFor = 200;
let i = 0;

const rows = [rocketBar(), percentage()];

const ii = setInterval(() => {
	draw(rows, i / waitFor);
	if (i >= waitFor) {
		clearInterval(ii);
		close();
		process.exit();
	}
	i++;
}, 20);
