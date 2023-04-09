import { useState, useEffect, useContext } from 'react';
import { fileType, fileSize } from '../../utils/file';

// Style
import './scss/file.scss';
// Icons
import IconConvert from '../../assets/svgs/icons/convert';
import IconPreview from '../../assets/svgs/icons/preview';
import IconSave from '../../assets/svgs/icons/save';
import IconRemove from '../../assets/svgs/icons/remove';
import IconMenu from '../../assets/svgs/icons/menu';
import Logos from '../../assets/svgs/files';

// Context
import FilesContext from '../../contexts/files/context';

export default function Files(props) {
    // State
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(false);
    // Context
    const File = useContext(FilesContext);

    // Effect
    useEffect(() => {
        if (props.data.hasOwnProperty('messages')) {
            setStatus(true);
        } else {
            setStatus(false);
        };
    },[File.files]);
    // Methods
    const convert = () => {
        // (!) To convert specific backup file into JSON:
        if (!status) {
            File.convert(props.id);
            setStatus(true);
            setOpen(false);
        };
    };
    const preview = () => {
        // (!) To load specific converted file in the viewer:
        if (status) {
            File.preview(props.id);
            setOpen(false);
        };
    };
    const save = () => {
        // (!) To save specific converted file on local machine:
        if (status) {
            File.save(props.id);
        };
    };
    const remove = () => {
        // (!) To remove specific file from the explorer:
        File.selector(props.data.name, 'del');
        File.remove(props.data.name);
        setOpen(false);
    };
    const handleSelect = (e) => {
        // (!) To select [n]th file and added to list:
        if (e.target.checked) {
            File.selector(props.data.name);
        } else {
            File.selector(props.data.name, 'del');
        };
    };
    const handleToggle = () => {
        // (!) To toggle on/off context:
        setOpen(prev => !prev);
    };
    return (
        <div className='file-card'>
            <div className='file-card-context-menu'>
                <div onClick={handleToggle}><IconMenu/></div>
                { open &&
                    <div className='file-card-context-buttons'>
                        <button onClick={convert} className={status? 'disabled':null}><IconConvert/>Convert</button>
                        <button onClick={preview} className={!status? 'disabled':null}><IconPreview/>Preview</button>
                        <button onClick={save} className={!status? 'disabled':null}><IconSave/>Save</button>
                        <button onClick={remove}><IconRemove/>Remove</button>
                    </div>
                }
            </div>
            <div className='file-card-selector'>
                <input onChange={handleSelect} type="checkbox" disabled={!status}/>
            </div>
            <div className='file-card-icon'>
                <img src={status? Logos.done: Logos[fileType(props.data.type)]}/>
            </div>
            <div className='file-card-info'>
                <span className='file-card-info-name'>{props.data.name}</span>
                <span className='file-card-info-size'>
                    {status? props.data.count: fileSize(props.data.size)}
                </span>
            </div>
        </div>
    )
};