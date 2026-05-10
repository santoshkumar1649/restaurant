import { createContext, useContext, useState, type ReactNode } from 'react';

interface TableContextType {
  tableId: string | null;
  tableNumber: number | null;
  tableName: string | null;
  familyName: string | null;
  connectTable: (tableId: string, number: number, name: string, familyName: string) => void;
  disconnectTable: () => void;
  isConnected: boolean;
}

const TableContext = createContext<TableContextType | null>(null);

export function TableProvider({ children }: { children: ReactNode }) {
  const [tableId, setTableId] = useState<string | null>(null);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [tableName, setTableName] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState<string | null>(null);

  const connectTable = (id: string, num: number, name: string, family: string) => {
    setTableId(id);
    setTableNumber(num);
    setTableName(name);
    setFamilyName(family);
  };

  const disconnectTable = () => {
    setTableId(null);
    setTableNumber(null);
    setTableName(null);
    setFamilyName(null);
  };

  return (
    <TableContext.Provider value={{
      tableId, tableNumber, tableName, familyName,
      connectTable, disconnectTable,
      isConnected: !!tableId
    }}>
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('useTable must be used within TableProvider');
  return ctx;
}
