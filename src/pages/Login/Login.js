import React from 'react'
import { Input, Icon, Form, Button, message } from 'antd'
import 'antd/dist/antd.css'
import './Login.css'

import api from '../../services/Api'

import logo from '../../assets/logocomp.png'

class Login extends React.Component {
  handleSubmit = async e => {
    const { history } = this.props
    e.preventDefault()
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        console.log('Valores: ', values)
        const response = await api.post('/login', values)

        const valido = response.data
        console.log(valido)
        if (typeof valido === 'object') {
          const { _id } = response.data
          history.push(`/user/${_id}`)
        }
        if (valido == '2') {
          message.error('Senha incorreta')
        }
        if (valido == '3') {
          message.error('Usuario não existe')
        }

        this.props.form.resetFields()
      }
    })
  }

  render() {
    const { history } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div className="loginbox">
        <div className="quadro">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <img src={logo} className="login-logo" />
            <Form.Item>
              {getFieldDecorator('emailuser', {
                rules: [
                  {
                    type: 'email',
                    message: 'Esse não é um E-mail valido',
                  },
                  {
                    required: true,
                    message: 'Por Favor insira seu E-mail',
                  },
                ],
              })(
                <Input
                  className="login-input"
                  placeholder="Digite seu email"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('senhauser', {
                rules: [
                  {
                    required: true,
                    message: 'Insira sua senha',
                  },
                ],
              })(
                <Input.Password
                  className="login-input"
                  placeholder="Digite sua senha"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />
              )}
            </Form.Item>
            <Form.Item>
              <Button type="" htmlType="submit" className="btn-login">
                Entrar
              </Button>
            </Form.Item>
            <h3 onClick={() => history.push('/registro')}>
              Novo aqui ? Cadastre-se
            </h3>
          </Form>
        </div>
      </div>
    )
  }
}

const WrappedLogin = Form.create({ name: 'login' })(Login)

export default WrappedLogin
