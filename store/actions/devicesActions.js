import {
    GETDEVICES,
    GETDEVICESSUCCESS,
    GETDEVICESERROR,
    UPDATEDEVICES,
    UPDATEDEVICESSUCCESS,
    UPDATEDEVICESERROR,
    CREATEDEVICES,
    CREATEDEVICESSUCCESS,
    CREATEDEVICESERROR,
    DELETEDEVICES,
    DELETEDEVICESSUCCESS,
    DELETEDEVICESERROR,
    CHANGESTATEDEVICES
} from '../types';
import backendJona from "../../services/api";

export function getDevicesAction() {
    return async (dispatch) => {
        dispatch( getDevices() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/devices/GetDevices?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch( getDevicesSuccess(response.data) )

                }else{
                    dispatch( getDevicesError() )
                }
            }).catch(function (error) {
                dispatch( getDevicesError() )
            });
        } catch (error) {
            dispatch( getDevicesError() )
        }
    }
}
const getDevices = () => ({
    type: GETDEVICES
})
const getDevicesSuccess = (devices) => ({
    type: GETDEVICESSUCCESS,
    payload : devices
})
const getDevicesError = () => ({
    type: GETDEVICESERROR
})
//update
export function updateDevicesAction(updateDevice,accountId,currentDevice,dataVehicleChange,flagChangeDevice,flagChangeVehicle,reduxDeviceUpdate) {
    return async (dispatch) => {
        dispatch( updateDevices() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            if (flagChangeDevice) {
                backendJona.put(`/devices/UpdateDevice?RequesterId=${localStorage_RequesterId}&MovilId=${updateDevice.MovilId}`,
                updateDevice,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage_accessToken}`
                    }
                }).then(response => {
                    if (response.status === 200) {
                        if (flagChangeVehicle) {
                            detachDevice(dataVehicleChange,currentDevice,dispatch,reduxDeviceUpdate)
                        }else{
                            dispatch( updateDevicesSuccess(reduxDeviceUpdate) )
                        }
                    }else{
                        dispatch( updateDevicesError() )
                    }
                }).catch(function (error) {
                    dispatch( updateDevicesError() )
                });
            }else if (flagChangeVehicle && !flagChangeDevice) {
                detachDevice(dataVehicleChange,currentDevice,dispatch)
            }else{
                updateDevicesError()
            }
        } catch (error) {
            dispatch( updateDevicesError() )
        }
    }
}
function detachDevice(dataVehicleChange,currentDevice,dispatch,reduxDeviceUpdate) {
    const localStorage_accessToken = sessionStorage.getItem('accessToken')
    const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
    backendJona.post(`/Vehicles/DetachDevice?RequesterId=${localStorage_RequesterId}&VehicleId=${dataVehicleChange.oldVehicleId}&MovilId=${dataVehicleChange.MovilId}`,
    {},{
        headers: {
            'Authorization': `Bearer ${localStorage_accessToken}`
        }
    }).then(response => {
        if (response.status === 200) {
                //dispatch( updateDevicesSuccess(currentDevice) )
                attachDevice(dataVehicleChange,currentDevice,dispatch,reduxDeviceUpdate)
        }else{
            dispatch( updateDevicesError() )
        }
    }).catch(function (error) {
        dispatch( updateDevicesError() )
    });
}
function attachDevice(dataVehicleChange,currentDevice,dispatch,reduxDeviceUpdate) {
    const localStorage_accessToken = sessionStorage.getItem('accessToken')
    const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
    backendJona.post(`/Vehicles/AttachDevice?RequesterId=${localStorage_RequesterId}&VehicleId=${dataVehicleChange.newVehicleId}&MovilId=${dataVehicleChange.MovilId}`,
    {},{
        headers: {
            'Authorization': `Bearer ${localStorage_accessToken}`
        }
    }).then(response => {
        if (response.status === 200) {
                dispatch( updateDevicesSuccess(reduxDeviceUpdate) )
        }else{
            dispatch( updateDevicesError() )
        }
    }).catch(function (error) {
        dispatch( updateDevicesError() )
    });
}
const updateDevices = () => ({
    type: UPDATEDEVICES
})
const updateDevicesSuccess = (device) => ({
    type: UPDATEDEVICESSUCCESS,
    payload : device
})
const updateDevicesError = () => ({
    type: UPDATEDEVICESERROR
})
//create
export function createDevicesAction(device) {
    return async (dispatch) => {
        dispatch( createDevices() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            const deviceNew = {
                "AccountId": device.accountId,
                "MovilId": device.MovilId,
                "Name": device.Name,
                "Platform": device.Platform,
                "Status": device.Status,
                "Assigned": device.Assigned,
                "ExternalId": device.ExternalId ? device.ExternalId : "ND",
                "GpsModel": device.GpsModel,
                "DeviceServices":device.DeviceServices
            }
            backendJona.post(`/devices/SaveDevice?RequesterId=${localStorage_RequesterId}`,
            deviceNew,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                //dispatch( createDevicesSuccess(response.data) )
                dispatch(getDevicesActionFromCreate())
            }).catch(function (error) {
                dispatch( createDevicesError() )
            });
        } catch (error) {
            dispatch( createDevicesError() )
        }
    }
}
export function getDevicesActionFromCreate() {
    return async (dispatch) => {
        dispatch( getDevicesFromCreate() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.get(`/devices/GetDevices?RequesterId=${localStorage_RequesterId}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                if (response.status === 200) {
                    dispatch( createDevicesSuccess(response.data) )

                }else{
                    dispatch( getDevicesErrorFromCreate() )
                }
            }).catch(function (error) {
                dispatch( getDevicesErrorFromCreate() )
            });
        } catch (error) {
            dispatch( getDevicesErrorFromCreate() )
        }
    }
}
const getDevicesFromCreate = () => ({
    type: GETDEVICES
})
const getDevicesErrorFromCreate = () => ({
    type: GETDEVICESERROR
})
const createDevices = () => ({
    type: CREATEDEVICES
})
const createDevicesSuccess = (devices) => ({
    type: CREATEDEVICESSUCCESS,
    payload : devices
})
const createDevicesError = () => ({
    type: CREATEDEVICESERROR
})
//delete
export function deleteDevicesAction(arrayMovilIds,index) {
    return async (dispatch) => {
        dispatch( deleteDevices() );
        try {
            const localStorage_accessToken = sessionStorage.getItem('accessToken')
            const localStorage_RequesterId = sessionStorage.getItem('RequesterId')
            backendJona.delete(`/devices/DeleteDevice?RequesterId=${localStorage_RequesterId}&MovilId=${arrayMovilIds[index]}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage_accessToken}`
                }
            }).then(response => {
                index++;
                if ( index > arrayMovilIds.length - 1) {
                    dispatch(deleteDevicesSuccess(arrayMovilIds))
                }else{
                    dispatch(deleteDevicesAction(arrayMovilIds,index))
                }
            }).catch(function (error) {
                dispatch( deleteDevicesError() )
            });
        } catch (error) {
            dispatch( deleteDevicesError() )
        }
    }
}
const deleteDevices = () => ({
    type: DELETEDEVICES
})
const deleteDevicesSuccess = (arrayMovilIds) => ({
    type: DELETEDEVICESSUCCESS,
    payload : arrayMovilIds
})
const deleteDevicesError = () => ({
    type: DELETEDEVICESERROR
})
//
export function changeStateDevices(){
    return (dispatch) => {
        dispatch({
            type: CHANGESTATEDEVICES
        })
    }
}