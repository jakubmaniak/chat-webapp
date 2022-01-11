import { useContext } from 'react';

import { CacheContext } from '../contexts/cache-context';


function useCache() {
    const { cache, setCache } = useContext(CacheContext);

    return {
        getAvatarID: (username) => cache.avatars.get(username),
        setAvatarID: (username, avatarID) => {
            cache.avatars.set(username, avatarID);
            setCache({ ...cache });
        }
    };
}

export default useCache;