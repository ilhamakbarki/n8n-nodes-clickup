import {
	INodeProperties,
} from 'n8n-workflow';

export const messagesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'messages',
				],
			},
		},
		options: [
			{
				name: 'Send Message',
				value: 'send',
				action: 'Send message a messages',

			},
		],
		default: 'send',

	},
];


export const sendMessageFields: INodeProperties[] = [
	{
		displayName: 'Templates Name',
		name: 'template',
		type: 'string',
		default: '',
		required: true,
		description: "Templates name from list templates",
		displayOptions: {
			show: {
				resource: [
					'messages',
				],
				operation: [
					'send',
				],
			},
		},
	},
	{
		displayName: 'Recipient',
		name: 'recipient',
		type: 'string',
		default: '',
		required: true,
		description: "The WhatsApp ID for the recipient of your message",
		displayOptions: {
			show: {
				resource: [
					'messages',
				],
				operation: [
					'send',
				],
			},
		},
	},
];

export const sendMessageAdditional: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'messages',
				],
				operation: [
					'send',
				],
			},
		},
		options: [
			{
				displayName: 'Body Text Message',
				name: 'body',
				type: 'string',
				default: '',
				description: 'The Body Text Message, add symbol | for multiple body',
				hint: 'Name|address|phone',
			},
			{
				displayName: 'Header Images',
				name: 'image',
				type: 'string',
				default: '',
				description: 'The Images URL, add symbol | for multiple images',
				hint: 'https://example.com/image1.png|https://example.com/image2.png',
			},
		],
		default: {},

	},
];
