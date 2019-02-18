<template>
  <div class="columns">
    <div class="column col-12">
      <h5>Public Profile</h5>
    </div>
    <div class="column col-12">
      <div class="divider" />
    </div>
    <div class="column col-12">
      <div class="p-2" />
    </div>
    <div class="column col-12">
      <form>
        <div class="columns">
          <div class="column col-9">
            <div class="form-group">
              <label class="form-label" for="name">Username</label>
              <input class="form-input" type="text" id="username" placeholder="Username" v-model.lazy="profile.username">
            </div>
            <div class="form-group">
              <label class="form-label" for="name">Name</label>
              <input class="form-input" type="text" id="name" placeholder="Name" v-model.lazy="profile.fullname">
            </div>
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input class="form-input" type="email" id="email" placeholder="Email" v-model.lazy="profile.email">
            </div>
            <div class="form-group">
              <label class="form-label" for="bio">Bio</label>
              <textarea class="form-input" id="text" rows="3" placeholder="Bio" v-model.lazy="profile.bio"/>
            </div>
            <div class="form-group">
              <label class="form-label" for="company">Company</label>
              <input class="form-input" type="text" id="company" placeholder="Company Name" v-model.lazy="profile.company"/>
            </div>
            <div class="form-group">
              <div class="p-2"></div>
              <button class="btn btn-primary" @click.prevent="updateProfile">Update your Profile</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import swal from 'sweetalert2'

export default Vue.extend({
    data() {
        return {
            profile: {
                id: '',
                fullname: '',
                email: '',
                bio: '',
                company: '',
                username: ''
            }
        }
    },
    created() {
      this.$nextTick(() => {
          this.getUserProfile()
      })
    },
    methods: {
        updateProfile() {
          const self = this
          axios.post('/account/user/profile', self.profile,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            ).then((response) => {
                swal({
                    title: `Profile Updated`,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            }).catch((error) => {
                swal({
                    title: `Failed to update your profile`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
          })
        },
        getUserProfile() {
            const self = this
            axios.get(
                '/account/user/profile',
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.profile = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve your profile!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        }
    }
})
</script>
