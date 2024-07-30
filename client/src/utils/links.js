import { IoBarChartSharp } from 'react-icons/io5';
import { MdOutlineAdminPanelSettings, MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';


const links = [
  {
    id: 1,
    text: 'stats',
    path: '/',
    icon: <IoBarChartSharp />,
  },
  {
    id: 2,
    text: 'add employee',
    path: 'add-employee',
    icon: <MdQueryStats />,
  },
  {
    id: 3,
    text: 'add job',
    path: 'add-job',
    icon: <FaWpforms />,
  },
  {
    id: 4,
    text: 'profile',
    path: 'profile',
    icon: <ImProfile />,
  },
  {
    id: 5,
    text: 'admin',
    path: 'admin',
    icon: <MdOutlineAdminPanelSettings />,
  },
];

export default links;