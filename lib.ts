declare var process: any;
declare var require: any;
const width: any = require('cli-width');

import { solve as solveLayout } from './util/layout';
import { Row, RowWithAbsoluteSize, Alignment } from './etc/types';
import { smoosh, padArray } from './util/etc';
import * as prefabs from './etc/prefabs';

const getLine = (rows: RowWithAbsoluteSize[], progress: number) =>
	rows.map(row => {
		const total = row.size - (row.padding || 0);
		const elapsed = Math.floor(progress * total);
		const drawn = smoosh(
			row.draw(elapsed, total - elapsed, {
				total,
				progress,
			})
		).slice(0, row.size);

		if (row.align === 'right' && row.size - drawn.length > 0) {
			drawn.unshift(...Array(row.size - drawn.length).fill(' '));
		}

		if (row.align === 'center') {
			throw 'wow rude expecting me to center it';
		}

		return padArray(drawn, row.size).join('');
	});

const draw = (rows: RowWithAbsoluteSize[], progress: number) => {
	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(getLine(rows, progress).join(''));
};

const close = () => {
	process.stdout.write('\n');
};

const start = (
	rows: Row[] = [prefabs.dotProgressBar(), prefabs.percentage()]
) => {
	const screenWidth = width({ defaultWidth: 80 });
	const fixedRows: RowWithAbsoluteSize[] = solveLayout(rows, { screenWidth });
	const onUpdate = () => {
		draw(fixedRows, progress);
	};

	let progress = 0;

	return {
		close,
		upProgress: (number: number) => {
			progress += number;
			onUpdate();
		},
		setProgress: (number: number) => {
			progress = number;
			onUpdate();
		},
	};
};

export { start, prefabs, Alignment };
