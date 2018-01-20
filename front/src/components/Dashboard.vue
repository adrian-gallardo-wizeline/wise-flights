<template>
  <div class="wrapper">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Summary</span>
      </div>
      <ul>
        <li>
          <span class="text item">Created at:</span>
          <span class="text item">{{createdAt}}</span>
        </li>
        <li>
          <span class="text item">Origin:</span>
          <span class="text item">{{origin}}</span>
        </li>
        <li>
          <span class="text item">Destiny:</span>
          <span class="text item">{{destination}}</span>
        </li>
        <li>
          <span class="text item">Departure Range:</span>
          <span class="text item">{{fromDate}} - {{toDate}}</span>
        </li>
        <li>
          <span class="text item">Min Days:</span>
          <span class="text item">{{minDays}}</span>
        </li>
        <li>
          <span class="text item">Max Days:</span>
          <span class="text item">{{maxDays}}</span>
        </li>
        <li>
          <span class="text item">Adults:</span>
          <span class="text item">{{adults}}</span>
        </li>
        <li>
          <span class="text item">Email:</span>
          <span class="text item">{{email}}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>
<script>
import axios from 'axios'
import { format } from 'date-fns'

export default {
  name: 'Dashboard',
  data() {
    return {
      adults: 0,
      completedJobs: 0,
      createdAt: 0,
      destination: '',
      email: '',
      fromDate: '',
      jobs: [],
      maxDays: 0,
      minDays: 0,
      origin: '',
      toDate: '',
      totalJobs: 0,
    }
  },
  methods: {
  },
  computed: {
  },
  mounted() {
    axios.get(`http://127.0.0.1:1337/query?code=${this.$route.params.id}`)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          const userData = response.data[0]
          this.adults = userData.adults
          this.completedJobs = userData.completedJobs
          this.createdAt = format(new Date(userData.createdAt), 'MM/DD/YYYY')
          this.destination = userData.destination
          this.email = userData.email
          this.fromDate = format(userData.fromDate, 'MM/DD/YYYY')
          this.jobs = userData.jobs
          this.maxDays = userData.maxDays
          this.minDays = userData.minDays
          this.origin = userData.origin
          this.toDate = format(userData.toDate, 'MM/DD/YYYY')
          this.totalJobs = userData.totalJobs
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}
</script>

<style scoped>
.text {
    font-size: 14px;
  }

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
</style>