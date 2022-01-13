import React, {useEffect} from 'react';
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarExport  } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

import { esES, enUS } from '@mui/x-data-grid';
import { useSelector } from 'react-redux'
function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(0.5, 0.5, 0),
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    textField: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
      margin: theme.spacing(1, 0.5, 1.5),
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5),
      },
      '& .MuiInput-underline:before': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  }),
  { defaultTheme },
);
function QuickSearchToolbar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <GridToolbarDensitySelector size="large" />
        <GridToolbarFilterButton size="large" />
        {props.exportPermission?<GridToolbarExport size="large" />:null}
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        className={classes.textField}
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  exportPermission: PropTypes.bool.isRequired,
};
const TableComponent = ({
  rows=[],
  columns=[],
  handleEditCellChangeCommitted,
  selectionModel,
  setSelectionModel,
  classGridComponent,
  checkboxSelectionOption=true,
  exportPermission=true,
  isCellEditableFlag}) => {
  const userLanguage = useSelector(state => state.usuario.userLanguage);
  const [searchText, setSearchText] = React.useState('');
  const [rowsGrid, setRowsGrid] = React.useState(rows);
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = rows.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRowsGrid(filteredRows);
  };
  React.useEffect(() => {
    setRowsGrid(rows);
  }, [rows]);
  const [pageSize, setPageSize] = React.useState(20);
  useEffect(() => {
    console.log(enUS.components)
  }, [])
  return (
      <div style={{ height: '100%', /*width:"auto", maxWidth:"1400px" */}} className={classGridComponent}  >
      {
        isCellEditableFlag?
          <DataGrid
            className="MuiDataGrid-columnHeader--alignCenter DataGridTableIntralix"
            disableSelectionOnClick
            onCellEditCommit={ (cellData) => handleEditCellChangeCommitted(cellData) }//me ayuda a ver los cambios de la celda ya cuando dieron click
            showColumnRightBorder={false}
            rows={rowsGrid}
            columns={columns}
            checkboxSelection={checkboxSelectionOption}
            rowHeight={35}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[20, 50, 100]}
            pagination
            density="standard"
            components={{ Toolbar: QuickSearchToolbar, }}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(''),
                exportPermission: exportPermission
              },
            }}
            onSelectionModelChange={(newSelection) => {
              setSelectionModel(newSelection);
            }}
            selectionModel={ selectionModel ? selectionModel : [] }
            autoHeight={true}
            localeText={ userLanguage === 'es' ? esES.components.MuiDataGrid.localeText : (userLanguage === 'en' ? enUS.components.MuiDataGrid.localeText : esES.components.MuiDataGrid.localeText ) }
            isCellEditable={isCellEditableFlag}
          />
        :
          <DataGrid
            className="MuiDataGrid-columnHeader--alignCenter DataGridTableIntralix"
            disableSelectionOnClick
            onCellEditCommit={ (cellData) => handleEditCellChangeCommitted(cellData) }//me ayuda a ver los cambios de la celda ya cuando dieron click
            showColumnRightBorder={false}
            rows={rowsGrid}
            columns={columns}
            checkboxSelection={checkboxSelectionOption}
            rowHeight={35}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[20, 50, 100]}
            pagination
            density="standard"
            components={{ Toolbar: QuickSearchToolbar, }}
            componentsProps={{
              toolbar: {
                value: searchText,
                onChange: (event) => requestSearch(event.target.value),
                clearSearch: () => requestSearch(''),
                exportPermission: exportPermission
              },
            }}
            onSelectionModelChange={(newSelection) => {
              setSelectionModel(newSelection);
            }}
            selectionModel={ selectionModel ? selectionModel : [] }
            autoHeight={true}
            localeText={ userLanguage === 'es' ? esES.components.MuiDataGrid.localeText : (userLanguage === 'en' ? enUS.components.MuiDataGrid.localeText : esES.components.MuiDataGrid.localeText ) }
          />
      }
      </div>
    );
}
export default TableComponent;