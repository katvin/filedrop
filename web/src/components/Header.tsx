import { observer } from 'mobx-react-lite';
import type React from 'react';
import { useTranslation } from 'react-i18not';
import { IoInformationCircle } from 'react-icons/io5';
import { applicationStore } from '../stores/index.js';
import { DropIcon } from './DropIcon.js';
import styles from './Header.module.scss';
import { Link } from './Link.js';
import { SecureStatus } from './SecureStatus.js';

export const Header: React.FC = observer(() => {
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <h1>
          <Link to="/" className={styles.logo}>
            <DropIcon />
            <span>{applicationStore.appName}</span>
          </Link>
          <SecureStatus />
        </h1>
        <div className={styles.right}>
          <Link to="/about" title={t('sections.about')}>
            <IoInformationCircle />
          </Link>
        </div>
      </nav>
    </header>
  );
});
