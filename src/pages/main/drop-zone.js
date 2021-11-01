import { useContext, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

import api from '../../api';
import { ContactsContext } from '../../contexts/contacts-context';


function DropZone() {
    //const dropZoneRef = useRef();
    const { contacts } = useContext(ContactsContext);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        window.addEventListener('blur', () => {
            setIsVisible(true);
            setIsDragging(false);
        });
        window.addEventListener('focus', () => setIsVisible(false));
    }, []);

    //console.log(acceptedFiles);

    useEffect(() => {
        //console.log(acceptedFiles);
        if (acceptedFiles.length > 0) {
            const formData = new FormData();
            formData.append('file', acceptedFiles[0]);

            axios.post('http://localhost:3002/attachment', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then((res) => {
                console.log(res.data.data);

                const message = {
                    content: null,
                    fileName: res.data.data.fileName,
                    recipient: null,
                    roomID: null
                };

                console.log({message});

                if (contacts.currentContact.isRoom) {
                    message.roomID = contacts.currentContact.id;
                }
                else {
                    message.recipient = contacts.currentContact.name;
                }

                api.sendMessage(message);
            });
        }
    }, [acceptedFiles]);
    

    // if (!isVisible) {
    //     return <div></div>;
    // }

    //console.log(acceptedFiles);

    return <div
        className={'drop-zone-wrapper' + (isDragging ? ' dragging' : '')}
        style={{ display: (isVisible ? 'block' : 'none') }}
        {...getRootProps()}
        onDragEnter={(ev) => {
            // console.log('onDragEnter');
            // ev.preventDefault();
            // ev.stopPropagation();
            // ev.nativeEvent.preventDefault();
            // ev.nativeEvent.stopPropagation();
            // ev.nativeEvent.stopImmediatePropagation();
            setIsDragging(true);
            //return false;
        }}
        onDragLeave={(ev) => {
            // console.log('onDragLeave');
            // ev.preventDefault();
            // ev.stopPropagation();
            // ev.nativeEvent.preventDefault();
            // ev.nativeEvent.stopPropagation();
            // ev.nativeEvent.stopImmediatePropagation();
            setIsDragging(false);
            //return false;
        }}
        // onDragOver={(ev) => {
        //     console.log('onDragOver');
        //     ev.preventDefault();
        //     ev.stopPropagation();
        //     ev.nativeEvent.preventDefault();
        //     ev.nativeEvent.stopPropagation();
        //     ev.nativeEvent.stopImmediatePropagation();
        //     return false;
        // }}
        // onDragStart={(ev) => {
        //     console.log('onDragStart');
        //     ev.preventDefault();
        //     ev.stopPropagation();
        //     ev.nativeEvent.preventDefault();
        //     ev.nativeEvent.stopPropagation();
        //     ev.nativeEvent.stopImmediatePropagation();
        // }}
        // onDragEnd={(ev) => {
        //     console.log('onDragEnd');
        //     ev.preventDefault();
        //     ev.stopPropagation();
        //     ev.nativeEvent.preventDefault();
        //     ev.nativeEvent.stopPropagation();
        //     ev.nativeEvent.stopImmediatePropagation();
        // }}
        // onDrag={(ev) => {
        //     console.log('onDrag');
        //     ev.preventDefault();
        //     ev.stopPropagation();
        //     ev.nativeEvent.preventDefault();
        //     ev.nativeEvent.stopPropagation();
        //     ev.nativeEvent.stopImmediatePropagation();
        //     return false;
        // }}
        // onDrop={(ev) => {
        //     console.log('onDrop');
        //     ev.preventDefault();
        //     ev.stopPropagation();
        //     ev.nativeEvent.preventDefault();
        //     ev.nativeEvent.stopPropagation();
        //     ev.nativeEvent.stopImmediatePropagation();
        //     console.log(ev);
        //     return false;
        // }}
    >
        <input {...getInputProps()} />
        {/* {isDragging && <div className="drop-zone-container">
            <div className="drop-zone-hint">Upuść pliki tutaj</div>
        </div>} */}
    </div>;
}

export default DropZone;