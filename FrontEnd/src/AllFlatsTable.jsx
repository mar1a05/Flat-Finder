/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';




const StyledDataGrid = styled(DataGrid)({
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:hover': {
    backgroundColor: 'transparent',
  },
});

export default function AllFlatsTable({rows}) {
  // const {user, flats} = useAuth();
  console.log(rows);

  const columns = [
    { field: 'city', headerName: 'City', width: 200 },
    { field: 'streetName', headerName: 'Street Name', width: 250 },
    { field: 'streetNumber', headerName: 'Street Number', width: 150 },
    { field: 'createdBy', headerName: 'Owner', width: 250, valueGetter: (params) => params.email},
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
            onClick={() => handleButtonClick(params.row, 'details')}>Details</Button>

        </div>
      )
    },
  ];
  
  const navigate = useNavigate();

  const handleButtonClick = (row, actionType) => {
    console.log(row);
    console.log(`Button clicked for row ${row.id}, Action: ${actionType}`);
    if(actionType == "details"){
      navigate(`/homepage/flats/${row.id}`, 
      {state: { row }
      });
    }

    if(actionType == "edit"){
      navigate(`/homepage/edit-flat/${row.id}`, 
        {state: { row }
        });
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




