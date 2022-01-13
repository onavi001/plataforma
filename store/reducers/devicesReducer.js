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

const initialState = {
    devices: undefined,
    status:[{id:1,name:"Activo"},{id:2,name:"Baja"},{id:3,name:"Inventario"},{id:4,name:"RMA"},{id:5,name:"Demo"},{id:6,name:"Prestado"}],
    platforms:[{id:"Intralix",name:"Intralix"},{id:"Utrax",name:"Utrax"}],
    services:[{id:"Combustible",name:"Combustible"},{id:"Temperatura",name:"Temperatura"}],
    loading : false,
    error:false,
    errorMessage:'',
    success:false,
    successMessage:''
}
export default function usuarioReducer(state = initialState, action) {
    switch (action.type) {
        case GETDEVICES:
            return{
                ...state,
                loading: true
            }
        case GETDEVICESSUCCESS:
            return{
                ...state,
                loading: false,
                devices: action.payload
            }
        case GETDEVICESERROR:
            return{
                ...state,
                loading: false,
                devices:[]
            }
        case UPDATEDEVICES:
            return{
                ...state,
                loading: true
            }
        case UPDATEDEVICESSUCCESS:
            return{
                ...state,
                loading: false,
                devices: state.devices.map(device =>{
                        if(device.id === action.payload.id){
                            device = action.payload
                        }
                        return device;
                    }
                ),
                success:true,
                successMessage:'Se actualizo el dispositivo'
            }
        case UPDATEDEVICESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar dispositivo',
            }
        case CREATEDEVICES:
            return{
                ...state,
                loading: true
            }
        case CREATEDEVICESSUCCESS:
            return{
                ...state,
                loading: false,
                devices: action.payload,
                success:true,
                successMessage:'Se creo dispositivo'
            }
        case CREATEDEVICESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar dispositivo',
            }
        case DELETEDEVICES:
            return{
                ...state,
                loading: true
            }
        case DELETEDEVICESSUCCESS:
            return{
                ...state,
                loading: false,
                devices: state.devices.filter(device => !action.payload.find(tem => device.movilId === tem))
            }
        case DELETEDEVICESERROR:
            return{
                ...state,
                loading: false
            }
        case CHANGESTATEDEVICES:
            return{
                ...state,
                error:false,
                errorMessage:'',
                success:false,
                successMessage:''
            }
        default:
            return state;
    }
}