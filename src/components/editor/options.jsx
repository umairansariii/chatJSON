import { useState, useEffect, useRef } from 'react';

// Style
import './scss/options.scss';
// Icons
import IconClose from '../../assets/svgs/icons/close';
import IconMenu from '../../assets/svgs/icons/menu';
import IconPlus from '../../assets/svgs/icons/plus';
import IconRename from '../../assets/svgs/icons/rename';
import IconTransfer from '../../assets/svgs/icons/transfer';
import IconSave from '../../assets/svgs/icons/save';
import IconShow from '../../assets/svgs/icons/show';
import IconHide from '../../assets/svgs/icons/hide';

// Components
function User(props) {
    // State
    const [open, setOpen] = useState(false);
    const [rename, setRename] = useState(false);
    // Reference
    const inputName = useRef();

    // Effect
    useEffect(() => {
        // (!) To auto focus on renaming field:
        if (rename) {
            inputName.current.focus();
        };
    },[rename]);
    // Methods
    const handleSwap = () => {
        // (!) To swap the direction of a specific user:
        props.update(prev => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex(e => e.name == props.data.name);
            if (prev[index].dir == 'left') {
                prev[index].dir = 'right';
            } else {
                prev[index].dir = 'left';
            };
            return [...prev];
        });
    };
    const handleHide = () => {
        // (!) To hide or show a specific user from the viewer:
        props.update(prev => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex(e => e.name == props.data.name);
            if (!prev[index].hidden) {
                prev[index].hidden = true;
            } else {
                prev[index].hidden = false;
            };
            return [...prev];
        });
    };
    const handleRename = (name) => {
        // (!) To rename a specific user:
        props.update(prev => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex(e => e.name == props.data.name);
            prev[index].rename = name;
            return [...prev];
        });
    };
    const handleSelection = (e) => {
        // (!) To make multiple selection of users:
        props.update(prev => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex(e => e.name == props.data.name);
            prev[index].selected = e.target.checked;
            return [...prev];
        });
    };
    const handleJoin = () => {
        // (!) To join two or more selected users:
        props.join();
    };
    const handleExport = () => {
        // (!) To export single or multiple users as JSON:
        // Here, this user data belongs to where context openned.
        props.export(props.data);
    };
    const handleToggle = () => {
        // (!) To toggle on/off context:
        setOpen(prev => {
            if (open && rename) {
                // If user renaming and accidentally closes context, made changes unsaved.
                setRename(false);
            };
            return !prev;
        });
    };
    const handleToggleRename = () => {
        // (!) To toggle on/off renaming:
        if (rename) {
            // /!\ This operation takes (n) time as number of messages.
            handleRename(inputName.current.value);
            setRename(false);
        } else {
            setRename(true);
        };
    };
    const handleKeyEvent = (e) => {
        if (e.key == 'Enter') {
            handleToggleRename();
        };
    };
    return (
        <div className='dashboard-editor-options-contacts-user-card'>
            <input type="checkbox" onChange={handleSelection}/>
            { rename?
                <input 
                    type="text"
                    onKeyDown={handleKeyEvent}
                    placeholder={props.data.rename? props.data.rename: props.data.name}
                    ref={inputName}
                />:
                <span>{props.data.rename? props.data.rename: props.data.name}</span>
            }
            <div className='user-card-context-menu'>
                <div onClick={handleToggle}><IconMenu/></div>
                { open &&
                    <div className='user-card-context-buttons'>
                        <button onClick={handleJoin}><IconPlus/>Join</button>
                        <button onClick={handleSwap}><IconTransfer/>Swap</button>
                        <button onClick={handleToggleRename}><IconRename/>{rename? 'Change':'Rename'}</button>
                        <button onClick={handleExport}><IconSave/>Save</button>
                        <button onClick={handleHide}>{props.data.hidden? <IconShow/>:<IconHide/>}{props.data.hidden? 'Show':'Hide'}</button>
                    </div>
                }
            </div>
        </div>
    )
};
function Group(props) {
    // Methods
    const handleDelete = () => {
        props.del(props.id);
    };
    const handleLoad = () => {
        props.load(props.id);
    };
    return (
        <div className="dashboard-editor-options-contacts-group-card">
            <span onClick={handleLoad}>Group{props.id+1} ({props.count})</span>
            <span onClick={handleDelete}><IconClose/></span>
        </div>
    )
};

export default function Options(props) {
    // State
    const [filter, setFilter] = useState({start:'',end:''});

    // Methods
    const createGroup = () => {
        // (!) To create a new group:
        if (props.selected.length > 0) {
            props.createGrp();
        };
    };
    const deleteGroup = (id) => {
        // (!) To delete a specific group:
        props.deleteGrp(id);
    };
    const loadGroup = (id) => {
        // (!) To load a specific group:
        props.loadGrp(id);
    };
    const updateFilter = (e) => {
        // (!) To update filter state:
        setFilter(prev => {
            // Here, target.name represents (start|end).
            prev[e.target.name] = e.target.value;
            // /!\ Refreshes the state.
            return {...prev};
        });
    };
    const handleApplyFilter = () => {
        // (!) To apply filtration:
        props.apply(filter);
    };
    const handleClose = () => {
        // (!) To close the viewer and unload the file:
        props.close();
    };
    return (
        <div className='dashboard-editor-options no-print'>
            <div className='dashboard-editor-options-header'>
                <div onClick={handleClose}><IconClose/></div>
                <h2>{props.file.name? props.file.name:'No_Backup'}</h2>
                <p>{props.file.count? props.file.count:'0'} messages</p>
            </div>
            <div className='dashboard-editor-options-contacts'>
                <h4>Contacts</h4>
                <div className='dashboard-editor-options-contacts-user-container'>
                    {
                        props.contacts.map((item, idx) =>
                            <User
                                data={item}
                                update={props.update}
                                join={props.join}
                                export={props.export}
                                key={idx}
                            />
                        )
                    }
                </div>
                <br/><br/>
                <h4>Selected ({props.selected.length}) <span onClick={createGroup}><IconPlus/></span></h4>
                <div className='dashboard-editor-options-contacts-group-container'>
                    {
                        props.groups.map((item, idx) =>
                            <Group 
                                load={loadGroup}
                                del={deleteGroup}
                                count={item.length}
                                id={idx}
                                key={idx}
                            />
                        )
                    }
                </div>
                <br/><br/>
                <h4>Filter</h4>
                <h6>START</h6>
                <input onChange={updateFilter} type="datetime-local" name='start'/>
                <h6>END</h6>
                <input onChange={updateFilter} type="datetime-local" name='end'/>
                <h6>OPTIONS</h6>
                <div className='dashboard-editor-options-contacts-btn' onClick={handleApplyFilter}>Apply</div>
                <div className='dashboard-editor-options-contacts-btn'>Save</div>
            </div>
        </div>
    )
};