import { useState, useCallback } from 'react';

export default function useSiderIni() {
  function handleChangeSiderIni(siderIni) {
    const newSiderIni = { ...siderIni, value: siderIni.value === 1 ? 0 : 1 };

    window.sm.saveSiderIni(newSiderIni);

    return newSiderIni;
  }

  const [ini, setIni] = useState(null);
  const handleIni = useCallback(() => setIni(handleChangeSiderIni), []);

  return [ini, setIni, handleIni];
}
