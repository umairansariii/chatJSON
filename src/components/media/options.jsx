import { useState, useEffect, useContext } from 'react';


// Style
import './scss/options.scss';
// Icons
import IconClose from '../../assets/svgs/icons/close';
import IconPlus from '../../assets/svgs/icons/plus';

// Components
function Group(props) {
    // Methods
    const handleRemove = () => {
        props.remove(props.id);
    };
    return (
        <div className='dashboard-media-options-collections-card-groups'>
            <span>Group{props.id+1} ({props.count})</span>
            <span onClick={handleRemove}><IconClose/></span>
        </div>
    )
};

function Collection(props) {
    // State
    const [state, setState] = useState(true);

    // Methods
    const handleRemoveCollection = () => {
        props.removeCol(props.id);
    };
    const handleRemoveGroup = (gid) => {
        props.removeGrp(props.id, gid);
    };
    const handleToggle = () => {
        setState(prev => !prev);
    };
    return (
        <>
        <div className='dashboard-media-options-collections-card'>
            <span onClick={handleToggle}>Collection{props.id+1} ({props.groups.length})</span>
            <span onClick={handleRemoveCollection}><IconClose/></span>
        </div>
        {
            state &&
            <div className="dashboard-media-options-collections-card-expend">
            {
                props.groups.map((item, idx) =>
                    <Group
                        count={item.length}
                        remove={handleRemoveGroup}
                        id={idx}
                        key={idx}
                    />
                )
            }
            </div>
        }
        </>
    )
};

export default function Options(props) {

    // State

    // Effect

    // Methods
    const addCollection = (e) => {
        props.add(e.target.files[0]);
    };
    const removeCollection = (id) => {
        props.removeCol(id);
    };
    const removeGroup = (id, gid) => {
        props.removeGrp(id, gid);
    };
    return (
        <div className="dashboard-media-options">
            <div className='dashboard-media-options-header'>
                <div><IconClose/></div>
                <h2>No_Backup</h2>
                <p>0 messages</p>
            </div>
            <div className='dashboard-media-options-collections'>
                <input onChange={addCollection} id='file-browser' type='file' accept='.json'/>
                <h4>Collections <label htmlFor='file-browser'><IconPlus/></label></h4>
                <div className='dashboard-media-options-collections-container'>
                    {
                        props.collection.map((item, idx) => 
                            <Collection
                                groups={item.groups}
                                removeCol={removeCollection}
                                removeGrp={removeGroup}
                                id={idx}
                                key={idx}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
};