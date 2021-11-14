import { useEffect, useState } from "react";

function ImageViewer({ attachment, onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (attachment) {
            setIsVisible(true);
        }
        else {
            setIsVisible(false);
        }

        const onKeyUp = (ev) => {
            if (ev.key === 'Escape') {
                close();
            }
        };

        window.addEventListener('keyup', onKeyUp);

        return () => {
           window.removeEventListener('keyup', onKeyUp);
        };
    }, [attachment]);

    function close() {
        setIsVisible(false);
        onClose?.();
    }

    function getSizeText() {
        if (attachment.size < 1024) {
            return attachment.size + ' B';
        }
        else if (attachment.size < 1024 * 1024) {
            return Math.round(attachment.size / 1024) + ' kB';
        }
        else if (attachment.size < 1024 * 1024 * 1024) {
            return (attachment.size / 1024 / 1024).toFixed(2) + ' MB';
        }
    }

    function downloadImage(ev) {
        ev.stopPropagation();
        
        fetch('http://localhost:3002/attachments/' + attachment.fileName)
        .then((res) => res.blob())
        .then((blob) => {
            const blobURL = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobURL;
            a.download = attachment.fileName;
            a.click();
        });

        // const a = document.createElement('a');
        // a.href = 'http://localhost:3002/attachments/' + attachment.fileName;
        // a.download = attachment.fileName;
        // a.innerText = "download";
        // a.click();
    }


    if (!isVisible) {
        return null;
    }

    return <div className="image-viewer-wrapper" onClick={close}>
        {attachment && 
            <div className="image-viewer-container">
                <img src={'http://localhost:3002/attachments/' + attachment.fileName}/>
                <div className="image-viewer-footer">
                    <div className="image-viewer-detail">
                        <span className="image-viewer-detail-label">ROZMIAR</span>
                        <span className="image-viewer-detail-value">{getSizeText()}</span>
                    </div>
                    <div className="image-viewer-detail">
                        <span className="image-viewer-detail-label">TYP</span>
                        <span className="image-viewer-detail-value">{attachment.extension.slice(1).toUpperCase()}</span>
                    </div>
                    <button className="image-viewer-download-button" onClick={(ev) => downloadImage(ev)}>POBIERZ</button>
                </div>
            </div>
        }
    </div>;
}

export default ImageViewer;