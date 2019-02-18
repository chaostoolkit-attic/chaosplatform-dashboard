import { Uuid } from '@typed/uuid'
import { Action, Module, VuexModule, Mutation, MutationAction, getModule } from 'vuex-module-decorators'

import store from '@/store'
import { NewOrg, NewWorkspace, Org, User, Workspace } from '@/store/model'
import { createOrg, createWorkspace, fetchUserOrgs, fetchUser, fetchUserWorkspaces } from '@/store/service'



@Module({ name: 'user', namespaced: true, dynamic: true, store })
class UserModule extends VuexModule {
  public user: User | null = null
  public workspaces: Workspace[] | null = null
  public orgs: Org[] | null = null

  @MutationAction({ mutate: ['user'], rawError: true })
  public async load() {
    const user = await fetchUser()
    return {user}
  }

  get authenticated(): boolean {
      return this.user != null
  }

  get id(): Uuid {
    return this.user.id
  }

  @MutationAction({ mutate: ['workspaces'], rawError: true })
  public async loadWorkspaces(userId: Uuid) {
      const workspaces = await fetchUserWorkspaces(userId)
      return {workspaces}
  }

  @MutationAction({ mutate: ['orgs'], rawError: true })
  public async loadOrgs(userId: Uuid) {
      const orgs = await fetchUserOrgs(userId)
      return {orgs}
  }

  @Mutation
  public pushWorkspace(w: Workspace) {
    this.workspaces.push(w)
  }

  @Action({ rawError: true })
  public async addWorkspace(workspace: NewWorkspace) {
    const w = await createWorkspace(workspace)
    this.context.commit('pushWorkspace', w)
  }

  @Mutation
  public pushOrg(o: Org) {
    this.orgs.push(o)
  }

  @Action({ rawError: true })
  public async addOrg(org: NewOrg) {
    const o = await createOrg(org)
    this.context.commit('pushOrg', o)
  }
}

export default getModule(UserModule)
