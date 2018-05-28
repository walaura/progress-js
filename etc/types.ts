enum Alignment {
	left = 'left',
	center = 'center',
	right = 'right',
}

interface DrawExtraParams {
	total: number;
	progress: number;
}

interface Row {
	draw: (elapsed: number, remaining: number, DrawExtraParams) => string[][];
	span?: number;
	size?: number;
	padding?: number;
	align?: Alignment;
}

interface RowWithAbsoluteSize extends Row {
	size: number;
}

export { Row, RowWithAbsoluteSize, Alignment };
