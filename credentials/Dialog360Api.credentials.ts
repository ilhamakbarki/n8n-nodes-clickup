import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';


export class Dialog360Api implements ICredentialType {
	name = 'dialog360Api';
	displayName = '360 Dialog API';
	documentationUrl = 'https://docs.360dialog.com/whatsapp-api/whatsapp-api/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key Secret',
			name: 'apiKeySecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];
}
