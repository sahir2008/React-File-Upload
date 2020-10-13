import React, { Fragment, useState } from 'react';
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [fileName, setFileName] = useState('Choose file');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        const f = e.target.files[0];
        setFile(f);
        setFileName(f.name);
    }

    const onSubmit = async e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: ProgressEvent => {
                    setUploadPercentage(parseInt(Math.round((ProgressEvent.loaded * 100) /
                        ProgressEvent.total)));

                    // Clear percentage 
                    setTimeout(() => setUploadPercentage(0), 3000);
                }

            });

            const { fileName, filePath } = res.data;

            setUploadedFile({ fileName, filePath });
            setMessage('File Uploaded');

        } catch (err) {
            if (err.response.status === 500) {
                setMessage("There was a problem with the server");
            } else {
                setMessage(err.response.data.msg);
            }

        }
    }

    return (
        <Fragment>
            {message && <Message msg={message} />}
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                    <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                    <label className="custom-file-label" htmlFor="customFile">
                        {fileName}
                    </label>
                </div>

                <Progress percentage={uploadPercentage} />

                <input type="submit" value="upload" className="btn btn-primary btn-block mt-4" />
            </form>
            { uploadedFile && <div className="row mt-5 ">
                <div className="col-md-6 m-auto">
                    <h3 className="text-center">{uploadedFile.fileName}</h3>
                    <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" />
                </div>
            </div>}
        </Fragment>
    )
}

export default FileUpload;
