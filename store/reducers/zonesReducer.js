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
const initialState = {
    zones: undefined,
    classifications:undefined,
    regions:undefined,
    zoneTypes:[
        {id:1,name:"CEDIS",parent:true},
        {id:2,name:"Planta",parent:true},
        {id:3,name:"Punto de venta",parent:true},
        {id:4,name:"Anden de carga",parent:false},
        {id:5,name:"Anden de descarga",parent:false},
        {id:6,name:"Anden de descarga y descarga",parent:false},
    ],
    zoneActions:[
        {id:0,name:"Carga de activo"},
        {id:1,name:"Descarga de activos"},
        {id:2,name:"Pago de caseta"},
        {id:3,name:"Llenado de combustible"},
        {id:3,name:"Descarga de combustible"}
    ],
    loading : false,
    error:false,
    errorMessage:'',
    success:false,
    successMessage:'',
}
export default function zonesReducer(state = initialState, action) {
    switch (action.type) {
        case GETZONES:
            return{
                ...state,
                //loading: true
            }
        case GETZONESSUCCESS:
            return{
                ...state,
                //loading: false,
                zones: action.payload
            }
        case GETZONESERROR:
            return{
                ...state,
                //loading: false
            }
        case GETCLASSIFICATIONS:
            return{
                ...state,
                //loading: true
            }
        case GETCLASSIFICATIONSSUCCESS:
            return{
                ...state,
                //loading: false,
                classifications: action.payload
            }
        case GETCLASSIFICATIONSERROR:
            return{
                ...state,
                //loading: false
            }
        case GETREGIONS:
            return{
                ...state,
                //loading: true
            }
        case GETREGIONSSUCCESS:
            return{
                ...state,
                //loading: false,
                regions: action.payload
            }
        case GETREGIONSERROR:
            return{
                ...state,
                //loading: false
            }
        case CREATEZONES:
            return{
                ...state,
                loading: true
            }
        case CREATEZONESSUCCESS:
            return{
                ...state,
                loading: false,
                zones: [...state.zones,action.payload.zone],
                classifications: [...state.classifications,action.payload.classification],
                success:true,
                successMessage:'Zona creada con exito',
            }
        case CREATEZONESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al crear la zona',
            }
        case UPDATEGEOFENCES:
            return{
                ...state,
                loading: true
            }
        case UPDATEGEOFENCESSUCCESS:
            return{
                ...state,
                loading: false,
                zones: state.zones.map(zone => {
                    if(zone.id === action.payload.id){
                        zone = action.payload;
                    }
                    return zone;
                }),
                success:true,
                successMessage:'Zona actualizada con exito',
            }
        case UPDATEGEOFENCESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar la zona',
            }
        case UPDATEZONES:
            return{
                ...state,
                loading: true
            }
        case UPDATEZONESSUCCESS:
            return{
                ...state,
                loading: false,
                zones: state.zones.map(zone => {
                    if(zone.id === action.payload.zone.id){
                        zone = action.payload.zone;
                    }
                    return zone;
                }),
                classifications: state.classifications.map(classification => {
                    if(classification.id === action.payload.classification.id){
                        classification = action.payload.classification;
                    }
                    return classification;
                }),
                success:true,
                successMessage:'Zona actualizada con exito',
            }
        case UPDATEZONESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar la zona',
            }
        case DELETEZONES:
            return{
                ...state,
                loading: true
            }
        case DELETEZONESSUCCESS:
            return{
                ...state,
                loading: false,
                zones: state.zones.filter(
                    zone => (zone.id !== action.payload.zoneId) 
                ),
                classifications: state.classifications.filter(
                    classification => (classification.id !== action.payload.classificationId && classification.parent !== action.payload.classificationId)
                ),
                success:true,
                successMessage:'Zona eliminada con exito',
            }
        case DELETEZONESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al eliminar la zona',
            }
        case CREATEREGIONS:
            return{
                ...state,
                loading: true
            }
        case CREATEREGIONSSUCCESS:
            return{
                ...state,
                loading: false,
                regions: [...state.regions,action.payload],
                success:true,
                successMessage:'Región creada con exito',
            }
        case CREATEREGIONSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al crear la región',
            }
        case UPDATEREGIONS:
            return{
                ...state,
                loading: true
            }
        case UPDATEREGIONSSUCCESS:
            return{
                ...state,
                loading: false,
                regions: state.regions.map(region => {
                    if(region.id === action.payload.id){
                        region = action.payload;
                    }
                    return region;
                }),
                success:true,
                successMessage:'Región actualizada con exito',
            }
        case UPDATEREGIONSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar la región',
            }
        case CHANGESTATEZONES:
            return{
                ...state,
                success:false,
                successMessage:'',
                error:false,
                errorMessage:'',
            }
        default:
            return state;
    }
}