<template>
  <div class="columns" v-if="collaborators">
    <div class="column col-12">
      <h5>Workspace Collaborators</h5>
    </div>
    <div class="column col-12">
      <div class="divider" />
    </div>
    <div class="column col-12">
      <div class="p-2" />
    </div>
    <div class="column col-12 text-justify">
      <p>
        Collaborators to workspace can perform operations on that workspace only.
        Members of the workspace's organization have already access to the
        workspace as members by default, you can turn any of these members into
        a workspace owner for increased permissions.
      </p>
    </div>
    <div class="column col-12">
      <div class="p-2" />
      <div class="p-2" />
      <div class="p-2" />
    </div>
    <div class="column col-12">
      <div class="columns">
        <div class="column col-11">
          <h6>Collaborators</h6>
          <div class="divider" />
        </div>
        <div class="column col-9">
          <table class="table table-hover" v-if="collaborators.collaborators">
            <tbody>
              <tr v-for="collaborator in collaborators.collaborators" :key="collaborator.id">
                <td>
                  <div class="columns">
                    <div class="column col-4">
                      <strong>{{collaborator.username}}</strong>
                    </div>
                    <div class="column col-5">
                      <strong>{{collaborator.name}}</strong>
                    </div>
                    <div class="column col-2">
                      <span v-if="collaborator.owner">Owner</span>
                      <span v-else>Collaborator</span>
                    </div>
                    <div class="column col-1" v-if="context.workspace.owner">
                      <div class="dropdown">
                        <button class="btn btn-primary btn-action dropdown-toggle" tabindex="0">
                          <i class="icon icon-caret"></i>
                        </button>
                        <ul class="menu">
                          <li class="menu-item">
                            <a v-if="collaborator.owner" @click.prevent="asCollaborator(collaborator)" href="#">Remove Ownership</a>
                            <a v-else @click.prevent="asOwner(collaborator)" href="#">Make Organization Owner</a>
                          </li>
                          <li class="menu-item">
                            <a @click.prevent="removeUser(collaborator)" href="#">Remove from Workspace</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <ul class="pagination">
            <li class="page-item page-prev">
              <router-link :to="{'name': 'org_settings_collaborators', 'page': 'collaborators.paging.prev'}">
                <div class="page-item-subtitle" v-if="collaborators.paging.prev">Previous</div>
                <div class="page-item-subtitle disabled" v-else>Previous</div>
              </router-link>
            </li>
            <li class="page-item page-next">
              <router-link :to="{'name': 'org_settings_collaborators', 'page': 'collaborators.paging.next'}">
                <div class="page-item-subtitle" v-if="collaborators.paging.next">Next</div>
                <div class="page-item-subtitle disabled" v-else>Next</div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="column col-12">
      <div class="p-2" />
      <div class="p-2" />
      <div class="p-2" />
    </div>

    <div class="column col-12" v-if="canAddcollaborators()">
      <h6>Add User as a Collaborator</h6>
      <div class="divider col-11" />
      <p>
          Add users to your workspace so they have access to all its experiments.
      </p>
      <form @submit.prevent="findUser">
        <div class="columns">
          <div class="column col-9">
            <div class="form-group">
              <label class="form-label" for="user">Name</label>
              <div class="has-icon-right">
                <input class="form-input" type="text" id="user" placeholder="Name" v-model.trim="user" />
                <i class="form-icon icon icon-search c-hand" @click="findUser"></i>
              </div>
            </div>
            <ul class="menu" v-if="matches">
              <li class="menu-item">
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <div class="columns col-oneline py-1" v-for="match in matches" :key="match.id">
                        <div class="column col-10 col-mx-auto">
                          <span v-if="match.username">{{match.username}} - </span>
                          <span v-if="match.name">{{match.name}}</span>
                        </div>
                        <div class="column col-2">
                          <button class="float-right btn btn-sm btn-primary btn-action" @click.prevent="addUser(match)">
                            <i class="icon icon-plus c-hand"></i>
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang='ts'>
/**
import Vue from 'vue'
import axios from 'axios'
import swal from 'sweetalert2'

export default Vue.extend({
    data(): any {
      return {
          collaborators: null,
          matches: null,
          user: null,
          context: {
              signedIn: false,
              org: null
          }
      }
  },
    created(): any {
      this.$nextTick(() => {
          this.getCurrentOrg()
      })
    },
      methods: {
        canAddcollaborators() {
            return this.isOwner() && !this.isWorkspacePersonal()
        },
        isWorkspacePersonal() {
            return this.context.workspace.type === 'personal'
        },
        isOwner() {
          return this.context.workspace.owner
        },
        getWorkspaceCollaborators() {
            const self = this
            const orgName = this.$route.params.org
            const workspaceName = this.$route.params.workspace
            axios.get(
                '/account/orgs/' + orgName + '/' + workspaceName + '/settings/collaborators',
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.collaborators = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve collaborators!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        findUser() {
            const self = this
            self.matches = null

            if ((self.user === '') || (self.user === null)) {
                return
            }

            axios.get(
                '/users/lookup?user=' + self.user,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.matches = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to looking up users!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        addUser(user: any) {
            const self = this
            const orgName = this.$route.params.org
            const workspaceName = this.$route.params.workspace
            axios.post(
                '/account/orgs/' + orgName + '/' + workspaceName + '/settings/collaborators', user,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
              const data = response.data
              if ((data !== '') && (data != null)) {
                self.collaborators.push(data)
              }
            }).catch((error) => {
                swal({
                    title: `Failed to add user to organization!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        removeUser(user: any) {
            const self = this
            const orgName = this.$route.params.org
            const workspaceName = this.$route.params.workspace
            axios.delete(
                '/account/orgs/' + orgName + '/' + workspaceName + '/settings/collaborators/' + user.id,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.getWorkspaceCollaborators()
            }).catch((error) => {
                swal({
                    title: `Failed to remove user from organization!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        asOwner(user: any) {
            const self = this
            const orgName = this.$route.params.org
            const workspaceName = this.$route.params.workspace
            const patched = Object.assign(user)
            patched.owner = true
            axios.patch(
                '/account/orgs/' + orgName + '/' + workspaceName + '/settings/collaborators/' + patched.id, patched,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                user.owner = true
            }).catch((error) => {
                swal({
                    title: `Failed to set user as organization owner!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        asCollaborator(user: any) {
            const self = this
            const orgName = this.$route.params.org
            const workspaceName = this.$route.params.workspace
            const patched = Object.assign(user)
            patched.owner = false
            axios.patch(
                '/account/orgs/' + orgName + '/' + workspaceName + '/settings/collaborators/' + user.id, patched,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                user.owner = false
            }).catch((error) => {
                swal({
                    title: `Failed to set user as workspace collaborator!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        getCurrentOrg() {
            const self = this
            const orgName = this.$route.params.org
            axios.get(
            '/account/orgs/' + orgName, {
                headers: {
                  Accept: 'application/json'
                }
            }
            ).then((response) => {
              self.context.org = response.data
              self.getCurrentWorkspace()
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve the current organization!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        getCurrentWorkspace() {
            const self = this
            const orgName = this.$route.params.org
            const workspaceName = this.$route.params.workspace
            axios.get(
                '/account/orgs/' + orgName + '/' + workspaceName, {
                headers: {
                  Accept: 'application/json'
                }
            }
            ).then((response) => {
              self.context.workspace = response.data
              self.getWorkspaceCollaborators()
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve the current workspace!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        }
    }
})
*/
</script>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { Org, User, Visibility, Workspace } from '@/store/model'
  import workspace from '@/store/modules/workspace'

  @Component({ name: 'workspaceCollaborators' })
  export default class WorkspaceCollaborators extends Vue {
    @Prop(Object) public currentUser ?: User
    @Prop(Object) public currentOrg ?: Org
    @Prop(Object) public currentWorkspace ?: Workspace

    get collaborators(): Collaborator[] {
      return currentWorkspace.collaborators
    }

    public async createWorkspace() {
      const self = this
      this.reset()
      await user
        .addWorkspace(this.newWorkspace as NewWorkspace)
        .then(() => {
            self.workspaceCreated = true
        })
        .catch((error) => {
            self.errors = error.response.data
        })
    }

    public async created() {
      await user.loadOrgs(this.currentUser.id)
      await user.loadWorkspace(this.currentUser.id)
    }

    private reset() {
        this.workspaceCreated = false
        this.errors = {
            org: null, name: null
        }
    }
  }
</script>
