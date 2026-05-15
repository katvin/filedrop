import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { applicationStore } from '../stores/index.js';
import styles from './Footer.module.scss';
import { Link } from './Link.js';

export const Footer: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <footer className={clsx(styles.footer)}>
      <ul>
        <li>
          <Link to="/privacy">{t('sections.privacy')}</Link>
        </li>
        <li>
          <Link to="/tos">{t('sections.terms')}</Link>
        </li>
        {applicationStore.abuseEmail && (
          <li>
            <Link to="/abuse">{t('sections.abuse')}</Link>
          </li>
        )}
        <li>
          <Link to="/tech">{t('sections.tech')}</Link>
        </li>
      </ul>
    </footer>
  );
});
