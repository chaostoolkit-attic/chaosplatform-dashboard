<template>
  <div class="container">
    <div class="columns">
      <div class="column col-9 col-mx-auto">
        <div class="card">
          <div class="card-header">
            <div class="card-title h5">Create a new Experiment</div>
            <div class="card-subtitle text-gray">Declare and share a new Chaos Engineering experiment</div>
          </div>
          <div class="card-body">
            <div class="columns">
              <div class="column">
                <form class="form-horizontal">
                  <div class="form-group">
                    <label class="form-label" for="title">Title</label>
                    <input id="title" class="form-input" type="text" placeholder="A title clarifies the objective of this experiment" v-model="newExperiment.title"/>
                    <label class="form-label" for="description">Description</label>
                    <textarea id="description" class="form-input" placeholder="Explain what your experiment covers and its expected learnings"
                      rows="3" v-model="newExperiment.description" />
                  </div>
                </form>
              </div>
              <div class="divider-vert" data-content="OR"></div>
              <div class="column">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="form-label" for="expfile">Experiment File</label>
                        <input id="expfile" ref="expfile" class="form-input" type="file" @change="handleFileUpload" />
                    </div>
                </form>
              </div>
              <div class="column col-12">
                  <div class="divider" />
              </div>
              <div class="column col-12">
                  <form>
                      <div class="form-group">
                    <label class="form-label" for="title">Workspace</label>
                    <select id="workspace" class="form-select" @change="selectWorkspace" v-model="workspace_id">
                      <option v-for="w in context.workspaces" :key="w.id" :value="w.id">{{w.name}}</option>
                    </select>
                  </div>
                  </form>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="form-group">
              <button class="btn btn-primary input-group-btn" @click.prevent="newExperiment">Create experiment</button>
            </div>
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

  export default Vue.extend({
    data() {
      return {
          context: {},
          newExperiment: {
              title: null,
              description: null,
              file: null
          },
          workspace: null,
          workspace_id: null,
          org: null
      }
  },
    created() {
      this.$nextTick(() => {
          this.getNewExperimentContext()
      })
    },
      methods: {
        selectWorkspace(e: any) {
            const context: any = this.context
            for (const w of context.workspaces) {
                if (w.id === this.workspace_id) {
                    this.org = w.org.name,
                    this.workspace = w.name
                    break
                }
            }
        },
        getNewExperimentContext() {
            const self = this
            axios.get(
                '/experiment/new/context',
                { headers: { Accept: 'application/json' } }
            ).then((response) => {
                self.context = response.data
            }).catch((error) => {
                swal({
                    title: `Failed to retrieve your context!`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
            })
        },

        newExperiment() {
          const self = this
          if ((this.newExperiment.file === null) &&
              ((this.newExperiment.title === '') || (this.newExperiment.title === null))) {
              swal({
                    title: `Oops!`,
                    text: `You must provide a title and description, or upload an experiment`,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
              })
              return
          }

          if (this.workspace === null) {
              swal({
                title: `Oops!`,
                text: `You must select a workspace to add your experiment to`,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary'
              })
              return
          }

          const path = '/' + self.org + '/' + self.workspace + '/experiment'
          axios.post(path, self.newExperiment,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
            ).then((response) => {
                const experimentID = response.data.id
                const workspaceName = response.data.workspace.name
                const orgName = response.data.workspace.org.name
                self.$router.push({
                    name: 'experiment_default',
                    params: {
                        experiment: experimentID,
                        workspace: workspaceName,
                        org: orgName
                    }
                })
            }).catch((error) => {
                swal({
                    title: `Failed to create your experiment`,
                    text: error.message,
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-primary'
                })
          })
        },

        handleFileUpload() {
            const self = this

            const reader = new FileReader()
            reader.addEventListener('load', () => {
                self.newExperiment.file = reader.result
            }, false)

            const experimentUpload: any = this.$refs.expfile
            const file: any = experimentUpload.files[0]
            if (file) {
                if (/\.(json)$/i.test(file.name)) {
                    reader.readAsText(file)
                }
            }
        }
      }
  })
</script>