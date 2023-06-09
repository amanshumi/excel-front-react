import { Link, Outlet } from "react-router-dom";


const Nav = () => {
    return (
        <div>
            <div className="navbar">
                <Link to={'/'} >Home</Link>
                <Link to={'/upload'} >Upload</Link>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default Nav;