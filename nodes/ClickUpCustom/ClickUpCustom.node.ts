import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { clickupApiRequest, validateJSON } from './GenericFunctions';

import { taskCreateFields, taskOperations, taskSetCustomFields } from './TaskDescription';

import { ITask } from './TaskInterface';

export class ClickUpCustom implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickUp Custom',
		name: 'clickUpCustom',
		icon: 'file:clickup.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ":" + $parameter["resource"]}}',
		description: 'Consume ClickUp Custom API',
		defaults: {
			name: 'ClickUp Custom',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clickUpApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['accessToken'],
					},
				},
			},
			{
				name: 'clickUpOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'accessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'accessToken',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'task',
			},
			// TASK
			...taskOperations,
			...taskCreateFields,
			...taskSetCustomFields,
		],
	};

	methods = {
		loadOptions: {
			// Get all the available teams to display them to user so that he can
			// select them easily
			async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				const { teams } = await clickupApiRequest.call(this, 'GET', '/team');
				for (const team of teams) {
					const teamName = team.name;
					const teamId = team.id;
					returnData.push({
						name: teamName,
						value: teamId,
					});
				}
				return returnData;
			},
			// Get all the available spaces to display them to user so that he can
			// select them easily
			async getSpaces(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const teamId = this.getCurrentNodeParameter('team') as string;
				const returnData: INodePropertyOptions[] = [];
				const { spaces } = await clickupApiRequest.call(this, 'GET', `/team/${teamId}/space`);
				for (const space of spaces) {
					const spaceName = space.name;
					const spaceId = space.id;
					returnData.push({
						name: spaceName,
						value: spaceId,
					});
				}
				return returnData;
			},
			// Get all the available folders to display them to user so that he can
			// select them easily
			async getFolders(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const spaceId = this.getCurrentNodeParameter('space') as string;
				const returnData: INodePropertyOptions[] = [];
				const { folders } = await clickupApiRequest.call(this, 'GET', `/space/${spaceId}/folder`);
				for (const folder of folders) {
					const folderName = folder.name;
					const folderId = folder.id;
					returnData.push({
						name: folderName,
						value: folderId,
					});
				}
				return returnData;
			},
			// Get all the available lists to display them to user so that he can
			// select them easily
			async getLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const folderId = this.getCurrentNodeParameter('folder') as string;
				const returnData: INodePropertyOptions[] = [];
				const { lists } = await clickupApiRequest.call(this, 'GET', `/folder/${folderId}/list`);
				for (const list of lists) {
					const listName = list.name;
					const listId = list.id;
					returnData.push({
						name: listName,
						value: listId,
					});
				}
				return returnData;
			},
			// Get all the available lists without a folder to display them to user so that he can
			// select them easily
			async getFolderlessLists(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const spaceId = this.getCurrentNodeParameter('space') as string;
				const returnData: INodePropertyOptions[] = [];
				const { lists } = await clickupApiRequest.call(this, 'GET', `/space/${spaceId}/list`);
				for (const list of lists) {
					const listName = list.name;
					const listId = list.id;
					returnData.push({
						name: listName,
						value: listId,
					});
				}
				return returnData;
			},
			// Get all the available assignees to display them to user so that he can
			// select them easily
			async getAssignees(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getCurrentNodeParameter('list') as string;
				const taskId = this.getCurrentNodeParameter('task') as string;
				const returnData: INodePropertyOptions[] = [];
				let url: string;
				if (listId) {
					url = `/list/${listId}/member`;
				} else if (taskId) {
					url = `/task/${taskId}/member`;
				} else {
					return returnData;
				}

				const { members } = await clickupApiRequest.call(this, 'GET', url);
				for (const member of members) {
					const memberName = member.username;
					const menberId = member.id;
					returnData.push({
						name: memberName,
						value: menberId,
					});
				}
				return returnData;
			},
			// Get all the available tags to display them to user so that he can
			// select them easily
			async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const spaceId = this.getCurrentNodeParameter('space') as string;
				const returnData: INodePropertyOptions[] = [];
				const { tags } = await clickupApiRequest.call(this, 'GET', `/space/${spaceId}/tag`);
				for (const tag of tags) {
					const tagName = tag.name;
					const tagId = tag.name;
					returnData.push({
						name: tagName,
						value: tagId,
					});
				}
				return returnData;
			},
			// Get all the available tags to display them to user so that he can
			// select them easily
			async getTimeEntryTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const teamId = this.getCurrentNodeParameter('team') as string;
				const returnData: INodePropertyOptions[] = [];
				const { data: tags } = await clickupApiRequest.call(
					this,
					'GET',
					`/team/${teamId}/time_entries/tags`,
				);
				for (const tag of tags) {
					const tagName = tag.name;
					const tagId = JSON.stringify(tag);
					returnData.push({
						name: tagName,
						value: tagId,
					});
				}
				return returnData;
			},
			// Get all the available tags to display them to user so that he can
			// select them easily
			async getStatuses(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getCurrentNodeParameter('list') as string;
				const returnData: INodePropertyOptions[] = [];
				const { statuses } = await clickupApiRequest.call(this, 'GET', `/list/${listId}`);
				for (const status of statuses) {
					const statusName = status.status;
					const statusId = status.status;
					returnData.push({
						name: statusName,
						value: statusId,
					});
				}
				return returnData;
			},
			// Get all the available lists to display them to user so that he can
			// select them easily
			async getTasks(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getCurrentNodeParameter('list') as string;
				const archived = this.getCurrentNodeParameter('archived') as string;
				const returnData: INodePropertyOptions[] = [];
				const { tasks } = await clickupApiRequest.call(
					this,
					'GET',
					`/list/${listId}/task?archived=${archived}`,
				);
				for (const task of tasks) {
					const taskName = task.name;
					const taskId = task.id;
					returnData.push({
						name: taskName,
						value: taskId,
					});
				}
				return returnData;
			},
			// Get all the custom fields to display them to user so that he can
			// select them easily
			async getCustomFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getCurrentNodeParameter('list') as string;
				const returnData: INodePropertyOptions[] = [];
				const { fields } = await clickupApiRequest.call(this, 'GET', `/list/${listId}/field`);
				for (const field of fields) {
					const fieldName = field.name;
					const fieldId = field.id;
					const data: INodePropertyOptions = {
						name: fieldName,
						value: fieldId,
					};
					if (field.type !== "drop_down" && field.type !== "labels") {
						returnData.push(data);
					}
				}
				return returnData;
			},
			// Get all the custom fields to display them to user so that he can
			// select them easily
			async getCustomFieldsOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getCurrentNodeParameter('list') as string;
				const returnData: INodePropertyOptions[] = [];
				const { fields } = await clickupApiRequest.call(this, 'GET', `/list/${listId}/field`);
				for (const field of fields) {
					const fieldName = field.name;
					const fieldId = field.id;
					const data: INodePropertyOptions = {
						name: fieldName,
						value: fieldId,
					};
					if (field.type === "drop_down" || field.type === "labels") {
						returnData.push(data);
					}
				}
				return returnData;
			},
			// Get all the custom fields to display them to user so that he can
			// select them easily
			async getCustomFieldsOptionsValue(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const listId = this.getCurrentNodeParameter('list') as string;
				const returnData: INodePropertyOptions[] = [];
				const { fields } = await clickupApiRequest.call(this, 'GET', `/list/${listId}/field`);
				for (const field of fields) {
					if (field.type === "drop_down" || field.type === "labels") {
						let fieldName = "name";
						if (field.type === "labels") {
							fieldName = "label";
						}
						const config = field.type_config;
						for (const option of config.options) {
							const data: INodePropertyOptions = {
								name: option[fieldName],
								value: option.id,
							};
							returnData.push(data);
						}
					}
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		const qs: IDataObject = {};
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'task') {
					if (operation === 'create') {
						const listId = this.getNodeParameter('list', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const body: ITask = {
							name,
						};
						let isDateTime = false;
						if (additionalFields.isDateTime) {
							isDateTime = additionalFields.isDateTime as boolean;
						}
						const customFields: IDataObject[] = [];
						if (additionalFields.customFieldsText && Object.keys(additionalFields.customFieldsText as IDataObject).length) {
							const customFieldsText = additionalFields.customFieldsText as IDataObject;
							for (const value of customFieldsText.values as IDataObject[]) {
								const dataToAdd: IDataObject = {
									id: value['fieldId'],
									value: value['fieldValue'],
								};
								if (isDateTime) {
									dataToAdd["value_options"] = {
										"time": true,
									};
								}
								customFields.push(dataToAdd);
							}
						}
						if (additionalFields.customFieldsOptions && Object.keys(additionalFields.customFieldsOptions as IDataObject).length) {
							const customFieldsOptions = additionalFields.customFieldsOptions as IDataObject;
							for (const value of customFieldsOptions.values as IDataObject[]) {
								customFields.push({
									id: value['fieldId'],
									value: value['fieldValue'],
								});
							}
						}
						if (customFields.length > 0) body.custom_fields = customFields;
						if (additionalFields.content) {
							body.content = additionalFields.content as string;
						}
						if (additionalFields.assignees) {
							body.assignees = additionalFields.assignees as string[];
						}
						if (additionalFields.tags) {
							body.tags = additionalFields.tags as string[];
						}
						if (additionalFields.status) {
							body.status = additionalFields.status as string;
						}
						if (additionalFields.priority) {
							body.priority = additionalFields.priority as number;
						}
						if (additionalFields.dueDate) {
							body.due_date = new Date(additionalFields.dueDate as string).getTime();
						}
						if (additionalFields.dueDateTime) {
							body.due_date_time = additionalFields.dueDateTime as boolean;
						}
						if (additionalFields.timeEstimate) {
							body.time_estimate = (additionalFields.timeEstimate as number) * 6000;
						}
						if (additionalFields.startDate) {
							body.start_date = new Date(additionalFields.startDate as string).getTime();
						}
						if (additionalFields.startDateTime) {
							body.start_date_time = additionalFields.startDateTime as boolean;
						}
						if (additionalFields.notifyAll) {
							body.notify_all = additionalFields.notifyAll as boolean;
						}
						if (additionalFields.parentId) {
							body.parent = additionalFields.parentId as string;
						}
						if (additionalFields.markdownContent) {
							delete body.content;
							body.markdown_content = additionalFields.content as string;
						}
						responseData = await clickupApiRequest.call(this, 'POST', `/list/${listId}/task`, body);
					}
					if (operation === 'setCustomField') {
						const taskId = this.getNodeParameter('task', i) as string;
						const field = this.getNodeParameter('field', i) as IDataObject;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						let isDateTime = false;
						if (additionalFields.isDateTime) {
							isDateTime = additionalFields.isDateTime as boolean;
						}
						const customFields: IDataObject[] = [];
						if (field.customFieldsText && Object.keys(field.customFieldsText as IDataObject).length) {
							const customFieldsText = field.customFieldsText as IDataObject;
							for (const value of customFieldsText.values as IDataObject[]) {
								const dataToAdd: IDataObject = {
									id: value['fieldId'],
									value: value['fieldValue'],
								};
								if (isDateTime) {
									dataToAdd["value_options"] = {
										"time": true,
									};
								}
								customFields.push(dataToAdd);
							}
						}
						if (field.customFieldsOptions && Object.keys(field.customFieldsOptions as IDataObject).length) {
							const customFieldsOptions = field.customFieldsOptions as IDataObject;
							for (const value of customFieldsOptions.values as IDataObject[]) {
								customFields.push({
									id: value['fieldId'],
									value: value['fieldValue'],
								});
							}
						}
						if (customFields.length < 1) {
							throw new NodeOperationError(this.getNode(), 'Minimum 1 Custom Fields to Setting', {
								itemIndex: i,
							});
						}
						const responseDatas: IDataObject[] = [];
						for (const d of customFields) {
							const fieldId = d.id;
							delete d.id;
							const resp = await clickupApiRequest.call(
								this,
								'POST',
								`/task/${taskId}/field/${fieldId}`,
								d,
							);
							if (Array.isArray(resp)) {
								responseDatas.push.apply(responseDatas, resp as IDataObject[]);
							} else if (resp !== undefined) {
								responseDatas.push(resp as IDataObject);
							}
						}
						responseData = {"message":"OK", "responseData": responseDatas};
					}
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message, json: {} });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
