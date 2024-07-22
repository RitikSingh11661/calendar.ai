import React, { useEffect, useState } from "react";
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { addEvents } from "../redux/App/action.js";
import { useDispatch } from "react-redux";
import { FaCheck } from "react-icons/fa";
import '../styles/DetectTextStyle.css';
import { useToast } from "@chakra-ui/react";
import jwtDecode from "jwt-decode";
import { AddTimetable } from "./AddTimetable.jsx";

export const DetectText = () => {
  const [file, setFile] = useState({});
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isOcrClicked, setIsOcrClicked] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true)
  const [userId, setUserId] = useState('');
  const bucketName = process.env.REACT_APP_SECRET_BUCKET_NAME;
  const toast = useToast();
  const dispatch = useDispatch();

  const onSelectFile = (e) => {
    // ocrDenyingToast();
    setIsFileSelected(false);
    setIsOcrClicked(false);
    if (!e.target.files || e.target.files.length === 0) return;
    const reader = new FileReader();
    const file = e.target.files[0];
    const fileType = file.type.split('/')[1];
    if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'pdf') {
      alert('Please choose a valid image or PDF file');
      return;
    }
    setFile(file);
    setIsFileSelected(true);
    reader.readAsDataURL(file);
  }

  const onPaste = (event) => {
    // ocrDenyingToast();
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1 || item.type === 'application/pdf') {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = () => {
          const file = new File([blob], 'pasted-file', { type: blob.type });
          setFile(file);
          setIsFileSelected(true);
        };
        reader.readAsDataURL(blob);
      } else {
        alert('Please choose a valid image or PDF file');
        return;
      }
    }
  };

  const credential = {
    accessKeyId: process.env.REACT_APP_ACCESS_KEY_id,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_Region
  }

  const s3 = new AWS.S3(credential);

  let ocrDenyingToast = () => {
    return toast({
      title: "Aws charge for this service",
      description: "You can contact developer for demo",
      status: "error",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }

  let ocrSuccessToast = () => {
    return toast({
      title: 'Document analysis successfully done',
      description: `You can now start adding events with just one click.`,
      status: "success",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }

  let ocrFailureToast = (error) => {
    return toast({
      title: "Analysation of document failed",
      description: error.msg,
      status: "error",
      duration: 3000,
      position: "top",
      isClosable: true,
    });
  }

  const detectText = async () => {
    if (!isFileSelected) {
      alert('Please choose a file & upload it first');
      return;
    }
    const fileExtension = file.name.split('.').pop();
    let filename;
    if (isPrivate) filename = `${file.name.split('.').slice(0, -1).join('.')}.${fileExtension}-${uuidv4()}`;
    else filename = `${file.name.split('.').slice(0, -1).join('.')}-${userId}-${uuidv4()}.${fileExtension}`;

    const params = { Bucket: bucketName, Key: filename, Body: file };

    s3.putObject(params, (err, data) => {
      // try {
      //   console.log('data',data);
      // } catch (error) {
      //   console.log('err',error);
      // }
      if (err) console.log('error', err);
      else console.log('success', data);
    });

    const lambda = new AWS.Lambda(credential);

    const params2 = {
      FunctionName: process.env.REACT_APP_Function_Name,
      Payload: JSON.stringify({ Records: [{ s3: { bucket: { name: bucketName }, object: { key: filename } } }] })
    };

    lambda.invoke(params2, (err, data) => {
      if (data) {
        const res = JSON.parse(data.Payload);
        if (res.statusCode === 200) {
          const tableKeys = Object.keys(res.body.table);
          const tableId = tableKeys[0];
          const firstTableData = res.body.table[tableId];
          dispatch(addEvents(firstTableData))
          ocrSuccessToast()
          setIsOcrClicked(prev => !prev)
        }
      } else if (err) {
        ocrFailureToast(err);
      };
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    const decodedId = jwtDecode(token).userId;
    setUserId(decodedId)
    document.addEventListener('paste', onPaste);
    return () => {document.removeEventListener('paste', onPaste)};
  }, [])

  return (
    <div id='main_div_detect_text'>
      <div id="file-uploader-container">
        <input type="file" id="file" name="file" onChange={onSelectFile} className="inputfile" />
        <label htmlFor="file" style={{ backgroundColor: isFileSelected ? "rgb(181 63 181)" : "" }} className="file-label">Choose a file</label>
        <button onClick={detectText} className="ocr-button">Run OCR</button>
        <FaCheck color={isOcrClicked ? "#4caf50" : "grey"} size={26} />
        <div className="private-toggle">
          <input type="checkbox" id="private-checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
          <label htmlFor="private-checkbox">Private mode</label>
        </div>
      </div>
      <h2>or</h2>
      <AddTimetable />
    </div>
  )
}