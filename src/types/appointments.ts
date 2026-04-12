export interface VendorAppointmentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  profilePhoto: string | null;
  phoneNumber: string;
  accountType: string;
}

export interface VendorAppointmentService {
  id: number;
  serviceName: string;
  category: { id: number; name: string; iconName: string | null };
  price: string;
  duration: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
}

export type VendorAppointmentStatus = "pending" | "accepted" | "rejected" | "completed";

export interface VendorAppointment {
  id: number;
  user: VendorAppointmentUser;
  vendor: VendorAppointmentUser;
  services: VendorAppointmentService[];
  date: string;
  time: string;
  rescheduleDate: string | null;
  rescheduleTime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specificRequest: string;
  paymentMethod: "online" | "wallet";
  status: VendorAppointmentStatus;
  totalAmount: number;
  commissionAmount: number;
  vendorAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}
