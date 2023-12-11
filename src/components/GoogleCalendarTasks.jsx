import React from 'react'
import '../styles/GoogleCalendarTasksStyle.css'
import { useSelector } from 'react-redux';
// import { AddGoogleCalenderThing } from './AddGoogleThing';

export const GoogleCalendarTasks = () => {
  // const gapi=window.gapi;
  const {tasks}=useSelector(store=>store.AppReducer);
  
  // will be implement later
  // const addAutoTasks=()=>{
  //   const tasks = [
  //     { "title": "Task 3", "notes": "This is the first task" },
  //     { "title": "Task 4", "notes": "This is the second task" }
  //   ]

  //   // temp solution 
  //   tasks.forEach(task =>
  //     gapi.client.tasks.tasks.insert({ tasklist: 'MTc0MTY5NjA3MTc2ODY1MDAwNjk6MDow', resource: task }).then(res => console.log('res', res))
  //   )

  //   // Inserting in the array form
  //   // gapi.client.tasks.tasks.insert({ tasklist: 'MTc0MTY5NjA3MTc2ODY1MDAwNjk6MDow', resource:tasks}).then(res => console.log('res', res))

  //   // Inserting in the object of array form
  //   // gapi.client.tasks.tasks.insert({ tasklist: 'MTc0MTY5NjA3MTc2ODY1MDAwNjk6MDow', resource:{items:tasks}}).then(res => console.log('res', res))
  // }

  return (
    <div id='main-div'>
      <h2>My Tasks</h2>
      {/* <AddGoogleCalenderThing title={'Add Tasks'} onClick={addAutoTasks}/> */}
      <div className="tasks-container">     
      {tasks?.length>0 && tasks?.map((task) => (
        <div key={task.id} className={`task ${task.status}`}>
          <h3>{task.title}</h3>
          {task.notes && <p>{task.notes}</p>}
          <p>{task.due ? new Date(task.due).toLocaleDateString() : 'No due date'}</p>
        </div>
      ))}
      {!tasks && <p>No tasks found.</p>}
    </div>
    </div> 
  )
}
