import './App.css';
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import planetaryjs from './globe'
import SearchForm from './components/searchForm'
import FaresTable from './components/fares-table'
import PassengerForm from './components/passengerForm'
//import BookingConfirmation from './components/bookingConfirmation'
import PurchaseConfirmation from './components/purchaseConfirmation'

import { fetchCities } from './reducers/citiesSlice'
import { fetchFlights, setFlight } from './reducers/flightsSlice'
import { resetSearchForm } from './reducers/searchFormSlice'


function App() {
  const [step, setStep] = useState('route')
  const [tab, setTab] = useState(0)
  const [cart, setCart] = useState(JSON.parse(localStorage.cart || '[]'))
  const canvas = useRef()
  const planet = useRef()
  const ping = useRef()
  const dispatch = useDispatch()
  const flight = useSelector(store => store.flights.flight)
  const { origin, destination, passengers } = useSelector(store => store.searchForm)

  const bookingsMapper = (b, onClick, onClickDel) => <li key={b.cartId} onClick={() => onClick(b)}>
    <div>
      <p>{`${b.origin.name} - ${b.destination.name}`}</p>
      <p>{`Vuelo: ${b.id} / Categoría:  ${b.type}`}</p>
    </div>
    <div>
    <p>{`Total: $${b.total}.`}<sup>00</sup></p>
    </div>
    <div>
      <p onClick={(e) => {e.stopPropagation(); onClickDel(b.cartId)}}>✖︎</p>
    </div>
  </li>

  useEffect(() => {
    dispatch(fetchCities)
    if (canvas.current && tab === 0){
      planet.current = planetaryjs(canvas.current)
    }

    return () => {
      clearInterval(ping.current)
    }
  }, [dispatch, tab])

  const onCityChange = city => {
    pingCity(city)  
  }

  const onSearchSubmit = () => {
    pingCity(destination)
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

  const onClickBooked = () => {
    setStep('booked')
    localStorage.cart = JSON.stringify([
      ...cart,
      {
        cartId: Date.now(),
        ...flight,
        origin: { id: origin.id, name: origin.name},
        destination: { id: destination.id, name: destination.name},
        passengers,
        total: totalPssngr * flight.fare
      }
    ])

    setCart(JSON.parse(localStorage.cart))
  }

  const onClickBooking = () => {
    setTab(0)
    setStep('route')
    dispatch(resetSearchForm())
    dispatch(setFlight({}))
    clearInterval(ping.current)
  }

  const onClickCart = () => {
    setTab(1)
    setStep('cart')
    setFlight({})
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

  const onUsrDataSubmit = () => {
    onClickDeleteBooking(flight.cartId)
    setStep('purchased')
    
  }

  const totalPssngr =  passengers.reduce((a,v)=>a+v,0)

  return (
      <div className="App">
        <header>
          <h1><span>✈</span>Mi aerolinea</h1>
          <ul>
            <li><button className={tab === 0 ? 'active' : ''} onClick={onClickBooking}>Reservas</button></li>
            <li><button className={tab === 1 ? 'active' : ''} onClick={onClickCart}>Lista de Viajes</button></li>
          </ul>
        </header>
        {tab === 0 && <main className={step}>
          <SearchForm {...{onCityChange, onSearchSubmit}} />
          <section>
            <canvas ref={canvas} width="500" height="500" />
            <div className={step === 'flights' ? 'fares' : ''}>
              <FaresTable />
              <span className="return" onClick={chgForm}>←</span>
            </div>
            { !!flight.id && <button onClick={onClickBooked}>Reservar</button> }
          </section>
          <section className="details">
            <h2>Tu vuelo ha sido reservado</h2>
            <p>{`${origin.name} - ${destination.name}`}</p>
            <p>{`Vuelo: ${flight.id} / Categoría:  ${flight.type}`}</p>
            <p>{`$${flight.fare}.00 x ${totalPssngr} pasajero${totalPssngr>1?'s':''}`}</p>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{`Total: $${flight.fare * totalPssngr}.`}<sup>00</sup></p>
          </section>
        </main>}
        {tab === 1 && <main className={step}>
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
          <PassengerForm onUsrDataSubmit={onUsrDataSubmit}/>
          {!!flight.origin && <PurchaseConfirmation />}
        </main>}
      </div>
  );
}

export default App;
