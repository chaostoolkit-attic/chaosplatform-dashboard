<template>
    <div class="columns" v-if="workspaces">
        <div class="column col-12">
            <h5>Workspaces</h5>
        </div>
        <div class="column col-12">
            <div class="divider" />
        </div>
        <div class="column col-12 text-justify">
            <p>
                Workspaces allow you to share your experiments as well as collaborating on them with members of that
                workspace.
            </p>
            <p>
                You have a personal workspace by default. All experiments, and their executions, belonging to that
                personal workspace are
                private to you only.
            </p>
            <p>
                When you want to share with other users, you need to copy, or move, an experiment into a non-personal
                workspace. Experiments
                are then publicly viewable by everyone, even non members. You can make their executions private and
                viewable only
                by members of the workspace. Or, you can make executions publicly viewable as well.
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
                    <h6>Your Workspaces</h6>
                    <div class="divider" />
                </div>
                <div class="column col-9">
                    <table class="table table-hover">
                        <tbody>
                            <tr v-for="w in workspaces" :key="w.id">
                                <td>
                                    <strong><a :href="'/dashboard/orgs/'+w.org_name+'/'+w.name">{{w.org_name}}/{{w.name}}</a></strong>
                                </td>
                                <td>
                                    <span>{{w.type}}</span>
                                </td>
                                <td>
                                    <span v-if="w.owner">Owner</span>
                                    <span v-else>Member</span>
                                </td>
                                <td>
                                    <a :href="'/dashboard/orgs/'+w.org_name+'/'+w.name+'/settings'" v-if="w.owner">
                                        <i class="icon icon-edit"></i>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="column col-12">
            <div class="p-2" />
            <div class="p-2" />
            <div class="p-2" />
        </div>
        <div class="column col-12">
            <h6>New Workspace</h6>
            <div class="divider col-11" />
            <form>
                <div class="columns">
                    <div class="column col-9">
                        <div class="form-group">
                            <label class="form-label" for="name">Name</label>
                            <input v-bind:class="nameClass" type="text" id="name" placeholder="Name" v-model.trim="newWorkspace.name" />
                            <p class="form-input-hint" v-if="errors.name">{{errors.name[0]}}</p>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="org">Organization</label>
                            <select v-bind:class="orgClass" v-model="newWorkspace.org">
                                <option v-for="org in orgs" :key="org.id" v-bind:value="org.id">{{org.name}}</option>
                            </select>
                            <p class="form-input-hint" v-if="errors.org">{{errors.org[0]}}</p>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Experiment's visibility</label>
                            <label class="form-radio">
                                <input type="radio" name="experiment_visibility" v-model="newWorkspace.visibility.experiment"
                                    value="private"><i class="form-icon"></i> Private <small class="d-block text-gray">Only
                                    collaborators and organization members will access it</small>
                            </label>
                            <label class="form-radio">
                                <input type="radio" name="experiment_visibility" checked="" v-model="newWorkspace.visibility.experiment"
                                    value="protected"><i class="form-icon"></i> Protected <small class="d-block text-gray">Only
                                    authenticated users will access the experiment</small>
                            </label>
                            <label class="form-radio">
                                <input type="radio" name="experiment_visibility" v-model="newWorkspace.visibility.experiment"
                                    value="public"><i class="form-icon"></i> Public <small class="d-block text-gray">Everyone
                                    will be able to view the experiment</small>
                            </label>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Run results visibility to non-collaborators</label>
                            <div class="columns">
                                <div class="column col-12">
                                    <label class="form-radio">
                                        <input type="radio" name="execution_visibility" v-model="newWorkspace.visibility.execution"
                                            value="none"><i class="form-icon"></i>
                                        None <small class="d-block text-gray">Runs will remain visible only to
                                            collaborators and owners</small>
                                    </label>
                                </div>
                                <div class="column col-12">
                                    <label class="form-radio">
                                        <input type="radio" name="execution_visibility" checked="" v-model="newWorkspace.visibility.execution"
                                            value="status"><i class="form-icon"></i>
                                        Status <small class="d-block text-gray">Only the run's status will be visible</small>
                                    </label>
                                </div>
                                <div class="column col-12">
                                    <label class="form-radio">
                                        <input type="radio" name="execution_visibility" v-model="newWorkspace.visibility.execution"
                                            value="full"><i class="form-icon"></i>
                                        Full <small class="d-block text-gray">The full run's log will be shown</small>
                                    </label>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="toast toast-success" v-if="workspaceCreated">
                                    <button @click.prevent="workspaceCreated=false" class="btn btn-clear float-right"></button>
                                    Your new workspace has been created!
                                </div>
                                <div class="p-2"></div>
                                <button class="btn btn-primary" @click.prevent="createWorkspace">Create workspace</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { NewWorkspace, Org, User, Visibility, Workspace } from '@/store/model'
  import user from '@/store/modules/user'

  @Component({ name: 'userWorkspaces' })
  export default class UserWorkspaces extends Vue {
    @Prop(Object) public currentUser ?: User

    public workspaceCreated: boolean = false
    public newWorkspaceError: object | null = null
    public errors: object = {
        org: null,
        name: null
    }
    public newWorkspace: object = {
      name: null,
      org: null,
      visibility: {
        experiment: 'protected',
        execution: 'status'
      }
    }

    get nameClass(): any {
      return {
        'form-input': true,
        'is-error': (this.errors as any).name != null
      }
    }

    get orgClass(): any {
      return {
        'form-select': true,
        'is-error': (this.errors as any).org != null
      }
    }

    get workspaces(): Workspace[] {
      return user.workspaces
    }

    get orgs(): Org[] {
      return user.orgs
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
      await user.loadWorkspaces(this.currentUser.id)
    }

    private reset() {
        this.workspaceCreated = false
        this.errors = {
            org: null, name: null
        }
    }
  }
</script>
