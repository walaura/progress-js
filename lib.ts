declare var process: any;
declare var require: any;
const width: any = require('cli-width');
var readline = require('readline');

import { solve as solveLayout } from './util/layout';
import { Row, RowWithAbsoluteSize, Alignment, BarProps } from './etc/types';
import { smoosh, padArray } from './util/etc';
import * as prefabs from './etc/prefabs';

const getLine = (rows: RowWithAbsoluteSize[], props: BarProps) =>
	rows.map(row => {
		const total = row.size - (row.padding || 0);
		const elapsed = Math.floor(props.progress * total);
		const drawn = smoosh(
			row.draw(elapsed, total - elapsed, {
				total,
				props,
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

const draw = (rows: RowWithAbsoluteSize[], props: BarProps) => {
	process.stdout.cursorTo(0);
	process.stdout.clearLine();
	process.stdout.write(getLine(rows, props).join(''));
};

const close = () => {
	process.stdout.write('\n');
};

const start = (
	rows: Row[] = [prefabs.dotProgressBar(), prefabs.percentage()]
) => {
	const screenWidth = width({ defaultWidth: 80 });
	const fixedRows: RowWithAbsoluteSize[] = solveLayout(rows, { screenWidth });

	const props = {
		progress: 0,
		task: '',
		etc: {},
	};

	const onUpdate = () => {
		draw(fixedRows, props);
	};

	return {
		close,
		upProgress: (number: number) => {
			props.progress += number;
			onUpdate();
		},
		setProgress: (number: number) => {
			props.progress = number;
			onUpdate();
		},
		setTask: (task: string) => {
			props.task = task;
			onUpdate();
		},
		setEtc: (newEtc: {}) => {
			props.etc = {
				...props.etc,
				newEtc,
			};
			onUpdate();
		},
	};
};

export { start, prefabs, Alignment };
