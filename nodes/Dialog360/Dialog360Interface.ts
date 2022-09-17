import { IDataObject } from "n8n-workflow";

export interface IBody {
	to: string;
	type: string;
	template: {
		namespace: string,
		name: string,
		language: {
			"policy": string,
			"code": string
		},
		components : IDataObject[]
	};
}
