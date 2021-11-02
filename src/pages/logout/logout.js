import { useEffect } from 'react';
import { useHistory } from 'react-router';


function LogoutPage() {
    const history = useHistory();

    useEffect(() => {
        localStorage.clear();
        history.replace('/login');
    }, []);

    return null;
}

export default LogoutPage;