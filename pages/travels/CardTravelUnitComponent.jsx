import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { FaDesktop, FaGasPump, FaMapMarkerAlt, FaThermometerFull, FaThermometerEmpty, FaRoute } from 'react-icons/fa';
import Grid from "@material-ui/core/Grid";
import MouseOverPopover from "../../Components/MouseOverPopover";
import InformationComponent from "../../Components/InformationComponent";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Collapse from '@mui/material/Collapse';
import CardActions from '@mui/material/CardActions';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CardHeader from '@mui/material/CardHeader';
//import "../style/table.scss";
import IconButton from '@mui/material/IconButton';
const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));
export default function CardTravelComponent({name,classHeader,vehicle,data}) {
    console.log(vehicle.data)
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Card sx={{ maxWidth: 450, minWidth: 200 }} style={{maxWidth: "450px", minWidth: "200px",boxShadow:'0 0 0 0 rgb(0 0 0 / 20%), 2px 2px 2px 2px rgb(0 0 0 / 14%), 0 0 0 2px rgb(0 0 0 / 12%)'}}>
            <CardHeader
                title={<b style={{fontSize: "1.2rem"}}>{vehicle.name}</b>}
                className={vehicle.classHeader}
                action={
                    <ExpandMore
                        style={{margin: "8px 8px 0 -8px", backgroundColor:"transparent"}}
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                }
            />
            {
                <Collapse in={!expanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{ flex: '1 0 auto' }}  className='unitBodyTravel' >
                        <TableContainer component={Paper} >
                            <Table className={ vehicle.data.classBody} size="small" aria-label="a dense table">
                                <TableBody>
                                {
                                    (vehicle.data.filter((element,index)=> index < 2)).map(field => (
                                        <TableRow key={field.prop}>
                                            <TableCell component="th" scope="row">{field.fileName}</TableCell>
                                            <TableCell align="left">{field.value}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Collapse>
            }
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent sx={{ flex: '1 0 auto' }}  className='unitBodyTravel' >
                        <TableContainer component={Paper} >
                            <Table className={ vehicle.data.classBody} size="small" aria-label="a dense table">
                                <TableBody>
                                {
                                    vehicle.data.map(field => (
                                        <TableRow key={field.prop}>
                                            <TableCell component="th" scope="row">{field.fileName}</TableCell>
                                            <TableCell align="left">{field.value}</TableCell>
                                        </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Collapse>
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