'use client';

import { useState } from 'react';
import { Upload, File, Download, Trash2, X, CheckCircle2 } from 'lucide-react';

// Types
interface Document {
  id: string;
  name: string;
  description: string;
  uploadedDate: string;
  uploadedBy: string;
  fileSize: string;
  fileType: string;
}

// Example data
const exampleDocuments: Document[] = [
  {
    id: 'DOC-001',
    name: 'IT Security Policy 2024',
    description: 'Updated security guidelines and best practices for all employees',
    uploadedDate: '2024-03-15',
    uploadedBy: 'John Smith',
    fileSize: '2.4 MB',
    fileType: 'PDF',
  },
  {
    id: 'DOC-002',
    name: 'New Employee Onboarding Guide',
    description: 'Comprehensive guide for new employee setup and orientation',
    uploadedDate: '2024-03-14',
    uploadedBy: 'Sarah Johnson',
    fileSize: '1.8 MB',
    fileType: 'DOCX',
  },
  {
    id: 'DOC-003',
    name: 'Network Infrastructure Diagram',
    description: 'Current network architecture and connection points',
    uploadedDate: '2024-03-13',
    uploadedBy: 'Mike Wilson',
    fileSize: '3.2 MB',
    fileType: 'PDF',
  },
  {
    id: 'DOC-004',
    name: 'Software License Inventory',
    description: 'Complete list of software licenses and renewal dates',
    uploadedDate: '2024-03-12',
    uploadedBy: 'John Smith',
    fileSize: '950 KB',
    fileType: 'XLSX',
  },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(exampleDocuments);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create new document
    const newDocument: Document = {
      id: `DOC-${String(documents.length + 1).padStart(3, '0')}`,
      name: title,
      description: description,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User', // This would be replaced with actual user
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: selectedFile.name.split('.').pop()?.toUpperCase() || 'Unknown',
    };

    setDocuments([newDocument, ...documents]);
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setIsUploading(false);
    setUploadSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#333333]">Document Uploads</h1>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#333333] mb-4">Upload New Document</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                placeholder="Enter document title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006699]"
                placeholder="Enter document description"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Select File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <File className="w-8 h-8 text-[#006699]" />
                    <span className="text-sm text-[#333333]">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#006699] hover:text-[#005588] focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, XLSX up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || !title.trim() || isUploading}
              className="flex items-center px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </form>

        {/* Upload Success Message */}
        {uploadSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Document uploaded successfully!
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f4f4f4]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                  Uploaded Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                  File Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <File className="w-5 h-5 text-[#006699] mr-2" />
                      <span className="text-sm font-medium text-[#333333]">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#333333]">{doc.description}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                    {doc.uploadedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                    {doc.uploadedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#333333]">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mr-2">
                        {doc.fileType}
                      </span>
                      <span className="text-gray-500">{doc.fileSize}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <a
                        href="#" // This would be replaced with actual download link
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 