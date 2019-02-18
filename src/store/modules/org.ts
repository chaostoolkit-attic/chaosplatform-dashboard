import { Uuid } from '@typed/uuid'
import { Action, Module, VuexModule, Mutation, MutationAction, getModule } from 'vuex-module-decorators'

import store from '@/store'
import { Org, User, Workspace } from '@/store/model'
import { fetchOrgByName } from '@/store/service'


@Module({ name: 'org', namespaced: true, dynamic: true, store })
class OrgModule extends VuexModule {
  public org: Org | null = null

  @MutationAction({ mutate: ['org'], rawError: true })
  public async load(orgName: string) {
    const org = await fetchOrgByName(orgName)
    return {org}
  }

  get id(): Uuid {
    return this.org.id
  }
}

export default getModule(OrgModule)
