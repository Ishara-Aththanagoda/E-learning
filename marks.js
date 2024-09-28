import React, { useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './marks.css';

const Marks = () => {
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [studentName, setStudentName] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [subjects] = useState(['Sinhala', 'Mathematics', 'Science', 'English', 'Buddhism', 'History']);
    const [mark, setMark] = useState('');

    const handleAddStudent = () => {
        if (studentName && !students.includes(studentName)) {
            setStudents([...students, studentName]);
            setMarks({ ...marks, [studentName]: {} });
            setStudentName('');
        }
    };

    const handleMarksChange = () => {
        if (studentName && selectedSubject && mark) {
            setMarks({
                ...marks,
                [studentName]: {
                    ...marks[studentName],
                    [selectedSubject]: parseFloat(mark) || 0
                }
            });
            setSelectedSubject('');
            setMark('');
        }
    };

    const handleClearData = () => {
        setStudents([]);
        setMarks({});
        setStudentName('');
        setSelectedSubject('');
        setMark('');
    };

    const calculateRankings = () => {
        return students.map(student => ({
            name: student,
            total: subjects.reduce((acc, subject) => acc + (marks[student][subject] || 0), 0),
        })).sort((a, b) => b.total - a.total);
    };

    const calculateAverages = () => {
        const studentAverages = students.map(student => ({
            name: student,
            average: subjects.reduce((acc, subject) => acc + (marks[student][subject] || 0), 0) / subjects.length,
        }));

        const subjectAverages = subjects.map(subject => ({
            name: subject,
            average: students.reduce((acc, student) => acc + (marks[student][subject] || 0), 0) / students.length,
        }));

        return { studentAverages, subjectAverages };
    };

    const chartData = {
        labels: students,
        datasets: subjects.map(subject => ({
            label: subject,
            data: students.map(student => marks[student][subject] || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
        })),
    };

    const rankings = calculateRankings();
    const { studentAverages, subjectAverages } = calculateAverages();

    const downloadRankingsReport = () => {
        const doc = new jsPDF();
        doc.text('Student Rankings Report', 14, 20);
        const tableData = rankings.map((student, index) => [index + 1, student.name, student.total]);

        doc.autoTable({
            head: [['Position', 'Student Name', 'Total Marks']],
            body: tableData,
            startY: 30,
        });

        doc.save('Student_Rankings_Report.pdf');
    };

    const downloadAveragesReport = () => {
        const doc = new jsPDF();
        doc.text('Average Marks Report', 14, 20);

        doc.autoTable({
            head: [['Student Name', 'Average Marks']],
            body: studentAverages.map(student => [student.name, student.average.toFixed(2)]),
            startY: 30,
        });

        doc.autoTable({
            head: [['Subject Name', 'Average Marks']],
            body: subjectAverages.map(subject => [subject.name, subject.average.toFixed(2)]),
            startY: doc.autoTable.previous.finalY + 10, // Start below the previous table
        });

        doc.save('Average_Marks_Report.pdf');
    };

    return (
        <div className="marks-container">
            <h2>First please enter all of the students' names and then add all marks for students one by one.</h2>

            <div className="marks-entry">
                <input
                    type="text"
                    placeholder="Add Student Name"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                />
                <button onClick={handleAddStudent}>Add Student</button>
            </div>

            {students.length > 0 && (
                <div className="marks-entry">
                    <select
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(subject => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Enter Marks"
                        value={mark}
                        onChange={e => setMark(e.target.value)}
                    />
                    <button onClick={handleMarksChange}>Add Marks</button>
                </div>
            )}

            <h2>Marks Chart</h2>
            <div className="marks-chart">
                <Bar data={chartData} />
            </div>

            <h2>Rankings</h2>
            <div className="rankings">
                <ul>
                    {rankings.map((student, index) => (
                        <li key={index} className="ranking-item">
                            <span className="ranking-position">{index + 1}.</span>
                            <span className="ranking-name">{student.name}</span>
                            <span className="ranking-total">Total Marks: {student.total}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={downloadRankingsReport} className="download-report-btn">
                Download Rankings Report
            </button>

            <h2>Average Marks</h2>
            <div className="averages">
                <div className="averages-section">
                    <h3>Per Student</h3>
                    <ul>
                        {studentAverages.map(student => (
                            <li key={student.name} className="average-item">
                                {student.name}: <span className="average-value">{student.average.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="averages-section">
                    <h3>Per Subject</h3>
                    <ul>
                        {subjectAverages.map(subject => (
                            <li key={subject.name} className="average-item">
                                {subject.name}: <span className="average-value">{subject.average.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={downloadAveragesReport} className="download-report-btn">
                Download Averages Report
            </button>

            <div className="clear-data">
                <button onClick={handleClearData}>Clear Data</button>
            </div>
        </div>
    );
};

export default Marks;
