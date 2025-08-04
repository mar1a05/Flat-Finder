import React, { useState } from 'react'
import api from './api';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('');
    const token = useParams();
    const navigate = useNavigate();
    console.log(token);

    const handleResetPassword = async(e) => {
        e.preventDefault();

        try{
          const response = await api.post(`/resetPassword/${token.resetToken}`, {
            password: newPassword
          })  

          console.log(response)

          if(response.status == 200) {
            navigate("/login");         
          }

        }catch(e){
            console.error("Error resetting password", e);
        }

    }

  return (
    <div>
        <input type='text' value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
        <button onClick={handleResetPassword}>Reset password</button>
    </div>
  )
}

export default ResetPasswordForm