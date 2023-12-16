import jsPDF from "jspdf";

const GenerarPDF = ({
  productosSeleccionados,
  totalSinIVA,
  descuentoAplicado,
  clienteSeleccionado,
  tipoPago,
  invoiceNumber,
  userData,
  descuentoMenuValue,
  setDescuentoAplicado,
  setShowDiscountMenu,
  setActualizacion
}) => {

  const pdf = new jsPDF();

  const imgData = "../../src/images/LogoSinFoindo.png";
  const imgWidth = 40;
  const imgHeight = 40;
  const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
  const imgY = -10;
  pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);

  pdf.setFontSize(24);
  pdf.text("Factura Hans Motors", pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  // Línea separadora entre el título y el contenido
  const lineSeparatorY = 20;
  pdf.line(5, lineSeparatorY, pdf.internal.pageSize.getWidth() - 5, lineSeparatorY);


  const today = new Date();
  const dateString = today.toLocaleDateString();
  pdf.setFontSize(10);
  pdf.text(`Fecha: ${dateString}`, pdf.internal.pageSize.getWidth() - 45, 40);


  pdf.setFontSize(10);
  const tipoPagoText = `Tipo de Pago: ${tipoPago}`;
  const tipoPagoX = 165;
  const tipoPagoY = imgY + imgHeight + 0 ; 
  pdf.text(tipoPagoText, tipoPagoX, tipoPagoY);

  pdf.setFontSize(10);
  const invoiceNumberText = `N° Factura: ${invoiceNumber}`;
  const invoiceNumberX = 165;
  const invoiceNumberY = imgY + imgHeight + 5;
  pdf.text(invoiceNumberText, invoiceNumberX, invoiceNumberY);


  pdf.setFontSize(10);
  const userText = `Nombre Vendedor: ${userData.nombre} ${userData.apellido} `;
  const userX = 8;
  const userY = imgY + imgHeight + 0;
  pdf.text(userText, userX, userY);

  pdf.setFontSize(10);
  const rutText = `Rut Vendedor: ${userData.rut}`;
  const rutX = 8;
  const rutY = imgY + imgHeight + 5;
  pdf.text(rutText, rutX, rutY);
  
  pdf.setFontSize(10);
  const emailText = `Email Vendedor: ${userData.email}`;
  const emailX = 8;
  const emailY =  imgY + imgHeight + 10;
  pdf.text(emailText, emailX, emailY);

  pdf.setFontSize(10);
  const telefonoText = `Telefono Vendedor: ${userData.telefono}`;
  const telefonoX = 8;
  const telefonoY =imgY + imgHeight + 15;
  pdf.text(telefonoText, telefonoX, telefonoY);

  if (clienteSeleccionado) {
    console.log("Selected client:", clienteSeleccionado);
    pdf.setFontSize(10);

    const clienteText = `Nombre Cliente: ${clienteSeleccionado?.nombre || ''} ${clienteSeleccionado?.apellido || ''}`;
    const clienteX = 78;
    const clienteY = imgY + imgHeight + 0;
    pdf.text(clienteText, clienteX, clienteY);
  
    const rutClienteText = `Rut Cliente: ${clienteSeleccionado.rut || ''}`;
    const rutClienteX = 78;
    const rutClienteY = imgY + imgHeight + 5;
    pdf.text(rutClienteText, rutClienteX, rutClienteY);
  
    const emailClienteText = `Email Cliente: ${clienteSeleccionado.email || ''}`;
    const emailClienteX = 78;
    const emailClienteY = imgY + imgHeight + 10;
    pdf.text(emailClienteText, emailClienteX, emailClienteY);
  
    const telefonoClienteText = `Telefono Cliente: ${clienteSeleccionado.telefono || ''}`;
    const telefonoClienteX = 78;
    const telefonoClienteY = imgY + imgHeight + 15;
    pdf.text(telefonoClienteText, telefonoClienteX, telefonoClienteY);
  } else {
    // If clienteSeleccionado is not defined or null, handle accordingly
    pdf.setFontSize(10);
    const errorText = "Error: Cliente no seleccionado";
    pdf.text(errorText, 78, imgY + imgHeight);
  }
  // hasta  aqui agregue yo


  // Encabezado
  const lineY = tipoPagoY + 20;
  pdf.line(5, lineY, pdf.internal.pageSize.getWidth() - 5, lineY);

  // Línea vertical entre el título y el contenido
  const lineX = 5; 
  pdf.line(lineX, lineSeparatorY, lineX, tipoPagoY + 20);

  const lineX0 = 75; 
  pdf.line(lineX0, lineSeparatorY, lineX0, tipoPagoY + 20);

  const lineX1 = 163; 
  pdf.line(lineX1, lineSeparatorY, lineX1, tipoPagoY + 20);

  const lineX2 = 205; 
  pdf.line(lineX2, lineSeparatorY, lineX2, tipoPagoY + 20);




  //lista de productos 



  const fontSize = 10;
  pdf.setFontSize(fontSize);


  const headers = ["Producto", "Cantidad", "Descripción", "Precio U.", "Total", "Total Producto"];
  const tableX = 10;
  const tableY = lineY + 12;

  // Ajusta la posición del eje x para cada título del encabezado
  pdf.text(headers[0], tableX + 10, tableY);
  pdf.text(headers[1], tableX + 41, tableY);
  pdf.text(headers[2], tableX + 80, tableY);
  pdf.text(headers[3], tableX + 140, tableY);
  pdf.text(headers[4], tableX + 170, tableY);
  pdf.text(headers[5], tableX + 250, tableY);


  const tableLineY = tableY - 5;
  pdf.line(5, tableLineY, pdf.internal.pageSize.getWidth() - 5, tableLineY);


  const tableLineY1 = tableY + 3;
  pdf.line(5, tableLineY1, pdf.internal.pageSize.getWidth() - 5, tableLineY1);


  // headers.forEach((header, index) => {
  //   pdf.text(header, tableX + index * 40, tableY);
  // });

  const rowSpacing = 3;
  const productosHeight = productosSeleccionados.reduce(
    (total, producto) => total + pdf.getTextDimensions(producto.descripcion).h + rowSpacing,
    0
  );

  // Líneas verticales en la tabla
  const tableLineX1 = tableX + 40;
  const tableLineX2 = tableX + 120;
  const tableLineX3 = tableX + 160;
  const tableLineX4 = pdf.internal.pageSize.getWidth() - 143;
  const tableLineX5 = pdf.internal.pageSize.getWidth() - 205;
  const tableLineX6 = pdf.internal.pageSize.getWidth() - 5;

  pdf.line(tableLineX1, tableLineY, tableLineX1, tableY + productosHeight - 4);
  pdf.line(tableLineX2, tableLineY, tableLineX2, tableY + productosHeight - 4);
  pdf.line(tableLineX3, tableLineY, tableLineX3, tableY + productosHeight - 4);
  pdf.line(tableLineX4, tableLineY, tableLineX4, tableY + productosHeight - 4);
  pdf.line(tableLineX5, tableLineY, tableLineX5, tableY + productosHeight - 4);
  pdf.line(tableLineX6, tableLineY, tableLineX6, tableY + productosHeight - 4);


  // Inicializar variable para el neto
  let neto = 0;

  let currentY = tableY + 10;
  const hasEnoughSpace = () => currentY + 30 < pdf.internal.pageSize.getHeight();
  productosSeleccionados.forEach((producto) => {
    if (!hasEnoughSpace()) {
      pdf.addPage();
      currentY = 20; // Reset Y position on the new page
    }
    const { h } = pdf.getTextDimensions(producto.descripcion);
    const lines = pdf.splitTextToSize(producto.descripcion, 50);

    lines.forEach((line, i) => {
      pdf.text(line, tableX + 60, currentY);
      currentY += h + rowSpacing;
    });

    pdf.text(producto.nombreProducto, tableX, currentY - 10);
    pdf.text(producto.cantidad.toString(), tableX + 45, currentY - 10);

    const costoNumerico = parseFloat(producto.costo.replace(/\./g, '').replace(',', '.'));

    pdf.text(costoNumerico.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), tableX + 120, currentY - 10);

    const totalProducto = producto.cantidad * costoNumerico;
    pdf.text(totalProducto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.'), tableX + 160, currentY - 10);

    neto += totalProducto;

    currentY += h + rowSpacing;
  });

  // Dibujar línea horizontal encima del neto
  pdf.line(5, currentY + 5, pdf.internal.pageSize.getWidth() - 130, currentY + 5);


  pdf.text(`Neto: ${neto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 10);

  const iva = neto * 0.19;
  pdf.text(`Total IVA (19%): ${iva.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 20);

  // const totalFinal = neto + iva - descuentoAplicado;
  const totalFinal = neto + iva; 
  pdf.text(`Total Final: ${totalFinal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 30);

  const descuento = parseInt(descuentoMenuValue, 10);
  // const descuento = (totalSinIVA * descuentoMenuValue) / 100;

  // Calcula el descuento en el total final
  const descuentoTotalFinal = (descuento / 100) * (totalFinal);

  // Actualiza el estado del descuento aplicado
  setDescuentoAplicado(descuentoTotalFinal);

  // Oculta el menú de descuentos después de aplicar el descuento
  setShowDiscountMenu(false);
  
  pdf.text(`Descuento: ${descuentoTotalFinal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 40);
  pdf.text(`Total Final con Descuento: ${(totalFinal - descuentoTotalFinal).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`, tableX + 0, currentY + 50);
  


  // Dibujar líneas verticales desde el neto hacia abajo
  const verticalLineX = pdf.internal.pageSize.getWidth() - 130;
  pdf.line(verticalLineX, currentY + 5, verticalLineX, currentY + 56);

  // Dibujar otra línea vertical paralela
  const secondVerticalLineX = pdf.internal.pageSize.getWidth() - 205; 
  pdf.line(secondVerticalLineX, currentY + 5, secondVerticalLineX, currentY + 56);

  // Dibujar línea horizontal después del total final
  pdf.line(5, currentY + 33, pdf.internal.pageSize.getWidth() - 130, currentY + 33);
  pdf.line(5, currentY + 56, pdf.internal.pageSize.getWidth() - 130, currentY + 56);
  
  // const lineY2 = tableY + tableHeight;
  // pdf.line(5, lineY2, pdf.internal.pageSize.getWidth() - 5, lineY2);

  pdf.save("factura.pdf");
  setActualizacion((prevActualizacion) => prevActualizacion + 1);
};
