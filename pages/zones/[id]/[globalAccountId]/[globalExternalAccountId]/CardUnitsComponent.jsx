import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FaDesktop, FaGasPump, FaMapMarkerAlt, FaThermometerFull, FaThermometerEmpty, FaRoute } from 'react-icons/fa';
import Grid from "@material-ui/core/Grid";
import MouseOverPopover from "../../../../../Components/MouseOverPopover";
export default function CardUnitsComponent({name,classHeader,vehicle}) {
    return (
        <Card sx={{ maxWidth: 300, minWidth: 200 }} style={{boxShadow:'0 0 0 0 rgb(0 0 0 / 20%), 2px 2px 2px 2px rgb(0 0 0 / 14%), 0 0 0 2px rgb(0 0 0 / 12%)'}}>
            <CardContent sx={{ flex: '1 0 auto' }} className={vehicle.classHeader} >
                    <Typography component="div" >
                        <b>{vehicle.name}</b>
                    </Typography>
            </CardContent>
            <CardContent style={{padding: "0",textAlign: "-webkit-center"}}>
                <Typography component="div" >
                        T. Detenida {vehicle.timeStop} Hrs.
                </Typography>
                <Typography component="div" >
                        Ultima posición {vehicle.lastPosition} Hrs.
                </Typography>
            </CardContent>
            <CardContent style={{padding: "5px"}}>
                <Grid container spacing={2} >
                    <Grid item md style={{alignSelf: "center"}} >
                        <MouseOverPopover
                            text={(<FaDesktop onClick={(e)=>vehicle.actionShow(e,vehicle.vehicleId,1)} style={{cursor: "pointer", fontSize:'1.3rem', marginLeft: "2px"}} />)}
                            hoverText='Ver unidad'
                        />
                    </Grid>
                    <Grid item md style={{alignSelf: "center"}} >
                        <MouseOverPopover
                            text={(<FaGasPump onClick={(e)=>vehicle.actionShow(e,vehicle.vehicleId,2)} style={{cursor: "pointer", fontSize:'1.3rem', marginLeft: "2px"}} />)}
                            hoverText='Combustible'
                        />
                    </Grid>
                    <Grid item md style={{alignSelf: "center"}} >
                        <MouseOverPopover
                            text={(<FaMapMarkerAlt onClick={(e)=>vehicle.actionShow(e,vehicle.vehicleId,3)} style={{cursor: "pointer", fontSize:'1.3rem',color: "#ed1c25", marginLeft: "2px"}} />)}
                            hoverText='Ultima posición'
                        />
                    </Grid>
                    <Grid item md style={{alignSelf: "center"}} >
                        <MouseOverPopover
                            text={(
                                <div onClick={(e)=>vehicle.actionShow(e,vehicle.vehicleId,4)} style={{display: "inline-flex"}}>
                                    <FaThermometerEmpty style={{cursor: "pointer", fontSize:'1.3rem',color:'#037fe2', marginRight: "-4px"}} />
                                    <FaThermometerFull style={{cursor: "pointer", fontSize:'1.3rem',color:'#fd0202', marginLeft: "-4px"}} />
                                </div>
                            )}
                            hoverText='Temperatura'
                        />
                    </Grid>
                    <Grid item md style={{alignSelf: "center"}} >
                        <MouseOverPopover
                            text={(<FaRoute onClick={(e)=>vehicle.actionShow(e,vehicle.vehicleId,5)} style={{cursor: "pointer", fontSize:'1.3rem', marginRight: "2px"}} />)}
                            hoverText='Mi viaje'
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}