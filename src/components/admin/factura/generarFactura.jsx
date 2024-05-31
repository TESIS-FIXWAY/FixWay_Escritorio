import React, { useState, useEffect } from "react";
import Admin from "../admin";
import jsPDF from "jspdf";
import { db, auth, storage } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadString } from "firebase/storage";
import ListadoProductos from "./listadoProductos";
import AplicarDescuento from "./aplicarDescuento";
import ClienteVista from "./clienteVista";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import PercentIcon from "@mui/icons-material/Percent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const GenerarFactura = () => {
  const [inventario, setInventario] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [showProductList, setShowProductList] = useState(false);
  const [tipoPago, setTipoPago] = useState("");
  const [showDiscountMenu, setShowDiscountMenu] = useState(false);
  const [descuentoMenuValue, setDescuentoMenuValue] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [showClienteVista, setShowClienteVista] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [actualizacion, setActualizacion] = useState(0);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const identifyUser = auth.currentUser;
    if (identifyUser) {
      const userRef = doc(db, "users", identifyUser.uid);
      onSnapshot(userRef, (snapshot) => {
        const userData = snapshot.data();
        setUserData(userData);
        setNewName(userData.nombre || "");
        setNewApellido(userData.apellido || "");
        setRut(userData.rut || "");
        setEmail(userData.email || "");
        setTelefono(userData.telefono || "");
      });
    }
  }, []);

  const generarFactura = async () => {
    if (productosSeleccionados.length === 0) {
      alert("No hay productos seleccionados para generar la factura.");
      return;
    }

    let facturasCollection;
    let nuevaFactura;

    try {
      facturasCollection = collection(db, "misFacturas");
      const batch = writeBatch(db);

      for (const producto of productosSeleccionados) {
        const productoRef = doc(db, "inventario", producto.id);

        if (typeof producto.cantidad === "number") {
          const docSnapshot = await getDoc(productoRef);
          const existingQuantity = docSnapshot.data().cantidad;

          if (existingQuantity < producto.cantidad) {
            alert(`No hay suficiente stock para ${producto.nombre}.`);
            return;
          }

          const newQuantity = existingQuantity - producto.cantidad;

          batch.update(productoRef, { cantidad: newQuantity });
        } else {
          console.error("Invalid cantidad value:", producto.cantidad);
        }
      }

      await batch.commit();

      const invoiceNumber = generateInvoiceNumber();
      const total = await generarPDF(
        productosSeleccionados,
        totalSinIVA,
        descuentoAplicado
      );
      const fecha = obtenerFechaActual();
      const time = new Date().toLocaleTimeString("es-CL", { hour12: false });
      const timestamp = new Date().getTime();
      nuevaFactura = {
        invoiceNumber: invoiceNumber,
        tipo: "Factura",
        total: total.toString(),
        fecha: fecha,
        time: time,
        timestamp: timestamp,
        tipoPago: tipoPago,
      };

      const nuevaFacturaRef = await addDoc(facturasCollection, nuevaFactura);

      const invoiceId = nuevaFacturaRef.id;
      nuevaFactura.invoiceNumber = invoiceId;

      await updateDoc(doc(facturasCollection, invoiceId), nuevaFactura);

      const historialVentasCollection = collection(db, "historialVentas");
      await addDoc(historialVentasCollection, {
        totalCompra: parseInt(total, 10),
        tipo: "Factura",
        fecha: fecha,
        time: time,
        tipoPago: tipoPago,
      });

      setProductosSeleccionados([]);
      setDescuentoMenuValue("");
      setShowProductList(false);
      setActualizacion((prevActualizacion) => prevActualizacion + 1);
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  };

  const obtenerFechaActual = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, "0");
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0");
    const año = fechaActual.getFullYear().toString().slice(-2);
    return `${dia}/${mes}/${año}`;
  };

  const generarPDF = async (
    productosSeleccionados,
    totalSinIVA,
    descuentoAplicado
  ) => {
    const pdf = new jsPDF();
    const imgData = "../../../images/AutoSinFondo.png";
    const imgWidth = 40;
    const imgHeight = 40;
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = -10;
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);

    pdf.setFontSize(24);
    pdf.text("Factura Settore", pdf.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    const lineSeparatorY = 20;
    pdf.line(
      5,
      lineSeparatorY,
      pdf.internal.pageSize.getWidth() - 5,
      lineSeparatorY
    );

    const today = new Date();
    const dateString = today.toLocaleDateString();
    pdf.setFontSize(10);
    pdf.text(`Fecha: ${dateString}`, pdf.internal.pageSize.getWidth() - 45, 42);

    const hour = String(today.getHours()).padStart(2, "0");
    const minute = String(today.getMinutes()).padStart(2, "0");
    const second = String(today.getSeconds()).padStart(2, "0");
    const dateStringHora = `${hour}:${minute}:${second}`;
    const dateXH = pdf.internal.pageSize.getWidth() - 45;
    const userYX = imgY + imgHeight + 8;
    pdf.text(`Hora: ${dateStringHora}`, dateXH, userYX);

    pdf.setFontSize(10);
    const tipoPagoText = `Tipo de Pago: ${tipoPago}`;
    const tipoPagoX = 165;
    const tipoPagoY = imgY + imgHeight + 0;
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
    const emailY = imgY + imgHeight + 10;
    pdf.text(emailText, emailX, emailY);

    pdf.setFontSize(10);
    const telefonoText = `Telefono Vendedor: ${userData.telefono}`;
    const telefonoX = 8;
    const telefonoY = imgY + imgHeight + 15;
    pdf.text(telefonoText, telefonoX, telefonoY);

    if (clienteSeleccionado) {
      console.log("Selected client:", clienteSeleccionado);
      pdf.setFontSize(10);

      const clienteText = `Nombre Cliente: ${
        clienteSeleccionado?.nombre || ""
      } ${clienteSeleccionado?.apellido || ""}`;
      const clienteX = 78;
      const clienteY = imgY + imgHeight + 0;
      pdf.text(clienteText, clienteX, clienteY);

      const rutClienteText = `Rut Cliente: ${clienteSeleccionado.rut || ""}`;
      const rutClienteX = 78;
      const rutClienteY = imgY + imgHeight + 5;
      pdf.text(rutClienteText, rutClienteX, rutClienteY);

      const emailClienteText = `Email Cliente: ${
        clienteSeleccionado.email || ""
      }`;
      const emailClienteX = 78;
      const emailClienteY = imgY + imgHeight + 10;
      pdf.text(emailClienteText, emailClienteX, emailClienteY);

      const telefonoClienteText = `Telefono Cliente: ${
        clienteSeleccionado.telefono || ""
      }`;
      const telefonoClienteX = 78;
      const telefonoClienteY = imgY + imgHeight + 15;
      pdf.text(telefonoClienteText, telefonoClienteX, telefonoClienteY);
    } else {
      pdf.setFontSize(10);
      const errorText = "Error: Cliente no seleccionado";
      pdf.text(errorText, 78, imgY + imgHeight);
    }

    const lineY = tipoPagoY + 20;
    pdf.line(5, lineY, pdf.internal.pageSize.getWidth() - 5, lineY);

    const lineX = 5;
    pdf.line(lineX, lineSeparatorY, lineX, tipoPagoY + 20);

    const lineX0 = 75;
    pdf.line(lineX0, lineSeparatorY, lineX0, tipoPagoY + 20);

    const lineX1 = 163;
    pdf.line(lineX1, lineSeparatorY, lineX1, tipoPagoY + 20);

    const lineX2 = 205;
    pdf.line(lineX2, lineSeparatorY, lineX2, tipoPagoY + 20);

    const fontSize = 10;
    pdf.setFontSize(fontSize);

    const headers = [
      "Producto",
      "Cantidad",
      "Descripción",
      "Precio U.",
      "Total",
      "Total Producto",
    ];
    const tableX = 10;
    const tableY = lineY + 12;

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

    const rowSpacing = 3;
    const productosHeight = productosSeleccionados.reduce(
      (total, producto) =>
        total + pdf.getTextDimensions(producto.descripcion).h + rowSpacing,
      0
    );

    const tableLineX1 = tableX + 40;
    const tableLineX2 = tableX + 120;
    const tableLineX3 = tableX + 160;
    const tableLineX4 = pdf.internal.pageSize.getWidth() - 143;
    const tableLineX5 = pdf.internal.pageSize.getWidth() - 205;
    const tableLineX6 = pdf.internal.pageSize.getWidth() - 5;

    pdf.line(
      tableLineX1,
      tableLineY,
      tableLineX1,
      tableY + productosHeight - 4
    );
    pdf.line(
      tableLineX2,
      tableLineY,
      tableLineX2,
      tableY + productosHeight - 4
    );
    pdf.line(
      tableLineX3,
      tableLineY,
      tableLineX3,
      tableY + productosHeight - 4
    );
    pdf.line(
      tableLineX4,
      tableLineY,
      tableLineX4,
      tableY + productosHeight - 4
    );
    pdf.line(
      tableLineX5,
      tableLineY,
      tableLineX5,
      tableY + productosHeight - 4
    );
    pdf.line(
      tableLineX6,
      tableLineY,
      tableLineX6,
      tableY + productosHeight - 4
    );

    let neto = 0;
    let currentY = tableY + 10;
    const hasEnoughSpace = () =>
      currentY + 30 < pdf.internal.pageSize.getHeight();
    productosSeleccionados.forEach((producto) => {
      if (!hasEnoughSpace()) {
        pdf.addPage();
        currentY = 20;
      }
      const { h } = pdf.getTextDimensions(producto.descripcion);
      const lines = pdf.splitTextToSize(producto.descripcion, 50);

      lines.forEach((line, i) => {
        pdf.text(line, tableX + 60, currentY);
        currentY += h + rowSpacing;
      });

      pdf.text(producto.nombreProducto, tableX, currentY - 10);
      pdf.text(producto.cantidad.toString(), tableX + 45, currentY - 10);

      const costoNumerico = parseFloat(
        producto.costo.replace(/\./g, "").replace(",", ".")
      );

      pdf.text(
        costoNumerico.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        tableX + 120,
        currentY - 10
      );

      const totalProducto = producto.cantidad * costoNumerico;
      pdf.text(
        totalProducto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        tableX + 160,
        currentY - 10
      );

      neto += totalProducto;

      currentY += h + rowSpacing;
    });

    pdf.line(
      5,
      currentY + 5,
      pdf.internal.pageSize.getWidth() - 130,
      currentY + 5
    );

    pdf.text(
      `Neto: ${neto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 10
    );

    const iva = neto * 0.19;
    pdf.text(
      `Total IVA (19%): ${iva
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 20
    );

    const totalFinal = neto + iva;
    pdf.text(
      `Total Final: ${totalFinal
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 30
    );

    const descuento = parseInt(descuentoMenuValue, 10);
    const descuentoTotalFinal = (descuento / 100) * totalFinal;

    setDescuentoAplicado(descuentoTotalFinal);
    setShowDiscountMenu(false);

    pdf.text(
      `Descuento: ${descuentoTotalFinal
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 40
    );
    pdf.text(
      `Total Final con Descuento: ${(totalFinal - descuentoTotalFinal)
        .toFixed(0)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 50
    );

    const verticalLineX = pdf.internal.pageSize.getWidth() - 130;
    pdf.line(verticalLineX, currentY + 5, verticalLineX, currentY + 56);

    const secondVerticalLineX = pdf.internal.pageSize.getWidth() - 205;
    pdf.line(
      secondVerticalLineX,
      currentY + 5,
      secondVerticalLineX,
      currentY + 56
    );

    pdf.line(
      5,
      currentY + 33,
      pdf.internal.pageSize.getWidth() - 130,
      currentY + 33
    );
    pdf.line(
      5,
      currentY + 56,
      pdf.internal.pageSize.getWidth() - 130,
      currentY + 56
    );

    setActualizacion((prevActualizacion) => prevActualizacion + 1);

    const pdfBase64 = pdf.output("datauristring");
    const storageRef = ref(storage, "misFacturas/" + invoiceNumber + ".pdf");
    const blob = new Blob([pdf.output("blob")], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
    try {
      await uploadString(storageRef, pdfBase64, "data_url");
      console.log("PDF guardado en el Storage de Firebase");
    } catch (error) {
      console.error("Error al guardar el PDF en el Storage:", error);
    }
    return totalFinal - descuentoAplicado;
  };

  const generarBoleta = async () => {
    if (productosSeleccionados.length === 0) {
      alert("No hay productos seleccionados para generar la boleta.");
      return;
    }

    let boletasCollection;
    let nuevaBoleta;

    try {
      boletasCollection = collection(db, "misBoletas");
      const batch = writeBatch(db);

      for (const producto of productosSeleccionados) {
        const productoRef = doc(db, "inventario", producto.id);

        if (typeof producto.cantidad === "number") {
          const docSnapshot = await getDoc(productoRef);
          const existingQuantity = docSnapshot.data().cantidad;

          if (existingQuantity < producto.cantidad) {
            alert(`No hay suficiente stock para ${producto.nombre}.`);
            return;
          }

          const newQuantity = existingQuantity - producto.cantidad;

          batch.update(productoRef, { cantidad: newQuantity });
        } else {
          console.error("Invalid cantidad value:", producto.cantidad);
        }
      }

      await batch.commit();

      const totalBoleta = await generarBoletaPDF(
        productosSeleccionados,
        totalSinIVA,
        descuentoAplicado
      );
      const boletaNumber = generateInvoiceNumber();
      const fecha = obtenerFechaActual();
      const time = new Date().toLocaleTimeString("es-CL", { hour12: false });
      const timestamp = new Date().getTime();
      nuevaBoleta = {
        boletaNumber: boletaNumber,
        tipo: "Boleta",
        total: totalBoleta,
        fecha: fecha,
        time: time,
        timestamp: timestamp,
        tipoPago: tipoPago,
      };

      const nuevaBoletaRef = await addDoc(boletasCollection, nuevaBoleta);

      const boletaId = nuevaBoletaRef.id;
      nuevaBoleta.boletaNumber = boletaId;

      await updateDoc(doc(boletasCollection, boletaId), nuevaBoleta);

      const historialVentasCollection = collection(db, "historialVentas");
      await addDoc(historialVentasCollection, {
        totalCompra: parseInt(totalBoleta, 10),
        tipo: "Boleta",
        fecha: fecha,
        time: time,
        tipoPago: tipoPago,
      });

      generarBoletaPDF(productosSeleccionados);
      setProductosSeleccionados([]);
      setActualizacion((prevActualizacion) => prevActualizacion + 1);
    } catch (error) {
      console.error("Error al generar la boleta:", error);
    }
  };

  const generarBoletaPDF = async (
    productosSeleccionados,
    totalSinIVA,
    descuentoAplicado
  ) => {
    let neto = 0;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 210],
    });

    const imgData = "../../../images/AutoSinFondo.png";
    const imgWidth = 20;
    const imgHeight = 20;
    const imgX = pdf.internal.pageSize.getWidth() - imgWidth - 10;
    const imgY = -5;
    pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);

    pdf.setFontSize(14);
    pdf.text("Boleta Settore", pdf.internal.pageSize.getWidth() / 2, 15, {
      align: "center",
    });

    const lineSeparatorY = -1;

    pdf.setFontSize(6);
    const userText = `Nombre Vendedor: ${userData.nombre} ${userData.apellido} `;
    const userX = 5;
    const userY = imgY + imgHeight + 6;
    pdf.text(userText, userX, userY);

    pdf.setFontSize(6);
    const rutText = `Rut Vendedor: ${userData.rut}`;
    const rutX = 5;
    const rutY = imgY + imgHeight + 8;
    pdf.text(rutText, rutX, rutY);

    pdf.setFontSize(6);
    const emailText = `Email Vendedor: ${userData.email}`;
    const emailX = 5;
    const emailY = imgY + imgHeight + 10;
    pdf.text(emailText, emailX, emailY);

    pdf.setFontSize(6);
    const invoiceNumberText = `N° Boleta: ${invoiceNumber}`;
    const invoiceNumberX = 52;
    const invoiceNumberY = imgY + imgHeight + 10;
    pdf.text(invoiceNumberText, invoiceNumberX, invoiceNumberY);

    const today = new Date();
    const dateString = today.toLocaleDateString();
    const dateX =
      pdf.internal.pageSize.getWidth() -
      pdf.getStringUnitWidth(dateString) * pdf.internal.getFontSize() -
      5;
    pdf.text(`Fecha: ${dateString}`, dateX, userY);

    const hour = String(today.getHours()).padStart(2, "0");
    const minute = String(today.getMinutes()).padStart(2, "0");
    const second = String(today.getSeconds()).padStart(2, "0");
    const dateStringHora = `${hour}:${minute}:${second}`;
    const dateXH =
      pdf.internal.pageSize.getWidth() -
      pdf.getStringUnitWidth(dateString) * pdf.internal.getFontSize() -
      5;
    const userYX = imgY + imgHeight + 8;
    pdf.text(`Hora: ${dateStringHora}`, dateXH, userYX);

    pdf.line(
      5,
      lineSeparatorY,
      pdf.internal.pageSize.getWidth() - 5,
      lineSeparatorY
    );

    // Encabezado
    const lineY = 18;
    pdf.line(5, lineY, pdf.internal.pageSize.getWidth() - 5, lineY);

    // Lista de productos
    const fontSize = 6;
    pdf.setFontSize(fontSize);

    const headers = [
      "Producto",
      "Cantidad",
      "Descripción",
      "Precio U.",
      "Total",
      "Total Producto",
    ];
    const tableX = 5;
    const tableY = 29;

    pdf.text(headers[0], tableX, tableY); // producto
    pdf.text(headers[1], tableX + 24, tableY); // cantitadad
    pdf.text(headers[3], tableX + 38, tableY); // precio u
    pdf.text(headers[5], tableX + 55, tableY); // totalProducto

    const lineY2 = 30;
    pdf.line(5, lineY2, pdf.internal.pageSize.getWidth() - 5, lineY2);

    const tableLineY = tableY - 3;
    pdf.line(5, tableLineY, pdf.internal.pageSize.getWidth() - 5, tableLineY);

    let currentY = tableY + 5;
    const hasEnoughSpace = () =>
      currentY + 15 < pdf.internal.pageSize.getHeight();
    productosSeleccionados.forEach((producto) => {
      if (!hasEnoughSpace()) {
        pdf.addPage();
        currentY = 20;
      }
      pdf.text(producto.nombreProducto, tableX, currentY);

      pdf.text(producto.cantidad.toString(), tableX + 28, currentY);

      const costoNumerico = parseFloat(
        producto.costo.replace(/\./g, "").replace(",", ".")
      );

      pdf.text(
        costoNumerico.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        tableX + 39,
        currentY
      );

      const totalProducto = producto.cantidad * costoNumerico;
      pdf.text(
        totalProducto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "."),
        tableX + 58,
        currentY
      );

      neto += totalProducto;
      currentY += 10;
    });

    pdf.line(
      5,
      currentY + 5,
      pdf.internal.pageSize.getWidth() - 20,
      currentY + 5
    );

    pdf.text(
      `Neto: ${neto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 10
    );

    const iva = neto * 0.19;
    pdf.text(
      `IVA (19%): ${iva.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 15
    );

    const totalFinal = neto + iva;
    pdf.text(
      `Total: ${totalFinal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
      tableX + 0,
      currentY + 20
    );

    setActualizacion((prevActualizacion) => prevActualizacion + 1);

    const pdfBase64 = pdf.output("datauristring");
    const storageRef = ref(storage, "misFacturas/" + invoiceNumber + ".pdf");
    const blob = new Blob([pdf.output("blob")], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    URL.revokeObjectURL(url);
    try {
      await uploadString(storageRef, pdfBase64, "data_url");
      console.log("PDF guardado en el Storage de Firebase");
    } catch (error) {
      console.error("Error al guardar el PDF en el Storage:", error);
    }
    return totalFinal;
  };

  function generateInvoiceNumber() {
    const letters =
      String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
      String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const numbers = Math.floor(100 + Math.random() * 900);
    const invoiceNumber = `${letters}${numbers}`;
    return invoiceNumber;
  }

  const invoiceNumber = generateInvoiceNumber();

  const toggleDiscountMenu = () => {
    setShowDiscountMenu(!showDiscountMenu);
  };

  const totalSinIVA = productosSeleccionados.reduce((total, producto) => {
    const costoTotalProducto = (producto.costo || 0) * (producto.cantidad || 1);
    return total + costoTotalProducto;
  }, 0);

  const iva = totalSinIVA * 0.19;
  const totalFinal = totalSinIVA + iva;

  useEffect(() => {
    const obtenerInventario = async () => {
      try {
        const inventarioSnapshot = await getDocs(collection(db, "inventario"));
        const datosInventario = inventarioSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventario(datosInventario);
      } catch (error) {
        console.error("Error al obtener el inventario:", error);
      }
    };

    obtenerInventario();
  }, [actualizacion, refresh]);

  const toggleSeleccionProducto = (id) => {
    const productoIndex = productosSeleccionados.findIndex(
      (producto) => producto.id === id
    );
    if (productoIndex === -1) {
      const productoSeleccionado = inventario.find(
        (producto) => producto.id === id
      );
      setProductosSeleccionados([
        ...productosSeleccionados,
        { ...productoSeleccionado, cantidad: 1 },
      ]);
      setShowProductList(false);
    } else {
      const nuevaLista = [...productosSeleccionados];
      nuevaLista.splice(productoIndex, 1);
      setProductosSeleccionados(nuevaLista);
      setShowProductList(false);
    }
  };

  const toggleProductList = () => {
    console.log("Toggle Product List");
    setShowProductList(!showProductList);
  };

  const quitarProducto = (id) => {
    const nuevaLista = productosSeleccionados.filter(
      (producto) => producto.id !== id
    );
    setProductosSeleccionados(nuevaLista);
  };

  const actualizarCantidadManual = (id, nuevaCantidad) => {
    const producto = inventario.find((p) => p.id === id);
    if (producto && nuevaCantidad > producto.cantidad) {
      alert("No hay suficiente stock disponible");
      return;
    }
    setProductosSeleccionados((prevProductos) => {
      return prevProductos.map((p) =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      );
    });
  };

  const buscadorProducto = (e) => {
    const { value } = e.target;
    const inventarioFiltrado = inventario.filter((producto) => {
      return producto.nombreProducto
        .toLowerCase()
        .includes(value.toLowerCase());
    });
    setInventario(inventarioFiltrado);
    if (value === "") {
      setRefresh((prevRefresh) => !prevRefresh);
    }
  };

  const handleDescuentoChange = (e) => {
    const { value } = e.target;
    if (/^[1-9][0-9]?$|^100$/.test(value) || value === "") {
      setDescuentoMenuValue(value);
    }
  };

  const aplicarDescuento = () => {
    const descuento = parseInt(descuentoMenuValue, 10);
    console.log(`Descuento aplicado: ${descuento}%`);
    const descuentoCantidad = (descuento / 100) * totalSinIVA;
    const descuentoTotalFinal =
      (descuento / 100) * (totalSinIVA + totalSinIVA * 0.19);

    setDescuentoAplicado(descuentoTotalFinal);
    setShowDiscountMenu(false);
  };

  const cancelarDescuento = () => {
    setShowDiscountMenu(false);
    setDescuentoMenuValue(0);
  };

  const mostrarDescuentoMenu = () => {
    if (showDiscountMenu) {
      return (
        <AplicarDescuento
          showDiscountMenu={showDiscountMenu}
          descuentoMenuValue={descuentoMenuValue}
          handleDescuentoChange={handleDescuentoChange}
          aplicarDescuento={aplicarDescuento}
          cancelarDescuento={cancelarDescuento}
        />
      );
    }
  };

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const clientesSnapshot = await getDocs(collection(db, "clientes"));
        const datosClientes = clientesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(datosClientes);
      } catch (error) {
        console.error("Error al obtener la lista de clientes:", error);
      }
    };

    obtenerClientes();
  }, [refresh]);

  const toggleClienteVista = () => {
    setShowClienteVista(!showClienteVista);
  };

  const seleccionarCliente = (cliente) => {
    console.log("Selected Client:", cliente);
    setClienteSeleccionado(cliente);
    toggleClienteVista();
  };

  const eliminarCliente = async (clienteId) => {
    try {
      const clienteDocRef = doc(db, "clientes", clienteId);
      await deleteDoc(clienteDocRef);

      setClientes(clientes.filter((cliente) => cliente.id !== clienteId));
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const filtrarCliente = (e) => {
    const texto = e.target.value.toLowerCase();
    const filtro = clientes.filter((clientes) => {
      return (
        clientes.nombre.toLowerCase().includes(texto) ||
        clientes.apellido.toLowerCase().includes(texto) ||
        clientes.rut.toLowerCase().includes(texto) ||
        clientes.email.toLowerCase().includes(texto) ||
        clientes.telefono.toLowerCase().includes(texto)
      );
    });
    setClientes(filtro);

    if (texto === "") {
      setRefresh((prevRefresh) => !prevRefresh);
    }
  };

  const mostrarListadoClientes = () => {
    if (showClienteVista) {
      return (
        <>
          {showClienteVista && (
            <ClienteVista
              clientes={clientes}
              setClientes={setClientes}
              toggleClienteVista={toggleClienteVista}
              seleccionarCliente={seleccionarCliente}
              eliminarCliente={eliminarCliente}
              filtrarCliente={filtrarCliente}
            />
          )}
        </>
      );
    }
  };

  const mostrarListadoProductos = () => {
    if (showProductList) {
      return (
        <ListadoProductos
          showProductList={showProductList}
          productosSeleccionados={productosSeleccionados}
          actualizarCantidadManual={actualizarCantidadManual}
          quitarProducto={quitarProducto}
          setProductosSeleccionados={setProductosSeleccionados}
          toggleProductList={toggleProductList}
        />
      );
    }
  };

  const getRowStyle = (cantidad) => {
    return cantidad <= 10 ? { backgroundColor: "#ffcccc" } : {};
  };

  return (
    <>
        <Admin />
      <div className="tabla_listar">
        <div className="table_header">
          <h2>Generar Factura</h2>
          <Stack spacing={2} direction="row">
            <Button
              onClick={() => generarFactura(productosSeleccionados)}
              variant="outlined"
              sx={{ height: "55px", marginTop: "10px" }}
            >
              <ReceiptLongIcon />
              Generar Factura
            </Button>
            <Button
              onClick={() => generarBoleta(productosSeleccionados)}
              variant="outlined"
              sx={{ height: "55px", marginTop: "10px" }}
            >
              <ReceiptIcon />
              Generar Boleta
            </Button>
            <Button
              onClick={toggleDiscountMenu}
              variant="outlined"
              sx={{ height: "55px", marginTop: "10px" }}
            >
              <PercentIcon />
              Añadir Descuento
            </Button>
            <Button
              onClick={toggleProductList}
              variant="outlined"
              sx={{ height: "55px", marginTop: "10px" }}
            >
              <ShoppingCartIcon />
              {showProductList ? "" : ""} ({productosSeleccionados.length})
            </Button>
            <Button
              onClick={toggleClienteVista}
              variant="outlined"
              sx={{ height: "55px", marginTop: "10px" }}
            >
              <PeopleIcon />
              Seleccionar Cliente
            </Button>
            <FormControl
              sx={{ height: "30px", marginTop: "10px", width: "140px" }}
            >
              <InputLabel id="Tipo de Pago">Tipo de Pago</InputLabel>
              <Select
                labelId="Tipo de Pago"
                id="Tipo de Pago"
                value={tipoPago}
                label="Tipo de Pago"
                onChange={(e) => setTipoPago(e.target.value)}
              >
                <MenuItem value={"contado"}>Contado</MenuItem>
                <MenuItem value={"credito"}>Crédito</MenuItem>
                <MenuItem value={"debito"}>Débito</MenuItem>
              </Select>
            </FormControl>
            <TextField
              onChange={buscadorProducto}
              sx={{ height: "45px", marginTop: "10px" }}
              id="Buscar producto"
              label="Buscar producto"
              variant="outlined"
            />
          </Stack>

          {showDiscountMenu && mostrarDescuentoMenu()}
          {showProductList && mostrarListadoProductos()}
          {mostrarListadoClientes()}
        </div>
        <div className="table_section">
          <TableContainer component={Paper} aria-label="simple table">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Seleccionar</TableCell>
                  <TableCell>Código Producto</TableCell>
                  <TableCell>Nombre del Producto</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Costo</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Cantidad Seleccionada</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventario.map((item) => (
                  <TableRow key={item.id} style={getRowStyle(item.cantidad)}>
                    <TableCell>
                      <Checkbox
                        onChange={() => toggleSeleccionProducto(item.id)}
                        checked={productosSeleccionados.some(
                          (producto) => producto.id === item.id
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{item.codigoProducto}</TableCell>
                    <TableCell>{item.nombreProducto}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell>{item.costo}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="0"
                        style={{ width: "80px" }}
                        value={
                          productosSeleccionados.find(
                            (producto) => producto.id === item.id
                          )?.cantidad || ""
                        }
                        onChange={(e) => {
                          const nuevaCantidad =
                            parseInt(e.target.value, 10) || 0;
                          actualizarCantidadManual(item.id, nuevaCantidad);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default GenerarFactura;
