import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    console.log('handleFileChange called with:', newFiles);
    setFiles(newFiles);
    if (onChange) {
      console.log('Calling onChange with files:', newFiles);
      onChange(newFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    console.log('Input change event:', selectedFiles);
    handleFileChange(selectedFiles);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Click handler triggered');
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    handleFileChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    onDrop: (acceptedFiles, rejectedFiles) => {
      console.log('Dropzone onDrop - accepted:', acceptedFiles, 'rejected:', rejectedFiles);
      if (rejectedFiles.length > 0) {
        alert('Please select a valid Excel file (.xlsx, .xls) or CSV file');
        return;
      }
      handleFileChange(acceptedFiles);
    },
    onDropRejected: (rejectedFiles) => {
      console.log('Files rejected:', rejectedFiles);
      alert('Please select a valid Excel file (.xlsx, .xls) or CSV file');
    },
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
        }`}
      >
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleInputChange}
          className="hidden"
          id="file-upload-input"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <IconUpload className="h-12 w-12 text-gray-400" />
          
          {isDragActive ? (
            <p className="text-purple-600 dark:text-purple-400">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drag and drop your Excel file here, or{' '}
                <button
                  type="button"
                  onClick={handleClick}
                  className="text-purple-600 hover:text-purple-700 underline"
                >
                  click to browse
                </button>
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Display selected files */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <IconUpload className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
