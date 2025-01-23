import React, { useState, useEffect } from "react";

const BillSplitting = () => {
  const [bills, setBills] = useState([]);

  // Fetch bills when the component mounts
  useEffect(() => {
    // Replace this with your API call
    
    const getTodos=async ()=>{
      
    
        try {
            const response = await fetch("http://localhost:5000/bills_splits", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                  
                    credentials: "include",  
                },
            });
         
            
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
    
            const bills = await response.json();
            console.log();
            console.log("Todos:", todos);
            
            
            setBills(todos)
          
        } catch (err) {
            console.error("Error fetching todos:", err.message);
        }
      }
        getTodos();
  }, []);

  // Handle accept bill
  const handleAccept = (id) => {
    const acceptBill=async(id)=>{
        const response = await fetch("http://localhost:5000/bills_splits", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
            
              credentials: "include",  // Attach token
          },
          body: JSON.stringify({"status":"reject","id":id,"userId":req.user.id}),
        
        });
        acceptBill(id);
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === id ? { ...bill, status: "Accepted" } : bill
      )
      
    )
   
}

  // Handle decline bill
  const handleDecline = (id) => {
    const rejectBill=async(id)=>{
        const response = await fetch("http://localhost:5000/bills_splits/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
            
              credentials: "include",  // Attach token
          },
          body: JSON.stringify({"status":"reject","id":id,"userId":req.user.id}),
        });
      };
      rejectBill(id);
    setBills((prevBills) =>
      prevBills.map((bill) =>
        bill.id === id ? { ...bill, status: "Declined" } : bill
      )
    );
    
    }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Bills</h2>
      {bills.length > 0 ? (
        <div className="list-group">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{bill.description}</h5>
                <p className="mb-0">Amount: ${bill.amount}</p>
                <p className="mb-0">Status: {bill.status}</p>
              </div>
              {bill.status === "Pending" && (
                <div>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleAccept(bill.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDecline(bill.id)}
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No bills to display.</p>
      )}
    </div>
  );
};
}

export default BillSplitting;
