import { getProductsProcedure } from "../product/getProducts";
import { router } from '../../trpc';
import { getProductProcedure } from "../product/getProduct";
import { addProductProcedure } from "../product/addProduct";
import { updateProductProcedure } from "../product/updateProduct";
import { deleteProductProcedure } from "../product/deleteProduct";
import { getAllProductsProcedure } from "../product/getAllProducts";
import { getRecProductsProcedure } from "../product/getRecProducts";

export const productRouter = router({
    getProducts: getProductsProcedure,
    getAllProducts: getAllProductsProcedure,
    getProductById: getProductProcedure,
    createProduct: addProductProcedure,
    updateProduct: updateProductProcedure,
    deleteProduct: deleteProductProcedure,
    getRecProduct: getRecProductsProcedure
});