// Clase ValidadorRUT: 
// Esta clase proporciona funcionalidades para validar y formatear RUTS chilenos. 
// Funciones y Características Principales: 
// Recibe un RUT como entrada y calcula su dígito verificador. 
// Valida si el RUT ingresado es válido según el algoritmo chileno. 
// Ofrece una función para formatear el RUT con puntos y guion, si es válido. 
// La validación incluye el cálculo y comparación del dígito verificador.

class validadorRUT {
  constructor(rut) {
    this.rut = rut;
    this.dv = rut.substring(this.rut.length - 1);
    this.rut = this.rut.substring(0, this.rut.length - 1).replace(/\D/g, "");
    this.esValido = this.validar();
  }
  validar() {
    let numerosArray = this.rut.split("").reverse();
    let acumulador = 0;
    let multiplicador = 2;

    for (let numero of numerosArray) {
      acumulador += parseInt(numero) * multiplicador;
      multiplicador++;
      if (multiplicador == 8) {
        multiplicador = 2;
      }
    }

    let dv = 11 - (acumulador % 11);

    if (dv == 11) 
      dv = '0';

    if (dv == 10) 
      dv = 'k';

    return dv == this.dv.toLowerCase();
  }
  
  formateado() {
    if (!this.esValido) return '';

    return (this.rut.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")) + "-" + this.dv;
  }
}

export default validadorRUT; 