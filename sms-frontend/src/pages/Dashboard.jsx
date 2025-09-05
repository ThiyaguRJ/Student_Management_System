import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => (await api.get("/analytics")).data,
  });

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <p className="text-gray-600">Analytics overview of your students</p>

      <div className="bg-white shadow rounded-xl p-5">
        <p className="text-lg font-semibold text-gray-700">
          Total Students:{" "}
          <span className="text-indigo-600">{data.total}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Gender Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.genderCounts}
                dataKey="count"
                nameKey="gender"
                outerRadius={90}
                label
              >
                {data.genderCounts.map((_, i) => (
                  <Cell
                    key={i}
                    fill={["#6366f1", "#22c55e", "#facc15"][i]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Students per Class
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.perClass}>
              <XAxis dataKey="Class.name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
