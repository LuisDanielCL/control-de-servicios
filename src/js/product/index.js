import 'styles/product.scss';
import 'styles/loading.scss';
import React, {useState, useEffect, useCallback} from 'react';
import Add from 'js/product/add';
import {getProducts, getTotalProducts, deleteProduct } from "../services/backendHttpService";
import { formatDate } from 'js/common/dateHelper'


function Product() {

  const limit = 20;
  const [products, setProducts] = useState ([]);
  const [offset, setOffset] = useState (0);
  const [sort, setSort] = useState ("");
  const [sortDirection, setSortDirection] = useState ("");
  const [isLoading, setIsLoading] = useState (true);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editData, setEditData] = useState({id: ""});



  const updateTable = useCallback(() => {
    setIsLoading(true)
    const options = {
      offset: offset*limit,
      limit: limit
    };
    if (sort !== "") options.filter = sort;
    if (sortDirection !== "") options.direction = sortDirection;

    getProducts(options).then(response => {
      setIsLoading(false)
      setProducts(response.data);
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
    getTotalProducts().then(response => {
      updatePagination(response.data.count);
    }).catch(response => {
      alert(response);
    });
  }, [updatePagination]);

  const remove = (id) => {
    deleteProduct(id).then(response => {
      updateTable();
      updatePagination(totalRows - 1);
    }).catch(response => {
      alert(response);
    });
  }

  const renderData = (data, index) => {
    const acquisitionDate = formatDate(data.acquisitionDate);

    return (
      <tr key={'product_'+data.id}>
        <td>{data.id}</td>
        <td>{data.name}</td>
        <td>{acquisitionDate}</td>
        <td>
          <div className="action_buttons">
            <button className="delete_button" onClick={() => remove(data.id)}>Borrar</button>
            <button className="edit_button" onClick={() => setEditData({ id: data.id, name: data.name, acquisitionDate: data.acquisitionDate })}>
              Editar
            </button>
          </div>
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
        <p className="content_label">Ordenar por:</p>
        <div className="box">
          <select id="SortBy" onChange={(event) => {setOffset(0);setSort(event.target.value)}} value={sort}>
            <option value=""/>
            <option value="id">Id</option>
            <option value="name">Nombre</option>
            <option value="acquisitionDate">Fecha de adquisición</option>
          </select>
        </div>

        <p className="content_label">Dirección: </p>
        <div className="box">
          <select id="Order" onChange={(event) => {setOffset(0);setSortDirection(event.target.value)}} value={sortDirection}>
            <option value=""/>
            <option value="ASC">Acs</option>
            <option value="DESC">Desc</option>
          </select>
        </div>
      </div>

      <div className="table-data">
        <table>
          <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Fecha de adquisición</th>
            <th>Acción</th>
          </tr>
          </thead>
          {!isLoading &&
          <tbody>
          {products.map(renderData)}
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

export default Product;
