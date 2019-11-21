import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row, Button, Avatar, Icon} from 'antd'
import api from '../../services/Api'
import './Home.css'

import find from '../../assets/find2.PNG'
import cadas from '../../assets/cadas.png'

export default class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      user: [],
      matchs: true,
      animais: true,
    }
  }

  componentDidMount = async () => {
    const { match, history } = this.props
    const response = await api.get(`/atual/${match.params.id}`)
    this.setState({
      user: response.data,
    })

    if (this.state.user.animais.length > 0) {
      this.setState({
        animais: false,
      })
    }

    if (this.state.user.match.length > 0) {
      this.setState({
        matchs: false,
      })
    }
  }

  render() {
    const { user, matchs, animais } = this.state
    return (
      <div className="conteudo-home">
        <div className="box-home">
          <div className="titulo-home">
            <h1>Bem Vindo, {user.nome}</h1>
          </div>

          <Row gutter={20}>
            <Col span={8}>
              <Link to={`/update/${user._id}`}>
                <Card className="cards-home">
                  <Avatar src={user.imagem} size={100} />
                  <h2>{user.nome}</h2>
                  <p>Editar perfil</p>
                </Card>
              </Link>
            </Col>
            <Col span={8}>
              <Link to={`/procurar/${user._id}`}>
                <Card className="cards-home">
                  <Avatar size={100} src={find} shape="square" />
                  <h2>Procurar Animal</h2>
                  <p>Procure um novo animalzinho para sua vida</p>
                </Card>
              </Link>
            </Col>
            <Col span={8}>
              <Link to={`/regisanimal/${user._id}`}>
                <Card className="cards-home">
                  <Avatar size={100} src={cadas} />
                  <h2>Cadastrar Animal</h2>
                  <p>Ajude um animalzinho a achar um lar</p>
                </Card>
              </Link>
            </Col>
          </Row>
        </div>
        <div className="opcao-home">
          <Row gutter={20}>
            <Col span={12}>
              <Card className="cards-opcao" style={{ width: 300 }}>
                <h3 className="til-op-home">Meus Matchs</h3>
                {matchs ? (
                  <h2>Você não teve nenhum match :C</h2>
                ) : (
                  <Link to={`/matchs/${user._id}`}>
                    <Button className="btn-op-home">Ver</Button>
                  </Link>
                )}
              </Card>
            </Col>
            <Col span={12}>
              <Card className="cards-opcao" style={{ width: 300 }}>
                <h3 className="til-op-home">Animais cadastrados</h3>
                {animais ? (
                  <h2>Você não tem nenhum animal cadastrado</h2>
                ) : (
                  <Link to={`/animais/${user._id}`}>
                    <Button className="btn-op-home">Ver</Button>
                  </Link>
                )}
              </Card>
            </Col>
          </Row>
        </div>
        <Link to={`/`}>
          <Button size="large" shape="round" className="btn-voltar-home
          ">
            <Icon type="left" />
            Sair
          </Button>
        </Link>
      </div>
    )
  }
}
