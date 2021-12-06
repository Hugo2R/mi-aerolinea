const initState = {
  origin: {id: ''},
  destination: {id: ''},
  passengers: [1, 0, 0]
}

export default function flightsReducer(state = initState, action) {
  switch (action.type) {
    case 'searchForm/setOrigin': {
      return { ...state, origin: action.city }
    }
    case 'searchForm/setDestination': {
      return { ...state, destination: action.city }
    }
    case 'searchForm/setPassengers': {
      return { ...state, passengers: action.passengers }
    }
    case 'searchForm/resetForm': {
      return { ...initState }
    }
    default:
      return state
  }
}

export function setOrigin(city) {
  return{ type: 'searchForm/setOrigin', city }
}

export function setDestination(city) {
  return{ type: 'searchForm/setDestination', city }
}

export function setPassengers(passengers) {
  return{ type: 'searchForm/setPassengers', passengers }
}

export function resetSearchForm() {
  return{ type: 'searchForm/resetForm' }
}
