// import { updateOrder } from "@/actions/order/updateOrder";
import { test } from 'vitest'
// import { updateOrderResponse } from "@/actions/order/updateOrder"
// import { ClientEntity } from "@/models/order/types/orderEntity";
// import { OrderPaymentMethod } from "@/models/order/types/orderPaymentMethod";
// import { OrderState } from "@/models/order/types/orderState";

test.skip("updateOrder", async () => {
//     const res = await updateOrder({
//         id: "67d857bb15a4485334517bc1",
//         email: "johndoe@gmail.com",
//         products: ["67d857bb15a4485334517bc1", "67d2e74e753515a745ffebf4"],
//         additional_info: {
//             delivery_address: {
//                 firstname: "John",
//                 lastname: "Doe",
//                 tel_number: "123456789",
//                 country: "USA",
//                 region: "California",
//                 city: "Los Angeles",
//                 home_address: "123 Main St"
//             },
//             billing_address: {
//                 company_name: "Tech Corp",
//                 idno: "123456",
//                 country: "USA",
//                 region: "California",
//                 city: "San Francisco",
//                 home_address: "456 Market St"
//             },
//             entity_type: ClientEntity.Legal
//         },
//         payment_method: OrderPaymentMethod.Paynet,
//         state: OrderState.Paid
//     });

//     assert(res.success === true, res.error);

//     expectTypeOf(res).toEqualTypeOf<updateOrderResponse>();
})