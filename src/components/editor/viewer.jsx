import { useState, useEffect, useContext, useRef } from "react";

// Style
import "./scss/viewer.scss";
// Icons
import IconSend from "../../assets/svgs/icons/send";
import IconRemove from "../../assets/svgs/icons/remove";
import IconUp from "../../assets/svgs/icons/up";
import IconDown from "../../assets/svgs/icons/down";

// Context
import FilesContext from "../../contexts/files/context";
// Constants
const OPTIONS = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
};

// Components
// EDITOR > VIEWER > MESSAGE --------------------------------------------:
function Message(props) {
    // State
    const [select, setSelect] = useState(false);
    const [hover, setHover] = useState(false);

    // Effect
    useEffect(() => {
        if (props.selected.includes(props.id)) {
            setSelect(true);
        } else {
            setSelect(false);
        }
    }, [props.selected]);
    // Methods
    const handleToggleSelection = (e) => {
        // (!) To select [n]th message and added to list:
        if (e.ctrlKey === true) {
            if (select) {
                setSelect(false);
                props.selector(props.id, "unselect");
            } else {
                setSelect(true);
                props.selector(props.id, "select");
            }
        }
    };
    const handleNewInsertion = (dir) => {
        const date = new Date(props.msg.date);
        let index = props.index;

        switch (dir) {
            case "above":
                date.setSeconds(date.getSeconds() - 1);
                break;
            case "below":
                date.setSeconds(date.getSeconds() + 1);
                index++;
                break;
        }
        props.trigger(index, date);
    };
    return (
        <>
            {props.user && (
                <div
                    className={`editor-viewer-message
                    ${props.user.dir}
                    ${props.user.hidden ? "hidden" : null}
                    ${select ? "selected" : null}`}
                    onClick={handleToggleSelection}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <div className="editor-viewer-message-head">
                        {props.user.rename
                            ? props.user.rename
                            : props.user.name}
                    </div>
                    <div className="editor-viewer-message-body">
                        {props.msg.body}
                    </div>
                    <div className="editor-viewer-message-foot">
                        {props.msg.date.toLocaleString("en-US", OPTIONS)}
                    </div>
                    {hover && (
                        <div className="editor-viewer-message-appends">
                            <div onClick={() => handleNewInsertion("above")}>
                                <IconUp />
                            </div>
                            <div onClick={() => handleNewInsertion("below")}>
                                <IconDown />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

// EDITOR > VIEWER ------------------------------------------------------:
export default function Viewer(props) {
    // State
    const [selector, toggleSelector] = useState(false);
    // insertMsgData: (index: nth position in File.view.messages)
    const [insertMsgData, setInsertMsgData] = useState({
        index: null,
        date: null,
        body: null,
    });
    // Reference
    const inputMessage = useRef();
    const inputSelector = useRef();
    // Context
    const File = useContext(FilesContext);

    // Effect
    useEffect(() => {
        function autoFocusUpdate() {
            if (selector) {
                inputSelector.current.focus();
            } else {
                inputMessage.current.disabled = true;
            }
        }
        autoFocusUpdate();
    }, [selector]);
    // Methods
    const validateFilter = (date) => {
        // (!) To validate and apply filter:
        // /!\ This operation takes (n) time as number of messages.
        let start = false,
            end = false;

        // (!) Check if start filter applied?
        if (props.filter.start) {
            // Then, set [n]th message property to true.
            if (date < new Date(props.filter.start)) start = true;
        }
        // (!) Check if end filter applied?
        if (props.filter.end) {
            // Then, set [n]th message property to true.
            if (date > new Date(props.filter.end)) end = true;
        }
        // (!) Check if either start or end is valid?
        return start || end ? true : false;
    };
    const handleTriggerCancelled = () => {
        setInsertMsgData({
            index: null,
            date: null,
            body: null,
        });
        toggleSelector(false);
    };
    const handleTriggerActive = (index, date) => {
        setInsertMsgData({
            ...insertMsgData,
            index: index,
            date: date,
        });
        inputMessage.current.disabled = false;
        inputMessage.current.focus();
    };
    const handleSendMessage = () => {
        if (insertMsgData.index) {
            setInsertMsgData({
                ...insertMsgData,
                body: inputMessage.current.value,
            });
            toggleSelector(true);
        }
    };
    const handleTriggerSuccess = () => {
        File.insert(
            {
                id: Math.random(),
                name: inputSelector.current.value,
                date: insertMsgData.date,
                body: insertMsgData.body,
            },
            insertMsgData.index
        );
        handleTriggerCancelled();
    };
    return (
        <div className="dashboard-editor-viewer">
            <div className="editor-viewer-options">
                <div className="editor-viewer-options-bar">
                    {!selector ? (
                        <input
                            type="text"
                            placeholder="Type your message"
                            onKeyDown={(e) =>
                                e.key === "Enter" ? handleSendMessage() : null
                            }
                            ref={inputMessage}
                            disabled
                        />
                    ) : (
                        <select
                            defaultValue="none"
                            ref={inputSelector}
                            onChange={handleTriggerSuccess}
                            onBlur={handleTriggerCancelled}
                        >
                            <option value="none" disabled>
                                Select contact
                            </option>
                            {props.users.map((e, idx) => (
                                <option value={e.name} key={idx}>
                                    {e.rename ? e.rename : e.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div className="editor-viewer-options-wpr">
                    <div
                        className="editor-viewer-options-btn"
                        onClick={handleSendMessage}
                    >
                        <IconSend />
                    </div>
                    <div className="editor-viewer-options-btn">
                        <IconRemove />
                    </div>
                </div>
            </div>
            <div className="editor-viewer-container">
                {File.view.messages &&
                    File.view.messages.map((item, idx) => {
                        if (!validateFilter(item.date)) {
                            const user = props.users.find(
                                (e) => e.name == item.name
                            );
                            return (
                                <Message
                                    key={idx}
                                    id={item.id}
                                    index={idx}
                                    msg={item}
                                    user={user}
                                    selected={props.selected}
                                    selector={props.selector}
                                    trigger={handleTriggerActive}
                                />
                            );
                        }
                    })}
            </div>
        </div>
    );
}
