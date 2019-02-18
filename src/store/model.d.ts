import { Uuid } from '@typed/uuid'
import { type } from 'os';
import { Url } from 'url';

export interface Links {
    self: Url
}

export interface Visibility {
    experiment: boolean
    execution: boolean
}

export interface User {
    id: Uuid
    username: string
    orgs: Org[]
    workspaces: []
    url: Url
    links: Links
}

export interface Workspace {
    id: Uuid
    name: string
    org_id: Uuid
    type: string
    org_name: string
    visibility: Visibility
    url: Url
    links: Links
}

export interface Collaborator {
    id: Uuid
    username: string
    fullname: String
    owner: boolean
    collaborator: boolean
    workspace_name: string
    workspace_id: Uuid
}

export interface NewWorkspace {
    name: string
    org: Uuid
    visibility: VisibilityState
}

export interface Org {
    id: Uuid
    name: string
    owner: boolean
    type: string
    workspaces: Workspace[]
    url: Url
    links: Links
}


export interface OrgSettings {
    description?: string
    logo?: string
    url?: Url
    email?: string
}

export interface NewOrg {
    name: string
    settings: OrgSettings
    visibility: Visibility
}
