import { Uuid } from '@typed/uuid'
import axios from 'axios'
import { Collaborator, NewOrg, NewWorkspace, Org, User, Workspace } from '@/store/model'

export const chaosPlatformApi = axios.create()


export async function fetchUser(): Promise<User> {
    const response = await chaosPlatformApi.get(`/account/user/profile`)
    return response.data as User
}


export async function fetchUserWorkspaces(userId: Uuid): Promise<Workspace[]> {
    const response = await chaosPlatformApi.get(`/api/v1/users/${userId}/workspaces`)
    return response.data as Workspace[]
}


export async function createWorkspace(workspace: NewWorkspace): Promise<Workspace> {
    const response = await chaosPlatformApi.post(
        `/api/v1/workspaces`, workspace,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    return response.data as Workspace
}


export async function createOrg(org: NewOrg): Promise<Org> {
    const response = await chaosPlatformApi.post(
        `/api/v1/organizations`, org,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
    return response.data as Org
}

export async function fetchUserOrgs(userId: Uuid): Promise<Org[]> {
    const response = await chaosPlatformApi.get(`/api/v1/users/${userId}/organizations`)
    return response.data as Org[]
}


export async function fetchWorkspace(workspaceId: Uuid): Promise<Workspace> {
    const response = await chaosPlatformApi.get(`/api/v1/workspaces/${workspaceId}`)
    return response.data as Workspace
}


export async function fetchWorkspaceByName(orgName: string, workspaceName: string): Promise<Workspace> {
    const response = await chaosPlatformApi.get(`/api/v1/workspaces/lookup/${workspaceName}?org=${orgName}`)
    return response.data as Workspace
}

export async function fetchOrgByName(orgName: string): Promise<User> {
    const response = await chaosPlatformApi.get(`/api/v1/organizations/lookup/${orgName}`)
    return response.data as User
}


export async function fetchWorkspaceCollaborators(workspaceId: Uuid): Promise<Collaborator[]> {
    const response = await chaosPlatformApi.get(`/api/v1/workspaces/${workspaceId}/collaborators`)
    return response.data as Collaborator[]
}
