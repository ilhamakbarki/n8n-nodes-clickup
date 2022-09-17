import {
	INodeProperties,
} from 'n8n-workflow';

export const templatesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: [
					'templates',
				],
			},
		},
		options: [
			{
				name: 'Get Templates',
				value: 'get',
				description: 'Get Templates Message',
				action: 'Get templates a templates',
			},
		],
		default: 'get',

	},
];

export const getTemplatesAdditional : INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'templates',
				],
				operation:[
					'get',
				],
			},
		},
		options: [
			{
				displayName: 'Template Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter template by name',
			},
		],
		default: {},

	},
];
