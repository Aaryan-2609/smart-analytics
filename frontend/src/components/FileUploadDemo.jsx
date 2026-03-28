"use client";

import React, { useState } from "react";
import { FileUpload } from "./ui/file-upload";
import { useNavigate } from "react-router-dom";
import axios from '../api/config';

export default function FileUploadDemo() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (uploadedFiles) => {
    console.log('FileUploadDemo - Files received:', uploadedFiles);
    setFiles(uploadedFiles);
    
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      const isValidType = validTypes.includes(file.type);
      const hasValidExtension = /\.(xlsx|xls|csv)$/i.test(file.name);
      
      console.log('File validation:', { isValidType, hasValidExtension, fileType: file.type });
      
      if (!isValidType && !hasValidExtension) {
        alert('Please select a valid Excel file (.xlsx, .xls) or CSV file');
        setFiles([]);
        return;
      }
      
      setUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file:', file.name);

        const response = await axios.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const { fileId, fileName } = response.data;
        console.log('Upload response:', response.data);

        // Navigate to axis selection with fileId
        setTimeout(() => {
          navigate("/axis-selection", {
            state: { fileName, fileId },
          });
        }, 1000);
      } catch (error) {
        console.error('Upload failed:', error);
        console.error('Error response:', error.response?.data);
        alert('Upload failed: ' + (error.response?.data?.message || error.message));
        setFiles([]);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl bg-[#1a1a1a] border border-neutral-700 shadow-md p-6 mb-10">
      <h2 className="text-xl font-semibold text-purple-300 mb-4">Upload Excel Files</h2>
      
      <FileUpload onChange={handleFileUpload} />
      
      {uploading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
          <p className="text-purple-300">Uploading...</p>
        </div>
      )}
      
      {files.length > 0 && !uploading && (
        <div className="mt-4 text-center">
          <p className="text-green-400">✓ File selected: {files[0]?.name}</p>
          <p className="text-sm text-gray-400">Ready to upload</p>
        </div>
      )}
      
      {/* Debug info */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Files state: {files.length} files</p>
        <p>Uploading: {uploading ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
