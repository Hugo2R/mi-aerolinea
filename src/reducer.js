import citiesReducer from './reducers/citiesSlice'
import flightsReducer from './reducers/flightsSlice'
import searchFormReducer from './reducers/searchFormSlice'

export default function rootReducer(state = {}, action) {
  return {
    cities: citiesReducer(state.cities, action),
    flights: flightsReducer(state.flights, action),
    searchForm: searchFormReducer(state.searchForm, action)
  }
}
