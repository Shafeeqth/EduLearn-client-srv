export interface OrderItems {
  courseId: string;
  price: number;
}

export interface PaymentDetails {
  paymentId: string;
  provider: string;
  providerOrderId?: string | undefined;
  paymentStatus: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItems[];
  paymentDetails?: PaymentDetails | undefined;
  totalAmount: number;
  discount: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceOrderPayload {
  courseIds: string[];
  userId?: string;
  couponCode?: string;
}
