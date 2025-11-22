import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class n8n implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n8n',
		name: 'n8n',
		icon: { light: 'file:n8n.svg', dark: 'file:n8n.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Basic n8n Node',
		defaults: {
			name: 'n8n',
		},
		inputs: [n8n.Main],
		outputs: [n8n.Main],
		usableAsTool: true,
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Leo N8N',
				name: 'leo',
				type: 'string',
				default: '',
				placeholder: 'Placeholder value',
				description: 'The description text',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				item = items[itemIndex];

				item.json.myString = myString;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
