
import { useState } from 'react';
import {
  Search, ShoppingCart, HeartPulse, UserRound,
  Plus, Minus, Trash2, Menu, X
} from 'lucide-react';
import Login from './pages/Login';
import './App.css';

const productos = [
  { id: 1, nombre: 'Paracetamol 500 mg', categoria: 'Medicamentos', precio: 5.50, imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500' },
  { id: 2, nombre: 'Vitamina C', categoria: 'Vitaminas', precio: 18.90, imagen: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500' },
  { id: 3, nombre: 'Protector solar', categoria: 'Cuidado personal', precio: 35.00, imagen: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500' },
  { id: 4, nombre: 'Alcohol medicinal', categoria: 'Primeros auxilios', precio: 8.50, imagen: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500' },
  { id: 5, nombre: 'Multivitamínico', categoria: 'Vitaminas', precio: 29.90, imagen: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500' },
  { id: 6, nombre: 'Crema hidratante', categoria: 'Cuidado personal', precio: 24.90, imagen: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500' },
  { id: 7, nombre: 'Botiquín básico', categoria: 'Primeros auxilios', precio: 42.00, imagen: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500' },
  { id: 8, nombre: 'Tabletas de vitamina', categoria: 'Vitaminas', precio: 16.50, imagen: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=500' }
];

function App() {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const categorias = ['Todos', 'Medicamentos', 'Vitaminas', 'Cuidado personal', 'Primeros auxilios'];

  const filtrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (categoria === 'Todos' || producto.categoria === categoria)
  );

  const agregar = (producto) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === producto.id);
      if (existe) {
        return actual.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...actual, { ...producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, cambio) => {
    setCarrito((actual) =>
      actual
        .map((item) => item.id === id ? { ...item, cantidad: item.cantidad + cambio } : item)
        .filter((item) => item.cantidad > 0)
    );
  };

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  const cantidadTotal = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  if (mostrarLogin) {
return <Login alVolver={() => setMostrarLogin(false)} />;
  }

  return (
    <div className="tienda">
      <header className="barra-superior">
        <a className="marca" href="#">
          <span className="marca-icono"><HeartPulse size={27} /></span>
          <span>Nova <strong>Salud</strong><small>BOTICA Y FARMACIA</small></span>
        </a>

        <div className="buscador">
          <Search size={20} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar medicamentos, vitaminas..."
          />
        </div>

        <div className="acciones">
          <button className="usuario" onClick={() => setMostrarLogin(true)}>
            <UserRound size={20} /> Mi cuenta
          </button>
          <button className="boton-carrito" onClick={() => setMostrarCarrito(true)}>
            <ShoppingCart size={21} />
            Carrito
            <span>{cantidadTotal}</span>
          </button>
        </div>
      </header>

      <nav className="navegacion">
        <span><Menu size={18} /> Categorías</span>
        <a href="#catalogo">Productos</a>
        <a href="#catalogo">Ofertas</a>
        <a href="#catalogo">Vitaminas</a>
        <a href="#catalogo">Cuidado personal</a>
      </nav>

      <main>
        <section className="banner">
          <div>
            <span className="etiqueta-banner">TU BIENESTAR ES PRIMERO</span>
            <h1>Cuida tu salud,<br />nosotros te ayudamos.</h1>
            <p>Encuentra tus productos de farmacia en un solo lugar.</p>
            <a href="#catalogo" className="boton-banner">Ver productos <span>→</span></a>
          </div>
          <div className="banner-decoracion">
            <HeartPulse size={115} strokeWidth={1.2} />
          </div>
        </section>

        <section className="beneficios">
          <div><span>🚚</span><p><strong>Entrega segura</strong><small>Compra desde casa</small></p></div>
          <div><span>💊</span><p><strong>Gran variedad</strong><small>Productos de calidad</small></p></div>
          <div><span>💙</span><p><strong>Atención cercana</strong><small>Estamos para ayudarte</small></p></div>
        </section>

        <section className="catalogo" id="catalogo">
          <div className="titulo-catalogo">
            <div>
              <span className="subtitulo">NUESTRO CATÁLOGO</span>
              <h2>Productos destacados</h2>
              <p>Encuentra lo que necesitas para cuidar de ti.</p>
            </div>
            <span className="contador-productos">{filtrados.length} productos</span>
          </div>

          <div className="filtros">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={categoria === cat ? 'filtro activo' : 'filtro'}
                onClick={() => setCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="productos-grid">
            {filtrados.map((producto) => (
              <article className="producto-card" key={producto.id}>
                <div className="producto-imagen">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                  />
                  <span className="producto-etiqueta">{producto.categoria}</span>
                </div>
                <div className="producto-info">
                  <span className="producto-categoria">{producto.categoria}</span>
                  <h3>{producto.nombre}</h3>
                  <div className="producto-pie">
                    <strong>S/ {producto.precio.toFixed(2)}</strong>
                    <button onClick={() => agregar(producto)} aria-label={`Agregar ${producto.nombre}`}>
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {filtrados.length === 0 && <p>No encontramos productos con esa búsqueda.</p>}
          </div>
        </section>
      </main>

      <footer className="pie-pagina">
        <HeartPulse size={22} /> Nova Salud · Cuidamos de ti y tu familia.
      </footer>

      {mostrarCarrito && (
        <div className="fondo-modal" onClick={() => setMostrarCarrito(false)}>
          <section className="panel-carrito" onClick={(e) => e.stopPropagation()}>
            <div className="encabezado-carrito">
              <h2><ShoppingCart size={23} /> Mi carrito</h2>
              <button onClick={() => setMostrarCarrito(false)}><X /></button>
            </div>
            {carrito.length === 0 ? (
              <div className="carrito-vacio">
                <ShoppingCart size={48} />
                <h3>Tu carrito está vacío</h3>
                <p>Agrega productos para comenzar tu compra.</p>
              </div>
            ) : (
              <>
                <div className="lista-carrito">
                  {carrito.map((item) => (
                    <div className="item-carrito" key={item.id}>
                      <div>
                        <strong>{item.nombre}</strong>
                        <small>S/ {item.precio.toFixed(2)}</small>
                      </div>
                      <div className="cantidad">
                        <button onClick={() => cambiarCantidad(item.id, -1)}><Minus size={15} /></button>
                        {item.cantidad}
                        <button onClick={() => cambiarCantidad(item.id, 1)}><Plus size={15} /></button>
                      </div>
                      <button className="eliminar" onClick={() => setCarrito((actual) => actual.filter((p) => p.id !== item.id))}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="total-carrito">
                  <p>Total <strong>S/ {total.toFixed(2)}</strong></p>
                  <button onClick={() => alert('El carrito está listo. La conexión de pago se realizará más adelante.')}>
                    Continuar compra
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
