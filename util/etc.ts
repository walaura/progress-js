const smoosh = (arr: any[]): any[] =>
	arr
		.map(val => (Array.isArray(val) ? val : [val]))
		.reduce((acc, current) => [...acc, ...current], []);

const padArray = (
	arr: any[],
	target: number = 0,
	filler: string = ' '
): any[] => {
	while (arr.length < target) {
		arr.push(filler);
	}
	return arr;
};

export { smoosh, padArray };
