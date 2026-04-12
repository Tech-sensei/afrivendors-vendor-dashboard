import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/authSlice";

export const useVendorGallery = () => {
  const dispatch = useAppDispatch();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await http.post("/vendor/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Image added to gallery!");
      dispatch(fetchUserProfile());
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to upload image"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await http.delete(`/vendor/gallery/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Image removed from gallery");
      dispatch(fetchUserProfile());
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to delete image"
      );
    },
  });

  const setBannerMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await http.post(`/vendor/gallery/${id}/banner`);
      return data;
    },
    onSuccess: () => {
      toast.success("Banner image updated!");
      dispatch(fetchUserProfile());
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to set banner"
      );
    },
  });

  return {
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,

    deleteAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    setBannerAsync: setBannerMutation.mutateAsync,
    isSettingBanner: setBannerMutation.isPending,
  };
};
