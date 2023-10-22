function validarFormulario() {
    let email = document.getElementById("email").value;
    let consulta = document.getElementById("consulta").value;

    if (!email || !consulta) {
        alert("Los campos de correo electrónico y consulta son obligatorios.");
        return false;
    }

    return true;
}

function borrarCampos() {
    // Obtiene una lista de todos los elementos de entrada en el formulario
    let elementosForm = document.querySelectorAll('input, textarea');
    let botonesType = ['button', 'submit']
    // Recorre los elementos y borra sus valores si tienen alguno y excluye a los botones
    for (var i = 0; i < elementosForm.length; i++) {
        if (elementosForm[i].value !== '' && !botonesType.includes(elementosForm[i].type)) {
            elementosForm[i].value = '';
        }
    }
}