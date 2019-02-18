<template>
  <div class="columns" v-if="members">
    <div class="column col-12">
      <h5>Organization Members</h5>
    </div>
    <div class="column col-12">
      <div class="divider" />
    </div>
    <div class="column col-12">
      <div class="p-2" />
    </div>
    <div class="column col-12 text-justify">
      <p>
        Organization members have access to all workspaces of the organization, whether private or public.
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
          <h6>Members</h6>
          <div class="divider" />
        </div>
        <div class="column col-9">
          <table class="table table-hover" v-if="members.users">
            <tbody>
              <tr v-for="member in members.users" :key="member.id">
                <td>
                  <div class="columns">
                    <div class="column col-4">
                      <strong>{{member.username}}</strong>
                    </div>
                    <div class="column col-5">
                      <strong>{{member.fullname}}</strong>
                    </div>
                    <div class="column col-2">
                      <span v-if="member.owner">Owner</span>
                      <span v-else>Member</span>
                    </div>
                    <div class="column col-1" v-if="isOwner()">
                      <div class="dropdown">
                        <button class="btn btn-primary btn-action dropdown-toggle" tabindex="0">
                          <i class="icon icon-caret"></i>
                        </button>
                        <ul class="menu">
                          <li class="menu-item">
                            <a v-if="member.owner" @click.prevent="asMember(member)" href="#">Remove Ownership</a>
                            <a v-else @click.prevent="asOwner(member)" href="#">Make Organization Owner</a>
                          </li>
                          <li class="menu-item">
                            <a @click.prevent="removeUser(member)" href="#">Remove from Organization</a>
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
              <router-link :to="{'name': 'org_settings_members', 'page': 'members.paging.prev'}">
                <div class="page-item-subtitle" v-if="members.paging.prev">Previous</div>
                <div class="page-item-subtitle disabled" v-else>Previous</div>
              </router-link>
            </li>
            <li class="page-item page-next">
              <router-link :to="{'name': 'org_settings_members', 'page': 'members.paging.next'}">
                <div class="page-item-subtitle" v-if="members.paging.next">Next</div>
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

    <div class="column col-12" v-if="canAddMembers()">
      <h6>Add User as a Member</h6>
      <div class="divider col-11" />
      <p>
          Add users to your organization so they have access to all its workspaces.
          If you want to add an user to a single workspace, don't add it to the
          organization itself but to the appropriate workspace.
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
import Vue from 'vue'
import axios from 'axios'
import swal from 'sweetalert2'

export default Vue.extend({
    data() {
      return {
          members: null,
          matches: null,
          user: null,
          context: {
              org: null
          }
      }
  },
    created() {
      this.$nextTick(function() {
          this.getCurrentOrg()
      })
    },
      methods: {
        canAddMembers() {
          return (this.isOwner() && !this.isOrgPersonal())
        },
        isOrgPersonal() {
            return this.context.org && this.context.org.type === 'personal'
        },
        isOwner() {
          return this.context.org && this.context.org.owner
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
        },
        findUser() {
            const self = this
            self.matches = null

            if ((self.user === '') || (self.user === null)) {
                return
            }

            axios.get(
                '/account/user/lookup?user=' + self.user,
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
            axios.post(
                '/account/orgs/' + orgName + '/settings/members', user,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
              const data = response.data
              if ((data !== '') && (data != null)) {
                self.members.users.push(data)
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
            axios.delete(
                '/account/orgs/' + orgName + '/settings/members/' + user.id,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.getOrgMembers()
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
            const patched = Object.assign(user)
            patched.owner = true
            axios.patch(
                '/account/orgs/' + orgName + '/settings/members/' + patched.id, patched,
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
        asMember(user: any) {
            const self = this
            const orgName = this.$route.params.org
            const patched = Object.assign(user)
            patched.owner = false
            axios.patch(
                '/account/orgs/' + orgName + '/settings/members/' + user.id, patched,
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                user.owner = false
            }).catch((error) => {
                swal({
                    title: `Failed to set user as organization member!`,
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
              self.getOrgMembers()
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve the current organization!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        }
      }
})
</script>