import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function Footer() {
  const {locale, resources} = useContext(LocaleContext);

  return (
    <footer className="p-4 text-white/80 [&_a]:text-indigo-400 [&_a]:font-medium text-xs relative z-10">
      {translate(locale, 'footer.sendFeedbackText', resources)}
      <a href="https://forms.gle/zS2UprPyfcD92j4j9" target="_blank" className="inline-block hover:text-indigo-300">{translate(locale, 'footer.sendFeedbackLinkText', resources)}</a>
    </footer>
  );
}
