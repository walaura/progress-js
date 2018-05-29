enum Alignment {
	left = 'left',
	center = 'center',
	right = 'right',
}

interface BarProps {
	progress: number;
	task: string;
	etc: {};
}

interface DrawExtraParams {
	total: number;
	props: BarProps;
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

export { Row, RowWithAbsoluteSize, Alignment, BarProps };
