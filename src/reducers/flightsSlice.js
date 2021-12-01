const initState = {
  flight: {},
  fares: []
}

export default function flightsReducer(state = initState, action) {
  switch (action.type) {
    case 'flights/loaded': {
      return { ...state, fares: action.payload }
    }
    case 'flights/selectedFlight':
      return { ...state, flight: action.flight }
    default:
      return state
  }
}

export async function fetchFlights(dispatch, getState) {
  const resp = await fetch('http://localhost:3006/flights')
  let data = []
  if (resp.ok) {
    data = await resp.json()
  }
  dispatch({ type: 'flights/loaded', payload: data })
}

export function setFlight(flight) {
  return{ type: 'flights/selectedFlight', flight }
}
