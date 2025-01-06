import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

import Productos from "./Productos"
import MenuRobot from './utils/MenuRobot'
import PuntoDeVenta from './puntoDeVenta/PuntoDeVenta';
import RetirosDeCaja from './RetirosDeCaja';
import VentasConsultaSucursalesHoy from './VentasConsultaSucursalesHoy';
import VentasBI from './VentasBI';
import VentasBiLavamaticaTienda from './VentasBiLavamanticaTienda'
import Ingresos from './Ingresos'
import Egresos from './Egresos'
import EstadoResultadosLimpiaduria from './EstadoResultadosLimpiaduria';
import IELimpiaduriaBI from './IELimpiaduriaBI';
import ComprasRecepcion from './ComprasRecepcion';
import ConsultaArticulo from './ConsultaArticulo';
import Kardex from './Kardex';
import AjustesInventario from './AjustesInventario';
import CambiosDePresentacion from './CambiosDePresentacion';
import TraspasosSalidaEntrada from './TraspasosSalidaEntrada';
import InventarioFaltantes from './InventarioFaltantes';

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
    User: User,
    Administrador: administrador,
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
    isDisabled = false 
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
                <div className="dropdown-divider"></div>
                <NavDropdown.Item as={Link} to="/menu/retirosdecaja" disabled={isDisabled} onClick={closeMenu}>💰 Retiro de Caja</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Ventas" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/menu/consultaventassucursaleshoy" disabled={isDisabled} onClick={closeMenu}>Consulta Ventas Sucursales Hoy</NavDropdown.Item>
                <div className="dropdown-divider"></div>
                <NavDropdown.Item as={Link} to="/menu/bi-limpiaduria" disabled={isDisabled} onClick={closeMenu}>Inteligencia de Negocio Limpiaduría</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/bi-lavamatica" disabled={isDisabled} onClick={closeMenu}>Inteligencia de Negocio Lavamática</NavDropdown.Item>
                {/* <NavDropdown.Item as={Link} to="/submenu2">Submenú 2</NavDropdown.Item> */}
              </NavDropdown>

              <NavDropdown title="Contabilidad" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/menu/ingresos" disabled={isDisabled} onClick={closeMenu}>Ingresos</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/contabilidad/egresos" disabled={isDisabled} onClick={closeMenu}>Egresos</NavDropdown.Item>
                <div className="dropdown-divider"></div>
                <NavDropdown.Item as={Link} to="/menu/contabilidad/estadoderesultadoslimpiaduria" disabled={isDisabled} onClick={closeMenu}>Estado de Resultados Limpiaduría</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/contabilidad/IELimpiaduriaBI" disabled={isDisabled} onClick={closeMenu}>Egresos Limpiaduría</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Compras" id="basic-nav-dropdown" disabled={isDisabled}>
                <NavDropdown.Item as={Link} to="/menu/compras/comprasrecepcion" disabled={isDisabled} onClick={closeMenu} >Compras Recepción</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Inventario" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/menu/inventario/consultaarticulo" disabled={isDisabled} onClick={closeMenu} >Consulta Artículo</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/inventario/kardex" disabled={isDisabled} onClick={closeMenu} >Kardex</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/inventario/ajustesinventario" disabled={isDisabled} onClick={closeMenu} >Ajustes Inventario</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/inventario/cambiosdepresentacion" disabled={isDisabled} onClick={closeMenu} >Cambios de Presentación</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/inventario/traspasossalidaentrada" disabled={isDisabled} onClick={closeMenu} >Traspasos Salida/Entrada</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/menu/inventario/inventariofaltantes" disabled={isDisabled} onClick={closeMenu} >Inventario Faltantes</NavDropdown.Item>
              </NavDropdown>

              <button className='btn btn-danger' onClick={handlerLogout}>Salir</button>

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>



      {/****************************************** Rutas ********************************************/}
      <Routes>
        {/* Corregir los paths de los primeros Route */}
        <Route path="productos" element={<Productos onProps={myProps} />} />
        <Route path="puntoDeVenta" element={<PuntoDeVenta onProps={myProps} />} />
        <Route path="retirosdecaja" element={<RetirosDeCaja onProps={myProps} />} />
        <Route path="consultaventassucursaleshoy" element={<VentasConsultaSucursalesHoy onProps={myProps} />} />
        <Route path="bi-limpiaduria" element={<VentasBI onProps={myProps} />} />
        <Route path="bi-lavamatica" element={<VentasBiLavamaticaTienda onProps={myProps} />} />
        <Route path="ingresos" element={<Ingresos onProps={myProps} naturalezaCC="1"/>} />
        <Route path="contabilidad/egresos" element={<Egresos onProps={myProps} naturalezaCC="-1"/>} />
        <Route path="contabilidad/estadoderesultadoslimpiaduria" element={<EstadoResultadosLimpiaduria onProps={myProps} />} />
        <Route path="contabilidad/IELimpiaduriaBI" element={<IELimpiaduriaBI onProps={myProps} />} />
        <Route path="compras/comprasrecepcion" element={<ComprasRecepcion onProps={myProps} />} />
        <Route path="inventario/consultaarticulo" element={<ConsultaArticulo onProps={myProps} />} />
        <Route path="inventario/kardex" element={<Kardex onProps={myProps} />} />
        <Route path="inventario/ajustesinventario" element={<AjustesInventario onProps={myProps} />} />
        <Route path="inventario/cambiosdepresentacion" element={<CambiosDePresentacion onProps={myProps} />} />
        <Route path="inventario/traspasossalidaentrada" element={<TraspasosSalidaEntrada onProps={myProps} />} />
        <Route path="inventario/inventariofaltantes" element={<InventarioFaltantes onProps={myProps} />} />

      </Routes>
      </>
  );
};

export default Menu;



