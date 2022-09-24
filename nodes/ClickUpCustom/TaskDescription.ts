import { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['task'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a task',
				action: 'Create a task',
			},
			{
				name: 'Set Custom Field',
				value: 'setCustomField',
				description: 'Set a custom field',
				action: 'Set a custom field on a task',
			},
		],
		default: 'create',
	},
];

export const customFieldText: INodeProperties = {
	displayName: 'Custom Fields Text',
	name: 'customFieldsText',
	placeholder: 'Add Custom Field',
	type: 'fixedCollection',
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'values',
			displayName: 'Value',
			values: [
				{
					displayName: 'Field Name or ID',
					name: 'fieldId',
					type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getCustomFields',
					},
					default: '',
					description: 'Custom field to set a value to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				},
				{
					displayName: 'Field Value',
					name: 'fieldValue',
					type: 'string',
					default: '',
				},
			],
		},
	],
};

export const customFieldOptions: INodeProperties = {
	displayName: 'Custom Fields Options',
	name: 'customFieldsOptions',
	placeholder: 'Add Custom Field',
	type: 'fixedCollection',
	default: {},
	typeOptions: {
		multipleValues: true,
	},
	options: [
		{
			name: 'values',
			displayName: 'Value',
			values: [
				{
					displayName: 'Field Name or ID',
					name: 'fieldId',
					type: 'options',
					typeOptions: {
						loadOptionsMethod: 'getCustomFieldsOptions',
					},
					default: '',
					description: 'Custom field to set a value to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				},
				{
					// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
					displayName: 'Field Value',
					name: 'fieldValue',
					type: 'options',
					default: '',
					typeOptions: {
						loadOptionsMethod: 'getCustomFieldsOptionsValue',
					},
					description: 'Custom field to set a value to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
				},
			],
		},
	],
};

export const taskCreateFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                task:create                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Team Name or ID',
		name: 'team',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create','setCustomField'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		required: true,
	},
	{
		displayName: 'Space Name or ID',
		name: 'space',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create','setCustomField'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getSpaces',
			loadOptionsDependsOn: ['team'],
		},
		required: true,
	},
	{
		displayName: 'Folderless List',
		name: 'folderless',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		required: true,
	},
	{
		displayName: 'Folder Name or ID',
		name: 'folder',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
				folderless: [false],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getFolders',
			loadOptionsDependsOn: ['space'],
		},
		required: true,
	},
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
				folderless: [true],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getFolderlessLists',
			loadOptionsDependsOn: ['space'],
		},
		required: true,
	},
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
				folderless: [false],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getLists',
			loadOptionsDependsOn: ['folder'],
		},
		required: true,
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		required: true,
		description: 'The first name on the task',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Assignee Names or IDs',
				name: 'assignees',
				type: 'multiOptions',
				description:
					'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getAssignees',
					loadOptionsDependsOn: ['list'],
				},
				default: [],
			},
			customFieldText,
			customFieldOptions,
			{
				displayName: 'Use Date Time On Custom Fields',
				name: 'isDateTime',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
			},
			{
				displayName: 'Due Date',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Due Date Time',
				name: 'dueDateTime',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Is Markdown Content',
				name: 'markdownContent',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Notify All',
				name: 'notifyAll',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Parent ID',
				name: 'parentId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 4,
				},
				description: 'Integer mapping as 1 : Urgent, 2 : High, 3 : Normal, 4 : Low',
				default: 3,
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Start Date Time',
				name: 'startDateTime',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Status Name or ID',
				name: 'status',
				type: 'options',
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
				typeOptions: {
					loadOptionsMethod: 'getStatuses',
					loadOptionsDependsOn: ['list'],
				},
				default: '',
			},
			{
				displayName: 'Tag Names or IDs',
				name: 'tags',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getTags',
					loadOptionsDependsOn: ['space'],
				},
				default: [],
				description:
					'The array of tags applied to this task. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
			},
			{
				displayName: 'Time Estimate',
				name: 'timeEstimate',
				type: 'number',
				description: 'Time estimate in minutes',
				default: 1,
			},
		],
	},
];

export const taskSetCustomFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                task:setCustomField                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'List Name or ID',
		name: 'list',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>',
		default: '',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['setCustomField'],
			},
		},
		typeOptions: {
			loadOptionsMethod: 'getFolderlessLists',
			loadOptionsDependsOn: ['space'],
		},
		required: true,
	},
	{
		displayName: 'Task ID',
		name: 'task',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['setCustomField'],
			},
		},
		description: 'The ID of the task to add custom field to',
	},
	{
		displayName: 'Custom Fields',
		name: 'field',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['setCustomField'],
			},
		},
		description: 'Add custom field',
		options:[
			customFieldText,
			customFieldOptions,
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['setCustomField'],
			},
		},
		options:[
			{
				displayName: 'Use Date Time On Custom Fields',
				name: 'isDateTime',
				type: 'boolean',
				default: false,
			},
		],
	},
];
