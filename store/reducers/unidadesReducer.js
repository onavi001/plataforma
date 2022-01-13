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

const initialState = {
    unidades: undefined,
    Types: [
        {id:'Automóvil',name:'Automóvil'},
        {id:'Tractocamión',name:'Tractocamión'},
        {id:'Transporte de carga',name:'Transporte de carga'},
        {id:'Camioneta',name:'Camioneta'},
        {id:'Plancha',name:'Plancha'},
        {id:'Remolque',name:'Remolque'},
        {id:'Caja Seca',name:'Caja Seca'},
        {id:'Caja Refrigerada',name:'Caja Refrigerada'},
        {id:'Camión Cisterna',name:'Camión Cisterna'}
    ],
    Marks: [
        {id:'Daf Trucks',name:'Daf Trucks'},
        {id:'Dina',name:'Dina'},
        {id:'Freightliner',name:'Freightliner'},
        {id:'Fuso',name:'Fuso'},
        {id:'Gami',name:'Gami'},
        {id:'Hino',name:'Hino'},
        {id:'International',name:'International'},
        {id:'Isuzu',name:'Isuzu'},
        {id:'Iveco',name:'Iveco'},
        {id:'Kenworth',name:'Kenworth'},
        {id:'Mack',name:'Mack'},
        {id:'Man',name:'Man'},
        {id:'MAN',name:'MAN'},
        {id:'Nissan',name:'Nissan'},
        {id:'Renault',name:'Renault'},
        {id:'Scania',name:'Scania'},
        {id:'Volkswagen',name:'Volkswagen'},
        {id:'Volvo',name:'Volvo'},
    ],
    Models: [
        {id:'Cascadia',name:'Cascadia',parentMark:'Freightliner'},
        {id:'114SD',name:'114SD',parentMark:'Freightliner'},
        {id:'360 715',name:'360 715',parentMark:'Freightliner'},
        {id:'360 917',name:'360 917',parentMark:'Freightliner'},
        {id:'360 1217',name:'360 1217',parentMark:'Freightliner'},
        {id:'360 2528',name:'360 2528',parentMark:'Freightliner'},
        {id:'M2',name:'M2',parentMark:'Freightliner'},
        {id:'Columbia 120',name:'Columbia 120',parentMark:'Freightliner'},
        {id:'Argosy',name:'Argosy',parentMark:'Freightliner'},
        {id:'Century Class',name:'Century Class',parentMark:'Freightliner'},
        {id:'Coronado',name:'Coronado',parentMark:'Freightliner'},
        {id:'FLD 120',name:'FLD 120',parentMark:'Freightliner'},
        {id:'CAJA SECA',name:'CAJA SECA',parentMark:'Gami'},
        {id:'1018',name:'1018',parentMark:'Hino'},
        {id:'1626',name:'1626',parentMark:'Hino'},
        {id:'1828',name:'1828',parentMark:'Hino'},
        {id:'2628',name:'2628',parentMark:'Hino'},
        {id:'2635',name:'2635',parentMark:'Hino'},
        {id:'516',name:'516',parentMark:'Hino'},
        {id:'616',name:'616',parentMark:'Hino'},
        {id:'816',name:'816',parentMark:'Hino'},
        {id:'514',name:'514',parentMark:'Hino'},
        {id:'616',name:'616',parentMark:'Hino'},
        {id:'716',name:'716',parentMark:'Hino'},
        {id:'816',name:'816',parentMark:'Hino'},
        {id:'Prostar',name:'Prostar',parentMark:'International'},
        {id:'Lonestar',name:'Lonestar',parentMark:'International'},
        {id:'CT',name:'CT',parentMark:'International'},
        {id:'HV',name:'HV',parentMark:'International'},
        {id:'Workstar',name:'Workstar',parentMark:'International'},
        {id:'MV',name:'MV',parentMark:'International'},
        {id:'LT',name:'LT',parentMark:'International'},
        {id:'TranStar',name:'TranStar',parentMark:'International'},
        {id:'9400i',name:'9400i',parentMark:'International'},
        {id:'9200i',name:'9200i',parentMark:'International'},
        {id:'T800',name:'T800',parentMark:'Kenworth'},
        {id:'T660',name:'T660',parentMark:'Kenworth'},
        {id:'T660',name:'T600',parentMark:'Kenworth'},
        {id:'T370',name:'T370',parentMark:'Kenworth'},
        {id:'T680',name:'T680',parentMark:'Kenworth'},
        {id:'T880',name:'T880',parentMark:'Kenworth'},
        {id:'KW45',name:'KW45',parentMark:'Kenworth'},
        {id:'KW55',name:'KW55',parentMark:'Kenworth'},
        {id:'T460',name:'T460',parentMark:'Kenworth'},
        {id:'T604',name:'T604',parentMark:'Kenworth'},
        {id:'T2000',name:'T2000',parentMark:'Kenworth'},
        {id:'W900',name:'W900',parentMark:'Kenworth'},
        {id:'Anthem',name:'Anthem',parentMark:'Mack'},
        {id:'Granite',name:'Granite',parentMark:'Mack'},
        {id:'TerraPro',name:'TerraPro',parentMark:'Mack'},
        {id:'Pinnacle',name:'Pinnacle',parentMark:'Mack'},
        {id:'TGX 26 480',name:'TGX 26 480',parentMark:'Man'},
        {id:'TGA',name:'TGA',parentMark:'Man'},
        {id:'VNL 430',name:'VNL 430',parentMark:'Volvo'},
        {id:'VNL 4300',name:'VNL 4300',parentMark:'Volvo'},
        {id:'VNL 630',name:'VNL 630',parentMark:'Volvo'},
        {id:'VNL 670',name:'VNL 670',parentMark:'Volvo'},
        {id:'VNL 730',name:'VNL 730',parentMark:'Volvo'},
        {id:'VLE',name:'VLE',parentMark:'Volvo'},
    ],
    status:[
        {id:"Activo",name:"Activo"},
        {id:"Baja",name:"Baja"},
        {id:"En Taller",name:"En Taller"},
        {id:"Fuera de Servicio",name:"Fuera de Servicio"},
        {id:"Siniestrada",name:"Siniestrada"},
        {id:'sin GPS',name:'sin GPS'}
    ],
    loading : false,
    error:false,
    errorMessage:'',
    success:false,
    successMessage:''
}
export default function usuarioReducer(state = initialState, action) {
    switch (action.type) {
        case GETUNITS:
            return{
                ...state,
                loading: true
            }
        case GETUNITSSUCCESS:
            return{
                ...state,
                loading: false,
                unidades: action.payload
            }
        case GETUNITSERROR:
            return{
                ...state,
                loading: false,
                unidades:[]
            }
        case UPDATEUNITS:
            return{
                ...state,
                loading: true
            }
        case UPDATEUNITSSUCCESS:
            return{
                ...state,
                loading: false,
                unidades: state.unidades.map(unidad =>
                    unidad.vehicleId === action.payload.vehicleId ? unidad = action.payload : unidad
                ),
                success:true,
                successMessage:'Unidad actualizada con exito'
            }
        case UPDATEUNITSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar vehiculo',
            }
        case DELETEUNITS:
            return{
                ...state,
                loading: true
            }
        case DELETEUNITSSUCCESS:
            return{
                ...state,
                loading: false,
                unidades: state.unidades.filter(unidad => unidad.vehicleId !== action.payload),
                success:true,
                successMessage:'Unidad eliminada con exito'
            }
        case DELETEUNITSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al eliminar vehiculo',
            }
        case CREATEUNITS:
            return{
                ...state,
                loading: true
            }
        case CREATEUNITSSUCCESS:
            return{
                ...state,
                loading: false,
                unidades: [...state.unidades, action.payload],
                success:true,
                successMessage:'Vehiculo creado con exito'
            }
        case CREATEUNITSERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:action.payload ? action.payload : 'Error al crear vehiculo',
            }
        case CHANGESTATEVEHICLE:
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