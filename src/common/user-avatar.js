import './user-avatar.scss';


function UserAvatar({ avatarID }) {
    if (avatarID) {
        return (
            <div
                className="user-avatar"
                style={{ backgroundImage: `url('http://localhost:3002/avatars/${avatarID}')` }}
            ></div>
        );
    }
    else {
        return <div className="user-avatar"></div>;
    }
}

export default UserAvatar;