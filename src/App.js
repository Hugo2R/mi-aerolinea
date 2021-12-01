import './App.css';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import planetaryjs from './globe'
import FaresTable from './fares-table'
import { fetchCities } from './reducers/citiesSlice'
import { fetchFlights, setFlight } from './reducers/flightsSlice'


function App() {
  const [origin, setOrigin] = useState({id: ''})
  const [destin, setDestin] = useState({id: ''})
  const [pssngr, setPssngr] = useState([1, 0, 0])
  const [step, setStep] = useState('route')
  const [tab, setTab] = useState(0)
  const [cart, setCart] = useState(JSON.parse(localStorage.cart || '[]')
)
  const canvas = useRef()
  const aside = useRef()
  const planet = useRef()
  const ping = useRef()
  const dispatch = useDispatch()
  const cities = useSelector(store => store.cities)
  const flight = useSelector(store => store.flights.flight)

  const citiesFilter = city => c => c.id !== city.id
  const citiesMapper = c => <option key={c.id} value={c.id}>{c.name}</option>
  const bookingsMapper = (b, onClick, onClickDel) => <li key={b.cartId} onClick={() => onClick(b)}>
    <div>
      <p>{`${b.origin.name} - ${b.destin.name}`}</p>
      <p>{`Vuelo: ${b.id} / Categoría:  ${b.type}`}</p>
    </div>
    <div>
    <p>{`Total: $${b.total}.`}<sup>00</sup></p>
    </div>
    <div>
      <p onClick={() => onClickDel(b.cartId)}>✖︎</p>
    </div>
  </li>

  useEffect(() => {
    dispatch(fetchCities)
    if (canvas.current){
      planet.current = planetaryjs(canvas.current)
    }

    return () => {
      clearInterval(ping.current)
    }
  }, [dispatch])

  const onCityChange = (e, update) => {
    const [city] = cities.filter(c => c.id === e.target.value)
    update(city)
    pingCity(city)  
  }

  const onSubmit = e => {
    e.preventDefault()
    pingCity(destin)
    setStep('flights')
    dispatch(fetchFlights)
  }

  const pingCity = (city) => {
    clearInterval(ping.current)
    planet.current.plugins.autorotate.pause()
    planet.current.projection.rotate([city.degX, city.degY, 0])
    planet.current.plugins.pings.add(city.lon, city.lat, {color: '#9f5905', ttl: 1500, angle: 3 })
    ping.current = setInterval(() => {
      planet.current.plugins.pings.add(city.lon, city.lat, {color: '#9f5905', ttl: 1500, angle: 3 })
    }, 1600)
  }

  const chgForm = () => {
    setStep('route')
    dispatch(setFlight({}))
    planet.current.plugins.autorotate.resume()
    clearInterval(ping.current)
  }

  const chgPssngr = (index, event) => {
    const tmp = [...pssngr]
    
    tmp[index] = parseInt(Number(event.target.value)) || 0

    const total = tmp.reduce((a, v) => a + v, 0)

    if (total < 10 && total > 0) {
      setPssngr(tmp)
    }
  }

  const onClickBooked = () => {
    setStep('booked')
    localStorage.cart = JSON.stringify([
      ...cart,
      {
        cartId: Date.now(),
        ...flight,
        origin: { id: origin.id, name: origin.name},
        destin: { id: destin.id, name: destin.name},
        pssngr,
        total: totalPssngr * flight.fare
      }
    ])

    setCart(JSON.parse(localStorage.cart))
  }

  const onClickBooking = () => {
    setTab(0)
    setStep('route')
    setOrigin({id: ''})
    setDestin({id: ''})
    setPssngr([1, 0, 0])
    dispatch(setFlight({}))
    clearInterval(ping.current)
  }

  useEffect(() => {
    if (canvas.current){
      planet.current = planetaryjs(canvas.current)
    }
  }, [tab])

  const onClickCart = () => {
    setTab(1)
    setStep('cart')
  }

  const onClickDeleteCart = () => {
    delete localStorage.cart
    setCart([])
  }

  const onClickDeleteBooking = (cartId) => {
    const tmp = cart.filter(b => b.cartId !== cartId)
    setCart(tmp)
    localStorage.cart = JSON.stringify(tmp)
  }

  const onClickBookingItem = (item) => {
    dispatch(setFlight(item))
    setStep('usrData')
  }

  const totalPssngr =  pssngr.reduce((a,v)=>a+v,0)

  return (
      <div className="App">
        <header>
          <h1><span>✈</span>Mi aerolinea</h1>
          <ul>
            <li><button className={tab === 0 ? 'active' : ''} onClick={onClickBooking}>Reservas</button></li>
            <li><button className={tab === 1 ? 'active' : ''} onClick={onClickCart}>Lista de Viajes</button></li>
          </ul>
        </header>
        {!tab && <main className={step}>
          <aside ref={aside}>
            <form onSubmit={onSubmit}>
              <label> <span>Origen</span>
                <select name="origin" placeholder="Selecciona una ciudad"
                   onChange={e => {onCityChange(e, setOrigin)}} value={origin.id} required>
                  <option disabled hidden value="">Selecciona una ciudad</option>
                  {cities.filter(citiesFilter(destin)).map(citiesMapper)}
                </select>
              </label>
              <label> <span>Destino</span>
                <select name="destin" placeholder="Selecciona una ciudad"
                  onChange={e => {onCityChange(e, setDestin)}} value={destin.id} required>
                  <option disabled hidden value="">Selecciona una ciudad</option>
                  {cities.filter(citiesFilter(origin)).map(citiesMapper)}
                </select>
              </label>
              <fieldset>
              <legend>Pasajeros</legend>
              <label><span>Adultos</span>
                <input type="number" min="0" max="9" value={pssngr[0]} onChange={e => chgPssngr(0, e)} />
              </label>
              <label><span>Niños</span>
                <input type="number" min="0" max="9" value={pssngr[1]} onChange={e => chgPssngr(1, e)} />
              </label>
              <label><span>Bebés</span>
                <input type="number" min="0" max="9" value={pssngr[2]} onChange={e => chgPssngr(2, e)} />
              </label>
              </fieldset>
              <button type="submit">Buscar vuelos</button>
            </form>
          </aside>
          <section>
            <canvas ref={canvas} width="500" height="500" />
            <div className={step === 'flights' ? 'fares' : ''}>
              <FaresTable />
              <span className="return" onClick={chgForm}>←</span>
            </div>
            { !!flight.id && <button onClick={onClickBooked}>Reservar</button> }
          </section>
          <section className={ step ==='booked' ? 'details' : ''}>
            <h2>Tu vuelo ha sido reservado</h2>
            <p>{`${origin.name} - ${destin.name}`}</p>
            <p>{`Vuelo: ${flight.id} / Categoría:  ${flight.type}`}</p>
            <p>{`$${flight.fare}.00 x ${totalPssngr} pasajero${totalPssngr>1?'s':''}`}</p>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{`Total: $${flight.fare * totalPssngr}.`}<sup>00</sup></p>
          </section>
        </main>}
        {!!tab && <main className={step}>
          <section>
            <h2>Lista de viajes reservados</h2>
            <div>
              <h3>{`Total: $${cart.reduce((a, v) => a + v.total, 0 )}.00`}</h3>
              <button onClick={onClickDeleteCart}>Borrar todo</button>
            </div>
            <ul className="bookings-list">
              {cart.map(b => bookingsMapper(b, onClickBookingItem, onClickDeleteBooking))}
            </ul>
          </section>
          <section></section>
        </main>}
      </div>
  );
}

export default App;
