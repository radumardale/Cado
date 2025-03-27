import { getAllOrdersProcedure } from "../order/getAllOrders";
import { router } from '../../trpc';

export const orderRouter = router({
    getAllOrders: getAllOrdersProcedure,
});