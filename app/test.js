import ApolloClient  from 'apollo-client';
import gql from 'graphql-tag';
import {
	print,
} from 'graphql-tag/bundledPrinter';
import data from './data';

const simpleQuery = gql`
	query {
		myData {
			id
			field_0
			field_1
			field_2
			field_3
			field_4
			field_5
			field_6
			field_7
			field_8
			field_9
			field_10
			field_11
			field_12
			field_13
			field_14
			myArr {
        subObjField_0
        subObjField_1
        subObjField_2
        subObjField_3
			}
		}
	}
`;


function requestToKey(request) {
	const queryString = request.query && print(request.query);

	return JSON.stringify({
		variables: request.variables || {},
		debugName: request.debugName,
		query: queryString,
	});
}


class MockNetworkInterface {
	constructor(mockedResponses) {
		this.mockedResponsesByKey = {};
		mockedResponses.forEach((mockedResponse) => {
			this.addMockedResponse(mockedResponse);
		});
	}

	addMockedResponse(mockedResponse) {
		const key = requestToKey(mockedResponse.request);
		let mockedResponses = this.mockedResponsesByKey[key];
		if (!mockedResponses) {
			mockedResponses = [];
			this.mockedResponsesByKey[key] = mockedResponses;
		}
		mockedResponses.push(mockedResponse);
	}

	query(request) {
		return new Promise((resolve, reject) => {
			const parsedRequest = {
				query: request.query,
				variables: request.variables,
				debugName: request.debugName,
			};

			const key = requestToKey(parsedRequest);
			const responses = this.mockedResponsesByKey[key];
			if (!responses || responses.length === 0) {
				throw new Error(`No more mocked responses for the query: ${print(request.query)}, variables: ${JSON.stringify(request.variables)}`);
			}

			const { result, error, delay } = responses.shift();

			if (!result && !error) {
				throw new Error(`Mocked response should contain either result or error: ${key}`);
			}

			setTimeout(() => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			}, delay ? delay : 0);
		});
	}
}



const getClientInstance = (numObjs, numSubObjs) => {
	return new ApolloClient({
		networkInterface: new MockNetworkInterface([{
			request: { query: simpleQuery },
			result: data(numObjs, numSubObjs),
		}]),
		addTypename: false,
	});
};

function log(...items) {
	document.getElementById('root').innerHTML += items.join(' ') + '\n';
}

export default function test(numObjs, numSubObjs) {
	log(`\nrunning test ${numObjs} objects with ${numSubObjs} sub-objects each\n`);
	const client = getClientInstance(numObjs, numSubObjs);

	function runTest(resultArr) {
		const startTime = Date.now();
		return client.query({ query: simpleQuery }).then(() => {
			const endTime = Date.now();
			log('query time: ' + (endTime - startTime) + 'ms');
			if (resultArr) {
				resultArr.push(endTime - startTime);
			}
			return resultArr;
		});
	}

	log('priming cache... ');
	return runTest().then(() => {
		log('starting cache read query tests...\n');
		return runTest([])
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then(runTest)
			.then((resultArr) => {
				let sum = 0;
				for (const result of resultArr) {
					sum += result;
				}
				log('mean:', sum/20);
			});
	});
}

