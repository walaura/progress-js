declare var process: any;
declare var require: any;
const width: any = require('cli-width');

import { solve as solveLayout } from './util/layout';
import { Row, RowWithAbsoluteSize, Alignment } from './etc/types';
import { smoosh, padArray } from './util/etc';
import * as prefabs from './etc/prefabs';

const draw = (rows: RowWithAbsoluteSize[], progress) => {
	const line = rows.reduce((previous, row) => {
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

		return [...previous, ...padArray(drawn, row.size)];
	}, []);

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	process.stdout.write(line.join(''));
};

const close = () => {
	process.stdout.write('\n');
};

const start = (
	rows: Row[] = [prefabs.dotProgressBar(), prefabs.percentage()]
) => {
	const screenWidth = width({ defaultWidth: 80 });
	const fixedRows: RowWithAbsoluteSize[] = solveLayout(rows, { screenWidth });

	return {
		progress: 0,
		close,
		upProgress: function(number: number) {
			this.progress += number;
			draw(fixedRows, this.progress);
		},
		setProgress: function(number: number) {
			this.progress = number;
			draw(fixedRows, this.progress);
		},
	};
};

export { start, prefabs, Alignment };
