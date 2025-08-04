/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

const StyledDataGrid = styled(DataGrid)({
    '& .MuiDataGrid-cell:focus': {
      outline: 'none', 
    },
    '& .MuiDataGrid-cell:hover': {
      backgroundColor: 'transparent', 
    },
  });

function UsersTable({rows}) {

    const {user} = useAuth();
    
    
      const columns = [
        { field: 'email', headerName: 'Email', width: 150 },
        { field: 'firstName', headerName: 'First Name', width: 200 },
        { field: 'lastName', headerName: 'Last Name', width: 150 },
        { field: 'birthDate', headerName: 'Age', width: 150,
          renderCell: (params) => {
            const dob = new Date(params.value);
            const age = new Date().getFullYear() - dob.getFullYear();
            const monthDifference = new Date().getMonth() - dob.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && new Date().getDate() < dob.getDate())) {
              return age - 1;
            }
            
            return age;
          }
         },
        { field: 'isAdmin', headerName: 'is Admin', width: 150, renderCell: (params) => {
          return params.value ? 'Yes' : 'No';
        } },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 400,
          sortable: false,
          renderCell: (params) => (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="contained"
                color="default"
                size="small"
                onClick={() => handleButtonClick(params.row, 'makeAdmin')}>Make Admin</Button>
      
              <Button
                variant="contained"
                color="default"
                size="small"
                onClick={() => handleButtonClick(params.row, 'delete')}>Delete user</Button>
      
              <Button
                variant="contained"
                color="default"
                size="small"
                onClick={() => handleButtonClick(params.row, 'edit')}>Edit profile</Button>
            </div>
          ),
        },
      ];
      
      const navigate = useNavigate();
    
      const handleDeleteUser = async(userID) => {

          // const deleteUser = async () => {
          //   await deleteDoc(doc(db, "users", String(userID)));
          // }

          await api.delete("/users/deleteUser", {
            ID: userID
          }, {
            headers: {
              Authorization: `bearer ${user.data.activeToken}`
            }
          })
      
        // deleteUser();

      }

      const handleMakeAdmin = async (row) => {
        // const makeAdmin = async () => {
        //   const userRef = doc(db, 'users', String(userID));
        //   await updateDoc(userRef, {
        //     role: "admin"
        //   });
        // }
        console.log(row.id, row.isAdmin);
        await api.patch("/users/updateUser", {
          ID: row.id, 
          userData: {isAdmin: !row.isAdmin}
        }, {
          headers: {
            Authorization: `bearer ${user.data.activeToken}`
          }
        })

        // makeAdmin();

      }
    
      const handleButtonClick = (row, actionType) => {
        console.log(`Button clicked for row ${row.id}, Action: ${actionType}`);
        if(actionType == "makeAdmin"){
          handleMakeAdmin(row);
        }
    
        
    
        if(actionType == "edit"){
          navigate(`/homepage/edit-user/${row.id}`, 
            {state: { row }
            });
        }

        if(actionType == "delete"){
          handleDeleteUser(row.id);
        }
      };
    
      const style = {
        height: 400, 
        width: '80%',
        backgroundColor: "transparent",
      }
    
      return (
        <div style={style}>
          <StyledDataGrid rows={rows} columns={columns} pageSize={5} disableRowSelectionOnClick={true} />
        </div>
      );
    }

export default UsersTable
