const smoosh = (arr: any[]): any[] =>
	arr
		.map(val => (Array.isArray(val) ? val : [val]))
		.reduce((acc, current) => [...acc, ...current], []);

export { smoosh };
