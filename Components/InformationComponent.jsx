import React from 'react';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const useStyles = makeStyles({
    table: {
        minWidth: 0,
    },
});

const InformationComponent = ({data,classBody}) => {
    const classes = useStyles();
    return (
        <div style={{ }}>
            <TableContainer component={Paper} >
                <Table className={classes.table + " " + classBody} size="small" aria-label="a dense table">
                    <TableBody>
                    {
                        data.map(field => (
                            <TableRow key={field.prop}>
                                <TableCell component="th" scope="row">{field.fileName}</TableCell>
                                <TableCell align="left">{field.value}</TableCell>
                            </TableRow>
                        ))
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
export default InformationComponent;