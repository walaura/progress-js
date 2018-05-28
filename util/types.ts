enum Alignment {
	left = 'left',
	center = 'center',
	right = 'right',
}

interface DrawExtraParams {
	total: number;
	progress: number;
}

interface UserRow {
	draw: (elapsed: number, remaining: number, DrawExtraParams) => string[][];
	span?: number;
	size?: number;
	padding?: number;
	align?: Alignment;
}

interface Row extends UserRow {
	size: number;
}

export { Row, UserRow, Alignment };
