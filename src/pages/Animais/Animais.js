import React from 'react'
import { Link } from 'react-router-dom'
import './Animais.css'
import { Button, Icon, Row, Card, Col } from 'antd'

import api from '../../services/Api'

import logo from '../../assets/logocomp.png'

export default class Animais extends React.Component {
  constructor() {
    super()
    this.state = {
      user: [],
      animais: [],
    }
  }

  componentDidMount = async () => {
    const { match } = this.props
    const response = await api.get('/care', {
      headers: {
        user: match.params.id,
      },
    })

    const usuario = await api.get(`/atual/${match.params.id}`)

    this.setState({
      animais: response.data,
      user: usuario.data,
    })
  }

  excluirAnimal = async id => {
    const bye = await api.delete(`/byeanimal/${id}`)

    this.setState({
      animais: this.state.animais.filter(animal => animal._id !== id),
    })
  }

  voltarHome = () => {
    const { match, history } = this.props
    history.push(`/user/${match.params.id}`)
  }

  render() {
    const { animais, user } = this.state

    return (
      <div className="container-animais">
        <Link to={`/user/${user._id}`}>
          <img src={logo} alt="AdoPets" style={{ width: 150 }} />
        </Link>

        <h2 style={{ fontSize: 30 }}>Seus animais cadastrados</h2>
        {animais.length > 0 ? (
          <ul>
            {animais.map(animal => (
              <li key={animal._id}>
                <img src={animal.imagem} alt={animal.nome} />
                <footer>
                  <strong>{animal.nome}</strong>
                </footer>
                <div className="btns-animal-op">
                  <Row>
                    <Col span={12}>
                      <Card className="excluir-animal">
                        <Button
                          icon="delete"
                          className="excluir-animal-btn"
                          onClick={() => this.excluirAnimal(animal._id)}
                        >
                          Excluir
                        </Button>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card className="inter-ani">
                        {animal.interessados.length > 0 ||
                        animal.likes.length > 0 ? (
                          <div className="inter-ani">
                            <Link to={`/interessados/${animal._id}`}>
                              <Button className="ver-inter" icon="smile">
                                Veja
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <h3>Sem Likes</h3>
                        )}
                      </Card>
                    </Col>
                  </Row>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">Você não tem tem animais cadastrados</div>
        )}

        <Button
          size="large"
          shape="round"
          className="btn-voltar-animais"
          onClick={this.voltarHome}
        >
          <Icon type="left" />
          Home
        </Button>
      </div>
    )
  }
}
