import './user-avatar.scss';


function UserAvatar({ avatarID, name = null, wide = false, large = false }) {
    if (avatarID) {
        return (
            <div
                className={'user-avatar' + (large ? ' large' : '')}
                style={{ backgroundImage: `url('http://localhost:3002/avatars/${avatarID}')` }}
            ></div>
        );
    }
    else if (name) {
        return <div className={'user-avatar' + (large ? ' large' : '')}>{name.slice(0, wide ? 3 : 2)}</div>;
    }
    else {
        return <div className={'user-avatar' + (large ? ' large' : '')}></div>;
    }
}

export default UserAvatar;