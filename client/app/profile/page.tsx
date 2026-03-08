'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, ArrowLeft, MapPin, ChevronRight, ShoppingBag, Heart, HelpCircle, Shield, Bell, Star, Edit3 } from 'lucide-react';

/* ── Design tokens ── */
const T = {
  brand:    '#2874F0',
  brandDk:  '#1a5dc8',
  brandLt:  '#EBF2FF',
  yellow:   '#FFD60A',
  orange:   '#FF6B00',
  orangeBg: '#FFF3EB',
  green:    '#26A541',
  greenBg:  '#E8F8EE',
  red:      '#F43F3F',
  redBg:    '#FFF0F0',
  purple:   '#7C3AED',
  purpleBg: '#F3EEFF',
  bg:       '#F1F3F6',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  border:   '#E0E0E0',
};

const handleLogout = (router) => {
  localStorage.clear();
  router.push('/login');
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', mobile: '', address: '' });

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) router.push('/login');
    setUser({
      name:    name,
      mobile:  localStorage.getItem('userMobile'),
      address: localStorage.getItem('userAddress') || 'No Address Saved',
    });
  }, []);

  const initials = user.name ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?';

  const menuSections = [
    {
      title: 'My Activity',
      items: [
        { icon: Package,  color: T.brand,  bg: T.brandLt,  label: 'My Orders',        sub: 'Track, return or buy again',  onClick: () => router.push('/my-orders') },
        { icon: Heart,    color: T.red,    bg: T.redBg,    label: 'Wishlist',          sub: 'Products you love',           onClick: () => {} },
        { icon: Star,     color: T.orange, bg: T.orangeBg, label: 'My Reviews',        sub: 'Rate your recent purchases',  onClick: () => {} },
      ],
    },
    {
      title: 'Account Settings',
      items: [
        { icon: MapPin,   color: T.green,  bg: T.greenBg,  label: 'Saved Addresses',   sub: user.address,                  onClick: () => {} },
        { icon: Bell,     color: T.purple, bg: T.purpleBg, label: 'Notifications',     sub: 'Manage alerts & updates',     onClick: () => {} },
        { icon: Shield,   color: T.brand,  bg: T.brandLt,  label: 'Privacy & Security',sub: 'Password, data & privacy',   onClick: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, color: T.orange, bg: T.orangeBg, label: 'Help Centre',     sub: 'FAQs and support',            onClick: () => {} },
      ],
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink, paddingBottom: 40 }}>
      <style>{`
        @keyframes fadeIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes avatarPop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        .page-body  { animation: fadeIn 0.3s ease both; }
        .avatar-anim { animation: avatarPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .menu-row   { transition: background 0.12s ease; cursor: pointer; }
        .menu-row:hover   { background: #F7F9FF !important; }
        .menu-row:active  { background: ${T.brandLt} !important; transform: scale(0.99); }
        .logout-btn { transition: all 0.15s ease; }
        .logout-btn:hover  { filter: brightness(0.96); }
        .logout-btn:active { transform: scale(0.97); }
        .edit-btn:hover  { background: rgba(255,255,255,0.25) !important; }
        .edit-btn:active { transform: scale(0.9); }
      `}</style>

      {/* ══ STICKY HEADER ══ */}
      <div style={{
        background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 100%)`,
        boxShadow: '0 2px 10px rgba(40,116,240,0.4)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ FREE Delivery on orders ₹499+ &nbsp;·&nbsp; <span style={{ textDecoration: 'underline' }}>INSTA20</span> → 20% off
        </div>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 14px', height: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/')}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={19} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 17, margin: 0 }}>My Account</h1>
          </div>
          <button
            onClick={() => router.push('/my-orders')}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>

      <div className="page-body" style={{ maxWidth: 680, margin: '0 auto', padding: '0 10px' }}>

        {/* ══ USER HERO CARD ══ */}
        <div style={{
          background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 55%, #7C3AED 100%)`,
          borderRadius: '0 0 24px 24px',
          padding: '24px 20px 28px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 14,
        }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,214,10,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: '30%', width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,107,0,0.12)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 2 }}>
            {/* Avatar */}
            <div className="avatar-anim" style={{ position: 'relative' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: T.yellow, color: T.brandDk,
                fontWeight: 900, fontSize: 26,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                border: '3px solid rgba(255,255,255,0.4)',
                flexShrink: 0,
              }}>
                {initials}
              </div>
              {/* Online dot */}
              <div style={{ position: 'absolute', bottom: 3, right: 3, width: 14, height: 14, borderRadius: '50%', background: T.green, border: '2px solid #fff' }} />
            </div>

            {/* Name / mobile */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ color: '#fff', fontWeight: 900, fontSize: 20, margin: '0 0 3px', letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || 'Guest User'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: '0 0 6px', fontWeight: 600 }}>
                📞 {user.mobile || '—'}
              </p>
              {/* Member badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: '3px 10px' }}>
                <Star size={10} fill={T.yellow} color={T.yellow} />
                <span style={{ fontSize: 10, fontWeight: 900, color: T.yellow, letterSpacing: '0.06em' }}>PREMIUM MEMBER</span>
              </div>
            </div>

            {/* Edit button */}
            <button
              className="edit-btn"
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', transition: 'background 0.15s', flexShrink: 0 }}
            >
              <Edit3 size={17} />
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 1, marginTop: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 12, overflow: 'hidden', position: 'relative', zIndex: 2 }}>
            {[
              { num: '0',   label: 'Orders'   },
              { num: '0',   label: 'Wishlist' },
              { num: '4.8', label: 'Rating'   },
            ].map((s, i) => (
              <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '10px 8px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                <p style={{ color: T.yellow, fontWeight: 900, fontSize: 18, margin: '0 0 1px', letterSpacing: '-0.3px' }}>{s.num}</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ MENU SECTIONS ══ */}
        {menuSections.map((section, si) => (
          <div key={section.title} style={{ marginBottom: 12 }}>
            {/* Section label */}
            <p style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 4px', marginBottom: 6 }}>
              {section.title}
            </p>

            {/* Items card */}
            <div style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {section.items.map((item, ii) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    <div
                      className="menu-row"
                      onClick={item.onClick}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: T.white }}
                    >
                      {/* Coloured icon box */}
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={item.color} />
                      </div>

                      {/* Label + sub */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: T.ink, margin: '0 0 1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.sub}
                        </p>
                      </div>

                      <ChevronRight size={16} color={T.muted} style={{ flexShrink: 0 }} />
                    </div>
                    {ii < section.items.length - 1 && (
                      <div style={{ height: 1, background: T.border, marginLeft: 62 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ══ LOGOUT BUTTON ══ */}
        <div style={{ marginTop: 8 }}>
          <button
            className="logout-btn"
            onClick={() => handleLogout(router)}
            style={{
              width: '100%', border: `1.5px solid rgba(244,63,63,0.25)`,
              borderRadius: 12, padding: '14px 16px',
              background: T.redBg, color: T.red,
              fontWeight: 900, fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(244,63,63,0.12)',
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* App version note */}
        <p style={{ textAlign: 'center', fontSize: 11, color: T.muted, marginTop: 20, fontWeight: 600 }}>
          ⚡ Instaware v1.0 · Made with ❤️ in India
        </p>
      </div>
    </div>
  );
}