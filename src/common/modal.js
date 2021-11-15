import { useEffect, useRef } from 'react';

import './modal.scss';


export function Input({ label, focused = false, value = '', onChange = null }) {
    const inputRef = useRef();

    useEffect(() => {
        if (focused) {
            inputRef.current.focus();
        }
    }, [focused]);

    return (
        <div className="modal-input-box">
            <p>{label}</p>
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={onChange}
                spellCheck="false"
            />
        </div>
    );
}

export function Button({ text, primary = false, disabled = false, onClick = null }) {
    let className = 'modal-button';

    if (primary) {
        className += ' primary';
    }

    return (
        <button className={className} onClick={onClick} disabled={disabled}>{text}</button>
    );
}

export function ModalRow(props) {
    return (
        <div className="modal-row">{props.children}</div>
    );
}

export function ModalFooter(props) {
    return (
        <div className="modal-footer">{props.children}</div>
    )
}

export function FileDropzone(props) {
    const fileInputRef = useRef();

    return (
        <div className="modal-file-dropzone">
            <Button text="Wybierz plik..." onClick={() => fileInputRef.current.click()} />
            <span className="modal-file-name">{props.label ?? ''}</span>
            <input
                className="modal-file-input"
                type="file"
                ref={fileInputRef}
                onChange={(ev) => props?.onChange(ev.target.files)}
            />
        </div>
    );
}

function Modal({ visible = false, title, closeable = true, onClose, children }) {
    function handleOverlayClick(ev) {
        if (onClose && ev.target === ev.currentTarget) {
            onClose();
        }
    }

    if (!visible) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <p className="modal-header-title">{title}</p>
                    {closeable && (
                        <button className="modal-close-button" onClick={() => onClose?.()}></button>
                    )}
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;