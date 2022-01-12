import { useContext } from 'react';

import { NavContext } from '../contexts/nav-context';


function useNav() {
    const { nav, setNav } = useContext(NavContext);

    return {
        focusedSection: nav.focusedSection,
        navigateTo: (section) => {
            setNav({ ...nav, focusedSection: section });
        }
    };
}

export default useNav;