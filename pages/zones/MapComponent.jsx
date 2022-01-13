import React, {
    useState,
    useRef,
    useEffect
} from "react";
import {
    GoogleMap,
    DrawingManager,
    Polygon,
    useLoadScript,
    InfoWindow,
    Circle,
} from "@react-google-maps/api";
import * as geolib from 'geolib';
const PolygonComponent = ({path2,id,handleEditZone,color,editable,name,onAddPath,radius}) => {
    const [firstClick,setFirstClick] = useState(undefined)
	const [path, setPath] = useState(path2);
	const [centerPolygon] = useState(()=>{
		const centerNew = geolib.getCenter(path2);
		geolib.getCenter(path2)
		return {lat:centerNew.latitude,lng:centerNew.longitude}
	})
    const [showLabel,setShowLabel]=useState(false);
	const polygonRef = useRef(null);
	const listenersRef = useRef([]);
	const onEdit = (e) => {
		if (polygonRef.current) {
			const nextPath = polygonRef.current
				.getPath()
				.getArray()
				.map((latLng) => {
				return { lat: latLng.lat(), lng: latLng.lng() };
			});
            if(editable){
                if(e.latLng){
                    path.forEach((pa,key) => {
                        const pic = geolib.isPointWithinRadius(
                            {lat: e.latLng.lat(), lng: e.latLng.lng()},//si este
                            pa,//esta en este
                            radius//radio
                        );
                        if(pic){
                            if(!firstClick && firstClick !== 0){
                                setFirstClick(key)
                                setInterval(()=>{setFirstClick(undefined)}, 300);
                            }else{
                                if(key === firstClick){
                                    let tempPath = path.filter((path,key) => key !== firstClick)
                                    if(firstClick===0){
                                        tempPath.filter((path,key) => key !== tempPath.length-1)
                                    }
                                    handleEditZone(id,tempPath)
                                    setPath(tempPath);
                                    setFirstClick(undefined)
                                }else{
                                    setFirstClick(key)
                                    setInterval(()=>{setFirstClick(undefined)}, 300);
                                }
                            }
                        }
                    })
                }
                if(nextPath.length !== path.length){
                    handleEditZone(id,nextPath)
                    setPath(nextPath);
                }else{
                    let flahChangePaths = false;
                    for (let i = 0; i < nextPath.length; i++) {
                        if(nextPath[i].lat === path[i].lat && nextPath[i].lng === path[i].lng){
                        }else{
                            flahChangePaths = true;
                        }
                    }
                    if(flahChangePaths){
                        handleEditZone(id,nextPath)
                        setPath(nextPath);
                    }
                }
            }
		}
	};
	const onLoad =
		(polygon) => {
			polygonRef.current = polygon;
			const path = polygon.getPath();
			listenersRef.current.push(
				//path.addListener("set_at", onEdit),
				path.addListener("insert_at", onEdit),
				path.addListener("remove_at", onEdit)
			);
		}
	return(
        <>
        {
            path.length > 0 ?
                <>
                    <Polygon
                        onDblClick={onAddPath}
                        editable={editable}
                        //draggable={editable}
                        onMouseOver={()=>{setShowLabel(true)}}
                        onMouseOut={()=>{setShowLabel(false)}}
                        path={path}
                        onMouseUp={onEdit}
                        onDragEnd={onEdit}
                        onLoad={onLoad}
                        options={{
                            strokeColor: color,
                            fillColor: color,
                            geodesic: false,
                        }}
                        label='hola'
                        zIndex={editable ? 1 : -1 }
                    >
                    </Polygon>
                    {
                        name && name.length > 0 && showLabel?
                        <InfoWindow style={{backgroundColor: "transparent"}} position={centerPolygon} className='infoWindowPolygon'>
                            <div className='infoWindowPolygon' style={{backgroundColor:`${color}`,opacity:'0.8'}}>
                                <h5 style={{color: "white"}}>{name}</h5>
                            </div>
                        </InfoWindow>
                        :
                        null
                    }
                </>
            :
                null
        }
        </>
	)
}
const CirclesPolygonComponent = ({centers,zoom,removePath,radius}) => {
    let temp = 0.1;
    for (let i = zoom; i <= 22; i++) {
        temp = temp * 2;
    }
    const optionsCircle = {
        strokeColor: 'transparent',
        //strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: 'transparent',
        //fillOpacity: 1,
        //clickable: false,
        draggable: false,
        //editable: false,
        visible: true,
        radius,
        zIndex: 0
    }
    return (
        centers.map((center,key) => (
            <Circle
                key={key}
                onDblClick={e => removePath(e,key)}
                center={ center }
                // required
                options={optionsCircle}
            />
        ))
    )
}
const options = {
    drawingControl: false,
    drawingControlOptions: {
        //drawingModes: ["polygon"]
    },
    polygonOptions: {
        fillColor: `#2196F3`,
        strokeColor: `#2196F3`,
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1
    }
};

export default function MapComponent({
    arrayPath=[],
    setArrayPath,
    handleEditZone,
    initialCenter={ lat:23.3279444,lng:-102.8456578 },
    setInitialCenter,
    initialZoom,
    setCenterMap,
    centerMap
}) {
    const [ libraries ] = useState(['drawing']);
    const { isLoaded,loadError } = useLoadScript({
        // Enter your own Google Maps API key
        googleMapsApiKey: "AIzaSyDFIoiT3cP8ZzKanEQrhm3MWr1-tZT5Erw",
        //googleMapsApiKey:'',
        libraries:libraries,
        language:"es",
        region:"us",
    });
    const [zoomMap, setZoomMap] = useState(initialZoom)
    const onPolygonComplete = React.useCallback(
        function onPolygonComplete(poly) {
            const polyArray = poly.getPath().getArray();
            let paths = [];
            polyArray.forEach(function (path) {
                paths.push({
                    lat: path.lat(),
                    lng: path.lng()
                });
            });
        },
        []
    );
    const [comp,setComp]= useState([])
	const mapRef = useRef(null);
    const [firstCenter,setFirstCenter]=useState(undefined)
    const getRadius = React.useCallback(
        function(){
            let temp = 0.12;
            for (let i = zoomMap; i <= 22; i++) {
                temp = temp * 2;
            }
            return temp;
        },
        [zoomMap]
    )
    const checkToRemovePoint =  React.useCallback(
        function(path,point){
            let flagPoint = false;
            path.path.forEach(pa => {
                const pic = geolib.isPointWithinRadius(
                    point,//si este
                    pa,//esta en este
                    getRadius()//radio
                );
                if(pic)
                    flagPoint=true;
            });
            return flagPoint;
        },
        [getRadius]
    )
    const onAddPath = React.useCallback(
        function onAddPath(e){
            let flagEdit = false;
            arrayPath.forEach(element => {
                if(element.editable){
                    flagEdit = true;
                }
            });
            if(flagEdit){
                setArrayPath(arrayPath.map((path) => {
                    if(path.editable){
                        const flagPoint = checkToRemovePoint(path,{lat: e.latLng.lat(),lng: e.latLng.lng()});
                        if(!flagPoint){
                            path.path.push({
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng()
                            })
                        }
                    }
                    return path;
                }))
            }
        },
        [arrayPath, checkToRemovePoint, setArrayPath]
    );
	useEffect(() => {
		if (comp.length <= 0 && arrayPath.length > 0) {
            setComp(
                arrayPath.map((path,key) =>
                    <PolygonComponent
                        key={key}
                        onAddPath={onAddPath}
                        path2={path.path}
                        id={path.id}
                        handleEditZone={handleEditZone}
                        color={path.color}
                        editable={path.editable}
                        name={path.name}
                        radius={getRadius()}
                    />)
                )
		}
	}, [arrayPath, comp, getRadius, handleEditZone, onAddPath])
	useEffect(() => {
		setComp([])
	}, [arrayPath])
    const removePath = (e,keyPath) => {
        setArrayPath(arrayPath.map(paths=>{
            if(paths.editable){
                paths.path = paths.path.filter((path,key) => key !==keyPath)
            }
            return paths;
        }))
    };
    function handleZoomChanged(){
        setZoomMap(this.getZoom())
    }
    if (loadError) return "Error loading Maps";
    if (!isLoaded) return "Loading Maps";
    const renderMap = () => {
        return (
            <div className="App">
                <GoogleMap
                        options={{
                            streetViewControl: false,
                            fullscreenControl: false,
                            mapTypeControl: false,
                            disableDoubleClickZoom:true
                        }}
                        mapContainerClassName="App-map"
                        center={initialCenter}
                        zoom={initialZoom}
                        onZoomChanged={handleZoomChanged}
                        version="weekly"
                        on
                        onDblClick={onAddPath}
                        onLoad={m => {
                            if(m){
                                mapRef.current = m;
                                setCenterMap(m.getCenter().toJSON())
                                setFirstCenter(m.getCenter().toJSON())
                            }
                        }}
                        onCenterChanged={e => {
                            if (mapRef.current){
                                const newPos = mapRef.current.getCenter().toJSON();
                                if(!firstCenter){
                                    setFirstCenter(newPos)
                                }
                                if(firstCenter && (firstCenter.lat !== newPos.lat && firstCenter.lng !== newPos.lng)){
                                    setCenterMap(newPos)
                                }
                            }
                        }}
                    >
                        {
                            comp.map(com => com)
                        }
                        {
                            <DrawingManager
                                options={options}
                                onPolygonComplete={onPolygonComplete}
                                editable
                                draggable
                            />
                        }
                        {
                            arrayPath.map((path,key) => (
                                path.editable ?
                                    <CirclesPolygonComponent
                                        key={key}
                                        centers={path.path}
                                        zoom={zoomMap}
                                        removePath={removePath}
                                        radius={getRadius()}
                                    />
                                :
                                null
                            ))
                        }
                </GoogleMap>
            </div>
        );
    };
    return isLoaded ? renderMap():null;
}