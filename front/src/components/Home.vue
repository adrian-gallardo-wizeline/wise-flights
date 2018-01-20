<template>
  <div class="wrapper">
    <el-form :rules="rules" ref="ruleForm" :label-position="labelPosition" :model="form" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="Origin" prop="origin">
            <el-autocomplete
              class="inline-input full-width"
              v-model="form.origin"
              suffix-icon="el-icon-location-outline"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              placeholder="Origin" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>      
        <el-col :span="24">
          <el-form-item label="Destiny" prop="destiny">
            <el-autocomplete
              class="inline-input full-width"
              v-model="form.destiny"
              suffix-icon="el-icon-location-outline"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              placeholder="Destiny" />
          </el-form-item>
        </el-col>
      </el-row>  
      <el-row>
        <el-col :span="24">      
          <el-form-item label="Departure Range" prop="departureRange">
            <div class="left-container">
              <el-date-picker
                class="full-width"
                v-model="form.departureRange"
                type="daterange"
                start-placeholder="From"
                end-placeholder="To" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="Min Days" prop="minDays">
            <el-input-number class="full-width" v-model="form.minDays" :min="1"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item label="Max Days" prop="maxDays">
            <div class="left-container">
              <el-input-number class="full-width" v-model="form.maxDays" :min="getMinMaxDays()"></el-input-number>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">        
          <el-form-item label="Adults" prop="adults">
            <div class="left-container">
              <el-input-number class="full-width" v-model="form.adults" :min="1" :max="9"></el-input-number>
            </div>
          </el-form-item>
        </el-col>        
      </el-row> 
      <el-row>
        <el-col :span="24">                 
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" prefix-icon="el-icon-message"></el-input>
          </el-form-item>
        </el-col>        
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">Create</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import iataCodes from '../assets/iata'
export default {
  name: 'Home',
  data() {
    return {
      iata: [],
      labelPosition: "top",
      form: {
        origin: '',
        destiny: '',
        adults: '',
        departureRange: '',
        minDays: 0,
        maxDays: 0,
        email: 'test@wizeline.com',
      },
      rules: {
        origin: [
          { required: true, message: 'Please input the origin of the flight', trigger: 'change' },
        ],
        destiny: [
          { required: true, message: 'Please input the destiny of the flight', trigger: 'change' },
        ],
        departureRange: [
          { required: true, message: 'Please input the departure range', trigger: 'change' },
        ],
        minDays: [
          { required: true, message: 'Please input the min days to stay in the destiny', trigger: 'blur' },
        ],
        maxDays: [
          { required: true, message: 'Please input the max days to stay in the destiny', trigger: 'blur' },
        ],
        adults: [
          { required: true, message: 'Please input the number of adults to travel', trigger: 'blur' },
        ],
        email: [
          { type: 'email', required: true, message: 'Please input a valid email', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        const origin = iataCodes.find((ic) => ic.value === this.form.origin)
        const destiny = iataCodes.find((ic) => ic.value === this.form.destiny)
        if (valid) {
          axios.post('http://127.0.0.1:1337/query', {
            adults: this.form.adults,
            email: this.form.email,
            origin: origin && origin.code,
            destination: destiny && destiny.code,
            fromDate: this.form.departureRange[0],
            toDate: this.form.departureRange[1],
            minDays: this.form.minDays,
            maxDays: this.form.maxDays,
          })
          .then(response => {
            if (response.status === 200 && response.data && response.data.code) {
              this.openModal(
                `An email has been sent to your inbox with the link to access to the dashboard, so you can follow the progress anytime`,
                'Query Created!',
                { type: 'info', message: 'Dashboard created' },
                () => {
                  this.$router.push({ path: `/dashboard/${response.data.code}` })
                }
              )
            } else {
              this.openModal(
                'Please try again later :saddod:',
                'Something Bad Happen',
                { type: 'error', message: ':(' }
              )
            }
          })
          .catch(error => {
            this.openModal(
              'Please try again later :saddod:',
              'Something Bad Happen',
              { type: 'error', message: ':(' }
            )
            console.log(error);
          });
        } else {
          return false;
        }
      });
    },
    querySearch(queryString, callback) {
      const iata = this.iata;
      var results = queryString ? iata.filter(this.createFilter(queryString)) : iata;
      callback(results);
    },
    createFilter(queryString) {
      return iata => {
        return (iata.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return iataCodes
    },
    getMinMaxDays() {
      const newDay = this.form.minDays + 1 
      if (this.form.maxDays <= this.form.minDays) {
        this.form.maxDays = newDay
      }
      return newDay
    },
    openModal(message, title, callBackOptions, callBackAction) {
      this.$alert(message, title, {
        confirmButtonText: 'OK',
        callback: action => {
          this.$message(callBackOptions)
          callBackAction && callBackAction()
        }
      });
    }
  },
  computed: {
    minMaxDays() {
      return this.form.minDays + 1 
    }
  },
  mounted() {
    this.iata = this.loadAll();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url("//unpkg.com/element-ui/lib/theme-chalk/index.css");
.left-container {
  text-align: left;
  width: 100%;
}
.full-width {
  width: 100% !important;
}
.wrapper {
  max-width: 500px;
  margin: 50px auto;
}
input {
  background-image: none !important;
}
div {
  text-align: left;
}
</style>
