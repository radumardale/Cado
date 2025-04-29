export enum OrderState {
    NotPaid = "NOT_PAID",
    Paid = "PAID",
    Delivered = "DELIVERED"
}

export const orderStateColors: Record<OrderState, string> = {
    [OrderState.Paid]: "#3A9F5C",
    [OrderState.Delivered]: "#929292",
    [OrderState.NotPaid]: "#FF3E3E",
};