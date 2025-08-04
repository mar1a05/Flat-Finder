
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './Register';
import LoginForm from './Login';
import HomePage from './Homepage';
import AddFlats from './AddFlats';
import MyFlats from './MyFlats';
import FlatDetails from './FlatDetails';
import MyProfile from './MyProfile';
import EditFlat from './EditFlat';
import AllFlats from './AllFlats';
import Favourites from './Favourites';
import ResetPasswordForm from './ResetPasswordForm';
import AdminRoute from './admin/AdminRoute';
import AllUsers from './admin/AllUsers';
import EditUser from './admin/EditUser';
import { AuthProvider } from './hooks/useAuth';


function App() {
  return (
    <AuthProvider>
      <Router>
      <Routes>
        <Route path='/' element={<LoginForm/>}></Route>
        <Route path='/register' element={<RegisterForm/>}></Route>
        <Route path='/login' element={<LoginForm/>}></Route>
        <Route path='/resetPassword/:resetToken' element={<ResetPasswordForm/>}></Route>
        <Route path='/homepage' element={<HomePage/>}>
          <Route path='my-flats' element={<MyFlats/>}></Route>
          <Route path='profile' element={<MyProfile/>}></Route>
          <Route path='flats/:flatID' element={<FlatDetails/>}></Route>
          <Route path='my-flats/:flatID' element={<FlatDetails/>}></Route>
          <Route path='edit-flat/:flatID' element={<EditFlat/>}></Route>
          <Route path='all-flats' element={<AllFlats/>}></Route>
          <Route path='add-flats' element={<AddFlats/>}></Route>
          <Route path='favourites' element={<Favourites/>}></Route>
          <Route element={<AdminRoute/>}>
            <Route path='all-users' element={<AllUsers/>}></Route>
            <Route path="edit-user/:userID" element={<EditUser/>}></Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  </AuthProvider>
      
  )
}

export default App

//register login myflats header 
