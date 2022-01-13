import Swal from 'sweetalert2';
import preloader from "../public/img/preloader.svg";
export function abrirAlerta(tipo,mensaje) {
    Swal.fire({
        //position: 'top-end',
        icon: tipo,
        title: mensaje,
        showConfirmButton: false,
        timer: 1000,
    })
}
export function abrirAlertaCampos(tipo,mensaje) {
    const Toast2 = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast2.fire({
        icon: tipo,
        title: mensaje
    })
}
export function abrirAlertaMap(tipo,mensaje) {
    const Toast2 = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCloseButton: true,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    Toast2.fire({
        icon: tipo,
        title:`Ayuda`,
        html:`
        <div style='font-size: 12px;'>
            Nuevo punto:haga doble clic en el mapa.</br>
            Insertar un punto:haga doble clic en la mitad del segmento entre dos puntos.</br>
            Eliminar punto:haga doble clic en un punto.</br>
            Mover un punto:haga clic en un punto y, apretando el botón izquierdo del ratón, arrástrelo a otro lugar.
        </div>
        `
    })
}
export function loadingAlerta() {
    Swal.fire({
        imageUrl: preloader,
        imageAlt: 'The uploaded picture',
        width: 200,
        showConfirmButton: false
    });
}
export function cerrarAlerta() {
    Swal.close();
}