<template>
  <div class="login">
    <header>
      <h1>Edu boss管理系统</h1>
    </header>
    <el-form :rules="rules" class="login-from" label-position="top" ref="form" :model="form" label-width="80px">
      <h2>登录</h2>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号">
        </el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          @click="onSubmit"
          :loading="isLoginLoading"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      isLoginLoading: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        await (this.$refs.form as Form).validate()

        this.isLoginLoading = true

        const { data } = await login(this.form)
        if (data.success) {
          this.$router.push({
            name: 'home'
          })
          this.$message.success(data.message)
        } else {
          this.$message.error(data.message)
        }
      } catch (error) {
        console.log('表单验证错误', error)
      }
      this.isLoginLoading = false
    }
  }
})
</script>

<style lang='scss' scoped>
.login {
  margin: 1rem auto;
  max-width: 22rem;
  header {
    h1 {
      margin: 4.5rem 0 3.5rem;
      text-align: center;
      letter-spacing: .1em;
      color: rgba(0,0,0,.5);
      font-size: 3rem;
      font-weight: 300;
      text-decoration: none;
      transition: text-shadow .3s;
    }
  }
  .login-from {
    width: 300px;
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    h2 {
      margin: 0 0 1rem;
      font-weight: 400;
      font-size: 1.5rem;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
