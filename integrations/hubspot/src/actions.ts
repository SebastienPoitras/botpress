import * as sdk from '@botpress/sdk'
import * as bp from '.botpress'
import * as hs from '@hubspot/api-client'
import { CreateLeadAssociationTypeArgs, Lead } from './types'
import { emptyStrToUndefined } from './utils'

const LEAD_TO_CONTACT_ASSOCIATION_TYPE: CreateLeadAssociationTypeArgs = {
  associationCategory: 'HUBSPOT_DEFINED',
  associationTypeId: 578,
}

const createLead: bp.IntegrationProps['actions']['createLead'] = async ({ input, ctx }) => {
  const { primaryContactId, name, type, label } = input

  /** Return undefined if the value is an empty string, else return the value */
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
        hs_lead_name: emptyStrToUndefined(name),
        hs_lead_type: emptyStrToUndefined(type),
        hs_lead_label: emptyStrToUndefined(label),
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

const getLeads: bp.IntegrationProps['actions']['getLeads'] = async ({ ctx }) => {
  const client = new hs.Client({ accessToken: ctx.configuration.apiKey })
  const request = {
    method: 'GET',
    path: '/crm/v3/objects/leads',
    qs: {
      properties: 'hs_lead_name,hs_lead_type,hs_lead_label',
    },
  }
  const response = await client.apiRequest(request)
  if (!response.ok) {
    const responseStr = JSON.stringify(await response.json())
    throw new sdk.RuntimeError(`Error retrieving lead: ${responseStr}`)
  }

  const responseBody = await response.json()
  const results: Lead[] = responseBody.results
  return {
    results: results.map((lead) => ({
      id: lead.id,
      name: lead.properties.hs_lead_name,
      type: lead.properties.hs_lead_type,
      label: lead.properties.hs_lead_label,
    })),
  }
}

const updateLead: bp.IntegrationProps['actions']['updateLead'] = async ({ ctx, input }) => {
  const client = new hs.Client({ accessToken: ctx.configuration.apiKey })
  const { id, name, type, label } = input
  const request = {
    method: 'PATCH',
    path: `/crm/v3/objects/leads${id}`,
    body: {
      hs_lead_name: emptyStrToUndefined(name),
      hs_lead_type: emptyStrToUndefined(type),
      hs_lead_label: emptyStrToUndefined(label),
    },
  }
  // TODO: Complete this function
  client.apiRequest(request);
  return {
    id: '123',
    name: null,
    type: null,
    label: null,
  }
}

export default {
  createLead,
  getLeads,
  updateLead,
} satisfies bp.IntegrationProps['actions']
