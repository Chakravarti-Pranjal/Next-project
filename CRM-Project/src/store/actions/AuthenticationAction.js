export const loginAction = (data) => {
  return {
    type: "LOGIN-USER",
    payload: data,
  };
};

export const logoutAction = () => {
  return {
    type: "LOG-OUT-USER",
  };
};
