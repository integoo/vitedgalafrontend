import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

import Productos from "./Productos"
import MenuRobot from './utils/MenuRobot'
import PuntoDeVenta from './puntoDeVenta/PuntoDeVenta';

const Menu = ({ onhandlerAppState, onPropsMenu }) => {
  const SucursalId = onPropsMenu.sucursalId
  const ColaboradorId = onPropsMenu.colaboradorId
  const accessToken = onPropsMenu.accessToken
  const dbName = onPropsMenu.dbName
  const origin = onPropsMenu.origin
  const administrador = onPropsMenu.administrador
  const version = onPropsMenu.version
  const User = onPropsMenu.user
  const perfilTransacciones = onPropsMenu.perfilTransacciones //analista,gerente,colaborador


  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Alternar entre abierto y cerrado
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Cerrar el menú
  };


  const myProps = {
    accessToken: accessToken,
    origin: origin,
    SucursalId: SucursalId,
    ColaboradorId: ColaboradorId,
    User: User
  }


  const handlerLogout = () => {
    onhandlerAppState(0, false, null, null, null, null, null, 0)
  }

  //******************************************************************************** */
  //***  ACTIVA PRIVILEGIOS O ACCESOS EN EL MENU DE ACUERDO AL "PERFIL" DEL USUARIO*/
  //** ACTUALMENTE SOLO ADMINISTRA ACCESOS A OPCIONES DE MENU QUE GRABAN O INSERTAN EN LA BASE DE DATOS */
  let isDisabled = false;

  if (perfilTransacciones === "Gerente") {
    isDisabled = false
  }
  if (perfilTransacciones === "Analista") {
    isDisabled = true
  }
  if (perfilTransacciones === "Colaborador") {
    isDisabled = true
  }
  //******************************************************************************** */

  let vbackground = (dbName) === 'dgaladb' ? "primary" : "warning" //Nombre de la Base de Datos
  let vvariant = (dbName) === 'dgaladb' ? "dark" : "light" //Nombre de la Base de Datos

  return (
<>
      {/************************************* Navbar ************************************/}
      <Navbar bg={vbackground} variant={vvariant} expand="lg" expanded={isMenuOpen} >
        <Container>

          {/* D'Gala y MenuRobot */}

          
          <div style={{ display: "flex", gap: "0px", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", margin: "0", padding: "0", width: "90px" }}>
              <Navbar.Brand as={Link} to="/menu"><span>D'Gala</span><span style={{ fontSize: "10px" }}>{version}</span></Navbar.Brand>
            </div>
            <div style={{ display: "flex", alignItems: "center", margin: "0", padding: "0" }}>
              <MenuRobot />
            </div>
          </div>




          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={handleToggle} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" style={{fontSize: "1rem"}}>

              <NavDropdown title="Catálogos" id="basic-nav-dropdown" disabled={isDisabled}>
                {/* <NavDropdown.Item as={Link} to="/productos" disabled={isDisabled} onClick={closeMenu} >🏷 Productos</NavDropdown.Item> */}
                <NavDropdown.Item as={Link} to="/menu/productos" disabled={isDisabled} onClick={closeMenu} >🗂 Productos</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Punto de Venta" id="basic-nav-dropdown" disabled={isDisabled}>
                {/* <NavDropdown.Item as={Link} to="/puntoDeVenta">💵 Punto de Venta</NavDropdown.Item> */}
                <NavDropdown.Item as={Link} to="/menu/puntoDeVenta" disabled={isDisabled} onClick={closeMenu}>🛒 Punto de Venta</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/submenu2">💰 Retiro de Caja</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Ventas" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/submenu1">Submenú 1</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/submenu2">Submenú 2</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Contabilidad" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/submenu1">Submenú 1</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/submenu2">Submenú 2</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Compras" id="basic-nav-dropdown" disabled={isDisabled}>
                <NavDropdown.Item as={Link} to="/submenu1">Submenú 1</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/submenu2">Submenú 2</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Inventario" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/submenu1">Submenú 1</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/submenu2">Submenú 2</NavDropdown.Item>
              </NavDropdown>

              <button className='btn btn-danger' onClick={handlerLogout}>Salir</button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>



      {/****************************************** Rutas ********************************************/}
      <Routes>
        <Route path="productos" element={<Productos onProps={myProps} />} />
        <Route path="puntoDeVenta" element={<PuntoDeVenta onProps={myProps} Administrador={administrador} />} />
      </Routes>
      </>
  );
};

export default Menu;



