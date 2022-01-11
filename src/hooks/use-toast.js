import { toast } from 'react-toastify';


const toastOptions = {
    theme: 'dark',
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    //draggable: true
};

function useToast() {
    return {
        show: (content) => toast(content, toastOptions),
        success: (content) => toast.success(content, toastOptions),
        error: (content) => toast.error(content, toastOptions),
        promise: (promise, content) => toast.promise(promise, content, toastOptions),
    };
}

export default useToast;