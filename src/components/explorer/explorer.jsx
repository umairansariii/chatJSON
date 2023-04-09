import { useContext } from 'react';

// Style
import './scss/explorer.scss';
// Icons
import IconExport from '../../assets/svgs/icons/export';
import IconBrowse from '../../assets/svgs/icons/browse';
import IconMerge from '../../assets/svgs/icons/merge';
import IconConvert from '../../assets/svgs/icons/convert';
import IconSave from '../../assets/svgs/icons/save';
import IconPreview from '../../assets/svgs/icons/preview';
import IconFilter from '../../assets/svgs/icons/filter';
import IconSelect from '../../assets/svgs/icons/select';
import IconPlus from '../../assets/svgs/icons/plus';
import IconShield from '../../assets/svgs/icons/shield';
import IconLock from '../../assets/svgs/icons/lock';

// Context
import FilesContext from '../../contexts/files/context';

// Components
import Files from './files';

export default function Explorer() {
    // Context
    const File = useContext(FilesContext);

    // Methods
    const handleDrop = (e) => {
        // (!) To add backup files in the explorer:
        e.stopPropagation();
        e.preventDefault();
        File.add(e.dataTransfer.files);
    };
    const handleMerge = () => {
        // (!) To merge two or more selected files:
        File.merge();
    };
    return (
        <div className='dashboard-explorer-container no-print'>
            <h1>Zaptales</h1>
            <p>Turn your memories into a storybook 📕🤗</p>

            <div className='dashboard-explorer-instructions'>
                <h4><b>Quick guide might help you:</b></h4>
                <p>Export <IconExport/> your backup files from your device or social accounts, <a href='#'>see this link</a> to get help how to export your chats.</p>
                <p>Drop your backup files here or <IconBrowse/> browse from your device.</p>
                <p>Convert your <IconConvert/> backup files in JSON format or <IconSave/> save on your device.</p>
                <p>If you have multiple backups from different time, <IconMerge/> merge all by selecting them.</p>
                <p>Preview <IconPreview/> your chats in the viewer, use <IconFilter/> filters for long conversations.</p>
                <p>Select <IconSelect/> messages you want to keep or <IconPlus/> create a group of events.</p><br />
                <p>Save, you are done!</p>
                <h4><b>Privacy and security:</b></h4>
                <p>Your files and chats will be processed on <IconShield/> client-end, no internet, no uploading required.</p>
                <p>End-to-end protected, <IconLock/> no privacy leakage guaranteed.</p>
            </div>
            <div className='dashboard-explorer' onDrop={(e) => handleDrop(e)}>
                <div className='dashboard-explorer-header'>
                    <h2>Drop backup files here</h2>
                    <p>Supported files .xml .txt .html .json</p>
                </div>
                <div className='dashboard-explorer-options'>
                    <label className='button' htmlFor='file-browser'>Browse files</label>
                    <input onChange={(e) => File.add(e.target.files)} id='file-browser' type='file' accept='.txt, .xml, .html, .json' multiple />
                    <button onClick={handleMerge} className='button'>Merge</button>
                </div>
                <div className='dashboard-explorer-files'>
                    { File.files &&
                        File.files.map((buffer, idx) =>
                            <Files data={buffer} id={idx} key={idx}/>
                        )
                    }
                </div>
            </div>
        </div>
    )
};