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
import './RegisAnimal.css'

const { Option } = Select

class RegisAnimal extends React.Component {
  constructor() {
    super()
    this.state = {
      user: [],
      confirmDirty: false,
      uploadedFiles: [],
      url_imagem: null,
    }
  }

  showModal = () => {
    const { history, match } = this.props
    Modal.success({
      title: 'Cadastro Realizado',
      content: <h2>Cadastro feito com sucesso!</h2>,
      onOk() {
        history.push(`/user/${match.params.id}`)
      },
    })
  }

  componentDidMount = async () => {
    const { match, history } = this.props
    const response = await api.get(`/atual/${match.params.id}`)
    this.setState({
      user: response.data,
    })
  }

  voltarHome = () => {
    const { match, history } = this.props
    history.push(`/user/${match.params.id}`)
  }

  handleSubmit = e => {
    const { form, history } = this.props

    e.preventDefault()

    form.setFieldsValue({
      responsavel: this.state.user.nome,
      id_responsavel: this.state.user._id,
      imagem: this.state.url_imagem,
      telefone: this.state.user.user.telefone,
    })

    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (this.state.url_imagem === null) {
        return message.error('Insira uma foto válida!')
      }

      if (!err) {
        const cadastro = await api.post('/animal', values)
        const resposta = cadastro.data
        await api.post(`/cadas/${resposta.id_responsavel}`, null, {
          headers: { animal: resposta._id },
        })
        this.showModal()
        console.log(resposta)
      }
    })
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

    const { uploadedFiles } = this.state

    return (
      <div className="pag">
        <div className="box-regisanimal">
          <Form
            layout="vertical"
            onSubmit={this.handleSubmit}
            className="form-regisAnimal"
          >
            <h2>Cadastro de Novo Animal</h2>
            <Row gutter={10}>
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
                      <Option value="Macho">Macho</Option>
                      <Option value="Femêa">Femêa</Option>
                      <Option value="Indefinido">Indefinido</Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Porte">
                  {getFieldDecorator('porte', {
                    rules: [
                      {
                        required: true,
                        message: 'Por favor selecione o porte',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Selecione..."
                      style={{ width: '100%' }}
                    >
                      <Option value="Pequeno">Pequeno</Option>
                      <Option value="Médio">Médio</Option>
                      <Option value="Grande">Grande</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Idade">
                  {getFieldDecorator('idade', {
                    rules: [
                      {
                        required: true,
                        message: 'Por favor insira a idade do animal',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Selecione..."
                      style={{ width: '100%' }}
                    >
                      <Option value="menos de 6 meses">Menos de 6 meses</Option>
                      <Option value="menos de 1 ano">Menos de 1 ano</Option>
                      <Option value="1 ano">1 ano</Option>
                      <Option value="2 anos">2 anos</Option>
                      <Option value="3 anos">3 anos</Option>
                      <Option value="4 anos">4 anos</Option>
                      <Option value="5 anos">5 anos</Option>
                      <Option value="6 anos">6 anos</Option>
                      <Option value="7 anos">7 anos</Option>
                      <Option value="8 anos">8 anos</Option>
                      <Option value="9 anos">9 anos</Option>
                      <Option value="10 anos">10 anos</Option>
                      <Option value="11 anos">11 anos</Option>
                      <Option value="12 anos">12 anos</Option>
                      <Option value="13 anos">13 anos</Option>
                      <Option value="14 anos">14 anos</Option>
                      <Option value="15 anos">15 anos</Option>
                      <Option value="16 anos">16 anos</Option>
                      <Option value="17 anos">17 anos</Option>
                      <Option value="18 anos">18 anos</Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Tipo do Animal">
                  {getFieldDecorator('tipo', {
                    rules: [
                      {
                        required: true,
                        message: 'Por favor selecione o tipo',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Selecione..."
                      style={{ width: '100%' }}
                    >
                      <Option value="gato">Gato</Option>
                      <Option value="cachorro">Cachorro</Option>
                      <Option value="outro">Outro</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Descrição">
              {getFieldDecorator('descricao', {
                rules: [
                  {
                    required: true,
                    message: 'Escreva uma descrição',
                  },
                ],
              })(<Input style={{ width: '100%', height: 60 }} />)}
            </Form.Item>
            <Form.Item label="Insira uma foto do animal">
              {getFieldDecorator('imagem')(<Input type="hidden" />)}
              <div className="imagemdiv">
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
              {getFieldDecorator('id_responsavel')(<Input type="hidden" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('responsavel')(<Input type="hidden" />)}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('telefone')(<Input type="hidden" />)}
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="btn-regisAnimal">
                Cadastrar
              </Button>
            </Form.Item>
          </Form>
        </div>
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
    )
  }
}

const WrappedRegisterAnimalForm = Form.create({ name: 'regisAnimal' })(
  RegisAnimal
)

export default WrappedRegisterAnimalForm
