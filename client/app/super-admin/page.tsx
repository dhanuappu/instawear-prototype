'use client';
import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, TrendingUp, Shield, Activity, Zap, Store, AlertTriangle, CheckCircle2, XCircle, Clock, RefreshCw, Download, Search, ChevronDown, BarChart3, Globe } from 'lucide-react';

/* ── Design tokens ── */
const T = {
  brand:    '#2874F0',
  brandDk:  '#1a5dc8',
  brandLt:  '#EBF2FF',
  yellow:   '#FFD60A',
  green:    '#26A541',
  greenBg:  '#E8F8EE',
  greenBd:  '#B2DFC1',
  red:      '#F43F3F',
  redBg:    '#FFF0F0',
  redBd:    'rgba(244,63,63,0.25)',
  orange:   '#FF6B00',
  orangeBg: '#FFF3EB',
  purple:   '#7C3AED',
  purpleBg: '#F3EEFF',
  bg:       '#F1F3F6',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  border:   '#E0E0E0',
};

const STAT_CARDS = [
  { key: 'users',   icon: Users,      color: T.brand,  bg: T.brandLt,  label: 'Total Users',       value: '1,240',  delta: '+12% this week',   deltaUp: true  },
  { key: 'vendors', icon: Store,      color: T.purple, bg: T.purpleBg, label: 'Total Vendors',      value: null,     delta: 'Registered shops',  deltaUp: null  },
  { key: 'revenue', icon: TrendingUp, color: T.green,  bg: T.greenBg,  label: 'Platform Revenue',   value: '₹45,000',delta: '10% commission',    deltaUp: true  },
  { key: 'status',  icon: Activity,   color: T.orange, bg: T.orangeBg, label: 'System Status',      value: 'ONLINE', delta: 'MongoDB Connected',  deltaUp: true  },
];

export default function SuperAdmin() {
  const [shops, setShops]   = useState([]);
  const [stats, setStats]   = useState({ totalShops: 0, active: 0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('https://instaware-prototype.onrender.com/api/shops')
      .then(res => res.json())
      .then(data => {
        setShops(data);
        setStats({
          totalShops: data.length,
          active: data.filter(s => s.status === 'active').length,
        });
      });
  }, []);

  const filteredShops = shops.filter(s =>
    (s.shopName  || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.ownerName || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.location  || '').toLowerCase().includes(search.toLowerCase())
  );

  /* Dynamic stat values */
  const getStatValue = (key) => {
    if (key === 'vendors') return stats.totalShops;
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseOnline { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .page-body   { animation: fadeUp 0.3s ease both; }
        .stat-card   { transition: all 0.18s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(40,116,240,0.13) !important; }
        .vendor-row  { transition: background 0.1s ease; }
        .vendor-row:hover { background: #F7F9FF !important; }
        .ban-btn:hover   { background: ${T.redBg} !important; }
        .ban-btn:active  { transform: scale(0.96); }
        .search-wrap:focus-within { border-color: ${T.brand} !important; box-shadow: 0 0 0 3px rgba(40,116,240,0.12) !important; }
        .nav-btn:hover { background: ${T.bg} !important; }
        .online-dot  { animation: pulseOnline 2s ease-in-out infinite; }
      `}</style>

      {/* ══ TOP NAV ══ */}
      <nav style={{
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
        boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Thin brand stripe */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${T.brand} 0%, ${T.purple} 50%, ${T.orange} 100%)` }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          {/* Left: logo + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${T.brandDk}, ${T.brand})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(40,116,240,0.35)' }}>
              <Zap size={20} color="#fff" fill="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: 0, letterSpacing: '-0.4px' }}>
                Instaware <span style={{ color: T.brand }}>Super Admin</span>
              </p>
              <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Master Control Console</p>
            </div>
          </div>

          {/* Right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.greenBg, border: `1px solid ${T.greenBd}`, borderRadius: 20, padding: '4px 12px' }}>
              <span className="online-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 900, color: T.green }}>LIVE</span>
            </div>

            <button
              className="nav-btn"
              onClick={() => window.location.reload()}
              style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 11px', cursor: 'pointer', color: T.sub, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, transition: 'background 0.12s' }}
            >
              <RefreshCw size={13} /> Refresh
            </button>

            <button
              className="nav-btn"
              style={{ background: 'transparent', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 11px', cursor: 'pointer', color: T.sub, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, transition: 'background 0.12s' }}
            >
              <Download size={13} /> Export
            </button>

            <div style={{ width: 1, height: 28, background: T.border }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg, ${T.brand}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>
                S
              </div>
              <div style={{ display: 'none' }} className="admin-name-desktop">
                <style>{`@media(min-width:640px){.admin-name-desktop{display:block!important}}`}</style>
                <p style={{ fontSize: 12, fontWeight: 800, color: T.ink, margin: 0 }}>Super Admin</p>
                <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>Full Access</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="page-body" style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px 48px' }}>

        {/* ══ PAGE HEADER ══ */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <Shield size={14} color={T.red} />
              <span style={{ fontSize: 10, fontWeight: 900, color: T.red, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Master Control</span>
            </div>
            <h1 style={{ fontSize: 'clamp(20px,4vw,28px)', fontWeight: 900, color: T.ink, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              Platform Overview
            </h1>
            <p style={{ fontSize: 13, color: T.muted, margin: 0, fontWeight: 500 }}>
              Real-time health and management for all Instaware operations.
            </p>
          </div>

          {/* Quick stat pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: '5px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <Store size={12} color={T.purple} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T.ink }}>{stats.totalShops} Vendors</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: '5px 12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: T.ink }}>{stats.active} Active</span>
            </div>
          </div>
        </div>

        {/* ══ STAT CARDS ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 24 }} className="stats-grid">
          <style>{`@media(min-width:640px){.stats-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>

          {STAT_CARDS.map(s => {
            const Icon = s.icon;
            const dynamicVal = getStatValue(s.key);
            const displayVal = dynamicVal !== null ? dynamicVal : s.value;
            const isOnline = s.key === 'status';

            return (
              <div
                key={s.key}
                className="stat-card"
                style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: '16px 16px 14px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{s.label}</p>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={15} color={s.color} />
                  </div>
                </div>

                <p style={{ fontSize: isOnline ? 20 : 28, fontWeight: 900, color: isOnline ? T.green : T.ink, margin: '0 0 4px', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  {String(displayVal)}
                </p>

                <p style={{ fontSize: 11, color: s.deltaUp === true ? T.green : s.deltaUp === false ? T.red : T.muted, margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                  {s.deltaUp === true && '↑ '}{s.deltaUp === false && '↓ '}{s.delta}
                </p>
              </div>
            );
          })}
        </div>

        {/* ══ VENDOR TABLE ══ */}
        <div style={{ background: T.white, borderRadius: 14, border: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>

          {/* Table header bar */}
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: T.white }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 34, height: 34, background: T.purpleBg, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={17} color={T.purple} />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 900, color: T.ink, margin: 0 }}>Registered Vendors</p>
                <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>{shops.length} vendors in the platform</p>
              </div>
            </div>

            {/* Search */}
            <div className="search-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: '7px 12px', transition: 'all 0.15s', minWidth: 220 }}>
              <Search size={14} color={T.muted} style={{ flexShrink: 0 }} />
              <input
                style={{ outline: 'none', border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: T.ink, width: '100%' }}
                placeholder="Search vendors…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Column headers */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr style={{ background: '#FAFAFA', borderBottom: `1px solid ${T.border}` }}>
                  {['#', 'Shop Name', 'Owner', 'Location', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', width: i === 0 ? 40 : 'auto' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredShops.length > 0 ? filteredShops.map((shop, idx) => {
                  const isActive  = !shop.status || shop.status === 'active';
                  const statusCfg = isActive
                    ? { bg: T.greenBg, text: T.green, bd: T.greenBd, label: 'Active' }
                    : { bg: T.redBg,   text: T.red,   bd: T.redBd,   label: 'Banned' };

                  return (
                    <tr
                      key={shop._id}
                      className="vendor-row"
                      style={{ borderBottom: idx < filteredShops.length - 1 ? `1px solid ${T.border}` : 'none', background: T.white }}
                    >
                      {/* Row number */}
                      <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700, color: T.muted }}>{idx + 1}</td>

                      {/* Shop name */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 9, background: T.purpleBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: T.purple, flexShrink: 0 }}>
                            {(shop.shopName || 'S')[0].toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: 0, whiteSpace: 'nowrap' }}>{shop.shopName || '—'}</p>
                            <p style={{ fontSize: 10, color: T.muted, margin: 0, fontFamily: 'monospace', fontWeight: 600 }}>#{shop._id?.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: T.sub, whiteSpace: 'nowrap' }}>
                        {shop.ownerName || '—'}
                      </td>

                      {/* Location */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Globe size={12} color={T.brand} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: T.brand, whiteSpace: 'nowrap' }}>{shop.location || '—'}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 10, fontWeight: 900, background: statusCfg.bg, color: statusCfg.text,
                          border: `1.5px solid ${statusCfg.bd}`, padding: '3px 10px', borderRadius: 20,
                          display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusCfg.text, display: 'inline-block' }} />
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <button
                            className="ban-btn"
                            style={{ background: 'transparent', border: `1px solid ${T.redBd}`, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 800, color: T.red, cursor: 'pointer', transition: 'all 0.12s', whiteSpace: 'nowrap' }}
                          >
                            BAN
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <Store size={38} color={T.muted} style={{ margin: '0 auto 10px' }} />
                      <p style={{ fontSize: 15, fontWeight: 800, color: T.sub, margin: '0 0 4px' }}>
                        {search ? 'No results found' : 'No vendors registered yet'}
                      </p>
                      <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                        {search ? `Try a different search term` : 'Vendors will appear here once they register.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          {filteredShops.length > 0 && (
            <div style={{ padding: '10px 18px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAFAFA' }}>
              <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>
                Showing {filteredShops.length} of {shops.length} vendors
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 11, fontWeight: 900, background: T.greenBg, color: T.green, padding: '2px 9px', borderRadius: 20 }}>
                  {stats.active} Active
                </span>
                <span style={{ fontSize: 11, fontWeight: 900, background: T.orangeBg, color: T.orange, padding: '2px 9px', borderRadius: 20 }}>
                  {shops.length - stats.active} Inactive
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ══ SYSTEM HEALTH STRIP ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginTop: 16 }} className="health-grid">
          <style>{`@media(min-width:640px){.health-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>

          {[
            { icon: '🟢', label: 'API Server',     status: 'Operational',  color: T.green  },
            { icon: '🟢', label: 'Database',        status: 'Connected',    color: T.green  },
            { icon: '🟡', label: 'Delivery API',    status: 'Degraded',     color: T.orange },
            { icon: '🟢', label: 'Payment Gateway', status: 'Operational',  color: T.green  },
          ].map(h => (
            <div key={h.label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 11, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', align: 'center', gap: 7, marginBottom: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 12 }}>{h.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h.label}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 900, color: h.color, margin: 0 }}>{h.status}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 11, color: T.muted, marginTop: 28, fontWeight: 600 }}>
          ⚡ Instaware Super Admin Console · Restricted Access · © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}