import { getAllOrdersProcedure } from '../order/getAllOrders';
import { router } from '../../trpc';
import { addOrderProcedure } from '../order/addOrder';
import { getOrderByIdProcedure } from '../order/getOrderById';
import { updateOrderProcedure } from '../order/updateOrder';
import { deleteOrderProcedure } from '../order/deleteOrder';
import { cancelOrderProcedure } from '../order/cancelOrderPayment';

export const orderRouter = router({
  addOrder: addOrderProcedure,
  getAllOrders: getAllOrdersProcedure,
  getOrderById: getOrderByIdProcedure,
  updateOrder: updateOrderProcedure,
  deleteOrder: deleteOrderProcedure,
  cancelOrder: cancelOrderProcedure,
});
