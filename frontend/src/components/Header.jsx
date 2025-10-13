import { useAuth } from '../context/AuthContext';

const headerStyle = {
    padding: '20px 40px',
    backgroundColor: 'var(--bg-medium)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold'
};

const logoutButtonStyle = {
    backgroundColor: 'var(--bg-light)',
    borderColor: 'var(--border-color)'
}

function Header() {
    const { logout } = useAuth();

    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>LexiLearn AI</h1>
            <button onClick={logout} style={logoutButtonStyle}>Logout</button>
        </header>
    );
}

export default Header;
