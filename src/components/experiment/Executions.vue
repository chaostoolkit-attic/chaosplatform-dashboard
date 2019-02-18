<template>
  <div class="container" v-if="experiment">
    <breadcrumb v-bind:experiment="experiment" pagename="Executions"/>
    <div class="columns">
      <div class="column col-12 col-mx-auto">
        <div class="panel my-2" v-for="execution in executions" :key="execution.timestamp">
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
        executions: null
      }
    },
    created() {
      this.$nextTick(function() {
        this.getExperiment()
        this.getExecutions()
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
      getExecutions() {
        const self = this
        const orgName = this.$route.params.org
        const workspaceName = this.$route.params.workspace
        const experimentId = this.$route.params.experiment
        return axios.get(
            '/' + orgName + '/' + workspaceName + '/experiment/' + experimentId + '/execution', {
            headers: {
              Accept: 'application/json'
            }
          }
        ).then((response) => {
          self.executions = response.data
        }).catch((error) => {
          swal({
            title: `Failed to retrieve your executions!`,
            text: error.message,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
          })
        })
      }
    }
  })
</script>
