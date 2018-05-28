import { UserRow, Row } from './types';
import { solve as solveFlex } from '../lib/flex';

const solve = (rows: UserRow[], { screenWidth }): Row[] => {
	const sizes = solveFlex(
		rows.map(row => ({
			padding: row.padding,
			size: row.size,
			flex: row.span,
		})),
		screenWidth
	);
	return rows.map((row, i) => ({
		...row,
		size: sizes[i],
	}));
};

export { solve };
