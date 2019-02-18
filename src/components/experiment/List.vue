<template>
  <div class="container">
    <div class="columns">
      <div class="column col-12 col-mx-auto">
        <div class="timeline">
          <div :id="x.id" class="timeline-item" v-for="x in experiments" :key="x.id">
            <div class="timeline-left">
              <a class="timeline-icon icon-lg" :href="'#'+x.id" />
            </div>
            <div class="timeline-content">
              <div class="tile">
                <div class="tile-content">
                  <div class="columns">
                    <div class="column col-12">
                      <span class="tile-title h6">{{x.title}}</span>
                    </div>
                    <div class="column col-12">
                      <span class="label">{{x.workspace.name}}</span>
                    </div>
                    <div class="column col-12">
                      <p>{{x.description}}</p>
                    </div>
                  </div>
                </div>
                <div class="tile-action">
                  <a class="btn" :href="'/experiment/'+x.id">View</a>
                </div>
              </div>
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
        experiments: []
      }
    },
    created() {
      this.$nextTick(function() {
        this.getExperiments()
      })
    },
    methods: {
      getExperiments() {
        const self = this
        axios.get(
          '/experiment/', {
            headers: {
              Accept: 'application/json'
            }
          }
        ).then((response) => {
          self.experiments = response.data
        }).catch((error) => {
          swal({
            title: `Failed to retrieve your experiments!`,
            text: error.message,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary'
          })
        })
      }
    }
  })
</script>