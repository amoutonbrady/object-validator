import { createSchema, isString } from '../pkg/dist-src';

describe('Schema creation', () => {
	const schema = createSchema({ test: [isString], sweden: [isString] });
	const optionalSchema = createSchema({
		_test: [isString],
		sweden: [isString],
	});

	it('should contain validate method', () => {
		expect(Object.keys(schema).includes('validate')).toBe(true);
	});

	it('should fail if one of the validator fails', () => {
		const [errors, pass] = schema.validate({ test: true, sweden: 'boss' });

		expect(pass).toBe(false);
		expect(errors.length).toBe(1);
	});

	it('should fail if one of the key is missing', () => {
		const [errors, pass] = schema.validate({ sweden: 'boss' });

		expect(pass).toBe(false);
		expect(errors.length).toBe(1);
	});

	it('should pass if one of the key is missing but optional', () => {
		const [errors, pass] = optionalSchema.validate({ sweden: 'boss' });

		expect(pass).toBe(true);
		expect(errors.length).toBe(0);
	});

	it('should pass if all the validators pass', () => {
		const [errors, pass] = schema.validate({
			sweden: 'boss',
			test: 'test',
		});

		expect(pass).toBe(true);
		expect(errors.length).toBe(0);
	});
});
