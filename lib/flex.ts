interface InputBox {
	flex?: number;
	size?: number;
	padding?: number;
}

const getMaxSize = (
	perc: number,
	usedSoFar: number,
	padding: number = 0,
	usableSize: number
): number => {
	const size: number = Math.floor(usableSize * perc);
	const max: number = usableSize - usedSoFar;
	return (size > max ? max : size) - 2;
};

const getDefaultFlexSize = (box, InputBox, boxes: InputBox[]) => {};

const normalizeBoxFlex = (boxes: InputBox[]): InputBox[] => {
	const assignedFlexBoxes = boxes.filter(box => !box.size && box.flex, 0);
	const freeFlexBoxes = boxes.filter(box => !box.size && !box.flex, 0);

	const assignedFlexBoxSpace = assignedFlexBoxes.reduce(
		(acc, cur) => acc + cur.flex,
		0
	);

	boxes = boxes.map(box => ({
		...box,
		flex:
			box.flex /
			(assignedFlexBoxSpace > 1
				? assignedFlexBoxSpace * freeFlexBoxes.length
				: 1),
	}));

	const freeFlexBoxSpacePerBox =
		(1 - assignedFlexBoxSpace) / freeFlexBoxes.length;

	boxes = boxes.map(box => ({
		...box,
		flex: box.flex || freeFlexBoxSpacePerBox,
	}));

	return boxes;
};
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
					usableSize
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

const getFlexBoxSize = (boxes: InputBox[]): number => {
	return boxes.reduce((acc, box) => (box.flex ? acc + box.flex : acc), 0);
};

const solve = (boxes: InputBox[], size: number): number[] => {
	boxes = normalizeBoxFlex(boxes);
	let sizes = getCalculatedBoxSize(boxes, getUsableSize(size, boxes));
	sizes = normalizeCalculatedBoxSize(sizes, size);
	return sizes;
};

export { solve };
