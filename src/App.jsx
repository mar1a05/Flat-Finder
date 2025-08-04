import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Homepage from './Homepage';
import Products from './Products';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassowrd';
import UpdatePassword from './UpdatePassword';
import UpdateProfile from './UpdateProfile';
import DeleteProfile from './DeleteProfile';
import AllUsers from './AllUsers';
import ProductDetails from './ProductDetails';
import AddProduct from './AddProduct';
import { AuthProvider } from './contexts/AuthContext';
import EditProduct from './EditProduct';
import ReviewList from './ReviewList';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path='/update-password' element={<UpdatePassword/>}/>
          <Route path="/resetPassword/:token" element={<ResetPassword/>}/>
          <Route path='/update-profile' element={<UpdateProfile/>}/>
          <Route path='/delete-profile' element={<DeleteProfile/>}/>
          <Route path='/product/:id' element={<ProductDetails/>}/>
          <Route path='/add-product' element={<AddProduct/>}/>
          <Route path='/edit-product/:id' element={<EditProduct/>}/>
          <Route path='/reviews' element={<ReviewList/>}/>
          
          {/* Route for admin */}
          <Route path='/all-users' element={<AllUsers/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;