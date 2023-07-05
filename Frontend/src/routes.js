import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp/SignUp';
import Main from './pages/Main/main';


function ProtectedRoutes({ redirectTo }) {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
}

function MyRoutes() {
  return (
    <Routes>
      <Route path='/'>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<SignUp />} />
      </Route>

      <Route element={<ProtectedRoutes redirectTo={'/'} />}>
        <Route path='/main' element={<Main />} />
      </Route>

      <Route path='*' element={<h1>404 - Not found</h1>} />
    </Routes>
  )
};

export default MyRoutes;