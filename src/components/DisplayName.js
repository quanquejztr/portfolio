import { createContext, useContext, useEffect, useState } from 'react';

const defaultName = { firstName: 'Stephen', fullName: 'Stephen Luong', toggleName: () => {} };
const DisplayNameContext = createContext(defaultName);

export function DisplayNameProvider({ children }) {
  const [firstName, setFirstName] = useState('Stephen');
  const fullName = `${firstName} Luong`;
  useEffect(() => { document.title = fullName; }, [fullName]);
  return <DisplayNameContext.Provider value={{ firstName, fullName, toggleName: () => setFirstName(name => name === 'Stephen' ? 'Cuong' : 'Stephen') }}>
    {children}
  </DisplayNameContext.Provider>;
}

export const useDisplayName = () => useContext(DisplayNameContext);
