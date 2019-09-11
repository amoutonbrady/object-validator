import { didNotPass, keyNotFound } from './errors';
import { Schema } from './interfaces';

export { isString } from './validators/isString';

export function createSchema(schema: Schema) {
	const getKeys = Object.keys;
	const schemaKeys = getKeys(schema);

	return {
		validate(objectToValidate: any) {
			const objectToValidateKeys = getKeys(objectToValidate);

			/**
			 * TODO: Add an error type
			 *
			 * Loop over every key from the schema and perform the following taks:
			 *
			 * 1. Compute if the key is optional or not
			 * 2. Check if the object to validate has the key
			 * 3. Loop over every validators for the value of that key
			 * 4. Apply and compute if the value passes the validators or not
			 */
			return schemaKeys.reduce<[string[], boolean]>(
				([errors, pass], key) => {
					/**
					 * 1. Check whether the key is optional or not
					 *    and if it's present in the object
					 */
					const isOptional = key.charAt(0) === '_';
					const normalizedKey = isOptional ? key.slice(1) : key;
					const isPresent = objectToValidateKeys.includes(
						normalizedKey,
					);

					/**
					 * 2.1 Check if the object has the key and if it's not optional.
					 *     Add an error and indicate that the object didn't pass
					 */
					if (!isOptional && !isPresent)
						return [[...errors, keyNotFound(normalizedKey)], false];

					/**
					 * 2.2 Bail early if the key is optional and not present
					 */
					if (isOptional && !isPresent) return [errors, pass];

					const validators = schema[key];

					/**
					 * 3. Loop over the validators from the schema
					 */
					return validators.reduce<[string[], boolean]>(
						(
							[errorsFromValidators, passFromValidators],
							validator,
						) => {
							/**
							 * 4.1 Apply the validator to the value and compute
							 *     whether the value (and therefore the object)
							 * 	   passes the test or not
							 */
							const passValidator = validator(
								objectToValidate[normalizedKey],
							);

							/**
							 * 4.2 If it doesn't pass the test then add an error
							 *     and indicate that the object didn't pass the test
							 */
							if (!passValidator)
								return [
									[
										...errorsFromValidators,
										didNotPass(
											normalizedKey,
											objectToValidate[normalizedKey],
											validator.name,
										),
									],
									passValidator,
								];

							return [errorsFromValidators, passFromValidators];
						},
						[errors, pass],
					);
				},
				[[], true],
			);
		},
	};
}
