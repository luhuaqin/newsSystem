import { createStore, combineReducers } from "redux"
import { LoadingReducer } from "./reducers/LoadingReducer"

const reducer = combineReducers({
  LoadingReducer
})
// const reducer = (prevState={isLoading: false}, action) => {
//   const newState = { ...prevState }
//   switch(action) {
//     case 'change-loading':
//       newState.isLoading = !newState.isLoading
//       return newState
//     default:
//       return prevState
//   }
// }

const store = createStore(reducer)

export default store
