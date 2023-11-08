// Providers
import CollectionsProvider from "../contexts/collections/provider";

// Components
import Theme from '../components/theme/theme';
import Media from '../components/media/media';

export default function DashboardMedia() {
    return (
        <div className="dashboard">
            <CollectionsProvider>
                <Theme/>
                <Media/>
            </CollectionsProvider>
        </div>
    )
};