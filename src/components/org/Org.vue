<template>
  <div class="container">
    <div class="columns" v-if="org">
      <div class="column col-12">
          <div class="columns">
              <div class="column col-12">
                <h2>{{org.name}}</h2>
              </div>
              <template v-if="org.settings">
                <div class="column col-12">
                    <span class="text-gray" v-if="org.settings.description">{{org.settings.description}}</span>
                </div>
                <div class="column col-6">
                    <a class="text-gray" v-if="org.settings.email" :href="'mailto:'+org.settings.email"><small><i class="icon icon-mail" /> {{org.settings.email}}</small></a>
                    <span class="px-2" />
                    <a class="text-gray" v-if="org.settings.url" :href="org.settings.url"><small><i class="icon icon-link" /> {{org.settings.url}}</small></a>
                </div>
              </template>
          </div>
      </div>
      <div class="column col-12">
          <div class="py-2" />
      </div>
      <div class="column col-4">
        <div class="columns">
          <div class="column col-12">
            <div class="card">
              <div class="card-header">
                <div class="card-title h5">
                  Experiments
                  <a v-if="isMember()" href="/experiment/new" class="float-right btn btn-primary btn-action">
                    <i class="icon icon-plus" />
                  </a>
                </div>
              </div>
              <div class="card-body">
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <div class="form-autocomplete">
                      <input class="form-input" type="text" placeholder="Find an experiment...">
                    </div>
                  </div>
                </div>
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <ul class="menu" v-if="org && experiments">
                      <li class="menu-item" v-for="experiment in experiments" :key="experiment.id">
                        <a :href="'/'+workspace.org.name+'/'+workspace.name+'/experiment/'+experiment.id">{{experiment.title}}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column col-12"><p/></div>
          <div class="column col-12">
            <div class="card">
              <div class="card-header">
                <div class="card-title h5">
                  Workspaces
                  <a v-if="isOrgOwner()" :href="'/account/workspaces'" class="float-right btn btn-primary btn-action">
                    <i class="icon icon-plus" />
                  </a>
                </div>
              </div>
              <div class="card-body">
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <div class="has-icon-right">
                      <input v-model.trim="searched_workspace" @keyup.enter="findWorkspace" class="form-input" type="text" placeholder="Find a workspace...">
                      <i class="form-icon icon icon-search c-hand" @click.prevent="findWorkspace"></i>
                    </div>
                  </div>
                </div>
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <ul class="menu" v-if="workspaces">
                      <li class="menu-item" v-for="workspace in workspaces" :key="workspace.id">
                        <a :href="'/'+org.name+'/'+workspace.name">{{workspace.name}}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column col-12"><p/></div>
          <div class="column col-12" v-if="org.type!='personal'">
            <div class="card">
              <div class="card-header">
                <div class="card-title h5">
                  Members
                  <a v-if="isOrgOwner()" :href="'/'+org.name+'/settings/members'" class="float-right btn btn-primary btn-action">
                    <i class="icon icon-plus" />
                  </a>
                </div>
              </div>
              <div class="card-body">
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <div class="has-icon-right">
                      <input v-model.trim="searched_member" @keyup.enter="findMember" class="form-input" type="text" placeholder="Find a member...">
                      <i class="form-icon icon icon-search c-hand" @click.prevent="findMember"></i>
                    </div>
                  </div>
                </div>
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <ul class="menu" v-if="members">
                      <li class="menu-item" v-for="member in members.users" :key="member.id">
                        <a :href="'/'+member.org_name">
                            <template v-if="member.username">
                                {{member.username}}
                            </template>
                            <template v-else-if="member.fullname">
                                {{member.fullname}}
                            </template>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column col-8">
        <div class="card" v-if="hasActivities()">
          <div class="card-header">
            <div class="card-title h5">Organization Activity</div>
          </div>
          <div class="card-body">
            <activities v-bind:details="org" />
          </div>
        </div>
        <div v-else>
            <div class="empty">
                <div class="empty-icon">
                    <i class="icon icon-3x icon-message"></i>
                </div>
                <p class="empty-title h5">
                    This organization has no activities yet!
                </p>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import axios from 'axios'
import swal from 'sweetalert2'
import moment from 'moment'
import Activities from '../Activities.vue'

export default Vue.extend({
  components: {
    Activities
  },
    data() {
      return {
          org: null,
          searched_member: null,
          searched_workspace: null,
          members: null,
          workspaces: null,
          context: {
              org: null
          }
      }
  },
    created() {
      this.$nextTick(function() {
          this.getOrgDashboard()
      })
    },
      methods: {
        isSignedIn(): boolean {
            return this.org && this.org.requested_by
        },
        isMember(): boolean {
            return this.isSignedIn() && this.org.requested_by.org_member
        },
        isOrgOwner(): boolean {
            return this.isSignedIn() && this.org.requested_by.org_owner
        },
        hasActivities() {
            return this.org.activities &&
                this.org.activities.length > 0
        },
        findMember() {
            if (!this.searched_member) {
                this.members = this.org.members
                return
            }

            const self = this
            const orgName = this.$route.params.org
            axios.get(
                '/account/orgs/' + orgName + '/lookup/member?q=' + self.searched_member,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.members = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to lookup members!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        findWorkspace() {
            if (!this.searched_workspace) {
                this.workspaces = this.org.org.workspaces
                return
            }

            const self = this
            const orgName = this.$route.params.org
            axios.get(
                '/account/orgs/' + orgName + '/lookup/workspace?q=' + self.searched_workspace,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.workspaces = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to lookup workspaces!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        getOrgDashboard() {
            const self = this
            const orgName = this.$route.params.org
            axios.get(
                '/account/orgs/' + orgName,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.org = response.data
                self.workspaces = self.org.workspaces
                self.getOrgMembers()
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve your dashboard details!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        getOrgMembers() {
            const self = this
            const orgName = this.$route.params.org
            axios.get(
                '/account/orgs/' + orgName + '/settings/members',
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.members = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve members!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        }
    }
})
</script>