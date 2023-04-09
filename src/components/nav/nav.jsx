
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
            <div className="nav-items"><IconHome/></div>
            <div className="nav-items"><IconBrowse/></div>
            <div className="nav-items"><IconImage/></div>
            <div className="nav-items"><IconColor/></div>
            <div className="nav-items"><IconSetting/></div>
        </nav>
    )
};