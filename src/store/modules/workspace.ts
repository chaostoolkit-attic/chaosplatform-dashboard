import { Uuid } from '@typed/uuid'
import { Action, Module, VuexModule, Mutation, MutationAction, getModule } from 'vuex-module-decorators'

import store from '@/store'
import { Org, Collaborator, Workspace } from '@/store/model'
import { fetchWorkspaceByName, fetchWorkspaceCollaborators } from '@/store/service'


@Module({ name: 'workspace', namespaced: true, dynamic: true, store })
class WorkspaceModule extends VuexModule {
  public organization: Org | null = null
  public workspace: Workspace | null = null
  public collaborators: Collaborator[] | null = null

  @MutationAction({ mutate: ['workspace'], rawError: true })
  public async load(orgName: string, workspaceName: string) {
    const workspace = await fetchWorkspaceByName(orgName, workspaceName)
    return { workspace }
  }

  @MutationAction({ mutate: ['collaborators'], rawError: true })
  public async loadCollaborators() {
    const collaborators = await fetchWorkspaceCollaborators(this.id)
    return { collaborators }
  }

  get id(): Uuid {
    return this.workspace.id
  }

  get org(): Org {
    return this.organization
  }
}

export default getModule(WorkspaceModule)
