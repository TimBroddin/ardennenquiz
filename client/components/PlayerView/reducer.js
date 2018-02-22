const reducer = (state = { name: false, id: false }, action) => {
  switch(action.type) {
    case 'RESET': {
        return { name: false, id: false }
    }
    case 'SET_NAME': {
      return {
        ...state,
        name: action.name
      }
    }
    case 'SET_ID': {
      return {
        ...state,
        id: action.id
      }
    }
    default: {
      return state;
    }
  }
};

export default reducer;
