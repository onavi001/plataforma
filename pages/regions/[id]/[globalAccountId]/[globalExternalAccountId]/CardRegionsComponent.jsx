import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FaEye } from 'react-icons/fa';
import Grid from "@material-ui/core/Grid";
export default function RecipeReviewCard({zoneRule,handleSeeZone}) {
    function createData(name, value, valueEx, color) {
        return { name, value, valueEx, color };
    }
    let maxUnitsColor='#fff';
    let timeBeforePitColor='#fff'
    let timeInPitColor='#fff'
    let timeAfterPitColor='#fff'
    if(zoneRule.maxUnitsCurrent > zoneRule.maxUnits){
        //se exedio
        maxUnitsColor='red'
    }else if(zoneRule.maxUnitsCurrent > zoneRule.maxUnits-5){
        //esta casi
        maxUnitsColor='orange'
    }else{
        //todo bien
        maxUnitsColor='green'
    }
    if(zoneRule.timeBeforePitCurrent > zoneRule.timeBeforePit){
        //se exedio
        timeBeforePitColor='red'
    }else if(zoneRule.timeBeforePitCurrent > zoneRule.timeBeforePit-5){
        //esta casi
        timeBeforePitColor='orange'
    }else{
        //todo bien
        timeBeforePitColor='green'
    }
    if(zoneRule.timeInPitCurrent > zoneRule.timeInPit){
        //se exedio
        timeInPitColor='red'
    }else if(zoneRule.timeInPitCurrent > zoneRule.timeInPit-5){
        //esta casi
        timeInPitColor='orange'
    }else{
        //todo bien
        timeInPitColor='green'
    }
    if(zoneRule.timeAfterPitCurrent > zoneRule.timeAfterPit){
        //se exedio
        timeAfterPitColor='red'
    }else if(zoneRule.timeAfterPitCurrent > zoneRule.timeAfterPit-5){
        //esta casi
        timeAfterPitColor='orange'
    }else{
        //todo bien
        timeAfterPitColor='green'
    }
    const rows = [
        createData('Remolques', zoneRule.maxUnitsCurrent, zoneRule.maxUnits, maxUnitsColor),//#FF0000
        createData('Antes de fosa', zoneRule.timeBeforePitCurrent, zoneRule.timeBeforePit, timeBeforePitColor),//#305496
        createData('En fosa', zoneRule.timeInPitCurrent, zoneRule.timeInPit, timeInPitColor),//#548235
        createData('Despues de fosa', zoneRule.timeAfterPitCurrent, zoneRule.timeAfterPit, timeAfterPitColor),//#C65911
    ];
    return (
        <Card sx={{ maxWidth: 350, minWidth: 220 }} style={{boxShadow:'0 0 0 0 rgb(0 0 0 / 20%), 2px 2px 2px 2px rgb(0 0 0 / 14%), 0 0 0 2px rgb(0 0 0 / 12%)'}}>
            <CardContent sx={{ flex: '1 0 auto' }} style={{padding: "0",textAlign: "-webkit-center", display:'flex'}}>
            <Grid container spacing={2} >
                <Grid item xs={9} md={9} >
                    <Typography component="div" >
                        <b>{zoneRule.alias}</b>
                    </Typography>
                </Grid>
                <Grid item xs={3} md={3} style={{alignSelf: "center"}} onClick={handleSeeZone}>
                    <FaEye style={{cursor: "pointer"}} />
                </Grid>
            </Grid>
            </CardContent>
            <CardContent style={{padding: "0",}}>
                <BasicTable rows={rows} />
            </CardContent>
        </Card>
    );
}
function BasicTable({rows}) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 220 }} aria-label="simple table">
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" style={{padding: "2px 0 2px 15px", borderRight: "1px solid rgba(224, 224, 224, 1)"}}>{row.name}</TableCell>
                            <TableCell align="center" style={{padding: "2px 10px", background:row.color, borderRight: "1px solid rgba(224, 224, 224, 1)"}}>{row.value}</TableCell>
                            <TableCell align="center" style={{padding: "2px 10px", background: "#305496", color:'#fff'}} >{row.valueEx}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}