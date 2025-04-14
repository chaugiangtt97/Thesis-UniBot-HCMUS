import * as React from 'react';
// import {
//   randomColor,
//   randomEmail,
//   randomInt,
//   randomName,
//   randomArrayItem,
//   random,
// } from '@mui/x-data-grid-generator';
import { DataGrid, gridStringOrNumberComparator, useGridApiRef } from '@mui/x-data-grid';
// import { renderAvatar } from './cell-renderers/avatar';
// import { renderEmail } from './cell-renderers/email';
// import { renderEditRating, renderRating } from './cell-renderers/rating';
// import {
//   COUNTRY_ISO_OPTIONS,
//   renderCountry,
//   renderEditCountry,
// } from './cell-renderers/country';
// import { renderSparkline } from './cell-renderers/sparkline';
// import { renderEditProgress, renderProgress } from './cell-renderers/progress';
// import {
//   renderEditStatus,
//   renderStatus,
//   STATUS_OPTIONS,
// } from './cell-renderers/status';
// import {
//   INCOTERM_OPTIONS,
//   renderEditIncoterm,
//   renderIncoterm,
// } from './cell-renderers/incoterm';

// function mockData(params = 10) {
//   const columns = [
//   {
//     field: 'name',
//     headerName: 'Name',
//     width: 120,    
//     headerClassName: 'app-theme--table-header',
//     editable: true,
//   },
//   {
//     field: 'avatar',
//     headerName: 'Avatar',
//     display: 'flex',
//     headerClassName: 'app-theme--table-header',
//     renderCell: renderAvatar,
//     valueGetter: (value, row) =>
//       row.name == null || row.avatar == null
//         ? null
//         : { name: row.name, color: row.avatar },
//     sortable: false,
//     filterable: false,
//   },
//   {
//     field: 'email',
//     headerName: 'Email',
//     renderCell: renderEmail,
//     width: 150,
//     headerClassName: 'app-theme--table-header',
//     editable: true,
//   },
//   {
//     field: 'rating',
//     headerName: 'Rating',
//     display: 'flex',
//     renderCell: renderRating,
//     renderEditCell: renderEditRating,
//     width: 180,
//     type: 'number',
//     headerClassName: 'app-theme--table-header',
//     editable: true,
//     availableAggregationFunctions: ['avg', 'min', 'max', 'size'],
//   },
//   {
//     field: 'country',
//     headerClassName: 'app-theme--table-header',
//     headerName: 'Country',
//     type: 'singleSelect',
//     valueOptions: COUNTRY_ISO_OPTIONS,
//     valueFormatter: (value) => value?.label,
//     renderCell: renderCountry,
//     renderEditCell: renderEditCountry,
//     sortComparator: (v1, v2, param1, param2) =>
//       gridStringOrNumberComparator(v1.label, v2.label, param1, param2),
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'salary',
//     headerName: 'Salary',
//     type: 'number',
//     headerClassName: 'app-theme--table-header',
//     valueFormatter: (value) => {
//       if (!value || typeof value !== 'number') {
//         return value;
//       }
//       return `$${value.toLocaleString()}`;
//     },
//     editable: true,
//   },
//   {
//     field: 'monthlyActivity',
//     headerName: 'Monthly activity',
//     type: 'custom',
//     headerClassName: 'app-theme--table-header',
//     resizable: false,
//     filterable: false,
//     sortable: false,
//     editable: false,
//     groupable: false,
//     display: 'flex',
//     renderCell: renderSparkline,
//     width: 150,
//     valueGetter: (value, row) => row.monthlyActivity,
//   },
//   {
//     field: 'budget',
//     headerClassName: 'app-theme--table-header',
//     headerName: 'Budget left',
//     renderCell: renderProgress,
//     renderEditCell: renderEditProgress,
//     availableAggregationFunctions: ['min', 'max', 'avg', 'size'],
//     type: 'number',
//     width: 120,
//     editable: true,
//   },
//   {
//     field: 'status',
//     headerClassName: 'app-theme--table-header',
//     headerName: 'Status',
//     renderCell: renderStatus,
//     renderEditCell: renderEditStatus,
//     type: 'singleSelect',
//     valueOptions: STATUS_OPTIONS,
//     width: 150,
//     editable: true,
//   },
//   {
//     field: 'incoTerm',
//     headerClassName: 'app-theme--table-header',
//     headerName: 'Incoterm',
//     renderCell: renderIncoterm,
//     renderEditCell: renderEditIncoterm,
//     type: 'singleSelect',
//     valueOptions: INCOTERM_OPTIONS,
//     editable: true,
//   },
//   ];

//   const rows = Array.from({ length: params }, (_, index) => ({
//     id: index,
//     name: randomName({}, {}),
//     avatar: randomColor(),
//     email: randomEmail(),
//     rating: randomInt(1, 5),
//     country: randomArrayItem(COUNTRY_ISO_OPTIONS),
//     salary: randomInt(35000, 80000),
//     monthlyActivity: Array.from({ length: 30 }, () => randomInt(1, 25)),
//     budget: random(0, 1).toPrecision(),
//     status: randomArrayItem(STATUS_OPTIONS),
//     incoTerm: randomArrayItem(INCOTERM_OPTIONS),
//   }));

//   return { columns,  rows}
// }

export default function MuiTable({ useData, getRowHeight, rowHeight, onRowClick, loading = false }) {
  const apiRef = useGridApiRef();
  const data = useData ? useData : mockData(30);
  return (
      <DataGrid
        apiRef={apiRef}
        // checkboxSelection
        density="compact"
        getRowHeight = {getRowHeight}
        {...data}
        rowHeight  = {rowHeight}
        onRowClick = {onRowClick}
        pageSizeOptions={[10,20,  100]}
        loading = {loading}
        initialState={{
          ...data.initialState,
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        // pagination // Kích hoạt phân trang
        // autoPageSize

        
        sx = {{ 
          '--mui-palette-action-active' : '#000'
         }}
      />
  );
}