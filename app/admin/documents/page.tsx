'use client';

import { useState, useEffect } from 'react';
import { Upload, File, Download, Trash2, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Types
interface Document {
  id: string;
  name: string;
  description: string;
  created_at: string;
  uploaded_by: string;
  file_size: number;
  file_type: string;
  file_path: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch documents from Supabase
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('documents')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) throw supabaseError;

        setDocuments(data || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
        toast.error('Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Create document record in database
      const { data, error: dbError } = await supabase
        .from('documents')
        .insert([{
          name: title,
          description: description,
          file_path: filePath,
          file_size: selectedFile.size,
          file_type: fileExt?.toUpperCase() || 'Unknown',
          uploaded_by: 'Current User', // This would be replaced with actual user
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setDocuments(prev => [data, ...prev]);
      setSelectedFile(null);
      setTitle('');
      setDescription('');
      setUploadSuccess(true);
      toast.success('Document uploaded successfully');

      // Hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete record from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Document deleted successfully');
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading document:', err);
      toast.error('Failed to download document');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699]"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No documents found</p>
        </div>
      ) : (
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
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#333333]">
                      {doc.uploaded_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#333333]">
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mr-2">
                          {doc.file_type}
                        </span>
                        <span className="text-gray-500">
                          {(doc.file_size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(doc.file_path, doc.name)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                          onClick={() => handleDelete(doc.id, doc.file_path)}
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
      )}
    </div>
  );
}
