<template>
  <div class="container">
    <div class="columns" v-if="details">
      <div class="column col-4">
        <div class="columns">
          <div class="column col-12">
            <div class="card">
              <div class="card-header">
                <div class="card-title h5">
                  Experiments
                  <a
                    v-if="isCollaborator()"
                    href="/experiment/new"
                    class="float-right btn btn-primary btn-action"
                  >
                    <i class="icon icon-plus"/>
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
                    <ul class="menu" v-if="details && details.experiments">
                      <li
                        class="menu-item"
                        v-for="experiment in details.experiments"
                        :key="experiment.id"
                      >
                        <a
                          :href="'/'+details.workspace.org.name+'/'+details.workspace.name+'/experiment/'+experiment.id"
                        >{{experiment.title}}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column col-12">
            <p/>
          </div>
          <div class="column col-12" v-if="details.type!='personal'">
            <div class="card">
              <div class="card-header">
                <div class="card-title h5">
                  Collaborators
                  <a
                    v-if="isOwner()"
                    :href="'/'+details.org.name+'/'+details.name+'/settings/collaborators'"
                    class="float-right btn btn-primary btn-action"
                  >
                    <i class="icon icon-plus"/>
                  </a>
                </div>
              </div>
              <div class="card-body">
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <div class="has-icon-right">
                      <input
                        v-model.trim="searchedCollaborator"
                        class="form-input"
                        type="text"
                        @keyup.enter="findCollaborator"
                        placeholder="Find a collaborator..."
                      >
                      <i
                        class="form-icon icon icon-search c-hand"
                        @click.prevent="findCollaborator"
                      ></i>
                    </div>
                  </div>
                </div>
                <div class="tile tile-centered">
                  <div class="tile-content">
                    <ul class="menu" v-if="collaborators">
                      <li
                        class="menu-item"
                        v-for="collaborator in collaborators"
                        :key="collaborator.id"
                      >
                        <a :href="'/'+collaborator.org.name">
                          <template
                            v-if="collaborator.profile.username"
                          >{{collaborator.profile.username}}</template>
                          <template
                            v-else-if="collaborator.profile.name"
                          >{{collaborator.profile.name}}</template>
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
            <div class="card-title h5">Workspace Activity</div>
          </div>
          <div class="card-body">
            <activities v-bind:details="details"/>
          </div>
        </div>
        <div v-else>
          <div class="empty">
            <div class="empty-icon">
              <i class="icon icon-3x icon-message"></i>
            </div>
            <p class="empty-title h5">This workspace has no activities yet!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  import { Collaborator, Org, User, Visibility, Workspace } from '@/store/model'
  import org from '@/store/modules/org'
  import workspace from '@/store/modules/workspace'

  @Component({ name: 'workspaceMain' })
  export default class WorkspaceMain extends Vue {
    @Prop(Object) public currentUser ?: User
    @Prop(Object) public currentOrg ?: Org
    @Prop(Object) public currentWorkspace ?: Workspace

    public async created() {
    }

    get signed(): boolean {
      return this.currentUser.authenticated
    }

    get collaborators(): Collaborator[] {
        return workspace.collaborators
    }

    get isCollaborator(): boolean {
        return this.signed && (this.currentWorkspace.owner || this.currentWorkspace.collaborator)
    }

    get isOwner(): boolean {
        return this.signed && this.currentWorkspace.owner
    }

    get hasActivities(): boolean {
        return false
    }
  }
</script>
