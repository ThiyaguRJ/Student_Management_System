import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function useStudents({ page, search }) {
  return useQuery({
    queryKey: ["students", page, search],
    queryFn: async () => {
      const res = await api.get("/students", {
        params: { page, pageSize: 10, search },
      });
      return res.data;
    },
    keepPreviousData: true,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {

      const res = await api.post("/students", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      console.log(formData, "formdata")
      const res = await api.put(`/students/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/students/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]); 
    },
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/students/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      alert("Students imported successfully!");
      queryClient.invalidateQueries(["students"]); 
    },
    onError: (err) => {
      console.error(err);
      alert(err.response?.data?.message || "Error importing students");
    },
  });
}