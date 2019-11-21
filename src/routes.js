import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import Login from './pages/Login/Login'
import Registro from './pages/Registro/Registro'
import Home from './pages/Home/Home'
import RegisAnimal from './pages/RegisAnimal/RegisAnimal'
import Procurar from './pages/Procurar/Procurar'
import Update from './pages/Update/Update'
import Animais from './pages/Animais/Animais'
import Interessados from './pages/Interessados/Interessados'
import Matchs from './pages/Match/Match'

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={Login} />
      <Route path="/registro" component={Registro} />
      <Route path="/user/:id" component={Home} />
      <Route path="/regisanimal/:id" component={RegisAnimal} />
      <Route path="/procurar/:id" component={Procurar} />
      <Route path="/update/:id" component={Update} />
      <Route path="/animais/:id" component={Animais} />
      <Route path="/interessados/:id" component={Interessados} />
      <Route path="/matchs/:id" component={Matchs} />
    </BrowserRouter>
  )
}
