import { Link } from 'react-router-dom';

// Style
import './scss/nav.scss';
// Icons
import IconHome from '../../assets/svgs/icons/home';
import IconBrowse from '../../assets/svgs/icons/browse';
import IconImage from '../../assets/svgs/icons/image';
import IconColor from '../../assets/svgs/icons/color';
import IconSetting from '../../assets/svgs/icons/setting';

export default function Nav() {
    return (
        <nav className="navbar">
            <Link className="nav-items" to="/"><IconHome/></Link>
            <Link className="nav-items" to="/browse"><IconBrowse/></Link>
            <Link className="nav-items" to="/media"><IconImage/></Link>
            <Link className="nav-items" to="/theme"><IconColor/></Link>
            <Link className="nav-items" to="/settings"><IconSetting/></Link>
        </nav>
    )
};