interface Schema {
	[key: string]: ((value: unknown) => boolean)[];
}

const getKeys = Object.keys;

const keyNotFound = (key: string) =>
	`The key: ${key} was found in the schema but not in the object`;

const didNotPass = (key: string, value: any, validatorName: string) =>
	`The value: ${JSON.stringify(
		value,
	)} for the key: ${key} didn't pass the ${validatorName} validator`;

export const isString = (value: any) => typeof value === 'string';

export function createSchema(schema: Schema) {
	const schemaKeys = getKeys(schema);

	return {
		validate(objectToValidate: any) {
			const objectToValidateKeys = getKeys(objectToValidate);

			return schemaKeys.reduce<[string[], boolean]>(
				([errors, pass], key) => {
					const isOptional = key.charAt(0) === '_';
					const normalizedKey = isOptional ? key.slice(1) : key;
					const isPresent = objectToValidateKeys.includes(
						normalizedKey,
					);

					if (!isOptional && !isPresent)
						return [[...errors, keyNotFound(normalizedKey)], false];

					if (isOptional && !isPresent) return [errors, pass];

					const validators = schema[key];

					return validators.reduce<[string[], boolean]>(
						(
							[errorsFromValidators, passFromValidators],
							validator,
						) => {
							const passValidator = validator(
								objectToValidate[normalizedKey],
							);

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
