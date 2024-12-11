import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo192.png';
import styles from '../components/Login.module.css';

import { useNavigate } from 'react-router-dom'

const Login = ({ onhandlerAppState, jsonv }) => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const userInputRef = useRef(null);
    const passwordInputRef = useRef(null)

    const navigate = useNavigate()


    const handleSubmit = async (event) => {
        event.preventDefault();
        let user = usuario.toLowerCase()
        let json = {
            user: user,
            password: password
        };

        // Si es localhost es ambiente de DEV. Si es grupdgala.com es ambiente PROD.
        const domain_browser = window.location.hostname;

        let port;
        let domain;
        let protocol;
        let origin;
        if (usuario === 'desarrollo' || domain_browser === 'localhost') {
            protocol = `http`
            domain = `localhost`
            port = 4001
            origin = `${protocol}://${domain}:${port}`
        } else {
            //En Producción no es necesario el port porque el REVERSE PROXY dirige los métodos con "/api" en su url al puerto 3001 del backend
            protocol = `https`
            domain = `grupodgala.com`
            origin = `${protocol}://${domain}`
        }

        try {
            //IMPORTANTE: Aquí desde el server no debo a regresar los mensajes de error como el 401 para que no despliegue el API https://grupodgala.com/api/login

            const response = await fetch(`${origin}/api/login`, {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json'
                }
            })


            if (response.ok) {   //response.status = 200's
                const data = await response.json()
                /* ***************TOKEN*************************** */
                // sessionStorage.setItem('myToken', data.accessToken);
                // sessionStorage.setItem('user', user);
                // sessionStorage.setItem('ColaboradorId', data.ColaboradorId)
                // sessionStorage.setItem('SucursalId', data.SucursalId)
                /* *********************************************** */
                onhandlerAppState(data.SucursalId, true, data.accessToken, data.db_name, data.Administrador, data.PerfilTransacciones, user, data.ColaboradorId, origin)
                navigate('/menu')
            } else {
                alert("Error: " + response.status + " " + response.statusText + " (Usuario o Password NO Autorizado)")
                passwordInputRef.current.focus();
                passwordInputRef.current.select();
            }
        } catch (error) {
            console.error(error)
            alert(error)
            userInputRef.current.focus();
        }
    }

    const handleGoogleSignIn = () => {
        // Lógica para iniciar sesión con Google OAuth2
        console.log('Iniciar sesión con Google');
    };

    return (
        <>
            <div className={`${styles.body_center} text-center`}>
                <form className={styles.form_signin} onSubmit={handleSubmit}>
                    <img className="mb-4" src={logo} alt="" width="148" height="102" />
                    <h1 className="h4 mb-3 font-weight-bold" style={{ color: "darkblue", fontWeight: "700" }}>Grupo D'Gala</h1>

                    <input type="text" id="inputEmail" className={styles.form_control} placeholder="Username" name="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} ref={userInputRef} required autoFocus></input>
                    <input type="password" id="inputPassword" className={styles.form_control} placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} ref={passwordInputRef} required></input>

                    <div className={`${styles.checkbox} mb-3`}>
                        <label style={{ fontSize: ".8em" }}>
                            <input type="checkbox" id="inputCheck" value="remember-me" /> Remember me
                        </label>
                    </div>
                    <button className={`btn btn-lg btn-primary btn-block ${styles.full_width_button}`} type="submit">Sign in</button>
                    <p style={{ fontSize: ".8em" }} className="mt-5 mb-1 text-muted">&copy;{jsonv.versionFecha}{jsonv.version}</p>
                    <span style={{ color: "blue", fontSize: ".8em" }}>Powered by</span><span style={{ marginLeft: "2px", color: "red", fontSize: ".8em" }}>Integoo.com</span>
                </form>
            </div>
        </>
    );
};

export default Login;
