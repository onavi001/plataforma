const messages = [
    {
        'message':"Formato incorrecto :file ",
        'type':'invalid'
    },{
        'message':"Error al iniciar sesión: credenciales inválidas.",
        'type':'Invalid credentials.'
    },{
        'message':"Error al iniciar sesión: usuario inactivo",
        'type':'User inactive within the system'
    },{
        'message':"Operación invalida: no es posible actualizar a este usaurio a root",
        'type':'Operation invalid,not is posible update user to root.'
    }
]
export function fileMesagge(file,type) {
    const messageFound = messages.find(message => message.type === type);
    let message = "";
    if (messageFound) {
        message = messageFound.message.replace(':file', file)
    }else{
        message = "Error"
    }
    return message;
}
export default messages;