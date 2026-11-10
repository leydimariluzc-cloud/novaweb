
import { useState } from 'react';
import {
  HeartPulse, Mail, Lock, UserRound, ArrowLeft
} from 'lucide-react';
import '../styles/Login.css';

function Login({ alVolver }) {
  const [esRegistro, setEsRegistro] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();

    alert(
      esRegistro
        ? 'El registro estará disponible cuando conectemos el backend.'
        : 'El inicio de sesión estará disponible cuando conectemos el backend.'
    );
  };

  return (
    <div className="login-pagina">
      <div className="login-panel">

        <button
          className="login-volver"
          onClick={alVolver}
          type="button"
        >
          <ArrowLeft size={18} /> Volver a la tienda
        </button>

        <div className="login-logo">
          <HeartPulse size={38} />
          <span>Nova Salud</span>
        </div>

        <h1>
          {esRegistro ? 'Crear una cuenta' : '¡Bienvenido de nuevo!'}
        </h1>

        <p className="login-descripcion">
          {esRegistro
            ? 'Regístrate para disfrutar de nuestros productos.'
            : 'Ingresa a tu cuenta para continuar.'}
        </p>

        <form onSubmit={manejarEnvio}>

          {esRegistro && (
            <label className="login-campo">
              Nombre completo
              <div className="login-input">
                <UserRound size={19} />
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
            </label>
          )}

          <label className="login-campo">
            Correo electrónico
            <div className="login-input">
              <Mail size={19} />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </label>

          <label className="login-campo">
            Contraseña
            <div className="login-input">
              <Lock size={19} />
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                minLength={6}
                required
              />
            </div>
          </label>

          <button className="login-boton" type="submit">
            {esRegistro ? 'Crear mi cuenta' : 'Iniciar sesión'}
          </button>

        </form>

        <p className="login-cambiar">
          {esRegistro
            ? '¿Ya tienes una cuenta?'
            : '¿No tienes una cuenta?'}

          <button
            type="button"
            onClick={() => setEsRegistro(!esRegistro)}
          >
            {esRegistro ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>

        <p className="login-seguridad">
          Tu bienestar es nuestra prioridad.
        </p>

      </div>
    </div>
  );
}

export default Login;
