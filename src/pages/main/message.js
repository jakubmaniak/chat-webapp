import { useState } from 'react';


function Message({ id, isOwned, content, date }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const className = (isOwned ? 'message owned' : 'message');

    content = content
        .split(/((?:https?:\/\/|ftps?:\/\/|mailto:|magnet:)[^\s]+)/g)
        .map((segment, i) => (
            (i % 2)
            ? <a href={segment} rel="noopener noreferrer nofollow" target="_blank">{segment}</a>
            : segment
        ));


    return <div
        className="message-row"
        key={id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        <div className={className}>{content}</div>
        {isHovered && <p className="message-date" title={date.format('LTS LL')}>{date.fromNow()}</p>}
    </div>;
}

export default Message;