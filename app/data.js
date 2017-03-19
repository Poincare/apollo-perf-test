function makeSubObj(index, numFields) {
	const result = {};
	for (let i = 0; i < numFields; i++) {
		result['subObjField_' + i] = 'sub obj ' + index
			+ ' field data ' + i + ' + lkajsdlkfja lajsdf lkajsd ';
	}
	return result;
}

function makeMainObj(index, numFields, numSubObjects, numSubObjFields) {
	const result = {
		id: 'mainObj:' + index,
		__typename: 'MainObj'
	};

	for (let i = 0; i < numFields; i++) {
		result['field_' + i] = index + 'Field Data ' + i + ' lkjadskljfald lakjdsflkja ljsdfkj lksd';
	}
	const myArr = [];
	for (let i = 0; i < numSubObjects; i++) {
		myArr.push(makeSubObj(i, numSubObjFields));
	}
	result.myArr = myArr;
	return result;
}

export default function data(numObjs, numSubObjs) {
	const arr = [];
	for (let i = 0; i < numObjs; i++) {
		arr.push(makeMainObj(i, 15, numSubObjs, 4));
	}
	return {
		data: {
			myData: arr
		}
	};
}

