<template>
  <div class="container" v-if="experiment">
    <breadcrumb v-bind:experiment="experiment" pagename="Execution"/>
    <div class="columns">
      <div class="column col-12 col-mx-auto">
        <div class="panel">
          <div class="panel-body">
            <single-run v-if="execution" v-bind:execution="execution" />
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
  import Breadcrumb from './Breadcrumb.vue'
  import SingleRun from './Execution/SingleRun.vue'

  export default Vue.extend({
    components: {
      Breadcrumb,
      SingleRun
    },
    data() {
      return {
        experiment: null,
        execution: null
      }
    },
    created() {
      this.$nextTick(function() {
        this.getExperiment()
        this.getExecution()
      })
    },
    methods: {
      getExperiment() {
        const self = this
        const orgName = this.$route.params.org
        const workspaceName = this.$route.params.workspace
        const experimentId = this.$route.params.experiment
        return axios.get(
            '/' + orgName + '/' + workspaceName + '/experiment/' + experimentId + '/context', {
            headers: {
              Accept: 'application/json'
            }
          }
        ).then((response) => {
          self.experiment = response.data
        }).catch((error) => {
          swal({
            title: `Failed to retrieve your experiment!`,
            text: error.message,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
          })
        })
      },
      getExecution() {
        const self = this
        const orgName = this.$route.params.org
        const workspaceName = this.$route.params.workspace
        const experimentId = this.$route.params.experiment
        const executionId = this.$route.params.execution
        return axios.get(
            // tslint:disable-next-line:max-line-length
            '/' + orgName + '/' + workspaceName + '/experiment/' + experimentId + '/execution/' + executionId + '/context', {
            headers: {
              Accept: 'application/json'
            }
          }
        ).then((response) => {
          self.execution = response.data
        }).catch((error) => {
          swal({
            title: `Failed to retrieve your execution!`,
            text: error.message,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
          })
        })
      }
    }
  })
</script>
