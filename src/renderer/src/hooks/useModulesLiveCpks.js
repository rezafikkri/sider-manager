import { useState, useCallback } from 'react';

export default function useModulesLiveCpks() {
  const [dataset, setDataset] = useState([]);
  const handleDataset = useCallback((data) => {
    window.sm.saveSiderIni(data);
    setDataset((prevDataset) => {
      return prevDataset.map((prevData) => {
        if (prevData.value === data.value) return { ...prevData, checked: !prevData.checked };
        return prevData;
      });
    });
  }, []);

  return [dataset, setDataset, handleDataset];
}
