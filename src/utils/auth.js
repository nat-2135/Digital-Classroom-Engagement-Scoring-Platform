export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
  sessionStorage.clear();
  window.location.href = '/login';
};
