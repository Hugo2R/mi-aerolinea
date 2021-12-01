const initState = []

export default function citiesReducer(state = initState, action) {
  switch (action.type) {
    case 'cities/loaded': {
      return action.payload
    }
    default:
      return state
  }
}

export async function fetchCities(dispatch, getState) {
  const resp = await fetch('http://localhost:3006/cities')
  let data = []
  if (resp.ok) {
    data = await resp.json()
  }
  dispatch({ type: 'cities/loaded', payload: data })
}
