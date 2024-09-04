export type CreateLeadAssociationTypeArgs = {
    associationTypeId: number,
    associationCategory: string,
}

export type CreateLeadAssociationArgs = {
    types: CreateLeadAssociationTypeArgs[]
    to: {
        id: string
    }
}

export type CreateLeadArgs = {
    primaryContactId: string
    name?: string
    type?: string
    label?: string
    associations: CreateLeadAssociationArgs[]
}

export type Lead = {
    id: string
    properties: {
        hs_lead_name: string
        hs_lead_type: string | null
        hs_lead_label: string | null
    }
}