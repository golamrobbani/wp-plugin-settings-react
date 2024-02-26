
// This function will convert json string to json object.
export const jsonStringToObject = ( jsonStringData ) => {
	let dataObj = [];
	if ( 'string' === typeof jsonStringData ) {
		dataObj = JSON.parse( jsonStringData );
	} else if ( 'object' === typeof jsonStringData ) {
		dataObj = jsonStringData;
	}
	return dataObj;
};

export const rtsbDebounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
