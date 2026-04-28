import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import type { VendorCategory } from "@/types/category";

export function useVendorCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await http.get<VendorCategory[]>("/categories");
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
