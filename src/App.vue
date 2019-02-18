<template>

  <body>
    <header v-if="showNavBar()" class="navbar navbar-primary">
      <div class="container">
        <div class="columns">
          <div class="column col-8 col-mx-auto">
            <div class="container">
              <div class="float-left navbar-section">
                <div class="logo">
                  <a href="/" class="logo-link">Chaos Platform</a>
                </div>
              </div>
              <div v-if="signed" class="navbar-section float-right">
                <div class="dropdown">
                  <div class="btn-group">
                    <button class="btn btn-secondary btn-action dropdown-toggle">
                      <i class="icon icon-menu" />
                    </button>

                    <ul class="menu">
                      <li class="menu-item">
                        <div class="tile tile-centered">
                          <div v-if="currentUser" class="tile-content">{{currentUser.username}}</div>
                        </div>
                      </li>
                      <li class="divider" />
                      <li class="menu-item">
                        <a href="user">
                          <i class="icon icon-edit" /> Account Settings
                        </a>
                      </li>
                      <li class="divider" />
                      <li class="menu-item">
                        <a href="/signout">
                          <i class="icon icon-shutdown" /> Sign Out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div v-else class="navbar-section float-right">
                <a href="/signup" class="register-link">
                  <button class="btn btn-block register-btn">
                    Sign-Up for a Free Account
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="container">
        <div class="columns">
          <div class="column col-8 col-mx-auto">
            <router-view :currentUser="currentUser" :currentOrg="currentOrg" :currentWorkspace="currentWorkspace">loading...</router-view>
          </div>
        </div>
      </div>
    </main>
    <footer>

      <div class="columns">
        <div class="column col-8 col-mx-auto">
            <div class="my-2"></div>
            <div class="d-block"><a href="https://chaosplatform.org">Chaos Platform</a> is an Open Source product under the
                <a href="https://github.com/chaostoolkit/chaosplatform/blob/master/LICENSE">Apache v2</a> license</div>
            <div class="d-block">&copy; 2019 - <a href="https://chaosiq.io">ChaosIQ</a></div>
        </div>
      </div>
      </footer>
  </body>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Vue, Component } from 'vue-property-decorator'
  import user from './store/modules/user'
  import org from './store/modules/org'
  import workspace from './store/modules/workspace'
  import { Org, User, Workspace } from './store/model'

  @Component({ name: 'app' })
  export default class Application extends Vue {
      public showNavBar(): boolean {
        return !((this.$route.path === '/signin') || (this.$route.path === '/signup'))
      }

      public async created() {
          await user.load().then(() => {
            const orgName = this.$route.params.org
            if (orgName) {
                org.load(orgName).then(() => {
                    const workspaceName = this.$route.params.workspace
                    if (workspaceName) {
                        workspace.load(orgName, workspaceName)
                    }
                })
            }
          })
      }

      public get signed(): boolean {
        return user.authenticated
      }

      public get currentUser(): User {
        return user.user
      }

      public get currentOrg(): Org {
        return org.org
      }

      public get currentWorkspace(): Workspace {
        return workspace.workspace
      }
  }
</script>
