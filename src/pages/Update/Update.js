import React from 'react'
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Modal,
  message,
  Icon,
} from 'antd'
import Upload from '../../components/Upload'
import FileList from '../../components/FileList'
import 'react-circular-progressbar/dist/styles.css'
import { uniqueId } from 'lodash'
import filesize from 'filesize'
import api from '../../services/Api'
import './Update.css'

const { TextArea } = Input

class Update extends React.Component {
  constructor() {
    super()
    this.state = {
      user: [],
      confirmDirty: false,
      uploadedFiles: [],
      url_imagem: null,
    }
  }

  componentDidMount = async () => {
    const { match, history } = this.props
    const response = await api.get(`/atual/${match.params.id}`)
    this.setState({
      user: response.data,
    })
  }

  handleSubmit = e => {
    const { form, history } = this.props

    form.setFieldsValue({
      nome: this.state.user.nome,
      senha: this.state.user.senha,
      sexo: this.state.user.sexo,
      nascimento: this.state.user.nascimento,
      email: this.state.user.email,
      telefone: this.state.user.telefone,
    })
    if (this.state.url_imagem === null) {
      form.setFieldsValue({
        imagem: this.state.user.imagem,
      })
    } else {
      form.setFieldsValue({
        imagem: this.state.url_imagem,
      })
    }

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const update = await api.put(`/update/${this.state.user._id}`, values)
        const resposta = update.data
        console.log(resposta)
      }
    })
  }

  voltarHome = () => {
    const { match, history } = this.props
    history.push(`/user/${match.params.id}`)
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

  handleConfirmBlur = e => {
    const { value } = e.target
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { setFieldsValue } = this.props.form

    const { uploadedFiles, user } = this.state

    return (
      <div className="pag-update">
        <div className="box-update">
          <Form
            layout="vertical"
            onSubmit={this.handleSubmit}
            className="form-update"
          >
            <h2>Altere suas Informações</h2>

            <Form.Item label="Conte um pouco sobre você e sua experiência com animais">
              {getFieldDecorator('entrevista', {
                initialValue: user.entrevista,
              })(
                <Input value={user.entrevista} style={{ width: '100%', height: 60 }} />
              )}
            </Form.Item>
            <Form.Item label="Insira uma foto sua:">
              {getFieldDecorator('imagem')(<Input type="hidden" />)}
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
              <Button htmlType="submit" className="btn-update">
                Cadastrar
              </Button>
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('nome')(<Input className="secret" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('senha')(<Input className="secret" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('sexo')(<Input className="secret" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('nascimento')(<Input className="secret" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('email')(<Input className="secret" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('telefone')(<Input className="secret" />)}
            </Form.Item>
          </Form>

          <Button
            size="large"
            shape="round"
            className="btn-voltar-regisAnimal"
            onClick={this.voltarHome}
          >
            <Icon type="left" />
            Home
          </Button>
        </div>
      </div>
    )
  }
}
const WrappedRegisterUpdateForm = Form.create({ name: 'update' })(Update)

export default WrappedRegisterUpdateForm
