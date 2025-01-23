import React, { useState } from 'react';

const Expense = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [categories, setCategories] = useState(['Food', 'Cinema']);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    newCategory: '',
  });

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (formData.newCategory.trim() && !categories.includes(formData.newCategory)) {
      setCategories((prev) => [...prev, formData.newCategory]);
      console.log(setCategories,"line no 262");
      
      const  postCategory=async()=>{
        const response = await fetch('http://localhost:5000/expense/addCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                credentials: "include",
            },
            body: JSON.stringify({ username:req.user.username,category: formData.newCategory ,amount:formData.amount,description:formData.description}),
        });
    }

      setFormData((prev) => ({ ...prev, newCategory: '', category: formData.newCategory }));
    }
  };

 
 

  const handleSubmit = (e) => {
    e.preventDefault();
    const  postExpense=async()=>{
        const response = await fetch('http://localhost:5000/expense/addExpense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                credentials: "include",
            },
            body: JSON.stringify({username:req.user.username,category:formData.category}),
        });
    }
     
    console.log('Expense Added:', formData);
    setFormData({
      amount: '',
      description: '',
      category: '',
      newCategory: '',
    });
    togglePopup();
  };
  console.log(setFormData,"line no 62");
  return (
    <div className="expense-container">
      <button className="add-expense-button" onClick={togglePopup}>
        + Add Expense
      </button>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Amount:
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Category:
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="add-new">Add New Category</option>
                </select>
              </label>
              {formData.category === 'add-new' && (
                <div>
                  <input
                    type="text"
                    name="newCategory"
                    value={formData.newCategory}
                    onChange={handleChange}
                    placeholder="New Category Name"
                  />
                  <button
                    type="button"
                    className="add-category-button"
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </button>
                </div>
              )}
              <button type="submit" className="submit-button">
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={togglePopup}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Expense;
