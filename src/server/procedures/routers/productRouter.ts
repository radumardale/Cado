import { getProductsProcedure } from "../product/getProducts";
import { router } from '../../trpc';
import { getProductProcedure } from "../product/getProduct";
import { addProductProcedure } from "../product/addProduct";
import { updateProductProcedure } from "../product/updateProduct";
import { deleteProductProcedure } from "../product/deleteProduct";
import { getAllProductsProcedure } from "../product/getAllProducts";
import { getRecProductsProcedure } from "../product/getRecProducts";
import { getSimilarProducts } from "../product/getSimilarProducts";
import { getAdminProductsProcedure } from "../product/getAdminProducts";
import { getMinMaxPriceProcedure } from "../product/getMinMaxPrice";
import { getProductsByIdsProcedure } from "../product/getProductsByIds";

export const productRouter = router({
    getProducts: getProductsProcedure,
    getAllProducts: getAllProductsProcedure,
    getAdminProducts: getAdminProductsProcedure,
    getProductById: getProductProcedure,
    getProductsByIds: getProductsByIdsProcedure,
    getMinMaxPrice: getMinMaxPriceProcedure,
    createProduct: addProductProcedure,
    updateProduct: updateProductProcedure,
    deleteProduct: deleteProductProcedure,
    getRecProduct: getRecProductsProcedure,
    getSimilarProducts: getSimilarProducts
});