<template>
  <div class="columns" v-if="org">
    <div class="column col-12">
      <h5>General Settings</h5>
    </div>
    <div class="column col-12">
      <div class="divider" />
    </div>
    <template v-if="org.settings">
      <div class="column col-12">
        <span class="text-gray" v-if="org.settings.description">{{org.settings.description}}</span>
      </div>
      <div class="column col-6">
        <a class="text-gray" v-if="org.settings.email" :href="'mailto:'+org.settings.email">
          <small>
            <i class="icon icon-mail" /> {{org.settings.email}}</small>
        </a>
        <span class="px-2" />
        <a class="text-gray" v-if="org.settings.url" :href="org.settings.url">
          <small>
            <i class="icon icon-link" /> {{org.settings.url}}</small>
        </a>
      </div>
    </template>
    <div class="column col-12 text-justify">
      <p>
        This organization was created {{renderDate(org.created_on)}} and contains
        <template v-if="org.workspaces.length==0">
          no workspaces.
        </template>
        <template v-else-if="org.workspaces.length==1">
          a
          <a href="/account/workspaces">single workspace</a>.
        </template>
        <template v-else>
          <a href="/account/workspaces">{{org.workspaces.length}} workspaces</a>.
        </template>
        <template v-if="org.owner">
          You may
          <a href="/account/workspaces">add new workspaces</a>.
        </template>
      </p>
    </div>
    <template v-if="isOwner()">
      <div class="column col-12">
        <div class="p-2" />
      </div>
      <div class="column col-12">
        <h6>Information</h6>
        <div class="divider col-11" />
        <form id="nameForm">
          <div class="columns">
            <div class="column col-9">
              <p>
                You may rename your organization but this has strong impacts since all existing links to it will be broken. So, be conservative
                and considerate for your community.
              </p>
              <div class="form-group">
                <label class="form-label" for="name">Name</label>
                <input v-bind:class="nameClass" type="text" id="name" placeholder="Name" v-model.trim="org.name" />
                <p class="form-input-hint" v-if="hasError('name')">{{getErrorMessage('name')}}</p>
              </div>
              <div class="form-group">
                <div class="p-2"></div>
                <button class="btn btn-primary" @click.prevent="renameOrg">Rename Organization</button>
              </div>
            </div>
          </div>
        </form>
        <div class="p-2" />
        <form id="detailsForm">
          <div class="columns">
            <div class="column col-9">
              <div class="form-group">
                <label class="form-label" for="desc">Description</label>
                <input class="form-input" type="text" id="desc" placeholder="Short description" v-model.trim="org.settings.description"
                />
              </div>
              <div class="form-group">
                <label class="form-label" for="url">URL</label>
                <input class="form-input" type="text" id="url" placeholder="URL" v-model.trim="org.settings.url" />
              </div>
              <div class="form-group">
                <label class="form-label" for="email">Contact</label>
                <input class="form-input" type="email" id="email" placeholder="Contact email" v-model.trim="org.settings.email"
                />
              </div>
              <div class="form-group">
                <div class="toast toast-success" v-if="org_settings_edited">
                  <button @click.prevent="org_settings_edited=false" class="btn btn-clear float-right"></button>
                  Details have been updated.
                </div>
                <div class="p-2"></div>
                <button class="btn btn-primary" @click.prevent="updateOrgInfo">Update Details</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="column col-12">
        <div class="p-2" />
        <div class="p-2" />
        <div class="p-2" />
      </div>
      <div class="column col-12">
        <h6 class="text-error">Danger Zone</h6>
        <div class="divider col-11" />
        <form>
          <div class="columns">
            <div class="column col-9" v-if="canDeleteOrg()">
              <p>
                You may delete your organization and all its data will be then made unavailable to anyone. Be considerate and warn your community
                before doing so.
              </p>
              <p>
                This process cannot be reversed.
              </p>
              <div class="form-group">
                <div class="p-2"></div>
                <button class="btn btn-error" @click.prevent="deleteOrg">Delete Organization</button>
              </div>
            </div>
            <div class="column col-9" v-else>
              <p>
                Personal organizations cannot be deleted and live as long as your account lives.
              </p>
            </div>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import swal from 'sweetalert2'
import moment from 'moment'

export default Vue.extend({
    data() {
      return {
          org: null,
          org_error: null,
          org_settings_edited: false,
          context: {
              org: null
          }
      }
  },
    created() {
      this.$nextTick(function() {
          this.loadOrg()
      })
    },
    computed: {
        nameClass(): any {
          return {
            'form-input': true,
            'is-error': this.hasError('name')
          }
        }
    },
    methods: {
        renderDate(d: any) {
            if (d == null) {
                return '-'
            }
            const date = moment(d).calendar()
            return date.charAt(0).toLowerCase() + date.slice(1)
        },
        hasError(field: string): boolean {
          if (!this.org_error) {
              return false
          }

          for (const err of this.org_error.errors) {
            if (err.field === field) {
                return true
            }
          }

          return false
        },
        getErrorMessage(field: string): string {
          if (!this.org_error) {
              return null
          }

          for (const err of this.org_error.errors) {
            if (err.field === field) {
                return err.message
            }
          }

          return ''
        },
        renameOrg() {
          const self = this
          const orgName = this.$route.params.org

          this.org_error = null
          if ( (this.org.name === '') || (this.org.name === null)) {
            this.org_error = {
                errors: [
                    {field: 'name', message: 'Please provide a name'}
                ]
            }
            return
          }

          this.org_error = null
          const payload = {
              name: self.org.name
          }
          axios.patch('/account/orgs/' + orgName + '/settings/general/name', payload,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            ).then((response) => {
                self.$router.push({
                    name: 'org_settings_general',
                    params: {
                        org: self.org.name
                    }
                })
            }).catch((error) => {
               self.org_error = error.response.data
            })
        },
        loadOrg() {
            const self = this
            const orgName = this.$route.params.org
            axios.get(
                '/account/orgs/' + orgName + '/settings/general',
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.org = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve your organization!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },
        deleteOrg() {
            const self = this
            const orgName = this.$route.params.org
            swal({
                title: 'Are you sure you want to delete this organization?',
                text: 'Please enter the name of your organization to acknowledge its deletion',
                input: 'text',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-error'
            })
            .then((result) => {
                if (result.value) {
                    return axios.delete(
                        '/account/orgs/' + orgName,
                        { headers: { Accept: 'application/json' } }
                    ).then((response) => {
                        self.$router.push({
                            name: 'user_home'
                        })
                    }).catch((error) => {
                        swal({
                            title: `Failed to delete your organization!`,
                            text: error.message,
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-primary'
                        })
                    })
                }

                return null
            })
        },
        updateOrgInfo() {
            const self = this
            const orgName = this.$route.params.org
            axios.patch(
                '/account/orgs/' + orgName + '/settings/general/details', self.org.settings,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    self.org_settings_edited = true
                }).catch((error) => {
                self.org_error = error.response.data
                })
        },
        canDeleteOrg() {
          return (this.isOwner() && !this.isOrgPersonal())
        },
        isOrgPersonal() {
            return this.org.type === 'personal'
        },
        isOwner() {
          return this.org.owner
        }
    }
})
</script>

