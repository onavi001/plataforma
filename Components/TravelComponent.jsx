import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InformationComponent from "./InformationComponent";
import {
    GoogleMap,
    useLoadScript,
    Polyline
} from "@react-google-maps/api";
import { makeStyles } from '@material-ui/styles';
const TravelComponent = ({data}) => {
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
    const onLoad = polyline => {
        console.log('polyline: ', polyline)
    };
    const path = [
        {lat:20.6432814,lng:-103.43288},
        {lat:20.6442914,lng:-103.43288},
        {lat:20.6442914,lng:-103.43488},
        {lat:20.6432814,lng:-103.44288},
    ];
    const options = {
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        fillColor: '#000000',
        fillOpacity: 0.35,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        paths: [
            {lat:20.6432814,lng:-103.43288},
            {lat:20.6442914,lng:-103.43288},
            {lat:20.6442914,lng:-103.43488},
            {lat:20.6432814,lng:-103.44288},
        ],
        zIndex: 1
    };
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
                        zoom={15}
                        center={centerMap}
                        version="weekly"
                        on
                    >
                    <Polyline
                        onLoad={onLoad}
                        path={path}
                        options={options}
                    />
                </GoogleMap>
            </div>
        );
    };
    return isLoaded ? renderMap():null;
}
export default TravelComponent;