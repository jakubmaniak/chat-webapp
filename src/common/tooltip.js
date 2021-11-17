import { useRef, useState } from 'react';

import './tooltip.scss';


function Tooltip({ text, horizontalPosition = 'right', children }) {
    const tooltipRef = useRef();
    const [visible, setVisible] = useState(false);
    const [x, setX] = useState('0');
    const [y, setY] = useState('0');

    function handleMouseEnter(ev) {
        setVisible(true);
    }

    function handleMouseLeave(ev) {
        setVisible(false);
    }

    function handleMove(ev) {
        if (!visible) return;

        if (horizontalPosition === 'right') {
            setX(ev.pageX + 24 + 'px');
        }
        else {
            setX(ev.pageX - tooltipRef.current.offsetWidth - 24 + 'px');
        }
        
        setY(ev.pageY - 2 + 'px');
    }

    return <>
        {visible && <span ref={tooltipRef} className="tooltip" style={{ left: x, top: y }}>{text}</span>}
        <div
            className="tooltip-caller"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMove}
        >
            {children}
        </div>
    </>;
}

export default Tooltip;