// Providers
import FilesProvider from "../contexts/files/provider";

// Components
import Explorer from "../components/explorer/explorer";
import Editor from '../components/editor/editor';

export default function DashboardBrowse() {
    return (
        <div className="dashboard">
            <FilesProvider>
                <Explorer/>
                <Editor/>
            </FilesProvider>
        </div>
    )
};