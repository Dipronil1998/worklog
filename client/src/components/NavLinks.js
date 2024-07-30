import { NavLink } from 'react-router-dom';
import links from '../utils/links';
import { useAppContext } from '../context/appContext';

const NavLinks = ({ toggleSidebar }) => {
  const {user} = useAppContext()
  return (
    <div className='nav-links'>
      {links.map((link) => {
        const { text, path, id, icon } = link;
        if(path === 'admin' && user.role !=='admin') return;
        return (
          <NavLink
            to={path}
            key={id}
            onClick={toggleSidebar}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;