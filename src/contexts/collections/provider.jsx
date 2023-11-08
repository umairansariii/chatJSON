import { useState } from 'react';
import loader from '../../utils/loader';

// Context
import CollectionsContext from './context';

export default function CollectionsProvider({ children }) {
    // State
    const [collections, setCollections] = useState([]);

    // Methods
    const add = (file) => {
        loader(file, update);
    };
    const update = (data, filename) => {
        setCollections(oldfiles => {
            if (!collections.find(e => e.name == filename)) {
                return [...oldfiles, {...data, name: filename}];
            } else {
                return [...oldfiles];
            };
        });
    };
    const removeCol = (idx) => {
        setCollections(prev => {
            const x = prev.splice(idx, 1);
            return [...prev];
        });
    };
    const removeGrp = (idx, gid) => {
        setCollections(prev => {
            const x = prev[idx].groups.splice(gid, 1);
            return [...prev];
        });
    };
    return (
        <CollectionsContext.Provider value={{
                add,
                removeCol,
                removeGrp,
                collections,
            }}>
            { children }
        </CollectionsContext.Provider>
    )
};