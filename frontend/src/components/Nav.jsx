import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <ul className="flex space-x-8 text-white">
        <li>
          <Link
            to="/"
            className="hover:text-indigo-400 transition duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/song/new"
            className="hover:text-indigo-400 transition duration-300"
          >
            Add Song
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
