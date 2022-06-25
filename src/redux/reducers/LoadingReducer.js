export const LoadingReducer = (prevState={ isLoading: false}, action) => {
  const newState = { ...prevState }
  switch(action.type) {
    case 'change-loading':
      newState.isLoading = action.payload
      return newState
    default:
      return prevState
  }
}
