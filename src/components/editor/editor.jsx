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
    const saveBackup = () => {
        // (!) To export edited chats as whole or into groups:
        if (groups.length > 0) {
            groups.forEach((group, idx) => {
                // (!) Collect all messages from each group.
                const messages = File.view.messages
                    .filter((e) => group.includes(e.id))
                    .map((msg) => {
                        // (!) Rename only those messages.
                        const user = users.find((e) => e.name === msg.name);
                        return {
                            ...msg,
                            name: user.rename ? user.rename : user.name,
                        };
                    });
                // Export each group individually.
                File.exportas({
                    count: messages.length,
                    name: `Group_${idx + 1}`,
                    messages,
                });
            });
        } else {
            if (File.view.hasOwnProperty("messages")) {
                // (!) Collect all messages within a date range.
                const messages = File.view.messages
                    .filter((e) => {
                        if (
                            new Date(e.date) >= new Date(dateFilter.start) &&
                            new Date(e.date) <= new Date(dateFilter.end)
                        )
                            return e;
                    })
                    .map((msg) => {
                        // (!) Rename only those messages.
                        const user = users.find((e) => e.name === msg.name);
                        return {
                            ...msg,
                            name: user.rename ? user.rename : user.name,
                        };
                    });
                // Export filtered messages.
                File.exportas({
                    count: messages.length,
                    name: "Zaptales_Backup",
                    messages,
                });
            }
        }
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
                file={{ name: File.view.name, count: File.view.count }}
                selected={selectedMessage}
                filter={dateFilter}
                users={users}
                groups={groups}
                join={joinUsers}
                update={setUsers}
                export={exportUsers}
                createGrp={createGroup}
                deleteGrp={deleteGroup}
                loadGrp={loadGroup}
                apply={applyFilter}
                save={saveBackup}
                close={handleEditorClose}
            />
            <Viewer
                selected={selectedMessage}
                filter={dateFilter}
                users={users}
                selector={selectMessage}
                applyFilter={applyFilter}
            />
        </div>
    );
}
