import { useDispatch, useSelector } from 'react-redux'
import { setOrigin, setDestination, setPassengers } from '../reducers/searchFormSlice'

function SearchForm ({onSearchSubmit, onCityChange}) {
  const cities = useSelector(store => store.cities)
  const { origin, destination, passengers } = useSelector(store => store.searchForm)
  const dispatch = useDispatch()

  const citiesFilter = city => c => c.id !== city.id
  const citiesMapper = c => <option key={c.id} value={c.id}>{c.name}</option>

  const onPassengerChange = (index, event) => {
    const tmp = [...passengers]
    
    tmp[index] = parseInt(Number(event.target.value)) || 0

    const total = tmp.reduce((a, v) => a + v, 0)

    if (total < 10 && total > 0) {
      dispatch(setPassengers(tmp))
    }
  }

  const onSelectChange = (e, update) => {
    const [city] = cities.filter(c => c.id === e.target.value)
    dispatch(update(city))
    onCityChange(city)
  }

  const onSubmit = e => {
    e.preventDefault()
    onSearchSubmit()
  }


	return (
  <aside>
    <form onSubmit={onSubmit}>
      <label> <span>Origen</span>
        <select name="origin" placeholder="Selecciona una ciudad"
           onChange={e => {onSelectChange(e, setOrigin)}} value={origin.id} required>
          <option disabled hidden value="">Selecciona una ciudad</option>
          {cities.filter(citiesFilter(destination)).map(citiesMapper)}
        </select>
      </label>
      <label> <span>Destino</span>
        <select name="destination" placeholder="Selecciona una ciudad"
          onChange={e => {onSelectChange(e, setDestination)}} value={destination.id} required>
          <option disabled hidden value="">Selecciona una ciudad</option>
          {cities.filter(citiesFilter(origin)).map(citiesMapper)}
        </select>
      </label>
      <fieldset>
      <legend>Pasajeros</legend>
      <label><span>Adultos</span>
        <input type="number" min="0" max="9" value={passengers[0]}
        	onChange={e => onPassengerChange(0, e)} />
      </label>
      <label><span>Niños</span>
        <input type="number" min="0" max="9" value={passengers[1]}
        	onChange={e => onPassengerChange(1, e)} />
      </label>
      <label><span>Bebés</span>
        <input type="number" min="0" max="9" value={passengers[2]}
        	onChange={e => onPassengerChange(2, e)} />
      </label>
      </fieldset>
      <button type="submit">Buscar vuelos</button>
    </form>
  </aside>)
 }

export default SearchForm
