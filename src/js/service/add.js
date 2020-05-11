import React, { useEffect, useState } from 'react';
import {createService, getProduct, updateService} from 'js/services/backendHttpService'
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

function Add({ updateTable, updatePagination, totalRows, clearEdit, editData }) {

  const [productId, setProductId] = useState ("");
  const [finalProductId, setFinalProductId] = useState("");
  const [productNotFound, setProductNotFound] = useState(false);
  const [nextServiceDate, setNextServiceDate] = useState (null);
  const [serviceState, setServiceState] = useState ("");
  const [serviceType, setServiceType] = useState ("");

  const addNewService = () => {
    if (productId!== "" && nextServiceDate!== "") {
      createService({
        productId: finalProductId,
        type: serviceType,
        state: serviceState,
        nextServiceDate: nextServiceDate
      }).then( response => {
          setProductId("")
          setFinalProductId("");
          setServiceState("");
          setServiceType("");
          setNextServiceDate(null);
          updateTable();
          updatePagination(totalRows + 1);
        }
      ).catch(response => {
        console.log("error");
        console.log(response);
      })
    } else {
      alert("all fields are required")
    }

  }

  const editService = () => {
    if (nextServiceDate!== "") {
      updateService({
        id: editData.id,
        productId: finalProductId,
        type: serviceType,
        state: serviceState,
        nextServiceDate: nextServiceDate
      }).then( response => {
          setProductId("")
          setFinalProductId("");
          setServiceState("");
          setServiceType("");
          setNextServiceDate(null);
          setProductNotFound(false);
          clearEdit();
          updateTable();
        }
      ).catch(response => {
        console.log("error");
        console.log(response);
      })
    } else {
      alert("all fields are required")
    }
  }

  const findProduct = () => {
    getProduct(productId).then( response => {
        if (response.data.id) {
          setProductNotFound(false);
          setFinalProductId(response.data.id)
        } else {
          setProductNotFound(true);
          setFinalProductId("")
        };
      }
    ).catch(response => {
      console.log("error");
      console.log(response);
    })
  }

  useEffect(() => {
    if(editData.id) {
      setFinalProductId(editData.productId)
      setServiceType(editData.type)
      setServiceState(editData.state)
      setNextServiceDate(new Date(editData.nextServiceDate));
    }
  }, [editData]);

  const disableFields = finalProductId === "";
  useEffect(() => {
    if (disableFields) {
      setNextServiceDate(null);
      setServiceState("");
      setServiceType("");
    }
  }, [disableFields, finalProductId]);



  return (
    <div className="add_wrapper">

      {!editData.id ?
        <>
          <div className="search-product">
            <label className="content_label">Id del producto</label>
            <input type="text" className="content_input" onChange={(event) => setProductId(event.target.value)} value={productId}/>
            <button type="button" className="edit_button" onClick={() => {findProduct()}}>Buscar</button>
            {productNotFound &&
              <label className="product-not-found-lbl">Producto NO encontrado</label>
            }
            {!disableFields &&
            <label className="product-found-lbl">Producto encontrado</label>
            }
          </div>
          {!disableFields &&
            <label className="final-product-lbl">Agregar servicio para producto: {finalProductId}</label>
          }
        </> :
        <label className="final-product-lbl">Editando Servicio: {editData.id}, Del producto: {finalProductId}</label>
      }
      <div className="content_wrapper">
        <label className="content_label" >Tipo</label>
        <input type="text" className="content_input" disabled={disableFields} onChange={(event) => setServiceType(event.target.value)} value={serviceType}/>
        <label className="content_label" >Estado</label>
        <div className="box">
          <select id="SortBy" disabled={disableFields} onChange={(event) => {setServiceState(event.target.value)}} value={serviceState}>
            <option value=""/>
            <option value="PENDIENTE">Pendiente</option>
            <option value="ENPROGRESO">En progreso</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
        </div>
        <label className="content_label" >Fecha del proximo servicio</label>
        <DatePicker selected={nextServiceDate} onChange={date => setNextServiceDate(date)} dateFormat="yyyy-MM-dd" disabled={disableFields}/>
        {editData.id === "" ?
          <button type="button" className="add_button" onClick={addNewService}>Agregar</button> :
          <button type="button" className="edit_button" onClick={editService}>Editar</button>
        }
      </div>


    </div>
  );
}

Add.propTypes = {
  updateTable: PropTypes.func,
  updatePagination: PropTypes.func,
  totalRows: PropTypes.number,
  clearEdit: PropTypes.func,
  editData: PropTypes.object
}

export default Add;
