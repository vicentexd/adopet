import React from 'react'
import { Link } from 'react-router-dom'
import './Match.css'
import { Button, Icon } from 'antd'

import api from '../../services/Api'
import logo from '../../assets/logocomp.png'

export default class Match extends React.Component {
  constructor() {
    super()
    this.state = {
      animais: [],
      user: [],
    }
  }

  componentDidMount = async () => {
    const { match } = this.props

    const response = await api.get(`/atual/${match.params.id}`)

    const matchs = await api.get('/matchs', {
      headers: {
        user: match.params.id,
      },
    })

    this.setState({
      user: response.data,
      animais: matchs.data,
    })
  }

  render() {
    const { user, animais } = this.state

    return (
      <div className="container-match">
        <Link to={`/user/${user._id}`}>
          <img src={logo} alt="AdoPets" className="logo-procurar" />
        </Link>

        <h2 style={{ fontSize: 30 }}>Animais que deram match com você</h2>

        <ul>
          {animais.map(animal => (
            <li key={animal._id}>
              <img src={animal.imagem} alt={animal.nome} />
              <footer>
                <strong>{animal.nome}</strong>
                <p>Sexo: {animal.sexo}</p>
                <p>Idade: {animal.idade}</p>
                <p>Porte: {animal.porte}</p>
                <p>Responsável:{animal.responsavel}</p>
                <p>{animal.descricao}</p>
              </footer>
              <div className="telefone-match">
                <Icon
                  type="phone"
                  style={{
                    fontSize: 20,
                    color: 'rgba(24, 182, 10, 0.836)',
                  }}
                />
                <h3> {animal.telefone}</h3>
              </div>
            </li>
          ))}
        </ul>
        <Link to={`/user/${user._id}`}>
          <Button size="large" shape="round" className="btn-voltar-procurar">
            <Icon type="left" />
            Home
          </Button>
        </Link>
      </div>
    )
  }
}
