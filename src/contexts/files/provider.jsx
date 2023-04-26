import { useState } from 'react';
import { fileSave } from '../../utils/file';
import loader from '../../utils/loader';

// Context
import FilesContext from './context';

export default function FilesProvider({ children }) {
    // State
    const [select, setSelect] = useState([]);
    const [files, setFiles] = useState([]);
    const [view, setView] = useState([]);

    // Methods [Explorer]
    const add = (files) => {
        // (!) To add (multiple) new files in the explorer:
        setFiles(oldfiles => {
            // /!\ Spreading files required.
            const browsefiles = [...files];
            // (!) Discard all new files those name are matched with older ones.
            const newfiles = browsefiles.filter(cf => !oldfiles.find(of => of.name == cf.name));
            return [...oldfiles, ...newfiles];
        });
    };
    const update = (data, id) => {
        // (!) To update a specific file with new data:
        setFiles(oldfiles => {
            oldfiles[id] = data;
            // /!\ Refreshes the state.
            return [...oldfiles];
        });
    };
    const convert = (id) => {
        // (!) To convert backup files into JSON:
        // /!\ It uses update method as callback function.
        loader(files[id], update, id);
    };
    const remove = (name) => {
        // (!) To remove a file from the explorer:
        setFiles(oldfiles => {
            const filtered = oldfiles.filter(cf => cf.name !== name);
            // /!\ Refreshes the state.
            return [...filtered];
        });
    };
    const save = (id) => {
        // (!) To save a converted file on local machine:
        fileSave(files[id]);
    };
    const selector = (name, flag) => {
        switch (flag) {
            case 'del':
                setSelect(prev => prev.filter(e => e !== name));
                break;
            default:
                setSelect(prev => [...prev, name]);
                break;
        };
    };
    const merge = () => {
        // (!) To merge two or more selected backup files:
        if (select.length == 0) {
            return console.error('Error: Cannot apply merge operation.');
        };
        if (select.length == 1) {
            return console.error('Error: Cannot merge a single file.');
        };
        const selected = files.filter(e => select.includes(e.name));
        const messages = [];

        // (!) Merge all messages.
        for(let i = 0; i < selected.length; i++) {
            messages.push(...selected[i].messages);
        };
        // (!) Sort all messages by date.
        messages.sort((a,b) => new Date(b.date) - new Date(a.date));
        // (!) Rewrite all messages id sequentially.
        for(let i = 0; i < messages.length; i++) {
            messages[i].id = i;
        };
        // (!) Creates a new buffer.
        const buffer = {
            name: `Merged_Backup_${Math.floor(Math.random() * 1000) + 1}.json`,
            count: messages.length,
            messages: messages,
        };
        // (!) Remove old files and add newly merged file.
        setFiles(prev => {
            const filtered = files.filter(e => !select.includes(e.name));
            // /!\ Refreshes the state.
            return [...filtered, buffer];
        });
        setSelect([]);
    };
    // Methods [Viewer]
    const preview = (id) => {
        // (!) To load a converted file in the viewer:
        setView(files[id]);
    };
    const join = (users) => {
        // (!) To join two or more selected contacts:
        setView(prev => {
            // /!\ This operation takes (n) time as number of messages. 
            for(let i = 0; i < prev.messages.length; i++) {
                // (!) If user found in selection, named will be replaced.
                if (users.includes(prev.messages[i].name)) {
                    prev.messages[i].name = 'Unknown';
                };
            };
            // /!\ Refreshes the state.
            return {...prev};
        });
    };
    const saveas = (users) => {
        // (!) To export all or specific contacts as JSON:
        const contacts = users.length > 1? [...users]: [users];
        const modified = [];
        // /!\ This operation takes (n) time as number of messages. 
        for(let i = 0; i < view.messages.length; i++) {
            // (!) If user found in selection, named will be replaced.
            const user = contacts.find(e => e.name == view.messages[i].name);
            if (user) {
                modified.push({
                    name: user.rename? user.rename: user.name,
                    body: view.messages[i].body,
                    date: view.messages[i].date,
                });
            };
        };
        // /!\ Saves file on local machine.
        fileSave(modified);
    };
    const exportas = (data) => {
        // (!) To export user edited data:
        fileSave(data);
    };
    const close = () => {
        // To close a file from the viewer:
        setView([]);
    };
    return (
        <FilesContext.Provider value={{ add, convert, remove, save, selector, merge, preview, join, saveas, exportas, close, files, view }}>
            { children }
        </FilesContext.Provider>
    )
};