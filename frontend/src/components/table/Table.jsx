import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const Table = ({ columns, rows }) => { 
  return (
        <DataGrid 
          rows={rows}
          columns={columns}
          checkboxSelection={false}
          disableSelectionOnClick
          initialState={{
            pagination: {
                paginationModel: { pageSize: 10 }
            }
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          slots={{
            toolbar: GridToolbar
          }}
          getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'bg-white' : 'bg-gray-100')}
          sx={{
            minHeight: '400px',
            border: '1px solid',
            borderRadius: '8px',
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#f18',
              color: '#000',
              fontSize: '1rem',
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-cell': {
              padding: '0.5rem',
              fontSize: '1rem',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#F7FAFC',
              },
            },
            '& .MuiDataGrid-toolbarContainer': {
              backgroundColor: '#000',
              color: '#FFFFFF',
              borderRadius: '8px 8px 0 0',
            }
          }}
        />
  );
};

export default Table;
