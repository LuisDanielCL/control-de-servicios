import 'styles/service.scss';

import React, {useState, useEffect, useCallback} from 'react';
import Add from 'js/service/add';
import {getServices, getTotalServices, deleteService } from "../services/backendHttpService";
import { formatDate } from 'js/common/dateHelper'
import { CSVLink } from "react-csv";

const stateMapping = {
  PENDIENTE: "Pendiente",
  ENPROGRESO: "En progreso",
  FINALIZADO: "Finalizado"
}

const headers = [
  { label: "Id", key: "id" },
  { label: "Next Service date", key: "nextServiceDate" },
  { label: "Product Id", key: "productId" },
  { label: "Type", key: "type" },
  { label: "state", key: "state" },
  { label: "Product Name", key: "product.name" },
  { label: "Product Acquisition Date", key: "product.acquisitionDate" }
];
const csvPageLink = React.createRef();
const csvAllLink = React.createRef();

function Service() {
  const limit = 20;
  const [services, setService] = useState ([]);
  const [offset, setOffset] = useState (0);
  const [sort, setSort] = useState ("");
  const [sortDirection, setSortDirection] = useState ("");
  const [isLoading, setIsLoading] = useState (true);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editData, setEditData] = useState({id: ""});
  const [csvData, setCsvData] = useState([]);





  const updateTable = useCallback(() => {
    setIsLoading(true)
    const options = {
      offset: offset*limit,
      limit: limit
    };
    if (sort !== "") options.filter = sort;
    if (sortDirection !== "") options.direction = sortDirection;

    getServices(options).then(response => {
      setIsLoading(false)
      setService(response.data);
    }).catch(response => {
      alert(response);
    });
  }, [offset, sort, sortDirection])

  const updatePagination = useCallback((rowsCount) => {
    setTotalRows(rowsCount);
    if(rowsCount === 0) {
      setTotalPages(1);
    } else {
      setTotalPages(Math.ceil(rowsCount / limit));
    }

  }, []);

  useEffect(() => {
    updateTable()
  }, [updateTable]);

  useEffect(() => {
    getTotalServices().then(response => {
      updatePagination(response.data.count);
    }).catch(response => {
      alert(response);
    });
  }, [updatePagination]);

  const remove = (id) => {
    deleteService(id).then(response => {
      updateTable();
      updatePagination(totalRows - 1);
    }).catch(response => {
      alert(response);
    });
  }

  const csvAllGetData = () => {
    getServices({}).then(response => {
      setCsvData(response.data);
      csvAllLink.current.link.click();
    }).catch(response => {
      alert(response);
    });
  }

  const renderData = (data, index) => {
    const acquisitionDate = formatDate(data.product.acquisitionDate);
    const nextServiceDate = formatDate(data.nextServiceDate);

    return (
      <tr key={'product_'+data.id}>
        <td>{data.id}</td>
        <td>{data.product.id}</td>
        <td>{data.product.name}</td>
        <td>{acquisitionDate}</td>
        <td>{nextServiceDate}</td>
        <td>{data.type}</td>
        <td>{stateMapping[data.state]}</td>
        <td>
          <button className="delete_button" onClick={() => remove(data.id)}>Borrar</button>
          <button className="edit_button" onClick={() =>
            setEditData({ id: data.id, productId: data.productId, type: data.type, state:data.state, nextServiceDate: data.nextServiceDate })
          }>
            Editar
          </button>
        </td>
      </tr>
    )
  };


  return (

    <div className="wrapper">

      <Add
        updateTable={() => {updateTable()}}
        updatePagination={(count) => {updatePagination(count)}}
        totalRows={totalRows}
        clearEdit={() => {setEditData({id: ""})}}
        editData={editData}
      />

      <div className="order_options">
        <label className="content_label">Ordenar por:</label>
        <div className="box">
          <select id="SortBy" onChange={(event) => {setOffset(0);setSort(event.target.value)}} value={sort}>
            <option value=""/>
            <option value="service.id">id</option>
            <option value="product.id">Id del producto</option>
            <option value="product.name">Nombre</option>
            <option value="product.acquisitionDate">Fecha de adquisición</option>
            <option value="service.nextServiceDate">Fecha del proximo servicio</option>
            <option value="service.type">Tipo</option>
            <option value="service.state">Estado</option>
          </select>
        </div>

        <label className="content_label">Dirección:</label>
        <div className="box">
          <select id="Order" onChange={(event) => {setOffset(0);setSortDirection(event.target.value)}} value={sortDirection}>
            <option value=""/>
            <option value="ASC">Acs</option>
            <option value="DESC">Desc</option>
          </select>
        </div>
      </div>

      <div className="csv_wrapper">
        <CSVLink data={services} headers={headers} filename="page.csv" ref={csvPageLink}/>
        <CSVLink data={csvData} headers={headers} filename="all.csv" ref={csvAllLink}/>
        <button type="button" className="edit_button" onClick={() => {csvPageLink.current.link.click()}}>exportar pagina a CSV</button>
        <button type="button" className="edit_button" onClick={() => {csvAllGetData()}}>exportar todo a CSV</button>

      </div>

      <div className="table-data">
        <table>
          <thead>
          <tr>
            <th>Id</th>
            <th>Id producto</th>
            <th>Nombre</th>
            <th>Fecha de adquisición</th>
            <th>Fecha proximo servicio</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
          </thead>
          {!isLoading &&
          <tbody>
          {services.map(renderData)}
          </tbody>
          }

        </table>

        {isLoading &&
        <div className="wrapper_loader">
          <div className="loader"/>
        </div>
        }


      </div>
      <div className="wrapper_pagination">
        <button className="button_pagination" disabled={offset < 1} onClick={() => {setOffset(offset - 1)}}>
          Anterior
        </button>
        <button className="button_pagination" disabled={totalPages <= offset+1} onClick={() => {setOffset(offset + 1)}}>
          Siguiente
        </button>

        <label>{offset+1} de {totalPages}</label>
      </div>


    </div>
  );
}

export default Service;
