import React, {useEffect, useState} from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { createProduct, updateProduct } from 'js/services/backendHttpService'
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";

function Add({ updateTable, updatePagination, totalRows, clearEdit, editData }) {

  const [productId, setProductId] = useState ("");
  const [name, setName] = useState ("");
  const [acquisitionDate, setAcquisitionDate] = useState(null);

  const addNewProduct = () => {
    if (productId!== "" && name!== "" && acquisitionDate!== null) {
      createProduct({
        id: productId,
        name: name,
        acquisitionDate: acquisitionDate,
      }).then( response => {
          setName("");
          setProductId("");
          setAcquisitionDate(null);
          updateTable();
          updatePagination(totalRows + 1);
        }
      ).catch(response => {
        debugger;
        alert(response.response.data.message)
      })
    } else {
      alert("all fields are required")
    }

  }

  const editProduct = () => {
    if (name!== "" && acquisitionDate!== "") {
      updateProduct({
        id: editData.id,
        name: name,
        acquisitionDate: acquisitionDate,
      }).then( response => {
          setName("");
          setProductId("");
          setAcquisitionDate(null);
          clearEdit();
          updateTable();
        }
      ).catch(response => {
        alert(response)
      })
    } else {
      alert("all fields are required")
    }
  }

  useEffect(() => {
    if(editData.id) {
      setProductId(editData.id);
      setName(editData.name);
      setAcquisitionDate(new Date(editData.acquisitionDate));
    }
  }, [editData]);

  return (
    <div className="add_wrapper">

      <label className="content_label">Id</label>
      <input type="text" className="content_input" disabled={editData.id !== ""} onChange={(event) => setProductId(event.target.value)} value={productId}/>

      <label className="content_label">Nombre</label>
      <input type="text" className="content_input" onChange={(event) => setName(event.target.value)} value={name}/>
      {/*add date selector*/}
      <label className="content_label" >Día de adquisición</label>
      <DatePicker selected={acquisitionDate} onChange={date => setAcquisitionDate(date)} dateFormat="yyyy-MM-dd"/>

      {editData.id === "" ?
        <button type="button" className="add_button" onClick={addNewProduct}>Agregar</button> :
        <button type="button" className="edit_button" onClick={editProduct}>Editar</button>
      }


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
