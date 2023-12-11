import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import "../styles/AddTimetable.css";
import { useDispatch } from "react-redux";
import { addEvents } from "../redux/App/action";
import { useToast } from "@chakra-ui/react";

export const AddTimetable = () => {
  const initEvent = ['', '-', new Date(), '']
  const [eventData, setEventData] = useState([initEvent]);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleInputChange = (rowIndex, columnIndex, value) => {
    let updatedEventData = [...eventData];
    if (columnIndex === 2) {
      // Format date value to dd/mm/yyyy
      const formattedDate = format(value, 'dd/MM/yyyy');
      updatedEventData[rowIndex][3] = formattedDate;
    } else if (columnIndex === 1) {
      // Update timings value
      const start = updatedEventData[rowIndex][1].split('-')[0];
      const end = updatedEventData[rowIndex][1].split('-')[1];
      updatedEventData[rowIndex][1] = `${start}-${end}`;
    }
    updatedEventData[rowIndex][columnIndex] = value;
    setEventData(updatedEventData);
  };

  const addRow=()=>{
    setEventData([...eventData,initEvent])
  }

  const removeRow = (rowIndex) => {
    const updatedEvents = [...eventData]
    updatedEvents.splice(rowIndex, 1);
    setEventData(updatedEvents);
  };

  let successToast = () => {
    return toast({
      title: 'Your schedule has been added successfully',
      description: `You can now start adding events with just one click.`,
      status: "success",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }

  const handleSubmit = () => {
    const hasEmptyField = eventData.some(([title, timings, date,]) => !title || !timings || !date);
    if (hasEmptyField) {
      alert('Please fill in all fields before submitting');
      return;
    }

    const hasEmptyTimings = eventData.some(([, timings]) => {
      const [start, end] = timings.split('-');
      return !start || !end;
    });
    if (hasEmptyTimings) {
      alert('Please provide both start and end timings');
      return;
    }

    let updatedData = [...eventData], dates = {};
    let dateColumns = Array.from(new Set(updatedData.map((arr) => arr[3])));
    dateColumns.sort((a, b) => new Date(a) - new Date(b)); // Sort date columns
    updatedData.forEach((arr) => {
      let eventTitle = arr[0], date = arr[3];
      if (!dates[date]) dates[date] = [arr[0], arr[1]];
      else dates[date].push(arr);
      arr.splice(2);
      dateColumns.forEach((column) => {
        if (column === date) arr.push(eventTitle);
        else arr.push('');
      });
    });

    let arr = Object.entries(dates);
    let header = ['Title', 'Timings']
    arr.forEach(el => header.push(el[0]));
    updatedData.unshift(header);

    // console.log('updatedData', updatedData)
    dispatch(addEvents(updatedData));
    setEventData([initEvent]);
    successToast();
  };

  return (
    <div className="add-timetable-container">
    <div className="table-container">
      <table className="timetable-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Timings</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {eventData.map((row, rowIndex) => {
            const cellValue = eventData[rowIndex][3];
            return (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => {
                  if (columnIndex === 0) {
                    return (
                      <td key={columnIndex}>
                        <input
                          required
                          type="text"
                          value={cell}
                          placeholder="Enter Title"
                          onChange={(e) =>
                            handleInputChange(rowIndex, columnIndex, e.target.value)
                          }
                        />
                      </td>
                    );
                  } else if (columnIndex === 1) {
                    const start = cell.split('-')[0];
                    const end = cell.split('-')[1];
                    return (
                      <td key={columnIndex}>
                        <label>
                          Start:
                          <input
                            type="time"
                            required
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                columnIndex,
                                `${e.target.value}-${end}`
                              )
                            }
                          />
                        </label>
                        <label>
                          End:
                          <input
                            type="time"
                            required
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                columnIndex,
                                `${start}-${e.target.value}`
                              )
                            }
                          />
                        </label>
                      </td>
                    );
                  } else if (columnIndex === 2) {
                    return (
                      <td key={columnIndex}>
                        <DatePicker
                          selected={cellValue ? cell : ''}
                          required
                          placeholderText="Select Date"
                          onChange={(date) =>
                            handleInputChange(rowIndex, columnIndex, date)
                          }
                          dateFormat="dd/MM/yyyy"
                        />
                      </td>
                    );
                  }
                })}
                <td>
                  <button className="remove-button" onClick={() => removeRow(rowIndex)}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <div className="buttons-container">
      <button className="add-button" onClick={addRow}>
        Add Row
      </button>
      <button className="submit-button" onClick={handleSubmit}>
        Add Schedule
      </button>
    </div>
  </div>
  
  );
};