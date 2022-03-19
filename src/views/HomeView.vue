<template>
  <div class="home d-flex flex-column">
    <input type="text" placeholder="name"
           class="form-control mt-2"
           v-model="name"
    >
    <input type="text" placeholder="phone"
           class="form-control mt-2"
           v-model="phone"
    >
    <button class="btn btn-dark mt-2"
            @click="sendData"
            :disabled="name === '' || phone === ''"
    >{{ this.changeId !== '' ? 'Change' : 'Send' }}</button>

    <ul v-if="data" class="form-control mt-5">
      <h4>List of users:</h4>
      <li v-for="elem in data" :key="elem._id" class="d-flex justify-content-between">
        <span class="name text-uppercase my-1" @click="selectUser(elem._id, elem.name, elem.phone)">{{elem.name}}</span> <span class="font-monospace">{{ elem.phone }}</span>
        <button class="btn btn-close" @click="deleteUser(elem._id)"></button>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

export default {
  name: 'HomeView',
  data() {
    return {
      data: '',
      name: '',
      phone: '',
      changeId: ''
    }
  },
  computed: {
    dataList() {
      return this.data
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const response = await axios.get('http://localhost:3000/api/records')
        console.log('data', response.data)
        this.data = response.data

      } catch (err) {
        console.log('loadData error', err)
      }
    },
    async sendData() {
      if (!this.changeId) {
        try {
          await axios({
            url: 'http://localhost:3000/api/records',
            method: 'post',
            data: {
              name: this.name,
              phone: this.phone
            }
          })
        } catch (err) {
          console.log('sendData error', err)
        }
        this.name = ''
        this.phone = ''
        this.changeId = ''
        await this.loadData()
      } else {
        try {
          await axios({
            url: 'http://localhost:3000/api/records/'+ this.changeId,
            method: 'put',
            data: {
              name: this.name,
              phone: this.phone
            }
          })
          this.name = ''
          this.phone = ''
          this.changeId = ''
          await this.loadData()
        } catch (err) {
          console.log('sendData error', err)
        }
      }


    },
    async deleteUser(id) {
      try {
        const response = await axios.delete('http://localhost:3000/api/records/' + id)
        console.log(response.data)
        await this.loadData()


      } catch (err) {
        console.log('sendData error', err)
      }
    },
    async selectUser(id, name, phone) {
      this.name = name
      this.phone = phone
      this.changeId = id
    }
  }
}
</script>
<style>
.home {
  margin: 0 auto;
  max-width: 500px;
}
ul {
  list-style: none;
}
.name {
  cursor: pointer;
}
.name:hover {
  color: red;
}
</style>