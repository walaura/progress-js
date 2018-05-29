import { Alignment } from '../etc/types';

const smoosh = (arr: any[]): any[] =>
	arr
		.map(val => (Array.isArray(val) ? val : [val]))
		.reduce((acc, current) => [...acc, ...current], []);

const align = (
	text: string[],
	containerWidth: number,
	alignment: Alignment
): string[] => {
	if (containerWidth - text.length < 1) return text;
	const copy = [...text];
	switch (alignment) {
		case Alignment.center:
			copy.unshift(
				...Array(Math.ceil((containerWidth - text.length) / 2)).fill(' ')
			);
			return copy;
		case Alignment.right:
			copy.unshift(...Array(containerWidth - text.length).fill(' '));
			return copy;
		case Alignment.left:
		default:
			copy.push(...Array(containerWidth - text.length).fill(' '));
			return copy;
	}
};

export { smoosh, align };
