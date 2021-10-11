const tableSubByte = [
	[0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76], // 00
	[0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0], // 01
	[0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15], // 02
	[0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75], // 03
	[0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84], // 04
	[0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf], // 05
	[0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8], // 06
	[0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2], // 07
	[0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73], // 08
	[0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb], // 09
	[0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79], // 0a
	[0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08], // 0b
	[0xba, 0x78, 0x25, 0xe2, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a], // 0c
	[0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e], // 0d
	[0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf], // 0e
	[0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]  // 0f
	//   00    01    02    03    04   05    06    07    08   09    0a    0b    0c   0d    0e    0f
];

const constant = [
	[2, 3, 1, 1],
	[1, 2, 3, 1],
	[1, 1, 2, 3],
	[3, 1, 1, 2]
];

const rcon = [
	[0x01, 0x00, 0x00, 0x00],
	[0x02, 0x00, 0x00, 0x00],
	[0x04, 0x00, 0x00, 0x00],
	[0x08, 0x00, 0x00, 0x00],
	[0x10, 0x00, 0x00, 0x00],
	[0x20, 0x00, 0x00, 0x00],
	[0x40, 0x00, 0x00, 0x00],
	[0x80, 0x00, 0x00, 0x00],
	[0x1b, 0x00, 0x00, 0x00],
	[0x36, 0x00, 0x00, 0x00]
];

const addRoundKey = (key, state) => key.map((bytes, i) => bytes.map((byte, j) => byte ^ state[i][j]));

const subBytes = (state) =>
	state.map((bytes) =>
		bytes.map((byte) => {
			const index = [...byte];

			const i = parseInt(index[0], 16);
			const j = parseInt(index[1], 16);
			const value = tableSubByte[i][j];

			return value;
		})
	);

const shiftRows = (state) => {
	let newState = state;

	for (let i = 1; i <= 3; i++) {
		let bytes = [newState[0][i], newState[1][i], newState[2][i], newState[3][i]];

		for (let j = 1; j <= i; j++) {
			bytes.push(bytes[0]);
			bytes.shift();
		}

		newState[0][i] = bytes[0];
		newState[1][i] = bytes[1];
		newState[2][i] = bytes[2];
		newState[3][i] = bytes[3];
	}

	return newState;
};

// Case 2
const mixColumnsCase2 = (byte) => {
	const step1 = byte >= 128 ? (byte << 1) & 255 : byte;
	const step2 = byte >= 128 ? step1 ^ 0x1b : byte * 0x02;

	return step2;
};

// case 3
const mixColumnsCase3 = (byte) => {
	const step1 = 2 * byte;
	const step2 = 1 * byte;
	const step3 = step1 > 255 ? (step1 & 255) ^ 0x1b ^ step2 : step1 ^ step2;

	return step3;
};

const handleMix = (byte, cons) => {
	const b = parseInt(byte, 16);
	const c = parseInt(cons, 16);

	switch (c) {
		case 3:
			return mixColumnsCase3(b);
		case 2:
			return mixColumnsCase2(b);
		default:
			return b;
	}
};

const mixColumns = (state) =>
	state.map((bytes) => {
		const b = [];

		constant.forEach((c, i) => {
			let count = 0;

			bytes.forEach((x, j) => {
				j === 0 ? (count = handleMix(x, c[j])) : (count ^= handleMix(x, c[j]));
			});

			b.push(count.toString(16).length > 1 ? count.toString(16) : "0" + count.toString(16));
		});

		return b;
	});

const rotWord = (key) => {
	const state = key;
	const first = state[3][0];

	state[3].shift();
	state[3].push(first);

	return state;
};

const subBytesKey = (key) => {
	const state = key;

	state[3] = state[3].map((byte) => {
		const i = byte & 15;
		const j = (byte >> 4) & 15;
		const value = tableSubByte[i][j];

		return value;
	});

	return state;
};

const xorLast = (key) => {
	const state = key;

	state[3] = state[3].map((byte, i) => byte ^ state[0][i]);

	return state;
};

const xorRcon = (key, i) => {
	const state = key;

	state[3] = state[3].map((byte, j) => byte ^ rcon[i][j]);

	return state;
};

const xorColumns = (initialKey, lastByte) => {
	let state = [lastByte];

	for (let i = 1; i < 4; i++) {
		state = [...state, initialKey[i].map((byte, j) => byte ^ state[i - 1][j])];
	}

	return state;
};

const expansionK = (initialKey) => {
	let keys = [initialKey];

	for (let i = 0; i < 10; i++) {
		let key = keys[i];

		key = rotWord(key);
		// console.log(key)
		key = subBytesKey(key);
		// console.log(key)
		key = xorLast(key);
		// console.log(key)
		key = xorRcon(key, i);
		// console.log(key)
		key = xorColumns(initialKey, key[3]);
		// console.log(key)

		keys = [...keys, key];
	}

	return keys;
};

const setMatrix = (string) => {
	let str = string;
	let matrix = [];

	for (let i = 0; i < 4; i++) {
		let byteArray = [];

		for (let j = 0; j < 4; j++) {
			byteArray = [...byteArray, str.charCodeAt(0)];
			str = str.slice(1);
		}

		matrix = [...matrix, byteArray];
	}

	return matrix;
};

const printMatrix = (matrix) => {
	const m = matrix.map((bytes) => bytes.map((byte) => String.fromCharCode(byte)));

	console.log(m);
};

const aes = ({ key, message }) => {
	let state = setMatrix(message);
	const initialKey = setMatrix(key);
	const keys = expansionK(initialKey);

	let encrypted = "";

	// getMatix(initialKey)
	console.log(key);
	printMatrix(initialKey);
	console.log(message);
	printMatrix(state);

	/* 
   // console.log(state)
   state = addRoundKey(initialKey, state)
   // console.log(state)
   state = subBytes(state)
   // console.log(state)
   state = shiftRows(state)
   // console.log(state)
   state = mixColumns(state)
   // console.log(state)
   */
};

aes({
	key: "clave de 128bits",
	message: "Píldora Thoth 30"
});
