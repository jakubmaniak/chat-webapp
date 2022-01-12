import { createContext } from 'react';

export const initialNavContext = {
    focusedSection: 'center'
};

export const NavContext = createContext(initialNavContext);