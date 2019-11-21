import React from 'react'
import { uniqueId } from 'lodash'
import filesize from 'filesize'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  DatePicker,
  InputNumber,
  message,
  Icon,
} from 'antd'
import locale from 'antd/es/date-picker/locale/pt_BR'
import moment from 'moment'
import 'moment/locale/pt-br'
import Upload from '../../components/Upload'
import FileList from '../../components/FileList'
import 'react-circular-progressbar/dist/styles.css'

import api from '../../services/Api'

import './Registro.css'

import logo from '../../assets/logocomp.png'

const dateFormatList = ['DD/MM/YYYY', 'DD/MM,YY']

const { TextArea } = Input

const { Option } = Select

class Registro extends React.Component {
  state = {
    confirmDirty: false,
    uploadedFiles: [],
    url_imagem: null,
    validade_img: true,
  }

  handleUpload = files => {
    if (this.state.uploadedFiles.length > 0) {
      return message.error('Somente um arquivo!')
    }
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }))

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles),
    })

    uploadedFiles.forEach(this.processUpload)
  }

  updateFile = (id, data) => {
    this.setState({
      uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile
      }),
    })
  }

  processUpload = uploadedFile => {
    const data = new FormData()

    data.append('file', uploadedFile.file, uploadedFile.name)

    api
      .post('posts', data, {
        onUploadProgress: e => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total))

          this.updateFile(uploadedFile.id, {
            progress,
          })
        },
      })
      .then(response => {
        this.updateFile(uploadedFile.id, {
          uploaded: true,
          id: response.data._id,
          url: response.data.url,
        })

        this.setState({
          url_imagem: response.data.url,
        })
      })
      .catch(() => {
        this.updateFile(uploadedFile.id, {
          error: true,
        })
      })
  }

  handleDeleta = async id => {
    await api.delete(`posts/${id}`)

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id),
    })
  }

  handleSubmit = e => {
    const { form } = this.props
    const { history } = this.props
    e.preventDefault()
    form.setFieldsValue({
      telefone: `(${form.getFieldValue('prefix')}) ${form.getFieldValue(
        'numero'
      )}`,
    })

    form.setFieldsValue({
      nascimento: `${moment(
        form.getFieldValue('data'),
        dateFormatList[0]
      ).format('DD/MM/YYYY')}`,
    })

    form.setFieldsValue({
      imagem: `${this.state.url_imagem}`,
    })

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (this.state.url_imagem === null) {
        return message.error('Insira uma foto válida!')
      }
      if (!err) {
        console.log('Valores form: ', values)

        const cadastro = await api.post('/user', values)
        const resposta = cadastro.data
        console.log(resposta)

        if (resposta == 'existe') {
          message.error('E-mail já cadastrado ')
        }
        if (resposta == 'cadastrado') {
          history.push('/')
        }
      }
    })
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('senha')) {
      callback('As duas senhas devem ser iguais!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  validarnum = (rule, value, callback) => {
    const { form } = this.props
    if (isNaN(form.getFieldValue('numero'))) {
      callback('.')
    }
    callback()
  }

  nomevalido = (rule, value, callback) => {
    const { form } = this.props
    if (!isNaN(form.getFieldValue('nome'))) {
      callback('')
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { setFieldsValue } = this.props.form

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '+11',
    })(
      <Select style={{ width: 80 }}>
        <Option value={11}>+11</Option>
        <Option value={12}>+12</Option>
        <Option value={13}>+13</Option>
        <Option value={14}>+14</Option>
        <Option value={15}>+15</Option>
        <Option value={16}>+16</Option>
        <Option value={17}>+17</Option>
        <Option value={18}>+18</Option>
        <Option value={19}>+19</Option>
      </Select>
    )

    const { uploadedFiles } = this.state

    return (
      <Row className="conteudo-registro" type="flex">
        <Col span={12} className="direita-registro">
          <div className="card-registro" />
          <h2>Cadastre-se no AdoPets</h2>
          <Form
            layout="vertical"
            onSubmit={this.handleSubmit}
            className="form-registro"
          >
            <Form.Item label="Nome">
              {getFieldDecorator('nome', {
                rules: [
                  {
                    required: true,
                    message: 'Por favor insira seu nome',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Senha" hasFeedback>
              {getFieldDecorator('senha', {
                rules: [
                  {
                    required: true,
                    message: 'Por Favor insira a senha',
                  },
                  {
                    min: 6,
                    message: 'A senha deve ter no min 6 caracteres',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password />)}
            </Form.Item>
            <Form.Item label="Confirme a Senha" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Por Favor confirme sua senha',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} />)}
            </Form.Item>
            <Row className="input-lado-registro" gutter={24}>
              <Col span={12}>
                <Form.Item label="Sexo">
                  {getFieldDecorator('sexo', {
                    rules: [
                      {
                        required: true,
                        message: 'Por favor selecionar uma das opções',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Selecione..."
                      style={{ width: '100%' }}
                    >
                      <Option value="masculino">Masculino</Option>
                      <Option value="feminino">Feminino</Option>
                      <Option value="outro">Outro</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nascimento" style={{ width: '100%' }}>
                  {getFieldDecorator('data', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: 'Por favor selecione uma data',
                      },
                    ],
                  })(
                    <DatePicker
                      defaultValue={moment('01/01/2019', dateFormatList[0])}
                      format={dateFormatList}
                      locale={locale}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="E-mail">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: 'Esse não é um E-mail valido',
                  },
                  {
                    required: true,
                    message: 'Por Favor insira um E-mail',
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="Telefone">
              {getFieldDecorator('numero', {
                defaultValue: '',
                rules: [
                  {
                    min: 8,
                    message: 'Número inválido',
                  },
                  {
                    required: true,
                    message: 'Por Favor coloque seu telefone',
                  },
                  {
                    validator: this.validarnum,
                  },
                ],
              })(
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder='xxxxx xxxx' />
              )}
            </Form.Item>
            <Form.Item label="Conte um pouco sobre você e sua experiência com animais">
              {getFieldDecorator('entrevista', {
                rules: [
                  {
                    required: true,
                    message: 'Por favor escreva um pouco sobre você',
                  },
                ],
              })(<Input style={{ width: '100%', height: 80 }} />)}
            </Form.Item>
            <Form.Item label="Insira uma foto sua:">
              {getFieldDecorator('imagem', {
                rules: [
                  {
                    required: true,
                    message: 'Por Favor insira uma foto sua',
                  },
                ],
              })(<Input type="hidden" />)}
              <div className="imagemdiv-registro">
                <Upload onUpload={this.handleUpload} />
                {!!uploadedFiles.length && (
                  <FileList
                    files={uploadedFiles}
                    onDelete={this.handleDeleta}
                  />
                )}
              </div>
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" className="btn-registro">
                Cadastrar
              </Button>
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('telefone')(<Input type="hidden" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('nascimento')(<Input type="hidden" />)}
            </Form.Item>
          </Form>
        </Col>
        <Col span={12}>
          <div className="esquerda-registro">
            <h2 className="titulo-registro">Seja Bem vindo!</h2>
            <h3>
              O Adopets tem o objetivo trazer uma nova maneira de dar uma
              oportunidade tanto para pessoas quanto para animais de terem uma
              nova companhia! Cadastre-se e procure um novo companheiro.
            </h3>
          </div>
        </Col>
      </Row>
    )
  }
}

const WrappedRegistrationForm = Form.create({ name: 'registro' })(Registro)

export default WrappedRegistrationForm
