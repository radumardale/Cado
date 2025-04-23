export enum DeliveryHours {
    "01:00-05:00" = "01:00-05:00",
    "06:00-09:00" = "06:00-09:00",
    "10:00-13:00" = "10:00-13:00",
    "14:00-19:00" = "14:00-19:00",
    "20:00-00:00" = "20:00-00:00",
}

export const DeliveryHoursArr = Object.values(DeliveryHours).filter(value => typeof value === 'string') as string[];

const deliveryAdditionalRate: Record<DeliveryHours, number> = {
    [DeliveryHours["01:00-05:00"]]: 0.6,
    [DeliveryHours["06:00-09:00"]]: 0.4,
    [DeliveryHours["10:00-13:00"]]: 0,
    [DeliveryHours["14:00-19:00"]]: 0,
    [DeliveryHours["20:00-00:00"]]: 0.4,
};

export function getDeliveryAdditionalRate(hour: DeliveryHours): number {
    return deliveryAdditionalRate[hour];
}