import {
    GETUNITS,
    GETUNITSSUCCESS,
    GETUNITSERROR,
    UPDATEUNITS,
    UPDATEUNITSSUCCESS,
    UPDATEUNITSERROR,
    DELETEUNITS,
    DELETEUNITSSUCCESS,
    DELETEUNITSERROR,
    CREATEUNITS,
    CREATEUNITSSUCCESS,
    CREATEUNITSERROR,
    CHANGESTATEVEHICLE,
} from '../types';
import backendJona from "../../services/api";

export function getUnitsAction() {
    return async (dispatch) => {
        dispatch( getUnits() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/Vehicles/GetVehicles?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch( getUnitsSuccess(response.data) )

                }else{
                    dispatch( getUnitsError() )
                }
            }).catch(function (error) {
                dispatch( getUnitsError() )
            });
        } catch (err) {
            dispatch( getUnitsError() )
        }
    }
}
const getUnits = () => ({
    type: GETUNITS
})
const getUnitsSuccess = (unidades) => ({
    type: GETUNITSSUCCESS,
    payload : unidades
})
const getUnitsError = () => ({
    type: GETUNITSERROR
})
//update
export function upodateUnitsAction(vehicle,vehicleRedux) {
    return async (dispatch) => {
        dispatch( upodateUnits() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            await backendJona.put(`/Vehicles/UpdateVehicle?RequesterId=${localStorage_RequesterId}&VehicleId=${vehicle.VehicleId}`,
            vehicle,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch( upodateUnitsSuccess(vehicleRedux) )
                }else{
                    dispatch( getUnitsError() )
                }
            }).catch(function (error) {
                dispatch( getUnitsError() )
            });
        } catch (error) {
            dispatch( upodateUnitsError() )
        }
    }
}
const upodateUnits = () => ({
    type: UPDATEUNITS
})
const upodateUnitsSuccess = (vehicle) => ({
    type: UPDATEUNITSSUCCESS,
    payload : vehicle
})
const upodateUnitsError = () => ({
    type: UPDATEUNITSERROR
})
//delete
export function deleteUnitsAction(arrayVehicleIds,index) {
    return async (dispatch) => {
        dispatch( deleteUnits() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.delete(`/Vehicles/DeleteVehicle`,
            {
                data:{
                    "RequesterId" : localStorage_RequesterId,
                    "VehicleId" : arrayVehicleIds[index]
                },
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            },).then(response => {
                index++;
                if ( index > arrayVehicleIds.length - 1) {
                    arrayVehicleIds.forEach(element => {
                        dispatch(deleteUnitsSuccess(element))
                    });
                }else{
                    dispatch(deleteUnitsAction(arrayVehicleIds,index))
                }
            }).catch(function (error) {
                dispatch( deleteUnitsError() )
            });
        } catch (error) {
            dispatch( deleteUnitsError() )
        }
    }
}
const deleteUnits = () => ({
    type: DELETEUNITS
})
const deleteUnitsSuccess = (unidades) => ({
    type: DELETEUNITSSUCCESS,
    payload : unidades
})
const deleteUnitsError = () => ({
    type: DELETEUNITSERROR
})
//create
export function createUnitsAction(vehicle) {
    return async (dispatch) => {
        dispatch( createUnits() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            await backendJona.post(`/Vehicles/SaveVehicle?RequesterId=${localStorage_RequesterId}`,
            vehicle,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200 || response.status === 201) {
                    vehicle.VehicleId = response.data.id;
                    if(vehicle.Devices.length > 0){
                        vehicle.vehicleId = response.data.id;
                        response.data.vehicleId = response.data.id;
                        dispatch( upodateUnitsDevices(vehicle,response.data) )
                    }else{
                        response.data.vehicleId = response.data.id;
                        response.data.gpsDevices=[];
                        dispatch( createUnitsSuccess(response.data) )
                    }
                }else{
                    dispatch( createUnitsError('Error al crear vehiculo') )
                }
            }).catch(function (error) {
                let errorSend = 'Error al crear vehiculo';
                if(error.response.data === 'There is already a vehicle with the same plates that you are trying to save.'){
                    errorSend='Ya existe un vehículo  con las mismas placas.';
                }
                dispatch( createUnitsError(errorSend) )
            });
        } catch (error) {
            dispatch( createUnitsError('Error al crear vehiculo') )
        }
    }
}
export function upodateUnitsDevices(vehicle,vehicleRedux) {
    return async (dispatch) => {
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            await backendJona.put(`/Vehicles/UpdateVehicle?RequesterId=${localStorage_RequesterId}&VehicleId=${vehicle.VehicleId}`,
            vehicle,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    vehicleRedux.gpsDevices = vehicle.Devices;
                    dispatch( createUnitsSuccess(vehicleRedux) )
                }else{
                    dispatch( createUnitsError('Error al crear vehiculo') )
                }
            }).catch(function (error) {
                dispatch( createUnitsError('Error al crear vehiculo') )
            });
        } catch (error) {
            dispatch( createUnitsError('Error al crear vehiculo') )
        }
    }
}
const createUnits = () => ({
    type: CREATEUNITS
})
const createUnitsSuccess = (unidad) => ({
    type: CREATEUNITSSUCCESS,
    payload : unidad
})
const createUnitsError = (error) => ({
    type: CREATEUNITSERROR,
    payload: error
})
//
export function changeStateVehicle(){
    return (dispatch) => {
        dispatch({
            type: CHANGESTATEVEHICLE
        })
    }
}