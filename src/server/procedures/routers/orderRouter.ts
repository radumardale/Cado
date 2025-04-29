import { getAllOrdersProcedure } from "../order/getAllOrders";
import { router } from '../../trpc';
import { addOrderProcedure } from "../order/addOrder";
import { getOrderByIdProcedure } from "../order/getOrderById";
import { updateOrderProcedure } from "../order/updateOrder";

export const orderRouter = router({
    addOrder: addOrderProcedure,
    getAllOrders: getAllOrdersProcedure,
    getOrderById: getOrderByIdProcedure,
    updateOrder: updateOrderProcedure
});