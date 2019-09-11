export const keyNotFound = (key: string) =>
	`The key: ${key} was found in the schema but not in the object`;

export const didNotPass = (key: string, value: any, validatorName: string) =>
	`The value: ${JSON.stringify(value)} for the key: ${key} didn't pass the ${validatorName} validator`;
