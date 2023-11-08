import { useState, useEffect, useContext } from 'react';

// Style
import './scss/editor.scss';

// Context
import FilesContext from '../../contexts/files/context';

// Components
import Options from './options';
import Viewer from './viewer';

export default function Editor() {
    // State
    const [users, setUsers] = useState([]);
    const [select, setSelect] = useState([]);
    const [group, setGroup] = useState([]);
    const [apply, setApply] = useState({start:'',end:''});
    const [state, forceUpdate] = useState(false);
    // Context
    const File = useContext(FilesContext);

    // Effect
    useEffect(() => {
        function updateContacts() {
            // (!) When new file is loaded, it will refresh the viewer.
            if (File.view.hasOwnProperty('messages')) {
                setUsers(getUsers(File.view.messages));
            };
        };
        updateContacts();
    },[File.view]);
    useEffect(() => {
        function generateBackup() {
            // /!\ Fix: group state isn't updating, therefore forcing state to update.
            exportChat();
        };
        generateBackup();
    },[state]);
    // Methods
    const getUsers = (list) => {
        // (!) To scan entire file and get unique contacts:
        const contacts = [];
        // /!\ This loop iterates (n) times as number of messages.
        for (let i = 0; i < list.length; i++) {
            // (!) Collect each unique user.
            if (!contacts.find(user => user.name == list[i].name)) {
                contacts.push({
                    name: list[i].name,
                    rename: undefined,
                    dir: 'left',
                    selected: false,
                    hidden: false,
                });
            };
        };
        return contacts;
    };
    const joinUsers = () => {
        // (!) To join two or more selected contacts:
        const selected = users.filter(e => e.selected == true);
        if (selected.length > 1) {
            File.join(selected.map(e => e.name));
        } else {
            console.error('Error: Cannot join a single contact.');
        };
    };
    const exportUsers = (user) => {
        // (!) To export single or multiple contacts as JSON:
        const selected = users.filter(e => e.selected == true);
        if (selected.length == 0) {
            File.saveas(user);
        } else {
            File.saveas(selected);
        };
    };
    const selectMessage = (id, flag) => {
        // (!) To add or remove selected messages:
        switch (flag) {
            case 'del':
                setSelect(prev => prev.filter(e => e !== id));
                break;
            default:
                setSelect(prev => [...prev, id]);
                break;
        };
    };
    const createGroup = () => {
        // (!) To create a new group:
        setGroup(prev => [...prev, select]);
        setSelect([]);
    };
    const deleteGroup = (idx) => {
        // (!) To delete a specific group:
        setGroup(prev => {
            const x = prev.splice(idx, 1);
            return [...prev];
        });
    };
    const loadGroup = (idx) => {
        // (!) To load a specific group:
        setSelect(group[idx]);
    };
    const applyFilter = (filter) => {
        // (!) To apply filters on the viewer:
        // /!\ This operation takes (n) time as number of messages.
        setApply(prev => {
            if (filter.start <= filter.end) {
                return {...filter};
            } else {
                console.error('Error: End-date must be greater.');
                return prev;
            };
        });
    };
    const exportChat = () => {
        // (!) To export user edited data as JSON:
        if (File.view.hasOwnProperty('messages') && group.length > 0) {
            // (#) Collect all messages.
            const selected = group.flat(1);
            // /!\ This operation takes (n) time as number of messages.
            const filtered = File.view.messages.filter(e => selected.includes(e.id));
            const compiled = [];
            // /!\ Rename and collects visible messages only.
            filtered.forEach(item => {
                const user = users.find(e => e.name == item.name);
                if (!user.hidden) {
                    compiled.push({
                        ...item, name: user.rename? user.rename: user.name,
                    });
                };
            });
            // (#) Collect all contacts.
            const contacts = [];
            // /!\ Drop unnecessary data and collects visible users only.
            users.forEach(item => { 
                if (!item.hidden) {
                    contacts.push({
                        name: item.rename? item.rename: item.name,
                        dir: item.dir,
                    });
                };
            });
            // (#) Collect all groups.
            for (let i = 0; i < group.length; i++) {
                for (let j = 0; j < group[i].length; j++) {
                    const name = filtered.find(e => e.id == group[i][j]).name;
                    // /!\ Keep visible messages only.
                    if (users.find(e => e.name == name).hidden) {
                        group[i].splice(j, 1);
                    };
                };
            };
            // /!\ Saves file on local machine.
            File.exportas({
                name: File.view.name,
                messages: compiled,
                count: compiled.length,
                groups: group,
                users: contacts,
            });
        };
    };
    const saveBackup = () => {
        // (!) To save edited backup on local machine:
        // /!\ Forces state to update.
        forceUpdate(prev => !prev);
    };
    const handleEditorClose = () => {
        // (!) To close the editor and unload the file:
        File.close();
        setGroup([]);
        setUsers([]);
        setSelect([]);
        setApply({start:'',end:''});
    };
    return (
        <div className='dashboard-editor'>
            <Options
                join={joinUsers}
                update={setUsers}
                export={exportUsers}
                apply={applyFilter}
                save={saveBackup}
                createGrp={createGroup}
                deleteGrp={deleteGroup}
                loadGrp={loadGroup}
                close={handleEditorClose}
                contacts={users}
                selected={select}
                groups={group}
                file={{name: File.view.name, count: File.view.count}}
            />
            <Viewer
                contacts={users}
                selected={select}
                selector={selectMessage}
                filter={apply}
            />
        </div>
    )
};