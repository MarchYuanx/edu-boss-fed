<template>
  <div>
    <el-form ref="role" :model="role">
      <el-form-item prop="name" label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>
      <el-form-item prop="description" label="角色描述">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createOrUpdate, getRoleById } from '@/services/role'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [String, Number]
    }
  },
  data () {
    return {
      role: {
        code: '',
        name: '',
        description: ''
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async onSubmit () {
      const { data } = await createOrUpdate(this.role)
      if (data.code === '000000') {
        (this.$refs.role as Form).resetFields()
        this.$message.success('操作成功')
        this.$emit('success')
      }
    },
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.role = data.data
    }
  }
})
</script>

<style>

</style>
