<template>
  <div class="columns" v-if="orgs">
    <div class="column col-12">
      <h4>Organizations</h4>
    </div>
    <div class="column col-12">
      <div class="divider" />
    </div>
    <div class="column col-12">
      <div class="p-2" />
      <div class="p-2" />
      <div class="p-2" />
    </div>
    <div class="column col-12">
      <div class="columns">
        <div class="column col-11">
          <h5>Your Organizations</h5>
          <div class="divider" />
        </div>
        <div class="column col-9">
          <table class="table table-hover">
            <tbody>
              <tr v-for="org in orgs" :key="org.id">
                <td>
                  <div class="columns">
                    <div class="column col-12">
                      <strong><a :href="'/dashboard/orgs/'+org.name">{{org.name}}</a></strong>
                    </div>
                  </div>
                </td>
                <td>
                  <span>{{renderDate(org.created_on)}}</span>
                </td>
                <td>
                  <span>{{org.type}}</span>
                </td>
                <td>
                  <span v-if="org.owner">Owner</span>
                  <span v-else>Member</span>
                </td>
                <td>
                  <a :href="'/dashboard/orgs/'+org.name+'/settings'" v-if="org.owner">
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
      <h5>New Organization</h5>
      <div class="divider col-11" />
      <form>
        <div class="columns">
          <div class="column col-9">
            <h6>Required Information</h6>
            <div class="form-group">
              <label class="form-label" for="name">Name</label>
              <input v-bind:class="nameClass" type="text" id="name" placeholder="Name" required v-model.trim="newOrg.name" />
              <p class="form-input-hint" v-if="errors.name">{{errors.name}}</p>
            </div>
            <div class="form-group">
              <label class="form-label">Experiment's visibility</label>
              <label class="form-radio">
                <input type="radio" name="experiment_visibility" v-model="newOrg.visibility.experiment" value="private"><i
                  class="form-icon"></i> Private <small class="d-block text-gray">Only
                  members and owners will access it</small>
              </label>
              <label class="form-radio">
                <input type="radio" name="experiment_visibility" checked="" v-model="newOrg.visibility.experiment"
                  value="protected"><i class="form-icon"></i> Protected <small class="d-block text-gray">Only
                  authenticated users will access the experiment</small>
              </label>
              <label class="form-radio">
                <input type="radio" name="experiment_visibility" v-model="newOrg.visibility.experiment" value="public"><i
                  class="form-icon"></i> Public <small class="d-block text-gray">Everyone
                  will be able to view the experiment</small>
              </label>
            </div>
            <div class="form-group">
              <label class="form-label">Run results visibility to non-collaborators</label>
              <div class="columns">
                <div class="column col-12">
                  <label class="form-radio">
                    <input type="radio" name="execution_visibility" v-model="newOrg.visibility.execution" value="none"><i
                      class="form-icon"></i>
                    None <small class="d-block text-gray">Runs will remain visible only to
                      members and owners</small>
                  </label>
                </div>
                <div class="column col-12">
                  <label class="form-radio">
                    <input type="radio" name="execution_visibility" checked="" v-model="newOrg.visibility.execution"
                      value="status"><i class="form-icon"></i>
                    Status <small class="d-block text-gray">Only the run's status will be visible</small>
                  </label>
                </div>
                <div class="column col-12">
                  <label class="form-radio">
                    <input type="radio" name="execution_visibility" v-model="newOrg.visibility.execution" value="full"><i
                      class="form-icon"></i>
                    Full <small class="d-block text-gray">The full run's log will be shown</small>
                  </label>
                </div>
              </div>
            </div>
            <div class=" p-2" />
            <h6>Additional Optional Information</h6>
            <div class="form-group">
              <label class="form-label" for="desc">Description</label>
              <input class="form-input" type="text" id="desc" placeholder="Short description" v-model.trim="newOrg.settings.description" />
            </div>
            <div class="form-group">
              <label class="form-label" for="url">URL</label>
              <input class="form-input" type="text" id="url" placeholder="URL" v-model.trim="newOrg.settings.url" />
            </div>
            <div class="form-group">
              <label class="form-label" for="email">Contact</label>
              <input class="form-input" type="email" id="email" placeholder="Contact email" v-model.trim="newOrg.settings.email" />
            </div>
            <div class="form-group">
              <div class="toast toast-success" v-if="orgCreated">
                <button @click.prevent="orgCreated=false" class="btn btn-clear float-right"></button>
                Your new organization has been created!
              </div>
              <div class="p-2"></div>
              <button class="btn btn-primary" @click.prevent="createOrg">Create organization</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { NewOrg, Org, User, Visibility, Workspace } from '@/store/model'
  import user from '@/store/modules/user'
  import moment from 'moment'

  @Component({ name: 'userOrgs' })
  export default class UserOrgs extends Vue {
    @Prop(Object) public currentUser ?: User

    public orgCreated: boolean = false
    public errors: object = {
        name: null
    }
    public newOrg: object = {
      name: null,
      settings: {
        description: null,
        url: null,
        logo: null,
        email: null
      },
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

    get workspaces(): Workspace[] {
      return user.workspaces
    }

    get orgs(): Org[] {
      return user.orgs
    }

    public renderDate(d: any): string {
        if (d == null) {
            return '-'
        }
        return moment(d).format('LL')
    }

    public async createOrg() {
      const self = this
      this.reset()
      await user
        .addOrg(this.newOrg as NewOrg)
        .then(() => {
            self.orgCreated = true
        })
        .catch((error) => {
            self.errors = error.response.data
        })
    }

    public async created() {
      await user.loadOrgs(this.currentUser.id)
    }

    private reset() {
        this.orgCreated = false
        this.errors = {
            name: null
        }
    }
  }
</script>
