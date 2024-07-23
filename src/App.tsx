import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { PDFDownloadLink, Document as PDFDocument, Page as PDFPage, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import './App.css';
import { TbCertificate } from "react-icons/tb";
import { FaUserCircle,FaEye } from "react-icons/fa";
import { TiAttachmentOutline } from "react-icons/ti";
import { LuLayoutTemplate } from "react-icons/lu";
import { IoMdDownload } from "react-icons/io";


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Styles for the PDF certificate
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
  },
});

// Certificate component for PDF generation
const Certificate = ({ data, studyInstructions }) => (
  <PDFDocument>
    <PDFPage size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{data.selectedTemplate.toUpperCase()} CERTIFICATE</Text>
        <Text style={styles.text}>
          This is to certify that {data.studentName} (Roll No: {data.rollNumber}, Reg No: {data.registrationNumber}) 
          has successfully completed the {data.internshipCourse || data.studyProgram || data.researchTopic || data.courseName}
          {data.fromDate && data.toDate ? ` from ${data.fromDate} to ${data.toDate}` : ''}.
        </Text>
        {data.selectedTemplate === 'study' && (
          <Text style={styles.text}>
            Note: {studyInstructions}
          </Text>
        )}
      </View>
    </PDFPage>
  </PDFDocument>
);

function App() {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    registrationNumber: '',
    internshipCourse: '',
    studyProgram: '',
    researchTopic: '',
    researchDomain: '',
    researchDescription: '',
    courseName: '',
    fromDate: '',
    toDate: '',
    projectTitle: '',
    projectDescription: '',
    projectReport: null,
    projectPPT: null,
    selectedTemplate: 'internship'
  });

  const [studyInstructions, setStudyInstructions] = useState(
    "This certificate is awarded for successful completion of a study program. It verifies the student's participation and achievement in the specified course of study."
  );

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (isFormValid()) {
      const generatePreview = async () => {
        const blob = await pdf(<Certificate data={formData} studyInstructions={studyInstructions} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      };
      generatePreview();
    }
  }, [formData, studyInstructions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: files[0]
    }));
  };

  const handleTemplateChange = (template) => {
    setFormData(prevData => ({
      ...prevData,
      selectedTemplate: template
    }));
  };

  const isFormValid = () => {
    const commonValidation = formData.studentName && formData.rollNumber && formData.registrationNumber;
    
    switch (formData.selectedTemplate) {
      case 'internship':
        return commonValidation && formData.fromDate && formData.toDate && formData.internshipCourse;
      case 'study':
        return commonValidation && formData.studyProgram;
      case 'research':
        return commonValidation && formData.researchTopic;
      case 'course':
        return commonValidation && formData.courseName;
      default:
        return false;
    }
  };

  const renderUserInfoInputs = () => {
    const commonInputs = (
      <>
        <label className="input-label">
          Student Name:
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleInputChange}
            placeholder="Enter student name"
          />
        </label>
        <label className="input-label">
          Roll Number:
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleInputChange}
            placeholder="Enter roll number"
          />
        </label>
        <label className="input-label">
          Registration Number:
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            placeholder="Enter registration number"
          />
        </label>
      </>
    );

    const dateInputs = (
      <>
        <label className="input-label">
          From Date:
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleInputChange}
          />
        </label>
        <label className="input-label">
          To Date:
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleInputChange}
          />
        </label>
      </>
    );

    switch (formData.selectedTemplate) {
      case 'internship':
        return (
          <>
            {commonInputs}
            {dateInputs}
            <label className="input-label">
              Internship Course:
              <input
                type="text"
                name="internshipCourse"
                value={formData.internshipCourse}
                onChange={handleInputChange}
                placeholder="Enter internship course"
              />
            </label>
          </>
        );
      case 'study':
        return (
          <>
            {commonInputs}
            <label className="input-label">
              Study Program:
              <input
                type="text"
                name="studyProgram"
                value={formData.studyProgram}
                onChange={handleInputChange}
                placeholder="Enter study program"
              />
            </label>
            <div className="instructions-section">
              <h3>Instructions</h3>
              <p>{studyInstructions}</p>
            </div>
          </>
        );
      case 'research':
        return (
          <>
            {commonInputs}
            <label className="input-label">
              Research Topic:
              <input
                type="text"
                name="researchTopic"
                value={formData.researchTopic}
                onChange={handleInputChange}
                placeholder="Enter research topic"
              />
            </label>
          </>
        );
      case 'course':
        return (
          <>
            {commonInputs}
            <label className="input-label">
              Course Name:
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="Enter course name"
              />
            </label>
          </>
        );
      default:
        return commonInputs;
    }
  };

  const renderProjectOrResearchSection = () => {
    if (formData.selectedTemplate === 'study') {
      return null;
    }

    if (formData.selectedTemplate === 'research') {
      return (
        <div className="section-box research-doc">
          <h2>Research Documentation</h2>
          <label className="input-label">
            Research Topic:
            <input
              type="text"
              name="researchTopic"
              value={formData.researchTopic}
              onChange={handleInputChange}
              placeholder="Enter research topic"
            />
          </label>
          <label className="input-label">
            Research Domain:
            <input
              type="text"
              name="researchDomain"
              value={formData.researchDomain}
              onChange={handleInputChange}
              placeholder="Enter research domain"
            />
          </label>
          <label className="input-label">
            Research Description:
            <textarea
              name="researchDescription"
              value={formData.researchDescription}
              onChange={handleInputChange}
              placeholder="Enter research description"
            />
          </label>
        </div>
      );
    }

    return (
      <div className="section-box project-doc">
        <h2><TiAttachmentOutline/> Project Documents</h2>
        <label className="input-label">
          Project Title:
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleInputChange}
            placeholder="Enter project title"
          />
        </label>
        <label className="input-label">
          Project Description:
          <textarea
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            placeholder="Enter project description"
          />
        </label>
        <label className="input-label">
          Project Report:
          <input
            type="file"
            name="projectReport"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </label>
        <label className="input-label">
          Project PPT:
          <input
            type="file"
            name="projectPPT"
            onChange={handleFileChange}
            accept=".pdf"
          />
        </label>
      </div>
    );
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>GET-CERTIFIED <TbCertificate /> </h1>
      </nav>
      <div className="sections-container">
        <div className="section-box user-info">
          <h2> <FaUserCircle /> User Information</h2>
          {renderUserInfoInputs()}
        </div>
        
        {renderProjectOrResearchSection()}
        
        <div className="section-box preview">
          <h2><FaEye/> Preview</h2>
          {previewUrl && (
            <iframe src={previewUrl} width="100%" height="500px" />
          )}
        </div>
        
        <div className="section-box template">
          <h2><LuLayoutTemplate /> Certificate Template</h2>
          <div className="button-group">
            {['internship', 'study', 'research', 'course'].map(template => (
              <button
                key={template}
                onClick={() => handleTemplateChange(template)}
                className={formData.selectedTemplate === template ? 'selected' : ''}
              >
                {template.charAt(0).toUpperCase() + template.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {isFormValid() && (
          <div className="section-box download">
            <h2><IoMdDownload/> Download Certificate</h2>
            <PDFDownloadLink document={<Certificate data={formData} studyInstructions={studyInstructions} />} fileName="certificate.pdf">
              {({ blob, url, loading, error }) => (
                <button className="download-button">
                  {loading ? 'Preparing document...' : 'Download Certificate'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;