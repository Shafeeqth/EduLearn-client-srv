import { BaseService } from './base-api/base.service';
import { config } from '@/lib/config';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api-response';
import { authRefreshToken, getClientAuthToken } from '@/lib/utils/auth-client-apis';
import { Order, PlaceOrderPayload } from '@/types/order';
import { serverRefresh } from '@/lib/utils/server-utils';

export interface IOrderService {
  placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<Order>>;
  getOrder(orderId: string): Promise<ApiResponse<Order>>;
  getOrdersByUserId(userId: string): Promise<ApiResponse<Order[]>>;
}

export class OrderService extends BaseService implements IOrderService {
  constructor(
    tokenGetter: () => string | null = getClientAuthToken,
    refresh: () => Promise<AuthResponse> = authRefreshToken
  ) {
    super(`${config.apiUrl}/orders`, {
      getToken: tokenGetter,
      authRefresh: refresh,
    });
  }

  public async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.get<ApiResponse<Order>>(`/${orderId}`);
  }
  public async getOrdersByUserId(userId: string): Promise<ApiResponse<Order[]>> {
    return this.get<ApiResponse<Order[]>>(`/?userId=${userId}`);
  }

  public async placeOrder(payload: PlaceOrderPayload): Promise<ApiResponse<Order>> {
    return this.post<ApiResponse<Order>>('/', payload);
  }

  // Static factory for SSR usage (pass a token getter or headers)
  static forSSR(token: string | null, refresh: () => Promise<AuthResponse> = serverRefresh) {
    return new OrderService(() => token, refresh);
  }
}

// Singleton for client-side usage
export const cartService: IOrderService = new OrderService();
