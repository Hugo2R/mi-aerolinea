import { useState } from 'react'

function PassengerForm({onUsrDataSubmit}) {

	let initData = {
		firstName: '',
		lastName: '',
		address: '',
		email: ''
	}

	const [form, setForm] = useState(initData)

	const onChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const onSubmit = e => {
		e.preventDefault()
		if (onUsrDataSubmit) onUsrDataSubmit()
		setForm(initData)
	}

	const submitDisabled = !form.firstName || !form.lastName || !form.address || !form.email

	return (
		<section>
			<form onSubmit={onSubmit} style={{maxWidth: '800px', margin: 'auto'}}>
				<label><span>Nombres</span>
					<input name="firstName" onChange={onChange} value={form.firstName} type="text" />
				</label>
				<label><span>Apellidos</span>
					<input name="lastName" onChange={onChange} value={form.lastName} type="text" />
				</label>
				<label><span>Dirección</span>
					<input name="address" onChange={onChange} value={form.address} type="text" />
				</label>
				<label><span>Correo Electrónico</span>
					<input name="email" onChange={onChange} value={form.email} type="text" />
				</label>
				<button disabled={submitDisabled} type="submit">Comprar</button>
			</form>
		</section>
	)
	
}

export default PassengerForm
