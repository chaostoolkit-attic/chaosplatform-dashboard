<template>
  <div class="columns">
    <div class="column col-3">
        <ul class="menu">
            <li class="menu-item">
                <router-link class-active="active" :to="{ name: 'account_profile' }">Profile</router-link>
            </li>
            <li class="menu-item">
                <router-link class-active="active" :to="{ name: 'account_tokens' }">Access Tokens</router-link>
            </li>
            <li class="menu-item">
                <router-link class-active="active" :to="{ name: 'account_privacy' }">Privacy</router-link>
            </li>
            <li class="menu-item">
                <router-link class-active="active" :to="{ name: 'account_orgs' }">Organizations</router-link>
            </li>
            <li class="menu-item">
                <router-link class-active="active" :to="{ name: 'account_workspaces' }">Workspaces</router-link>
            </li>
        </ul>
    </div>
    <div class="column col-8">
      <div class="card">
        <div class="card-body">
            <profile v-if="$route.path==='/dashboard/account' || $route.path==='/dashboard/account/ ' || $route.path==='/dashboard/account/profile'" />
            <tokens v-else-if="$route.path==='/dashboard/account/tokens'" />
            <privacy v-else-if="$route.path==='/dashboard/account/privacy'" />
            <orgs v-bind:currentUser="currentUser" v-else-if="$route.path==='/dashboard/account/orgs'" />
            <workspaces v-bind:currentUser="currentUser" v-else-if="$route.path==='/dashboard/account/workspaces'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Profile from './Profile.vue'
import Tokens from './Tokens.vue'
import Privacy from './Privacy.vue'
import Orgs from './Orgs.vue'
import Workspaces from './Workspaces.vue'
import { User } from '../../store/model'

import Vue from 'vue'
export default Vue.extend({
    props: {
        currentUser: Object
    },
    components: {
        Profile,
        Tokens,
        Privacy,
        Orgs,
        Workspaces
    }
})
</script>
