import { useState, useEffect, useContext } from "react";

// Style
import "./scss/editor.scss";

// Context
import FilesContext from "../../contexts/files/context";

// Components
import Options from "./options";
import Viewer from "./viewer";

export default function Editor() {
    // State
    const [users, setUsers] = useState([]);
    const [selectedMessage, updateSelectedMessage] = useState([]);
    const [groups, updateGroups] = useState([]);
    const [dateFilter, setDateFilter] = useState({ start: null, end: null });
    // Context
    const File = useContext(FilesContext);

    // Effect
    useEffect(() => {
        function autoApplyFilter() {
            // (!) To reduce the load of heavy backups.
            if (File.view.hasOwnProperty("messages")) {
                const start = File.view.messages[0].date;
                const end = new Date(File.view.messages[0].date);
                // (!) Only load one day chat in the viewer.
                end.setDate(end.getDate() + 1);
                setDateFilter({ start, end });
            }
        }
        function autoUpdateContacts() {
            // (!) To get all contact names from the backup.
            if (File.view.hasOwnProperty("messages")) {
                setUsers(getUsers(File.view.messages));
            }
        }
        autoApplyFilter();
        autoUpdateContacts();
    }, [File.view.name]);
    // Methods
    const getUsers = (messages) => {
        // (!) To scan all messages and only get unique contacts:
        const contacts = [];
        // /!\ This loop iterates (n) times as number of messages.
        for (let i = 0; i < messages.length; i++) {
            // (!) Collect each unique user.
            if (!contacts.find((user) => user.name == messages[i].name)) {
                contacts.push({
                    name: messages[i].name,
                    rename: undefined,
                    dir: "left",
                    selected: false,
                    hidden: false,
                });
            }
        }
        return contacts;
    };
    const joinUsers = () => {
        // (!) To join two or more selected contacts:
        const selected = users.filter((e) => e.selected == true);
        if (selected.length > 1) {
            File.join(selected.map((e) => e.name));
        } else {
            alert("Cannot join a single contact.");
        }
    };
    const exportUsers = (user) => {
        // (!) To export single or multiple contacts as JSON:
        const selected = users.filter((e) => e.selected == true);
        if (selected.length > 1 && selected.some((e) => e.name === user.name)) {
            if (
                confirm(
                    "Selected user(s) will be saved as JSON:\n" +
                        selected.map((e) => e.name).join("\n")
                )
            ) {
                File.saveas(selected);
            }
        } else {
            if (
                confirm("Selected user(s) will be saved as JSON:\n" + user.name)
            ) {
                File.saveas(user);
            }
        }
    };
    const selectMessage = (id, flag) => {
        // (!) To select or unselect messages:
        switch (flag) {
            case "select":
                updateSelectedMessage([...selectedMessage, id]);
                break;
            case "unselect":
                updateSelectedMessage(selectedMessage.filter((e) => e !== id));
                break;
        }
    };
    const createGroup = () => {
        // (!) To create a new group:
        if (selectedMessage.length > 0) {
            updateGroups([...groups, selectedMessage]);
            updateSelectedMessage([]);
        }
    };
    const deleteGroup = (idx) => {
        // (!) To delete a specific group:
        groups.splice(idx, 1);
        updateGroups([...groups]);
    };
    const loadGroup = (idx) => {
        // (!) To load a specific group:
        updateSelectedMessage(groups[idx]);
    };
    const applyFilter = (filter) => {
        // (!) To apply filters on the viewer:
        // /!\ This operation takes (n) time as number of messages.
        setDateFilter(() => {
            if (filter.start <= filter.end) {
                return { ...filter };
            } else {
                alert("Cannot apply the invalid date.");
                return dateFilter;
            }
        });
    };
    const exportChat = () => {
        // (!) To export user edited data as JSON:
        if (File.view.hasOwnProperty("messages") && groups.length > 0) {
            // (#) Collect all messages.
            const selected = groups.flat(1);
            // /!\ This operation takes (n) time as number of messages.
            const filtered = File.view.messages.filter((e) =>
                selected.includes(e.id)
            );
            const compiled = [];
            // /!\ Rename and collects visible messages only.
            filtered.forEach((item) => {
                const user = users.find((e) => e.name == item.name);
                if (!user.hidden) {
                    compiled.push({
                        ...item,
                        name: user.rename ? user.rename : user.name,
                    });
                }
            });
            // (#) Collect all contacts.
            const contacts = [];
            // /!\ Drop unnecessary data and collects visible users only.
            users.forEach((item) => {
                if (!item.hidden) {
                    contacts.push({
                        name: item.rename ? item.rename : item.name,
                        dir: item.dir,
                    });
                }
            });
            // (#) Collect all groups.
            for (let i = 0; i < groups.length; i++) {
                for (let j = 0; j < groups[i].length; j++) {
                    const name = filtered.find(
                        (e) => e.id == groups[i][j]
                    ).name;
                    // /!\ Keep visible messages only.
                    if (users.find((e) => e.name == name).hidden) {
                        groups[i].splice(j, 1);
                    }
                }
            }
            // /!\ Saves file on local machine.
            File.exportas({
                name: File.view.name,
                messages: compiled,
                count: compiled.length,
                groups: groups,
                users: contacts,
            });
        }
    };
    const saveBackup = () => {
        // (!) To save edited backup on local machine:
        // /!\ Forces state to update.
        createGroup();
    };
    const handleEditorClose = () => {
        // (!) To close the editor and offload the file:
        File.close();
        setUsers([]);
        updateGroups([]);
        updateSelectedMessage([]);
    };
    return (
        <div className="dashboard-editor">
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
                users={users}
                selected={selectedMessage}
                groups={groups}
                filter={dateFilter}
                file={{ name: File.view.name, count: File.view.count }}
            />
            <Viewer
                users={users}
                selected={selectedMessage}
                selector={selectMessage}
                filter={dateFilter}
                applyFilter={applyFilter}
            />
        </div>
    );
}
