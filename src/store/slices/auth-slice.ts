import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { VerifyOTPRequest } from '@/types/auth';
import { LoginCredentials } from '@/types/auth/login-data.type';
import { AuthResponse, RegisterData } from '@/types/auth/register-user.type';
import { User } from '@/types/user/user.type';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunks

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error)?.message || 'Failed to login ');
    }
  }
);
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error)?.message || 'Failed to register ');
    }
  }
);
export const verify = createAsyncThunk(
  'auth/verify',
  async (data: VerifyOTPRequest, { rejectWithValue }) => {
    try {
      const response = await authService.verify(data);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error)?.message || 'Failed to verify OTP ');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    return true;
  } catch (error) {
    return rejectWithValue((error as Error)?.message || 'Failed to logout');
  }
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error)?.message || 'Failed to refresh token');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue((error as Error)?.message || 'Failed to fetch current user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // synchronous actions
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { user, refreshToken, token } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      // save auth state to localstorage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    },

    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // save auth state to localstorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },

    restoreCredentials: (state) => {
      // Try to restore from LocalStorage on app initialization
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (token && refreshToken) {
        state.token = token;
        state.refreshToken = refreshToken;
        state.isLoading = true; // Will trigger getCurrentUser
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        const { refreshToken, token, user } = action.payload;
        state.user = user;
        state.refreshToken = refreshToken;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const { refreshToken, token, user } = action.payload;
        state.user = user;
        state.refreshToken = refreshToken;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
        state.refreshToken = null;
        state.token = null;
        state.isLoading = false;

        // Clear localStorage user data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logout.rejected, (state) => {
        // Caused by server error
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
        state.refreshToken = null;
        state.token = null;
        state.isLoading = false;

        // Clear localStorage user data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        const { refreshToken, token } = action.payload;
        state.refreshToken = refreshToken;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        // Token refresh failed , logout
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
        state.refreshToken = null;
        state.token = null;
        state.isLoading = false;
        state.error = action.payload as string;

        // Clear localStorage user data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
        state.refreshToken = null;
        state.token = null;
        state.isLoading = false;
        state.error = action.payload as string;

        // Clear localStorage user data
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });
  },
});

export const { clearCredentials, setCredentials, clearError, restoreCredentials } =
  authSlice.actions;

export default authSlice.reducer;
