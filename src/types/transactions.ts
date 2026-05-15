/** GET /transactions and GET /transactions/:id */

export type TransactionApiUser = {
  id: number;
  firstName: string;
  lastName: string;
};

export type TransactionApiServiceCategory = {
  id: number;
  name: string;
  iconName: string | null;
};

export type TransactionApiService = {
  id: number;
  serviceName: string;
  category: TransactionApiServiceCategory;
  price: string;
  duration: string;
  description: string;
  imageUrl: string;
  isPublished: boolean;
};

export type TransactionApiAppointment = {
  id: number;
  date: string;
  time: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  paymentStatus: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specificRequest: string;
  createdAt: string;
  updatedAt: string;
  services: TransactionApiService[];
};

export type TransactionApiItem = {
  id: number;
  amount: number;
  commissionAmount: number;
  /** API may omit this; map layer falls back to amount − commission. */
  netToVendorAmount: number | null;
  currency: string;
  status: string;
  type: string;
  description: string;
  referenceId: string;
  referenceType: string;
  createdAt: string;
  updatedAt: string;
  user?: TransactionApiUser;
  vendor?: TransactionApiUser;
  appointment?: TransactionApiAppointment | null;
};
