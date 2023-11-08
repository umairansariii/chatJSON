import { useState, useEffect, useContext } from 'react';

// Style
import './scss/media.scss';

// Context
import CollectionsContext from '../../contexts/collections/context';

// Components
import Options from './options';
import Viewer from './viewer';

export default function Media() {
    // State


    // Context
    const Collection = useContext(CollectionsContext);

    // Effect

    // Methods
    const addCollection = (file) => {
        Collection.add(file);
    };
    const removeCollection = (id) => {
        Collection.removeCol(id);
    };
    const removeGroup = (id, gid) => {
        Collection.removeGrp(id, gid);
    };
    return (
        <div className="dashboard-media">
            <Options
                add={addCollection}
                removeCol={removeCollection}
                removeGrp={removeGroup}
                collection={Collection.collections}
            />
            <Viewer/>
        </div>
    )
};