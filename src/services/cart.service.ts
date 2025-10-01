import { BaseService } from './base-api/base.service';
import { config } from '@/lib/config';
import { AuthResponse } from '@/types/auth';
import { ApiResponse } from '@/types/api-response';
import { authRefreshToken, getClientAuthToken } from '@/lib/utils/auth-client-apis';
import { CartItem } from '@/types/user';
import { Cart } from '@/types/cart';

export interface ICartService {
  getUserCart(userId: string): Promise<ApiResponse<{ cart: Cart; total: number }>>;
  getCurrentUserCart(): Promise<ApiResponse<{ cart: Cart; total: number }>>;
  addToCart(cartId: string, courseId: string): Promise<ApiResponse<CartItem>>;
  toggleCartItem(cartId: string, courseId: string): Promise<ApiResponse<CartItem>>;
  removeFromCart(cartId: string, courseId: string): Promise<ApiResponse<void>>;
}

export class CartService extends BaseService implements ICartService {
  constructor(
    tokenGetter: () => string | null = getClientAuthToken,
    refresh: () => Promise<AuthResponse> = authRefreshToken
  ) {
    super(`${config.apiUrl}/carts`, {
      getToken: tokenGetter,
      authRefresh: refresh,
    });
  }

  public async getCurrentUserCart(): Promise<ApiResponse<{ cart: Cart; total: number }>> {
    return this.get<ApiResponse<{ cart: Cart; total: number }>>(`/me`);
  }
  public async getUserCart(userId: string): Promise<ApiResponse<{ cart: Cart; total: number }>> {
    return this.get<ApiResponse<{ cart: Cart; total: number }>>(`/${userId}`);
  }

  public async addToCart(cartId: string, courseId: string): Promise<ApiResponse<CartItem>> {
    return this.post<ApiResponse<CartItem>>('/me', { cartId, courseId });
  }
  public async toggleCartItem(cartId: string, courseId: string): Promise<ApiResponse<CartItem>> {
    return this.post<ApiResponse<CartItem>>('/me', { cartId, courseId });
  }
  public async removeFromCart(cartId: string, courseId: string): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`/${cartId}/${courseId}`);
  }

  // Static factory for SSR usage (pass a token getter or headers)
  static forSSR(token: string | null) {
    return new CartService(() => token);
  }
}

// Singleton for client-side usage
export const cartService: ICartService = new CartService();
