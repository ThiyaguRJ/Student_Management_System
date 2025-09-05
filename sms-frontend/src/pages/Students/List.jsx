import {
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from "@/hooks/useStudents";
import { Pencil, Trash2, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import StudentTable from "../../components/StudentTable";

export default function StudentForm({ onCancel }) {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {},
  });
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useStudents({ page, search });

  const [openForm, setOpenForm] = useState(false); 
  const [defaultValues, setDefaultValues] = useState({}); 
  const [preview, setPreview] = useState(null);
  const [viewImage, setViewImage] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("photo", file);
    }
  };

  const removeFile = () => {
    setPreview(null);
    setValue("photo", null); 
  };

  useEffect(() => {
    if (defaultValues) {
      reset({
        rollNumber: defaultValues.rollNumber || "",
        name: defaultValues.name || "",
        gender: defaultValues.gender || "",
        dob: defaultValues.dob
          ? moment(defaultValues.dob).format("DD-MM-YYYY")
          : "",
        ClassId: defaultValues.ClassId || "",
      });

  
      if (defaultValues.photoUrl) {
        setPreview(defaultValues.photoUrl);
      } else {
        setPreview(null);
      }
    } else {
      reset({
        rollNumber: "",
        name: "",
        gender: "",
        dob: "",
        ClassId: "",
      });
      setPreview(null);
    }
  }, [defaultValues, reset]);

  if (isLoading) return <div>Loading students...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "photo" && value?.[0]) {
        formData.append("photo", value[0]);
      } else {
        formData.append(key, value);
      }
    });

    const tokenData = JSON.parse(localStorage.getItem("user") || "{}");
    if (tokenData?.name) {
      formData.append("user", tokenData.name);
    }


    if (viewImage?.id) {
      updateStudent.mutate(
        { id: viewImage.id, formData },
        {
          onSuccess: () => {
            alert("Student Updated!");
            handleCancel();
          },
          onError: (err) => {
            alert(err.response?.data?.message || "Error updating student");
            console.error(err);
          },
        }
      );
    } else {
      createStudent.mutate(formData, {
        onSuccess: () => {
          alert("Student Added!");
          handleCancel();
        },
      });
    }
  };

  const handleEdit = (student) => {
    const updatedStudent = {
      ...student,
      dob: moment(student.dob, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };

    reset(updatedStudent); 
    setViewImage(updatedStudent);
    setOpenForm(true); 
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteStudent.mutate(id, {
        onSuccess: () => {
          alert("Student deleted!");
        },
        onError: (err) => {
          console.error(err);
          alert(err.response?.data?.message || "Error deleting student");
        },
      });
    }
  };

  const columns = [
    { accessorKey: "rollNumber", header: "Roll No" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    {
      accessorKey: "dob",
      header: "Date of Birth",
    },
    { accessorKey: "ClassId", header: "Class" },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original; 
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(student)}
              className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
              <Pencil size={16} />
            </button>

            <button
              onClick={() => handleDelete(student.id)}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  const exportToExcel = () => {
    if (!data?.data?.length) {
      alert("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      data?.data.map((row) => ({
        "Roll No": row.rollNumber,
        Name: row.name,
        Gender: row.gender,
        "Date of Birth": moment(row.dob).format("DD-MM-YYYY"),
        Class: row.ClassId,
      }))
    );


    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "students.xlsx");
  };

  const handleCancel = () => {
    reset({
      rollNumber: "",
      name: "",
      gender: "",
      dob: "",
      ClassId: "",
      photo: null,
    });
    setViewImage(null);
    setPreview(null);
    setOpenForm(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 bg-white shadow-lg rounded-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Student Form
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            {...register("rollNumber")}
            placeholder="Roll Number"
            className="border rounded-lg p-2"
          />
          <input
            {...register("name")}
            placeholder="Name"
            className="border rounded-lg p-2"
          />
          <select {...register("gender")} className="border rounded-lg p-2">
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="O">Other</option>
          </select>
          <input
            type="date"
            {...register("dob")}
            className="border rounded-lg p-2"
          />
          <input
            type="number"
            {...register("ClassId")}
            placeholder="Class ID"
            className="border rounded-lg p-2"
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Upload Photo
            </label>

            {!preview && !defaultValues?.photoUrl ? (
              <div>
                <input
                  type="file"
                  id="photoUpload"
                  className="hidden"
                  {...register("photo")}
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="photoUpload"
                  className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                  Choose File
                </label>
              </div>
            ) : preview ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={`http://localhost:5173/${defaultValues.photoUrl}`}
                  alt="Existing"
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setDefaultValues((prev) => ({ ...prev, photoUrl: null }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              reset({});
              onCancel?.();
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>

      <div className="p-6 bg-white shadow-lg rounded-2xl mx-auto mt-3">
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        <StudentTable
          data={
            data?.data.map((item) => ({
              ...item,
              dob: moment(item.dob).format("DD-MM-YYYY"),
            })) || []
          }
          total={data?.total || 0}
          page={page}
          pageSize={10}
          onPageChange={(newPage) => setPage(newPage)}
          onSearch={(s) => {
            setSearch(s);
            setPage(1); 
          }}
          columns={columns}
          exportToExcel={exportToExcel}
        />
      </div>

      {openForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm"
          onClick={() => {
      
            handleCancel();
          }}>
          <div
            className="bg-white p-6 rounded-lg w-[400px] drop-shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">
              {viewImage ? "Edit Student" : "Add Student"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                type="text"
                placeholder="Roll No"
                {...register("rollNumber")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Name"
                {...register("name")}
                className="w-full p-2 border rounded"
              />
              <select
                {...register("gender")}
                className="w-full p-2 border rounded">
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              <input
                type="date"
                {...register("dob")}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Class"
                {...register("ClassId")}
                className="w-full p-2 border rounded"
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Upload Photo
                </label>

                <div className="relative inline-block">
                  <img
                    src={`/${viewImage?.photoUrl?.replace(/\\/g, "/")}`}
                    alt="Existings"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                 
                    handleCancel();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
