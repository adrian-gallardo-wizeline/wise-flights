<template>
  <div class="main">
    <div class="wrapper">
      <el-card class="box-card card">
        <div slot="header" class="clearfix">
          <span>Summary</span>
        </div>
        <el-row class="item">
          <strong class="text">Created at:</strong>
          <span class="text">{{createdAt}}</span>
        </el-row>
        <el-row class="item">
          <el-col :span="12">        
            <strong class="text">Origin:</strong>
            <span class="text">{{origin}}</span>
          </el-col>     
          <el-col :span="12">                 
            <strong class="text">Destiny:</strong>
            <span class="text">{{destination}}</span>
          </el-col>        
        </el-row>
        <el-row class="item">
          <el-col :span="12">                
            <strong class="text">From:</strong>
            <span class="text">{{fromDate}}</span>
          </el-col>        
          <el-col :span="12">
            <strong class="text">To:</strong>
            <span class="text">{{toDate}}</span>   
          </el-col>                
        </el-row>
        <el-row class="item">
          <el-col :span="12">
            <strong class="text">Min Days:</strong>
            <span class="text">{{minDays}}</span>
          </el-col>
          <el-col :span="12">
            <strong class="text">Max Days:</strong>
            <span class="text">{{maxDays}}</span>
          </el-col>  
        </el-row>
        <el-row class="item">
          <el-col :span="12">
            <strong class="text">Adults:</strong>
            <span class="text">{{adults}}</span>
          </el-col>
          <el-col :span="12">
            <strong class="text">Email:</strong>
            <span class="text">{{email}}</span>
          </el-col>  
        </el-row>
        <el-row class="item center">
          <strong class="text">Tasks Completed:</strong>
          <span class="text tasksCompleted">&nbsp;{{completedJobs}}/{{totalJobs}}</span>
          <i style="margin-left: 10px;" v-if="completedJobs < totalJobs" class="el-icon-loading"></i>
        </el-row>
        <el-row class="item">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="jobsPercentage" status="success"></el-progress>
        </el-row>
      </el-card>
    </div>
    <div id="results-table">
      <el-table :data="jobs" stripe height="350" style="width: 100%">
        <el-table-column prop="provider" label="Provider" sortable width="180" />
        <el-table-column prop="startDate" label="From" sortable width="180" />
        <el-table-column prop="endDate" label="To" sortable width="180" />
        <el-table-column prop="nights" label="Nights" sortable width="180" />
        <el-table-column prop="price" label="Price" sortable width="180" />
        <el-table-column prop="url" label="Actions" sortable width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="seeResult(scope.$index)">Go To Results</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <graph></graph>
  </div>
</template>
<script>
import axios from 'axios'
import Graph from './Graph'
import { format, differenceInDays } from 'date-fns'
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
    updateQueryInfo(){

      axios.get(`http://127.0.0.1:1337/query?code=${this.$route.params.id}`)
        .then(response => {
          console.log(response)
          if (response.status === 200) {
            const query = response.data[0]
            this.adults = query.adults
            this.completedJobs = query.completedJobs
            this.createdAt = format(new Date(query.createdAt), 'MM/DD/YYYY')
            this.destination = query.destination
            this.email = query.email
            this.fromDate = format(query.fromDate, 'MM/DD/YYYY')
            this.jobs = query.jobs
                             .filter(job => job.completed)
                             .map(job => ({ ...job, nights: differenceInDays(job.endDate, job.startDate) }))
            this.maxDays = query.maxDays
            this.minDays = query.minDays
            this.origin = query.origin
            this.toDate = format(query.toDate, 'MM/DD/YYYY')
            this.totalJobs = query.totalJobs

            console.log(this.jobs);
            this.onQueryInfoUpdated(query)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onQueryInfoUpdated(query) {
      if (query.completedJobs !== query.totalJobs) {
        setTimeout(() => {
          console.log('pooling...');
          this.updateQueryInfo();
        }, 5000);
      }
    },
    seeResult(index) {
      window.open(this.jobs[index].url, "_blank");
    }
  },
  computed: {
    jobsPercentage() {
      return this.completedJobs * 100 / this.totalJobs
    },
    completedJobs() {
      return this.jobs.filter(job => {
        return job.completed;
      });
    }
  },
  components: {
    Graph,
  },
  mounted() {
    this.updateQueryInfo();
  }
}
</script>

<style scoped>
.card {
  margin: 50px auto;
  max-width: 480px;
  width: 100% !important;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.main {
  max-width: 1080px;
  margin: 0 auto;
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

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.tasksCompleted {
  font-size: 24px;
}

</style>