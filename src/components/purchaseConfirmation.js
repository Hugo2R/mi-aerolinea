import { useSelector } from 'react-redux'

function PurchaseConfirmation() {
  const flight = useSelector(store => store.flights.flight)
  const passengers = useSelector(store => store.searchForm.passengers)
  const totalPssngr =  passengers.reduce((a,v)=>a+v,0)

	return (
		<section style={{textAlign: 'center'}}>
			<h2>¡Felicidades!</h2>
			<p>Su compra se realizó exitosamente</p>
      <p>{`${flight.origin.name} - ${flight.destination.name}`}</p>
      <p>{`Vuelo: ${flight.id} / Categoría:  ${flight.type}`}</p>
      <p>{`$${flight.fare}.00 x ${totalPssngr} pasajero${totalPssngr>1?'s':''}`}</p>
      <p style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{`Total: $${flight.fare * totalPssngr}.`}<sup>00</sup></p>
		</section>
	)
}

export default PurchaseConfirmation
