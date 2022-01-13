import {
    CREATERULES,
    CREATERULESSUCCESS,
    CREATERULESERROR,
    GETRULES,
    GETRULESSUCCESS,
    GETRULESERROR,
    UPDATERULES,
    UPDATERULESSUCCESS,
    UPDATERULESERROR,
    DELETERULES,
    DELETERULESSUCCESS,
    DELETERULESERROR,
    CHANGESTATERULES
} from '../types';
const initialState = {
    rules: undefined,
    loading : false,
    error:false,
    errorMessage:'',
    success:false,
    successMessage:'',
}
export default function rulesReducer(state = initialState, action) {
    switch (action.type) {
        case CREATERULES:
            return{
                ...state,
                loading: true
            }
        case CREATERULESSUCCESS:
            return{
                ...state,
                loading: false,
                rules: [...state.rules,action.payload],
                success:true,
                successMessage:'Regla creada con exito',
            }
        case CREATERULESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al crear la regla',
            }
        case GETRULES:
            return{
                ...state,
                loading: true
            }
        case GETRULESSUCCESS:
            return{
                ...state,
                loading: false,
                rules: action.payload,
            }
        case GETRULESERROR:
            return{
                ...state,
                loading: false,
                rules:[]
            }
        case UPDATERULES:
            return{
                ...state,
                loading: true
            }
        case UPDATERULESSUCCESS:
            return{
                ...state,
                loading: false,
                rules: state.rules.map(rule => {
                    if(rule.id === action.payload.id){
                        rule = action.payload;
                    }
                    return rule;
                }),
                success:true,
                successMessage:'Regla actualizada con exito',
            }
        case UPDATERULESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al actualizar la regla',
            }
        case DELETERULES:
            return{
                ...state,
                loading: true
            }
        case DELETERULESSUCCESS:
            return{
                ...state,
                loading: false,
                rules: state.rules.filter( rule => !action.payload.find(rul => rul === rule.id) ),
                success:true,
                successMessage:'Regla elimnada con exito',
            }
        case DELETERULESERROR:
            return{
                ...state,
                loading: false,
                error:true,
                errorMessage:'Error al eliminar la regla',
            }
        case CHANGESTATERULES:
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