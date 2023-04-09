import { useState, useEffect, useContext } from 'react';

// Style
import './scss/viewer.scss';

// Context
import FilesContext from '../../contexts/files/context';

// Constants
const OPTIONS = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
};

// Components
function Message(props) {
    // State
    const [select, setSelect] = useState();

    // Effect
    useEffect(() => {
        if (props.selected.includes(props.id)) {
            setSelect(true);
        } else {
            setSelect(false);
        };
    },[props.selected]);
    // Methods
    const handleSelect = (e) => {
        // (!) To select [n]th message and added to list:
        if (select) {
            setSelect(false);
            props.selector(props.id, 'del');
        } else {
            setSelect(true);
            props.selector(props.id);
        };
    };
    return (
        <>
        {   
            props.user &&
            <div
                className={`editor-viewer-message
                    ${props.user.dir}
                    ${props.user.hidden? 'hidden':''}
                    ${select? 'selected':''}`}
                onClick={handleSelect}
            >
                <div className="editor-viewer-message-head">{props.user.rename? props.user.rename: props.user.name}</div>
                <div className="editor-viewer-message-body">{props.msg.body}</div>
                <div className="editor-viewer-message-foot">
                    {props.msg.date.toLocaleString('en-US', OPTIONS)}
                </div>
            </div>
        }
        </>
    )
};

export default function Viewer(props) {
    // Context
    const File = useContext(FilesContext);

    // Methods
    const validateFilter = (date) => {
        // (!) To validate and apply filter:
        // /!\ This operation takes (n) time as number of messages.
        let start = false, end = false;

        // (!) Check if start filter applied?
        if (props.filter.start) {
            // Then, set [n]th message property to true.
            if (date < new Date(props.filter.start)) start = true;
        };
        // (!) Check if end filter applied?
        if (props.filter.end) {
            // Then, set [n]th message property to true.
            if (date > new Date(props.filter.end)) end = true;
        };
        // (!) Check if either start or end is valid?
        return (start || end)? true: false;
    };
    return (
        <div className='dashboard-editor-viewer'>
            {
                File.view.messages &&
                File.view.messages.map((item) => {
                    if (!validateFilter(item.date)) {
                        const user = props.contacts.find(e => e.name == item.name);
                        return (
                            <Message
                                msg={item}
                                user={user}
                                selected={props.selected}
                                selector={props.selector}
                                id={item.id}
                                key={item.id}
                            />
                        )
                    }
                })
            }
        </div>
    )
};