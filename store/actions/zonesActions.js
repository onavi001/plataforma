import {
    GETZONES,
    GETZONESSUCCESS,
    GETZONESERROR,
    GETCLASSIFICATIONS,
    GETCLASSIFICATIONSSUCCESS,
    GETCLASSIFICATIONSERROR,
    GETREGIONS,
    GETREGIONSSUCCESS,
    GETREGIONSERROR,
    CREATEZONES,
    CREATEZONESSUCCESS,
    CREATEZONESERROR,
    CHANGESTATEZONES,
    UPDATEGEOFENCES,
    UPDATEGEOFENCESSUCCESS,
    UPDATEGEOFENCESERROR,
    UPDATEZONES,
    UPDATEZONESSUCCESS,
    UPDATEZONESERROR,
    DELETEZONES,
    DELETEZONESSUCCESS,
    DELETEZONESERROR,
    CREATEREGIONS,
    CREATEREGIONSSUCCESS,
    CREATEREGIONSERROR,
    UPDATEREGIONS,
    UPDATEREGIONSSUCCESS,
    UPDATEREGIONSERROR,
} from '../types';
import {zoanasURL} from "../../services/api";
//getZones
export function getZonesAction(externalID) {
    return async (dispatch) => {
        dispatch( getZones() );
        try {
            zoanasURL.get(`/Zones/Accounts/${externalID}`,{headers: { }}).then(response => {
                if (response.status === 200) {
                    dispatch( getZonesSuccess(response.data) )

                }else{
                    dispatch( getZonesError() )
                }
            }).catch(function (error) {
                dispatch( getZonesError() )
            });
        } catch (error) {
            dispatch( getZonesError() )
        }
    }
}
const getZones = () => ({
    type: GETZONES
})
const getZonesSuccess = (zones) => ({
    type: GETZONESSUCCESS,
    payload : zones
})
const getZonesError = () => ({
    type: GETZONESERROR
})
//get classifications
export function getClassificationsAction(externalID) {
    return async (dispatch) => {
        dispatch( getClassifications() );
        try {
            zoanasURL.get(`/classifications/${externalID}`,{headers: { }}).then(response => {
                if (response.status === 200) {
                    dispatch( getClassificationsSuccess(response.data) )

                }else{
                    dispatch( getClassificationsError() )
                }
            }).catch(function (error) {
                dispatch( getClassificationsError() )
            });
        } catch (error) {
            dispatch( getClassificationsError() )
        }
    }
}
const getClassifications = () => ({
    type: GETCLASSIFICATIONS
})
const getClassificationsSuccess = (classifications) => ({
    type: GETCLASSIFICATIONSSUCCESS,
    payload : classifications
})
const getClassificationsError = () => ({
    type: GETCLASSIFICATIONSERROR
})
//get regions
export function getRegionsAction(externalID) {
    return async (dispatch) => {
        dispatch( getRegions() );
        try {
            zoanasURL.get(`/Regions/${externalID}`,{headers: { }}).then(response => {
                if (response.status === 200) {
                    dispatch( getRegionsSuccess(response.data) )

                }else{
                    dispatch( getRegionsError() )
                }
            }).catch(function (error) {
                dispatch( getRegionsError() )
            });
        } catch (error) {
            dispatch( getRegionsError() )
        }
    }
}
const getRegions = () => ({
    type: GETREGIONS
})
const getRegionsSuccess = (regions) => ({
    type: GETREGIONSSUCCESS,
    payload : regions
})
const getRegionsError = () => ({
    type: GETREGIONSERROR
})
//create Zones
export function createZonesAction(newProZone) {
    return async (dispatch) => {
        dispatch( createZones() );
        try {
            const newZone = {
                pafAccountId: newProZone.pafAccountId,
                externalAccountId: newProZone.externalAccountId,
                name: newProZone.name,
                wktPolygon: newProZone.wktPolygon
            }
            zoanasURL.post(`/Zones`,newZone,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    //dispatch( createZonesSuccess(response.data) )
                    const zone = response.data;
                    zone.polygonWKT = newProZone.wktPolygon;
                    if (newProZone.newRegion) {
                        createRegion(newProZone,response.data,dispatch)
                    }else{
                        createClassifications(newProZone,response.data,undefined,dispatch)
                    }

                }else{
                    dispatch( createZonesError() )
                }
            }).catch(function (error) {
                dispatch( createZonesError() )
            });
        } catch (error) {
            dispatch( createZonesError() )
        }
    }
}
const createRegion = (newProZone,zone,dispatch) =>{
    try {
        const newRegion = {
            accountId: newProZone.pafAccountId,
            name: newProZone.newRegionName
        }
        zoanasURL.post(`/Regions`,newRegion,
        {
            headers: { }
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                createClassifications(newProZone,zone,response.data,dispatch)
            }else{
                dispatch( createZonesError() )
            }
        }).catch(function (error) {
            dispatch( createZonesError() )
        });
    } catch (error) {
        dispatch( createZonesError() )
    }
}
const createClassifications = (newProZone,zone,region,dispatch) =>{
    try {
        const newClassification = {
            pafAccountId: newProZone.pafAccountId,
            externalAccountId: newProZone.externalAccountId,
            alias: newProZone.alias,
            description: newProZone.description,
            parent: newProZone.parent,
            type: newProZone.type,
            action: newProZone.action,
            region: newProZone.region,
            color: newProZone.color ? newProZone.color : "ND",
        }
        if (newProZone.newRegion) {
            newClassification.region= region.id
        }
        zoanasURL.post(`/Zones/${zone.id}/classify`,newClassification,
        {
            headers: { }
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch( createZonesSuccess(zone,response.data) )
            }else{
                dispatch( createZonesError() )
            }
        }).catch(function (error) {
            dispatch( createZonesError() )
        });
    } catch (error) {
        dispatch( createZonesError() )
    }
}
const createZones = () => ({
    type: CREATEZONES
})
const createZonesSuccess = (zone,classification) => ({
    type: CREATEZONESSUCCESS,
    payload : {zone,classification}
})
const createZonesError = () => ({
    type: CREATEZONESERROR
})
//update Geofences
export function updateGeofencesAction(zone) {
    return async (dispatch) => {
        dispatch( updateGeofences() );
        try {
            const putZone = {
                "name": zone.name,
                "wktPolygon": zone.wktPolygon
            }
            zoanasURL.put(`/Zones/${zone.id}`,putZone,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    const zone = response.data;
                    dispatch( updateGeofencesSuccess(zone) )
                }else{
                    dispatch( updateGeofencesError() )
                }
            }).catch(function (error) {
                dispatch( updateGeofencesError() )
            });
        } catch (error) {
            dispatch( updateGeofencesError() )
        }
    }
}
const updateGeofences = () => ({
    type: UPDATEGEOFENCES
})
const updateGeofencesSuccess = (zone) => ({
    type: UPDATEGEOFENCESSUCCESS,
    payload : zone
})
const updateGeofencesError = () => ({
    type: UPDATEGEOFENCESERROR
})
//update Zone
export function updateZonesAction(proZone) {
    return async (dispatch) => {
        dispatch( updateZones() );
        try {
            const putZone = {
                "name": proZone.name,
                "wktPolygon": proZone.wktPolygon
            }
            zoanasURL.put(`/Zones/${proZone.zoneId}`,putZone,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    const zone = response.data;
                    //dispatch( updateZonesSuccess(zone) )
                    updateClassifications(zone,proZone,dispatch)
                }else{
                    dispatch( updateZonesError() )
                }
            }).catch(function (error) {
                dispatch( updateZonesError() )
            });
        } catch (error) {
            dispatch( updateZonesError() )
        }
    }
}
const updateClassifications = (newZone,proZone,dispatch) =>{
    try {
        const newClassification = {
            alias: proZone.alias,
            description: proZone.description,
            parent: proZone.parent,
            type: proZone.type,
            action: proZone.action,
            region: proZone.region,
            color: proZone.color ? proZone.color : "ND",
        }
        if (proZone.type === 1 || proZone.type === 2) {
            newClassification.parent = "00000000-0000-0000-0000-000000000000"
        }
        zoanasURL.put(`/Classifications/${proZone.classificationId}`,newClassification,
        {
            headers: { }
        }).then(response => {
            if (response.status === 200 || response.status === 201) {
                dispatch( updateZonesSuccess(newZone,response.data) )
            }else{
                dispatch( updateZonesError() )
            }
        }).catch(function (error) {
            dispatch( updateZonesError() )
        });
    } catch (error) {
        dispatch( updateZonesError() )
    }
}
const updateZones = () => ({
    type: UPDATEZONES
})
const updateZonesSuccess = (zone,classification) => ({
    type: UPDATEZONESSUCCESS,
    payload : {zone,classification}
})
const updateZonesError = () => ({
    type: UPDATEZONESERROR
})
//delete Zone
export function deleteZonesAction(zone) {
    return async (dispatch) => {
        dispatch( deleteZones() );
        try {
            zoanasURL.delete(`/Zones/${zone.zoneId}`,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch( deleteZonesSuccess(zone) )
                }else{
                    dispatch( deleteZonesError() )
                }
            }).catch(function (error) {
                dispatch( deleteZonesError() )
            });
        } catch (error) {
            dispatch( deleteZonesError() )
        }
    }
}
const deleteZones = () => ({
    type: DELETEZONES
})
const deleteZonesSuccess = (zone) => ({
    type: DELETEZONESSUCCESS,
    payload : {zoneId:zone.zoneId,classificationId:zone.classificationId}
})
const deleteZonesError = () => ({
    type: DELETEZONESERROR
})
//create region
export function createRegionsAction(newRegion) {
    return async (dispatch) => {
        dispatch( createRegions() );
        try {
            zoanasURL.post(`/Regions`,newRegion,
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch(createRegionsSuccess(response.data))
                }else{
                    dispatch( createRegionsError() )
                }
            }).catch(function (error) {
                dispatch( createRegionsError() )
            });
        } catch (error) {
            dispatch( createRegionsError() )
        }
    }
}
const createRegions = () => ({
    type: CREATEREGIONS
})
const createRegionsSuccess = (region) => ({
    type: CREATEREGIONSSUCCESS,
    payload : region
})
const createRegionsError = () => ({
    type: CREATEREGIONSERROR
})
//update region
export function updateRegionsAction(newRegion) {
    return async (dispatch) => {
        dispatch( updateRegions() );
        try {
            zoanasURL.put(`/Regions/${newRegion.RegionId}`,{name:newRegion.name},
            {
                headers: { }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    dispatch(updateRegionsSuccess(response.data))
                }else{
                    dispatch( updateRegionsError() )
                }
            }).catch(function (error) {
                dispatch( updateRegionsError() )
            });
        } catch (error) {
            dispatch( updateRegionsError() )
        }
    }
}
const updateRegions = () => ({
    type: UPDATEREGIONS
})
const updateRegionsSuccess = (region) => ({
    type: UPDATEREGIONSSUCCESS,
    payload : region
})
const updateRegionsError = () => ({
    type: UPDATEREGIONSERROR
})

export function changeStateZones(){
    return (dispatch) => {
        dispatch({
            type: CHANGESTATEZONES
        })
    }
}