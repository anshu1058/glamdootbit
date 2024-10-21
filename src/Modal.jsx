// pop up menu of the olBank calling from the olbot compinent
import React, { useState } from 'react';
import './Modal.css'; // Import CSS for modal styling
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { AccountBalanceOutlined, AccountCircleOutlined, SavingsOutlined, Score } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdOutlineGroups3 } from "react-icons/md";
import ABalance from './icons/balance-sheet.png'
import Bank from './icons/bank.png'
import saving from './icons/piggy-bank.png'
import statement from './icons/bank-statement.png'
import id from './icons/id-card.png'
import card from './icons/credit-card.png'
import loan from './icons/personal.png'
import profit from './icons/profit.png'
const Modal = ({ isOpen, onClose, onOptionSelect,width }) => {
  const [expandedOptionText, setExpandedOptionText] = useState(null);

  if (!isOpen) return null;

  const sections = [
    {
      title: 'Account',
      options: [
        { 
          text: 'Account Balance', 
          icon: <img src={ABalance} alt="Balance Icon" className='icon' style={{ width: '1.7rem', height: '1.7rem' }} />,
          // subOptions: [
          //   { text: 'Account Balance' },
          //   { text: 'Mini Statement' },
          //   { text: 'Know Your Customer ID' },
          // ],
        },
        { text: 'Open Current Account', icon: <img src={Bank} alt="Balance Icon" className='icon' /> },
        { text: 'Open Saving Account', icon: <img src={saving} alt="Balance Icon" className='icon' /> },
        // { text: 'Account Balance' , icon: <AccountBalanceOutlined className='icon' />},
        { text: 'Mini Statement',  icon: <img src={statement} alt="Balance Icon" className='icon' />},
        { text: 'Know Your Customer ID' , icon: <img src={id} alt="Balance Icon" className='icon' /> },
      ],
    },
    {
      title: 'Cards',
      options: [
        { text: 'Debit Card', icon: <img src={card} alt="Balance Icon" className='icon' /> ,
            subOptions: [
                { text: 'Switch off Card' },
                { text: 'Block and Replace Card' },
               /* { text: 'Block Card' },*/
                { text: 'Debit Card Pin Change' },
                { text: 'Debit Card Limit Change' },
                { text: 'Replace Card' },
              ],
        },
        { text: 'Credit Cards', icon: <img src={card} alt="Balance Icon" className='icon' /> ,
        subOptions: [
          { text: 'Credit Card Pin Change' },
          { text: 'Total Credit Card Limit' },
          { text: 'Block Card' },
          { text: 'Available Credit Card Limit' },
            
          ],
        }
      ],
    },
    {
      title: 'Loan',
      options: [
        { text: 'Retail Loan Services', icon: <img src={loan} alt="Balance Icon" className='icon' />,
            // subOptions: [
            //     { text: 'Block Card' },
            //     { text: 'Credit Card Pin Change' },
            //     { text: 'Available Credit Card Limit' },
            //     { text: 'Total Credit Card Limit' },
                
            //   ],
         },
      ],
    },
    {
      title: 'Investment',
      options: [
        { text: 'Investments', icon: <img src={profit} alt="Balance Icon" className='icon' />,
            subOptions: [
                { text: 'Mutual Funds' },
                { text: 'PPF'},
                { text: 'Digital Gold' },
                { text: 'Sovereign Gold Bond' },
                { text: 'National Pension Scheme' },
                
              ],
         },
      ],
    }
  ];

  const handleOptionClick = (option) => {
    if (option.subOptions) {
      setExpandedOptionText(expandedOptionText === option.text ? null : option.text);
    } else {
      // Open the desired URL in a new tab based on the option selected
      if (option.text === 'Open Current Account' || option.text === 'Open Saving Account') {
        window.open('https://onelogica.com', '_blank');
      } else {
        onOptionSelect(option.text);
      }
      onClose();
    }
  };
  
 
 return (
  <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
    <div className={`modal-content ${isOpen ? 'active' : ''}`} style={{ width: `${width}px` }} onClick={e => e.stopPropagation()}>
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="modal-section">
          <h3>{section.title}</h3>
          <div className="modal-options-row">
            {section.options.map((option, optionIndex) => (
              <div key={optionIndex}>
                <div 
  className={`modal-option-item ${expandedOptionText === option.text && option.subOptions ? 'expanded' : ''}`}
  onClick={() => handleOptionClick(option)}
>
  <div className={`modal-option ${expandedOptionText === option.text && option.subOptions ? 'expandedoption' : ''}`}>
  <div className={`icon-row ${expandedOptionText === option.text ? `expanded ${option.text.replace(/\s+/g, '-').toLowerCase()}` : ''}`}>
  {option.icon}
</div>

    <div className={`text-row ${expandedOptionText === option.text ? 'expanded-text' : ''}`}>
      <Typography 
        component='p' 
        variant="body2" 
        style={{
          fontSize: expandedOptionText === option.text ? '18px' : '15px', 
          fontWeight: expandedOptionText === option.text && option.subOptions ? "bold" : ""
        }}
      >
        {option.text}
      </Typography>
    </div>
  </div>
  {expandedOptionText === option.text && option.subOptions && (
    <div className={`modal-options-row ${expandedOptionText === option.text ? 'expandedrow' : ''}`}>
      {option.subOptions.map((subOption, subOptionIndex) => (
        <div 
          key={subOptionIndex} 
          className="modal-suboption-item"
          onClick={() => { onOptionSelect(subOption.text); onClose(); }}
        >
          <div className="text-row">
            <Typography component='p' variant="body2" style={{ fontSize: '14px', color: "white" }}>
              {subOption.text}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);


};

export default Modal;
