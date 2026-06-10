export interface SetAction {
  type: "SET";
}

const darkModeReducer = (state: boolean, action: SetAction): boolean => {
  switch (action.type) {
    case "SET":
      return !state;
    default:
      return state;
  }
};

export default darkModeReducer;
