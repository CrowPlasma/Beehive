import React from 'react';

export default function ClassicBackgroundBees() {
  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-30 z-0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <g id="minimal-bee" transform="scale(2.5) translate(-12, -12)">
          {/* Cuerpito */}
          <rect x="6" y="8" width="12" height="8" rx="4" fill="#F59E0B" />
          <path d="M10 8 L10 16 M14 8 L14 16" stroke="#4B5563" strokeWidth="2" />
          
          {/* Alitas */}
          <ellipse cx="9" cy="5" rx="4" ry="2" fill="#D1D5DB" opacity="0.8" transform="rotate(-20 9 5)" />
          <ellipse cx="15" cy="5" rx="4" ry="2" fill="#D1D5DB" opacity="0.8" transform="rotate(20 15 5)" />
          
          {/* Aguijoncito */}
          <path d="M6 12 L3 12" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </defs>

      {/* Abeja 1 */}
      <path d="M 100 800 Q 300 700 400 900 T 800 600 T 1300 800" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.5"/>
      <use href="#minimal-bee" x="1300" y="800" transform="rotate(-15 1300 800)" />

      {/* Abeja 2 */}
      <path d="M 600 200 Q 800 100 1000 300 T 1500 250 T 1800 400" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.3"/>
      <use href="#minimal-bee" x="1800" y="400" transform="rotate(10 1800 400)" />

      {/* Abeja 3 */}
      <path d="M 2200 1200 Q 2400 1300 2500 1100 T 3000 1400 T 3500 1300" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4"/>
      <use href="#minimal-bee" x="3500" y="1300" transform="rotate(-5 3500 1300)" />
      
      {/* Abeja 4 */}
      <path d="M 1500 1800 Q 1700 1700 1800 1900 T 2300 1600" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.3"/>
      <use href="#minimal-bee" x="2300" y="1600" transform="rotate(-20 2300 1600)" />

      {/* Abeja 5 */}
      <path d="M 3200 400 Q 3400 300 3600 500 T 4100 300" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.5"/>
      <use href="#minimal-bee" x="4100" y="300" transform="rotate(15 4100 300)" />

      {/* Abeja 6 */}
      <path d="M 200 1600 Q 350 1700 450 1500 T 700 1800 T 900 1700" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4"/>
      <use href="#minimal-bee" x="900" y="1700" transform="rotate(-10 900 1700)" />

      {/* Abeja 7 */}
      <path d="M 1000 2200 Q 1200 2000 1400 2300 T 1700 2100 T 2000 2300" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.35"/>
      <use href="#minimal-bee" x="2000" y="2300" transform="rotate(12 2000 2300)" />

      {/* Abeja 8 */}
      <path d="M 2800 2000 Q 3000 1900 3200 2100 T 3500 1900 T 3800 2200" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.45"/>
      <use href="#minimal-bee" x="3800" y="2200" transform="rotate(25 3800 2200)" />

      {/* Abeja 9 */}
      <path d="M 4000 900 Q 3800 1000 3700 800 T 3300 1000 T 2900 850" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.5"/>
      <use href="#minimal-bee" x="2900" y="850" transform="rotate(170 2900 850)" />

      {/* Abeja 10 */}
      <path d="M 100 200 Q 200 100 350 250 T 600 100" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.4"/>
      <use href="#minimal-bee" x="600" y="100" transform="rotate(-30 600 100)" />

      {/* Abeja 11 */}
      <path d="M 2500 300 Q 2600 450 2800 200 T 3100 400" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.3"/>
      <use href="#minimal-bee" x="3100" y="400" transform="rotate(35 3100 400)" />
      
      {/* Abeja 12 */}
      <path d="M 4200 1800 Q 4000 1900 3900 1700 T 3500 1900 T 3200 1850" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.5"/>
      <use href="#minimal-bee" x="3200" y="1850" transform="rotate(175 3200 1850)" />
      
      {/* Abeja 13 */}
      <path d="M 500 1200 Q 600 1400 800 1100 T 1100 1300" fill="transparent" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 8" opacity="0.45"/>
      <use href="#minimal-bee" x="1100" y="1300" transform="rotate(15 1100 1300)" />
      
    </svg>
  );
}
