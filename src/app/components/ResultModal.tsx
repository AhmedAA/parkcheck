"use client";

import React from 'react';
import Image from 'next/image';
import styles from './ResultModal.module.css';

import ParkcheckLogo from '../../../public/icons/Parkcheck_Logo.svg';
import IconLocationPin from '../../../public/icons/Icon_LocationPin.svg';
import IconParktype from '../../../public/icons/Icon_Parktype.svg';
import IconAmount from '../../../public/icons/Icon_Amount.svg';

interface ParkingData {
  vejnavn?: string;
  p_pladstype?: string;
  p_antal?: number;
  betalingszone?: string;
  vejside?: string;
  p_type?: string;
}

interface ResultModalProps {
  status: 'allowed' | 'disallowed';
  data?: ParkingData | null;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ status, data, onClose }) => {
  if (!status) return null;

  const isAllowed = status === 'allowed';

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <Image src={ParkcheckLogo} alt="Parkcheck Logo" width={28} height={28} />
          <span>Parkcheck</span>
        </header>

        <div className={styles.content}>
          {isAllowed ? (
            <>
              <h2 className={styles.title}>Du må parkere her</h2>
              <p className={styles.subtitle}>
                Du er i {data?.betalingszone || 'ukendt zone'}, så check om du skal købe billet
              </p>
              <hr className={`${styles.separator} ${styles.allowed}`} />
             <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <Image src={IconLocationPin} alt="Location" width={64} height={64} />
                  <p className={styles.detailLabel}>{data?.vejnavn}<br/>{data?.vejside}</p>
                </div>
                <div className={styles.detailItem}>
                  <Image src={IconParktype} alt="Parking Type" width={64} height={64} />
                  <p>{data?.p_pladstype} - {data?.p_type}</p>
                </div>
                <div className={styles.detailItem}>
                  <Image src={IconAmount} alt="Amount" width={64} height={64} />
                  <p>{data?.p_antal} pladser</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.title}>Du må ikke parkere her</h2>
              <p className={styles.subtitle}>Vi kan ikke finde parkering hvor du står. Prøv et andet sted</p>
              <hr className={`${styles.separator} ${styles.disallowed}`} />
            </>
          )}
        </div>
        
        <footer className={styles.footer}>
          <button onClick={onClose} className={styles.checkButton}>
            CHECK IGEN
          </button>
          <p className={styles.disclaimer}>
            Parkcheck kan ikke holdes ansvarlig for din parkering
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ResultModal;