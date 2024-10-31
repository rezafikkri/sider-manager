import { useEffect, useState } from 'react';
import Header from './Header';
import ActivationForm from './ActivationForm';
import PESDirectoryForm from './PESDirectoryForm';

export default function Initializations() {
  // step of initialization [activation, choose pes folder]
  const [step, setStep] = useState(null);

  useEffect(() => {
    async function generateStep() {
      const isActivated = await window.initializations.isActivated();
      if (isActivated) {
        setStep('choose-pes-folder');
      } else {
        setStep('activation')
      }
    }
    generateStep();
  }, [step]);

  if (step === null) return null;
  
  return (
    <>
      <Header type="initialization" />
      <main className="p-8 mt-3">
        {step === 'activation' ? <ActivationForm onActivate={setStep} /> : <PESDirectoryForm /> } 
      </main>
    </>
  );
}
