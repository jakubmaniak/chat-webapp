import { useState } from 'react';

import ImageViewer from './image-viewer';


function Message({ id, isOwned, isAnimated, hasAttachment, content = null, attachment = null, date }) {
    const [isHovered, setIsHovered] = useState(false);
    const [displaysImageViewer, setDisplaysImageViewer] = useState(false);
    
    let className = (isOwned ? 'message owned' : 'message');
    isAnimated && (className += ' animated');

    content = content
        ?.split(/((?:https?:\/\/|ftps?:\/\/|mailto:|magnet:)[^\s]+)/g)
        ?.map((segment, i) => (
            (i % 2)
            ? <a href={segment} rel="noopener noreferrer nofollow" target="_blank">{segment}</a>
            : segment
        ));


    function renderAttachment(type, fileName) {
        let attachmentNode;

        if (type === 'image') {
            attachmentNode = (
                <img
                    className="message-attachment message-attachment-image"
                    src={'http://localhost:3002/attachments/' + attachment.fileName}
                    alt={attachment.fileName}
                    onClick={() => setDisplaysImageViewer(true)}
                />
            );
        }

        return <div className="message-row">{attachmentNode}</div>;
    }

    return <div key={id} className="message-container">
        {!hasAttachment && <div
            className="message-row"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={className}>{content}</div>
            {isHovered && <p className="message-date" title={date.format('LTS LL')}>{date.fromNow()}</p>}
        </div>}
        {hasAttachment && renderAttachment(attachment.type, attachment.fileName)}
        {displaysImageViewer && <ImageViewer attachment={attachment} onClose={() => setDisplaysImageViewer(false)} />}
    </div>;
}

export default Message;