import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'
import * as hs from '@hubspot/api-client'

const LEAD_TO_CONTACT_ASSOCIATION_TYPE = {
  associationCategory: 'HUBSPOT_DEFINED',
  associationTypeId: 578,
}

const createLead: bp.IntegrationProps['actions']['createLead'] = async ({ input, ctx }) => {
  const { primaryContactId, name, type, label } = input

  const makeUndefinedIfEmpty = (value: string | undefined) => (value === '' ? undefined : value)
  const client = new hs.Client({ accessToken: ctx.configuration.apiKey })
  const request = {
    method: 'POST',
    path: '/crm/v3/objects/leads',
    body: {
      associations: [
        {
          types: [LEAD_TO_CONTACT_ASSOCIATION_TYPE],
          to: {
            id: primaryContactId,
          },
        },
      ],
      properties: {
        hs_lead_name: makeUndefinedIfEmpty(name),
        hs_lead_type: makeUndefinedIfEmpty(type),
        hs_lead_label: makeUndefinedIfEmpty(label),
      },
    },
  }

  const response = await client.apiRequest(request)
  if (!response.ok) { 
    const responseStr = JSON.stringify(await response.json())
    throw new sdk.RuntimeError(`Error creating lead: ${responseStr}`)
  }

  const { id } = await response.json()
  return { id }
}

export default {
  createLead,
} satisfies bp.IntegrationProps['actions']
