import { useDispatch, useSelector } from 'react-redux'
import { setFlight } from './reducers/flightsSlice'

const faresMapper = (f, id, dispatch) => 
	<td
		key={f.type}
		onClick={() => dispatch(setFlight({...f, id}))}
		className={ f.active ? 'active' : ''}>
		{`$${f.fare}.`}<sup>00</sup>
	</td>

const flightsMapper = (fl, dispatch) =>
	<tr key={fl.id}>
		<th>{`${fl.sTime} ⎯⎯ ▪︎ ⎯⎯ ${fl.eTime}`}</th>
		{fl.fares.map(fr => faresMapper(fr, fl.id, dispatch))}
	 </tr>

function FaresTable({onClickFare}) {
	const flights = useSelector(store => store.flights.fares)
	const dispatch = useDispatch()

	return (
    <table>
      <thead>
        <tr><th></th><th>Turista</th><th>Ejecutiva</th><th>Primera</th></tr>
      </thead>
      <tbody>
        {flights.map((f) => flightsMapper(f, dispatch))}
      </tbody>
    </table>)
}

export default FaresTable
