import { createContext } from 'react';

export const initialNavContext = {
    fullView: true,
    focusedSection: 'center'
};

export const NavContext = createContext(initialNavContext);