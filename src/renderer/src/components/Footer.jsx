import { useContext } from 'react';
import LocaleContext from '../contexts/LocaleContext';
import { translate } from '../../../main/utils';

export default function Footer() {
  const {locale, resources} = useContext(LocaleContext);
  let feedbackLink = 'https://forms.gle/MWtbZcQ3AWDxHTwH9';
  if (locale === 'en') feedbackLink = 'https://forms.gle/zS2UprPyfcD92j4j9';

  return (
    <footer className="p-4 text-white/80 [&_a]:text-green-300/90 [&_a]:font-medium text-xs relative z-10">
      {translate(locale, 'footer.sendFeedbackText', resources)}
      <a href={feedbackLink} target="_blank" className="inline-block hover:text-green-300">{translate(locale, 'footer.sendFeedbackLinkText', resources)}</a>
    </footer>
  );
}
