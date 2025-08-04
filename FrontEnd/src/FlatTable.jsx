/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */


import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useAuth } from './hooks/useAuth';
import api from './api';
import { useEffect } from 'react';




const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:hover': {
    backgroundColor: 'transparent',
  },
});

export default function FlatTable({rows, setRows, where}) {
  const {user, fetchUser} = useAuth();


  const columns = [
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'streetName', headerName: 'Street Name', width: 200 },
    { field: 'streetNumber', headerName: 'Street Number', width: 150 },
    {
      field: 'action',
      headerName: 'Actions',
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="contained"
            color="default"
            size="small"
            onClick={() => handleButtonClick(params.row, 'edit')}>Edit</Button>
  
          <Button
            variant="contained"
            color="default"
            size="small"
            onClick={() => handleButtonClick(params.row, 'delete')}>Delete</Button>
  
          <Button
            variant="contained"
            color="default"
            size="small"
            onClick={() => handleButtonClick(params.row, 'details')}>Details</Button>

          <Button
          variant="contained"
          color="default"
          size="small"
          onClick={() => handleButtonClick(params.row, 'favourites')}>Favourite</Button>
        </div>
      ),
    },
  ];
  
  const navigate = useNavigate();

  const handleDeleteFlat = async(flatID) => {
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   const fetchFlatsData = async () => {
    //       if(user){
    //           const flatsColection = doc(db, 'users', user.uid);
    //           const flatDoc = await getDoc(flatsColection);
    //           if(flatDoc.exists()){
    //               const finalFlatData = flatDoc.data();
    //               const flatArr = finalFlatData.flats;
    //               const updatedFlatsList = flatArr.filter(flat => flat.id !== flatID);
    //               await updateDoc(flatsColection, {flats: updatedFlatsList});

    //               await deleteDoc(doc(db, "flats", String(flatID)));

    //           }
    //       }
    //   }
    //   fetchFlatsData();
    // })


    // console.log(flatID)

    try {
      await api.delete(`/deleteFlat/${flatID}`, {
        headers: {
          Authorization: `bearer ${user.data.activeToken}`,
        },
      });

      // Update local state din componenta părinte
      setRows(prev => prev.filter(row => row._id !== flatID));
    } catch (err) {
      console.error("Eroare la ștergere:", err);
    }

  }

  const handleFavourite = async(flatID) => {
    if(user){
      // const flatsColection = doc(db, 'users', user.uid);
      // const updatedFlats = flats.map(flat => flat.id == flatID ? {...flat, isFavourite: !flat.isFavourite} : flat);
      // return await updateDoc(flatsColection, {flats: updatedFlats});

      // console.log(user.data.flats);
      try {
        console.log(user.data.favouriteFlats);
        let updatedFavourites;

        const currentFavourites = (user.data.favouriteFlats != undefined) ? [...user.data.favouriteFlats] : [];
        const isFavourite = currentFavourites.includes(flatID);

        console.log(currentFavourites);
        if (isFavourite) {
          
          updatedFavourites = currentFavourites.filter(id => id.toString() != flatID.toString());
          console.log(updatedFavourites);
        } else {
          updatedFavourites = [...currentFavourites, flatID];
        }

        let newUserData = {favouriteFlats: updatedFavourites}
    
        const response = await api.patch("/users/update", {
          userData: newUserData,
          password: "add favourite"
        }, {
          headers: {
            Authorization: `bearer ${user.data.activeToken}`,
          }
        });
    
        // opțional: update local
        console.log("Favourites actualizat:", response.data);
        fetchUser(); // dacă ai user în state local
        if(where == "favourites"){
          setRows(updatedFavourites);
        }
      } catch (error) {
        console.error("Eroare la toggle favourite:", error);
      }

    }

  }

  const handleButtonClick = (row, actionType) => {
    console.log(`Button clicked for row ${row.id}, Action: ${actionType}`);
    if(actionType == "details"){
      navigate(`/homepage/my-flats/${row._id}`, 
      {state: { row }
      });
    }

    if(actionType == "delete"){
      handleDeleteFlat(row.id);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }

    if(actionType == "edit"){
      navigate(`/homepage/edit-flat/${row._id}`, 
        {state: { row }
        });
    }

    if(actionType == "favourites"){
      handleFavourite(row._id);

      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
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




