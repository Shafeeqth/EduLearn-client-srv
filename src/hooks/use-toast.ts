import { commonToasts, toastService } from '@/lib/toast';

export const useToast = () => {
  return {
    toast: toastService,
    common: commonToasts,
  };
};

export { toastService as toast, commonToasts };
