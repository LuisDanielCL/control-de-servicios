import http from "js/common/http-common";

const createProduct = data => {
  return http.post("/product", data);
};

const updateProduct = data => {
  return http.put("/product", data);
};

const getProducts = data => {
  return http.get("/product", { params: data});
};

const getProduct = productId => {
  return http.get("/product/"+productId);
};

const getTotalProducts = () => {
  return http.get("/products/count");
}

const deleteProduct = (id) => {
  return http.delete("/product/"+id);
}

const createService = data => {
  return http.post("/service", data);
};

const updateService = data => {
  return http.put("/service", data);
};

const getServices = data => {
  return http.get("/service", { params: data});
};

const getTotalServices = () => {
  return http.get("/services/count");
}

const deleteService = (id) => {
  return http.delete("/service/"+id);
}


export {
  createProduct,
  getProducts,
  getTotalProducts,
  deleteProduct,
  updateProduct,
  createService,
  updateService,
  getServices,
  getTotalServices,
  deleteService,
  getProduct
}
