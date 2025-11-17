import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './components/Login'
import Menu from './components/Menu'
import ProtectedRoutes from './components/utils/ProtectedRoutes'

import './App.css'

function App() {

  const [sucursalId, setSucursalId] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [dbName, setDbName] = useState("")
  const [administrador, setAdministrador] = useState("")
  const [perfilTransacciones, setPerfilTransacciones] = useState("")
  const [user, setUser] = useState("")
  const [colaboradorId, setColaboradorId] = useState(0)

  const [origin, setOrigin] = useState("")
  const [version, setVersion] = useState(" v2.9")
  const [versionFecha, setVersionFecha] = useState(" 2025 Nov 17")


  const handlerAppState = (SucursalId, trueFalse, accessToken, dbName, Administrador, PerfilTransacciones, user, ColaboradorId, origin) => {
    setSucursalId(SucursalId)
    setIsLoggedIn(trueFalse)
    setAccessToken(accessToken)
    setDbName(dbName)
    setAdministrador(Administrador)
    setPerfilTransacciones(PerfilTransacciones)
    setUser(user)
    setColaboradorId(ColaboradorId)
    setOrigin(origin)
  }

  const jsonVersion = {
    version: version,
    versionFecha: versionFecha
  }

  const propsMenu = {
    sucursalId: sucursalId,
    accessToken: accessToken,
    dbName: dbName,
    administrador: administrador,
    perfilTransacciones: perfilTransacciones,
    user: user,
    colaboradorId: colaboradorId,
    origin: origin,
    version: version,
    versionFecha: versionFecha
  }



  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onhandlerAppState={handlerAppState} jsonv={jsonVersion} />} />

          <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}>
            <Route path="/menu/*" element={<Menu onhandlerAppState={handlerAppState} onPropsMenu={propsMenu} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
