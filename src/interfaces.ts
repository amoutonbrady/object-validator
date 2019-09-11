export interface Schema {
	[key: string]: ((value: unknown) => boolean)[];
}
