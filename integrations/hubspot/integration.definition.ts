import { z, IntegrationDefinition } from '@botpress/sdk'
import { integrationName } from './package.json'

export default new IntegrationDefinition({
  name: integrationName,
  version: '0.0.1',
  readme: 'hub.md',
  icon: 'icon.svg',
  actions: {
    createLead: {
      title: 'Create a lead',
      description: 'Create a new lead based on the provided parameters',
      input: {
        schema: z.object({
          primaryContactId: z.string().describe('The ID of the primary contact of the lead'), // TODO: Offer diffrent types of associations
          name: z.string().optional().describe('The name of the lead'),
          type: z.string().optional().describe('The type of lead (Internal value)'),
          label: z.string().optional().describe('The label of the lead (Internal value)'),
        }),
      },
      output: {
        schema: z.object({
          id: z.string().describe('The ID of the created lead'),
        }),
      },
    },
    getLeads: {
      title: 'Get leads',
      description: 'Get all leads',
      input: {
        schema: z.object({}),
      },
      output: {
        schema: z.object({
          results: z.array(
            z.object({
              id: z.string().describe('The ID of the lead'),
              name: z.string().describe('The name of the lead'),
              type: z.string().nullable().describe('The type of lead (Internal value)'),
              label: z.string().nullable().describe('The label of the lead (Internal value)'),
            }),
          ),
        }),
      },
    },
    // TODO: Update leads
    // TODO: Delete leads
  },
  configuration: {
    schema: z.object({
      apiKey: z.string().describe('The API key to use for authentication'),
    }),
  },
})
