import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");


  const fetchFolders = async () => {
    const res = await axios.get("http://localhost:5000/api/folders");
    setFolders(res.data);
  };

  useEffect(() => {
    fetchFolders();
  }, []);

const createFolder = async () => {
  const name = prompt("Enter folder name");
  if (!name) return;

  try {
    const res = await axios.post("http://localhost:5000/api/create-folder", {
      folderName: name
    });

    // Immediately update UI
    setFolders((prev) => [...prev, res.data.folder]);
    setSelectedFolder(res.data.folder);

    setMessage("Folder created successfully");
  } catch (err) {
    setMessage(
      err.response?.data?.message || "Failed to create folder"
    );
  }
};


const uploadFile = async () => {
  if (!file || !selectedFolder) {
    setMessage("Please select a folder and a file");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", selectedFolder);

 await axios.post(
  `http://localhost:5000/api/upload?folder=${selectedFolder}`,
  formData
);



    setMessage("File uploaded successfully");
    setFile(null);
  } catch (err) {
    setMessage("File upload failed");
  }
};


  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-xl font-bold mb-6">My Drive</h1>

        <button
          onClick={createFolder}
          className="w-full mb-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          + New Folder
        </button>

        <div className="space-y-2">
          {folders.map((folder) => (
            <div
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`cursor-pointer px-3 py-2 rounded flex items-center gap-2
                ${
                  selectedFolder === folder
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100"
                }`}
            >
              📁 {folder}
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">
          {selectedFolder
            ? `Upload to "${selectedFolder}"`
            : "Select a folder"}
        </h2>
{message && (
  <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-700">
    {message}
  </div>
)}

        <div className="bg-white p-6 rounded shadow-md max-w-md">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full border rounded p-2 mb-4"
          />

          <button
            onClick={uploadFile}
            disabled={!selectedFolder}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Upload File
          </button>
        </div>
      </main>
    </div>
  );
}
