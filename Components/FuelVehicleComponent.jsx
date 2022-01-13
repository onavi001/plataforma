import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InformationComponent from "./InformationComponent";
import {
    GoogleMap,
    useLoadScript,
    Circle,
    Marker,
} from "@react-google-maps/api";
import { makeStyles } from '@material-ui/styles';
import fuelpumpicon from '../public/img/fuelpumpicon.png';
const FuelVehicleComponent = ({data}) => {
    return (
        <Card
            sx={{ maxWidth: 550, minWidth: 200, marginTop:'5px' }}
            //style={{boxShadow:'0 0 0 0 rgb(0 0 0 / 20%), 2px 2px 2px 2px rgb(0 0 0 / 14%), 0 0 0 2px rgb(0 0 0 / 12%)'}}
            style={{boxShadow: "0px 2px 1px -1px"}}
            >
            <CardContent style={{padding: "0px"}}>
                <InformationComponent data={data} />
                <MapComponent data={data} />
            </CardContent>
        </Card>
    )
}
const useStyles = makeStyles({
    mapCard: {
        textAlign: "center",
        height: "315px",
        width: "700px",
    },
});
const MapComponent = ({centerMap={lat:20.6432814,lng:-103.43288},data}) => {
    //20.6432814,-103.43288/
    const classes = useStyles();
    const { isLoaded,loadError } = useLoadScript({
        // Enter your own Google Maps API key
        googleMapsApiKey: "AIzaSyDFIoiT3cP8ZzKanEQrhm3MWr1-tZT5Erw",
        //googleMapsApiKey:'',
        language:"es",
        region:"us",
    });
    if (loadError) return "Error loading Maps";
    if (!isLoaded) return "Loading Maps";
    const renderMap = () => {
        return (
            <div className={classes.mapCard}>
                <GoogleMap
                        options={{
                            streetViewControl: true,
                            fullscreenControl: true,
                            mapTypeControl: true,
                        }}
                        mapContainerClassName="App-map"
                        center={centerMap}
                        zoom={15}
                        version="weekly"
                        on
                    >
                    <Marker
                        //onLoad={onLoad}
                        icon={ data.length > 0 ? fuelpumpicon : null }
                        position={centerMap}
                    />
                </GoogleMap>
            </div>
        );
    };
    return isLoaded ? renderMap():null;
}
export default FuelVehicleComponent;