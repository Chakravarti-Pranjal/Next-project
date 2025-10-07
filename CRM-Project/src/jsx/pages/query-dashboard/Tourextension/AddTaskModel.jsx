import React, {useState, useEffect} from 'react'
import {axiosOther} from '../../../../http/axios_base_url';

const AddTaskModel = ({isOpen, isClose, onOpenSelectTask, todo }) => {
  if (!isOpen) return null;

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false);

  const handleTaskModel = (todo) => {
    onOpenSelectTask(todo);
  };

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    const getTodos = async () => {
      try {
        const { data } = await axiosOther.post('todolist');
        console.log(data, 'todosResponse');
        if (data.Status == 1) {
          setTodos(data.DataList);
          // console.log()
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
  
    getTodos();
  }, [isOpen]);

  console.log(todos, 'todosksdkfds')

  return (
    <>
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <div>
          <h3 style={{ backgroundColor: "#233A49", padding: '5px', borderRadius: '6px'  }}>Todo List</h3>

          <table className="table table-bordered itinerary-table mt-2">
            <thead>
              <tr className="text-center ">
                  <th className=" p-1">Service Name</th>
                  <th className=" p-1">Type</th>
                  <th className=" p-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center">Loading...</td>
                </tr>
              ) : (
                Array.isArray(todos) && todos.map((todo, index) => (
                  <tr key={index}>
                    <td className="p-1" style={{color: 'black'}}>{todo.ServiceName}</td>
                    <td className="p-1" style={{color: 'black'}}>{todo.ServiceType}</td>
                    <td className="quotationbuttonss  btn-custom-size" style={{backgroundColor: 'black', margin:'2px' }} onClick={()=>handleTaskModel(todo)}>+Todo</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      <button className="custom-modal-close" style={{marginTop: "2rem", border:"2px solid gray", padding: '3px 10px', borderRadius: '15px'}} onClick={isClose}>Close</button>
      </div>
    </div>

    </>
  )
}

export default AddTaskModel;
