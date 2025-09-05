import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: async () => (await api.get(`/students/${id}`)).data,
  });

  if (isLoading) return "Loading...";

  const del = async () => {
    await api.delete(`/students/${id}`);
    navigate("/students");
  };

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Roll: {data.rollNumber}</p>
      <p>Class: {data.Class?.name}</p>
      {data.photoUrl && <img src={`http://localhost:4000/${data.photoUrl}`} alt="" width={100} />}
      <div className="flex gap-2">
        <Link to={`/students/${id}/edit`}>Edit</Link>
        <button onClick={del}>Delete</button>
      </div>
    </div>
  );
}
