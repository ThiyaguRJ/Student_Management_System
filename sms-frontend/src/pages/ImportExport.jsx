import { useImportStudents } from "@/hooks/useStudents";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function ImportExport() {
  const importMutation = useImportStudents();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile); 
    }
  };

  const importFile = () => {
    if (!file) return alert("Please select a file first!");
    importMutation.mutate(file, {
      onSettled: () => setFile(null), 
    });
  };

  const cancelFile = () => setFile(null);

  const exportTemplate = () => {
    const headers = [["Roll No", "Name", "Gender", "Date of Birth", "Class"]];

    const ws = XLSX.utils.aoa_to_sheet(headers);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");

    XLSX.writeFile(wb, "Student_Template.xlsx");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
          Excel Import / Export
        </h2>

        <div className="flex items-center gap-3">
          <label
            htmlFor="file-upload"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
            <Upload className="w-4 h-4 mr-2" />
            {file ? "Replace File" : "Choose File"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <button
              onClick={cancelFile}
              className="flex items-center px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
              <X className="w-4 h-4 mr-1" /> Cancel
            </button>
          )}
        </div>

        {file && <p className="text-sm text-gray-600">📄 {file.name}</p>}

        <div className="flex justify-end gap-4">
          <button
            onClick={importFile}
            disabled={importMutation.isLoading}
            className={`px-4 py-2 rounded-lg text-white ${
              importMutation.isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {importMutation.isLoading ? "Importing..." : "Import Students"}
          </button>

          <button
            onClick={exportTemplate}
            className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
            Export Template Excel
          </button>
        </div>
      </div>
    </div>
  );
}
