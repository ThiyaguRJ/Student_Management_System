import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export function useAudit({ page = 1, pageSize = 10, search = "" }) {
  return useQuery({
    queryKey: ["audit", page, search],
    queryFn: async () => {
      const res = await api.get("/audit", {
        params: { page, pageSize, search },
      });
      return res.data;
    },
    keepPreviousData: true,
    enabled: true,
  });
}