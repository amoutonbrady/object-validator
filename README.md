> object-validator is minimalistic (400b uncompressed), elegant and pluggable object validation library

object-validator supports modern browser. You'll need to use polyfill to make it work for older ones.

## Install

```
$ npm install @amoutonbrady/object-validator
```

```
$ yarn @amoutonbrady/object-validator
```

## Usage

```js
import { createSchema, isString } from '@amoutonbrady/object-validator';

const schema = createSchema({
	key1: [isString],
	_key2: [isString], // This key is marked optional because of the '_'
});

const [errors, pass] = schema.validate({ key1: 'test', key2: 'test' });
console.log({ errors, pass });
// { errors: [], pass: true }

const [errors, pass] = schema.validate({ key1: 'test' });
console.log({ errors, pass });
// { errors: [], pass: true }

const [errors, pass] = schema.validate({ key2: 'test' });
console.log({ errors, pass });
/**
 *  {
 *  	errors: [
 * 			"The key: key1 was found in the schema but not in the object",
 *    	],
 * 		pass: false,
 * 	}
 **/

const [errors, pass] = schema.validate({ key2: true });
console.log({ errors, pass });
/**
 *  {
 *  	errors: [
 * 			"The key: key1 was found in the schema but not in the object",
 * 			"The value: true for the key: key1 didn't pass the isString validator",
 *    	],
 * 		pass: false,
 * 	}
 **/
```
