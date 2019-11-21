import React from 'react'
import { Link } from 'react-router-dom'
import './Interessados.css'
import { Button, Icon } from 'antd'

import api from '../../services/Api'
import like from '../../assets/like.svg'
import dislike from '../../assets/dislike.svg'
import logo from '../../assets/logocomp.png'

export default class Interessados extends React.Component {
  constructor() {
    super()
    this.state = {
      animal: [],
      users: [],
    }
  }

  componentDidMount = async () => {
    const { match } = this.props

    const usuarios = await api.get('/user', {
      headers: {
        idanimal: match.params.id,
      },
    })

    const animal = await api.get(`/animal/${match.params.id}`)

    this.setState({
      animal: animal.data,
      users: usuarios.data,
    })
  }

  voltarPag = id => {
    const { history } = this.props
    history.push(`/animais/${id}`)
  }

  handleLike = async id => {
    const { match } = this.props
    await api.post(`/animais/${id}/likes`, null, {
      headers: { idenvia: match.params.id, type: 'animal' },
    })

    window.location.reload();
  }

  handleDislike = async id => {
    const { match } = this.props
    await api.post(`/animais/${id}/dislikes`, null, {
      headers: { idenvia: match.params.id, type: 'animal' },
    })

    this.setState({
      users: this.state.users.filter(user => user._id !== id),
    })
  }

  render() {
    const { animal, users } = this.state
    const { match } = this.props

    return (
      <div className="container-intere">
        <Link to={`/user/${animal.id_responsavel}`}>
          <img src={logo} alt="AdoPets" className="logo-procurar" />
        </Link>

        {users.length > 0 ? (
          <h2 style={{ fontSize: 30 }}>
            Pessoas que demonstraram interesse para {animal.nome}
          </h2>
        ) : null}

        {users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user._id}>
                <img src={user.imagem} alt={user.nome} />
                <footer>
                  <strong>{user.nome}</strong>
                  <p>Sexo: {user.sexo}</p>
                  <p>Nascimento: {user.nascimento}</p>
                  <p>{user.entrevista}</p>
                </footer>
                {animal.likes.includes(user._id) ? (
                  <div className="telefone-inter">
                    <Icon
                      type="phone"
                      style={{
                        fontSize: 20,
                        color: 'rgba(24, 182, 10, 0.836)',
                      }}
                    />
                    <h3> {user.telefone}</h3>
                  </div>
                ) : (
                  <div className="btns-inter">
                    <button
                      type="button"
                      onClick={() => this.handleDislike(user._id)}
                    >
                      <img src={dislike} alt="dislike" />
                    </button>
                    <button
                      type="button"
                      onClick={() => this.handleLike(user._id)}
                    >
                      <img src={like} alt="like" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">
            <h2>
              Sem Interessados... aguarde novas pessoas se interessarem por{' '}
              {animal.nome}
              :C
            </h2>
          </div>
        )}
        <Button
          size="large"
          shape="round"
          className="btn-voltar-procurar"
          onClick={() => this.voltarPag(animal.id_responsavel)}
        >
          <Icon type="left" />
          Voltar
        </Button>
      </div>
    )
  }
}
