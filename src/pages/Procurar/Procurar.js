import React from 'react'
import { Link } from 'react-router-dom'
import './Procurar.css'
import { Button, Icon } from 'antd'

import api from '../../services/Api'

import like from '../../assets/like.svg'
import dislike from '../../assets/dislike.svg'
import logo from '../../assets/logocomp.png'

export default class Procurar extends React.Component {
  constructor() {
    super()
    this.state = {
      animais: [],
    }
  }

  componentDidMount = async () => {
    const { match } = this.props
    console.log(match.params.id)
    const response = await api.get('/animais', {
      headers: {
        user: match.params.id,
      },
    })

    this.setState({
      animais: response.data,
    })
  }

  voltarHome = () => {
    const { match, history } = this.props
    history.push(`/user/${match.params.id}`)
  }

  handleLike = async id => {
    const { match } = this.props
    await api.post(`/animais/${id}/likes`, null, {
      headers: { idenvia: match.params.id, type: 'pessoa' },
    })

    this.setState({
      animais: this.state.animais.filter(animal => animal._id !== id),
    })
  }

  handleDislike = async id => {
    const { match } = this.props
    await api.post(`/animais/${id}/dislikes`, null, {
      headers: { idenvia: match.params.id, type: 'pessoa' },
    })

    this.setState({
      animais: this.state.animais.filter(animal => animal._id !== id),
    })
  }

  render() {
    const { animais } = this.state
    const { match } = this.props

    return (
      <div className="container-procurar">
        <Link to={`/user/${match.params.id}`}>
          <img src={logo} alt="AdoPets" className="logo-procurar" />
        </Link>

        {animais.length > 0 ? (
          <h2 className="procurar-lar">
            Animais que estão a procura de um lar!
          </h2>
        ) : null}
        {animais.length > 0 ? (
          <ul>
            {animais.map(animal => (
              <li key={animal._id}>
                <img src={animal.imagem} alt={animal.nome} />
                <footer>
                  <strong>{animal.nome}</strong>
                  <p>Sexo: {animal.sexo}</p>
                  <p>Idade: {animal.idade}</p>
                  <p>Porte: {animal.porte}</p>
                  <p>{animal.descricao}</p>
                </footer>

                <div className="btns-procurar">
                  <button
                    type="button"
                    onClick={() => this.handleDislike(animal._id)}
                  >
                    <img src={dislike} alt="dislike" />
                  </button>
                  <button
                    type="button"
                    onClick={() => this.handleLike(animal._id)}
                  >
                    <img src={like} alt="like" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            Sem animais disponíveis... Aguarde novos animais serem cadastrados
            :C
          </div>
        )}
        <Button
          size="large"
          shape="round"
          className="btn-voltar-procurar"
          onClick={this.voltarHome}
        >
          <Icon type="left" />
          Home
        </Button>
      </div>
    )
  }
}
