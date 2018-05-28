interface InputBox {
	flex?: number;
	size?: number;
	padding?: number;
}

const getMaxSize = (
	perc: number,
	usedSoFar: number,
	padding: number = 0,
	{ usableSize }: { usableSize: number }
): number => {
	const size: number = Math.round(usableSize * perc) - padding;
	const max: number = usableSize - usedSoFar;
	return size > max - padding ? max - padding : size;
};

const normalizeBoxFlex = (
	boxes: InputBox[],
	fixedBoxSize: number
): InputBox[] =>
	boxes.map(box => ({
		...box,
		flex: (box.flex || 1) / fixedBoxSize,
	}));

const getCalculatedBoxSize = (
	boxes: InputBox[],
	usableSize: number
): number[] =>
	boxes.reduce((boxes, box) => {
		if (!box.size) {
			return [
				...boxes,
				getMaxSize(
					box.flex,
					boxes.reduce((boxes, box) => boxes + box.flex, 0),
					box.padding || 0,
					{ usableSize }
				),
			];
		}
		return [...boxes, box.size];
	}, []);

const normalizeCalculatedBoxSize = (
	sizes: number[],
	containerSize: number
): number[] => {
	const multiplier = containerSize / sizes.reduce((acc, size) => acc + size, 0);
	const normalizedSizes = sizes.map(size => Math.round(size * multiplier));

	const offset =
		containerSize - normalizedSizes.reduce((acc, size) => acc + size, 0);
	normalizedSizes[0] += offset;
	return normalizedSizes;
};

const getUsableSize = (size: number, boxes: InputBox[]): number => {
	const naiveUsableSize =
		size -
		boxes.filter(box => box.size).reduce((acc, box) => acc + box.size, 0);

	return naiveUsableSize > size / 2 ? naiveUsableSize : size;
};

const getFixedBoxSize = (boxes: InputBox[]): number => {
	const getBoxSpanSpace = (box): number => (box.size ? 0 : 1);
	return boxes.reduce(
		(acc, box) => (box.flex ? acc + box.flex : acc + getBoxSpanSpace(box)),
		0
	);
};

const solve = (boxes: InputBox[], size: number): number[] => {
	const s1 = normalizeBoxFlex(boxes, getFixedBoxSize(boxes));
	const s2 = getCalculatedBoxSize(s1, getUsableSize(size, boxes));
	const s3 = normalizeCalculatedBoxSize(s2, size);
	return s3;
};

export { solve };
