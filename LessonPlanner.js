// src/components/LessonPlanner.js
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import './LessonPlanner.css';

const LessonPlanner = () => {
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [planCategory, setPlanCategory] = useState('');
    const [categories, setCategories] = useState(['General', 'Math', 'Science', 'Literature']); // Example categories

    const addOrUpdatePlan = () => {
        if (newPlan.trim()) {
            if (editingIndex !== null) {
                // Update existing plan
                const updatedPlans = [...plans];
                updatedPlans[editingIndex] = { content: newPlan, category: planCategory };
                setPlans(updatedPlans);
                setEditingIndex(null);
            } else {
                // Add new plan
                setPlans([...plans, { content: newPlan, category: planCategory }]);
            }
            setNewPlan('');
            setPlanCategory('');
        }
    };

    const editPlan = (index) => {
        setNewPlan(plans[index].content);
        setPlanCategory(plans[index].category);
        setEditingIndex(index);
    };

    const deletePlan = (index) => {
        setPlans(plans.filter((_, i) => i !== index));
    };

    const filteredPlans = plans.filter(plan =>
        plan.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (planCategory ? plan.category === planCategory : true)
    );

    const downloadPlans = () => {
        const blob = new Blob([JSON.stringify(plans, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lesson-plans.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="lesson-planner">
            <h2>Lesson Planning and Management</h2>

            <div className="input-container">
                <ReactQuill
                    value={newPlan}
                    onChange={setNewPlan}
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'image'],
                            ['clean']
                        ]
                    }}
                    formats={[
                        'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image'
                    ]}
                />
                <div className="form-controls">
                    <select value={planCategory} onChange={(e) => setPlanCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <button onClick={addOrUpdatePlan}>
                        {editingIndex !== null ? 'Update Plan' : 'Add Plan'}
                    </button>
                </div>
            </div>

            <div className="search-filter">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search plans"
                />
            </div>

            <ul className="plans-list">
                {filteredPlans.map((plan, index) => (
                    <li key={index} className="plan-item">
                        <div dangerouslySetInnerHTML={{ __html: plan.content }} className="plan-content"></div>
                        <div className="plan-controls">
                            <button onClick={() => editPlan(index)} className="edit-btn">Edit</button>
                            <button onClick={() => deletePlan(index)} className="delete-btn">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            <button onClick={downloadPlans} className="download-btn">Download Plans</button>
        </div>
    );
};

export default LessonPlanner;
