import { useState, useEffect, useRef } from "react";
import formatInputDate from "../../utils/formatInputDate";

// Style
import "./scss/options.scss";
// Icons
import IconClose from "../../assets/svgs/icons/close";
import IconMenu from "../../assets/svgs/icons/menu";
import IconPlus from "../../assets/svgs/icons/plus";
import IconRename from "../../assets/svgs/icons/rename";
import IconTransfer from "../../assets/svgs/icons/transfer";
import IconSave from "../../assets/svgs/icons/save";
import IconShow from "../../assets/svgs/icons/show";
import IconHide from "../../assets/svgs/icons/hide";

// Components
// EDITOR > OPTIONS > USERS ---------------------------------------------:
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
        }
    }, [rename]);
    // Methods
    const handleSwap = () => {
        // (!) To swap the direction of a specific user:
        props.update((prev) => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex((e) => e.name == props.data.name);
            if (prev[index].dir == "left") {
                prev[index].dir = "right";
            } else {
                prev[index].dir = "left";
            }
            return [...prev];
        });
    };
    const handleHide = () => {
        // (!) To hide or show a specific user from the viewer:
        props.update((prev) => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex((e) => e.name == props.data.name);
            if (!prev[index].hidden) {
                prev[index].hidden = true;
            } else {
                prev[index].hidden = false;
            }
            return [...prev];
        });
    };
    const handleRename = (name) => {
        // (!) To rename a specific user:
        props.update((prev) => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex((e) => e.name == props.data.name);
            prev[index].rename = name;
            return [...prev];
        });
    };
    const handleSelection = (e) => {
        // (!) To make multiple selection of users:
        props.update((prev) => {
            // /!\ This operation takes (n) time as number of messages.
            const index = prev.findIndex((e) => e.name == props.data.name);
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
        setOpen((prev) => {
            if (open && rename) {
                // If user renaming and accidentally closes context, made changes unsaved.
                setRename(false);
            }
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
        }
    };
    const handleKeyEvent = (e) => {
        if (e.key == "Enter") {
            handleToggleRename();
        }
    };
    return (
        <div className="editor-options-contacts-user-card">
            <input type="checkbox" onChange={handleSelection} />
            {rename ? (
                <input
                    type="text"
                    onKeyDown={handleKeyEvent}
                    placeholder={
                        props.data.rename ? props.data.rename : props.data.name
                    }
                    ref={inputName}
                />
            ) : (
                <span>
                    {props.data.rename ? props.data.rename : props.data.name}
                </span>
            )}
            <div className="user-card-context-menu">
                <div onClick={handleToggle}>
                    <IconMenu />
                </div>
                {open && (
                    <div className="user-card-context-buttons">
                        <button onClick={handleJoin}>
                            <IconPlus />
                            Join
                        </button>
                        <button onClick={handleSwap}>
                            <IconTransfer />
                            Swap
                        </button>
                        <button onClick={handleToggleRename}>
                            <IconRename />
                            {rename ? "Change" : "Rename"}
                        </button>
                        <button onClick={handleExport}>
                            <IconSave />
                            Save
                        </button>
                        <button onClick={handleHide}>
                            {props.data.hidden ? <IconShow /> : <IconHide />}
                            {props.data.hidden ? "Show" : "Hide"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// EDITOR > OPTIONS > GROUPS --------------------------------------------:
function Group(props) {
    return (
        <div className="editor-options-contacts-group-card">
            <span onClick={() => props.load(props.id)}>
                Group{props.id + 1} ({props.count})
            </span>
            <span onClick={() => props.del(props.id)}>
                <IconClose />
            </span>
        </div>
    );
}

// EDITOR > OPTIONS -----------------------------------------------------:
export default function Options(props) {
    // Reference
    const inputDateStart = useRef();
    const inputDateEnd = useRef();

    // Effect
    useEffect(() => {
        function autoApplyFilter() {
            // (!) When a new file is loaded, this will automatically set the filter.
            inputDateStart.current.value = formatInputDate(props.filter.start);
            inputDateEnd.current.value = formatInputDate(props.filter.end);
        }
        autoApplyFilter();
    }, [props.filter]);
    // Methods
    const handleApplyFilter = () => {
        // (!) To apply filtration:
        props.apply({
            start: inputDateStart.current.value,
            end: inputDateEnd.current.value,
        });
    };
    return (
        <div className="dashboard-editor-options no-print">
            <div className="editor-options-header">
                <div
                    className="editor-options-header-btn"
                    onClick={props.close}
                >
                    <IconClose />
                </div>
                <h2>{props.file.name ? props.file.name : "No_Backup"}</h2>
                <p>{props.file.count ? props.file.count : "0"} messages</p>
            </div>
            <div className="editor-options-contacts">
                <h4>Contacts</h4>
                <div className="editor-options-contacts-user-wpr">
                    {props.users.map((item, idx) => (
                        <User
                            key={idx}
                            data={item}
                            join={props.join}
                            update={props.update}
                            export={props.export}
                        />
                    ))}
                </div>
                <br />
                <br />
                <h4>
                    Selected ({props.selected.length})
                    <span onClick={props.createGrp}>
                        <IconPlus />
                    </span>
                </h4>
                <div className="editor-options-contacts-group-wpr">
                    {props.groups.map((item, idx) => (
                        <Group
                            key={idx}
                            id={idx}
                            count={item.length}
                            load={props.loadGrp}
                            del={props.deleteGrp}
                        />
                    ))}
                </div>
                <br />
                <br />
                <h4>Filter</h4>
                <h6>START</h6>
                <input
                    type="datetime-local"
                    name="start"
                    ref={inputDateStart}
                />
                <h6>END</h6>
                <input type="datetime-local" name="end" ref={inputDateEnd} />
                <h6>OPTIONS</h6>
                <div
                    className="editor-options-contacts-btn"
                    onClick={handleApplyFilter}
                >
                    Apply
                </div>
                <div
                    className="editor-options-contacts-btn"
                    onClick={props.save}
                >
                    Save
                </div>
            </div>
        </div>
    );
}
