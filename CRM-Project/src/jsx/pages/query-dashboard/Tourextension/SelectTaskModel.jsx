import React, {useState, useEffect} from 'react'
import {axiosOther} from '../../../../http/axios_base_url';
import { toast } from 'react-toastify';

const SelectTaskModel = ({isTaskOpen, isTaskClose, todo}) => {
  if (!isTaskOpen) return null;

const [formData, setFormData] = useState({
  task_title: '',
  task_date: '',
  task_time: '',
  Assign_to: '',
  remarks: ''
})

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

useEffect(() => {
  if (todo) {
    setFormData({
      task_title: todo.TaskTitle,
      task_date: todo.TaskDate,
      task_time: todo.TaskTime,
      Assign_to: todo.AssignTo,
      remarks: todo.Remark
    });
  }
}, []);

const handleSave = async () => {
  setLoading(true);
  try {
    const payload = {
      ID: todo.ID,
      QueryId: todo.QueryId,
      QuotationNumber: todo.QuotationNo,
      ServiceId: todo.ServiceId,
      ServiceType: todo.ServiceType,
      ServiceName: todo.ServiceName,
      TaskTitle: formData.task_title,
      TaskDate: formData.task_date,
      TaskTime: formData.task_time,
      FromTravel: todo.FromTravel,
      ToTravel: todo.ToTravel,
      Duration: todo.Duration,
      AssignTo: todo.AssignTo,
      Remark: formData.remarks,
      CompletedDate: todo.CompletedDate,
      CompletedTime: todo.CompletedTime,
      Status: todo.Status,
      AddedBy: todo.AddedBy,
      UpdatedBy: todo.UpdatedBy
    };
    const { data } = await axiosOther.post('update-todolist', payload);
    if (data.Status === 1) {
      toast.success('Task updated successfully!');
      isTaskClose();
    } 
  } catch (error) {
    toast.error('Error updating task.');
    console.log(error);
  }
  setLoading(false);
};


  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content2">
        <div>
          <h3 style={{ backgroundColor: "#233A49", padding: '5px', borderRadius: '6px'  }}>Select Task</h3>

          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', marginTop:'20px', padding:'0 20px'}}>
          <div>
            <label htmlFor="">Task Title</label>
             <input
                type="text"
                name="task_title"
                style={{width: '100%'}}
                value={formData.task_title}
                onChange={handleChange}
              />
          </div>
          <div className='d-flex' style={{gap: '40px'}}>
            <div>
            <label htmlFor="">Task Date</label>
              <input
                type="date"
                name="task_date"
                style={{width: '100%'}}
                value={formData.task_date}
                onChange={handleChange}
              />
            </div>
            <div>
            <label htmlFor="">Task Time</label>
              <input
                type="time"
                name="task_time"
                style={{width: '100%'}}
                value={formData.task_time}
                onChange={handleChange}
              />
            </div>
            <div>
            <label htmlFor="">Assign To</label>
              <input
                type="text"
                name="assign_to"
                style={{width: '100%'}}
                value={formData.Assign_to}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
          <label htmlFor="">Remarks</label>
             <input
                type="text"
                name="remarks"
                style={{width: '100%'}}
                value={formData.remarks}
                onChange={handleChange}
              />
          </div>
          </div>
        </div>
              
        <div className="" style={{display:'flex', alignItems: 'end' ,padding:'0 20px'}}>
            <button className="" style={{marginTop: "2rem", border:"2px solid gray", padding: '3px 10px', borderRadius: '15px'}} onClick={handleSave}>Save</button>
            <button className="" style={{marginTop: "2rem", border:"2px solid gray", padding: '3px 10px', borderRadius: '15px', marginLeft: '10px'}} onClick={isTaskClose}>Cancle</button>
        </div>
      </div>
    </div>
  )
}

export default SelectTaskModel;
