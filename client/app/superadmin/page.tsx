'use client';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Users, DollarSign, Package, LogOut, Zap, TrendingUp, Activity, RefreshCw, Download, Search, ChevronRight, CheckCircle2, Clock, Truck, AlertCircle, Store, BarChart3, X, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  sidebarBg: '#0F172A',   // Vercel-dark sidebar
  sidebarBd: '#1E293B',
  sidebarMuted: '#64748B',
  sidebarText: '#CBD5E1',
};

/* Status config */
const STATUS_CFG = {
  'Delivered':        { bg: T.greenBg,  text: T.green,  bd: T.greenBd                  },
  'Out for Delivery': { bg: T.purpleBg, text: T.purple, bd: 'rgba(124,58,237,.3)'       },
  'Packed':           { bg: T.brandLt,  text: T.brand,  bd: 'rgba(40,116,240,.3)'       },
  'Pending':          { bg: T.orangeBg, text: T.orange, bd: 'rgba(255,107,0,.3)'        },
};
const getStatus = (s) => STATUS_CFG[s] || STATUS_CFG['Pending'];

const NAV_ITEMS = [
  { key: 'overview',  icon: LayoutDashboard, label: 'Overview'      },
  { key: 'orders',    icon: ShoppingBag,     label: 'All Orders'    },
  { key: 'products',  icon: Package,         label: 'All Inventory' },
];

export default function SuperAdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]       = useState('overview');
  const [stats, setStats]               = useState({ revenue: 0, orders: 0, products: 0 });
  const [allOrders, setAllOrders]       = useState([]);
  const [allProducts, setAllProducts]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch]   = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes  = await fetch('https://instaware-prototype.onrender.com/api/admin/orders');
        const ordersData = await ordersRes.json();
        if (Array.isArray(ordersData)) {
          setAllOrders(ordersData);
          const totalRev = ordersData.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
          setStats(prev => ({ ...prev, revenue: totalRev, orders: ordersData.length }));
        }
        const prodRes  = await fetch('https://instaware-prototype.onrender.com/api/products');
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) {
          setAllProducts(prodData);
          setStats(prev => ({ ...prev, products: prodData.length }));
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  /* Filtered lists */
  const filteredOrders   = allOrders.filter(o =>
    (o.customerName || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
    (o.mobile       || '').includes(orderSearch)
  );
  const filteredProducts = allProducts.filter(p =>
    (p.name  || '').toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(productSearch.toLowerCase())
  );

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: T.sidebarBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 44, height: 44, border: `4px solid rgba(40,116,240,0.3)`, borderTopColor: T.brand, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 14, fontWeight: 700, color: T.sidebarMuted }}>Loading Admin Console…</p>
    </div>
  );

  /* ── Sidebar component (shared) ── */
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${T.sidebarBd}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${T.brandDk}, ${T.brand})`, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(40,116,240,0.4)' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 900, color: T.white, margin: 0, letterSpacing: '-0.3px' }}>Instaware</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: T.brand, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Super Admin</p>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ padding: '10px 16px', borderBottom: `1px solid ${T.sidebarBd}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(38,165,65,0.12)', borderRadius: 7, padding: '6px 10px', border: '1px solid rgba(38,165,65,0.2)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, display: 'inline-block', boxShadow: `0 0 0 3px rgba(38,165,65,0.2)` }} />
          <span style={{ fontSize: 11, fontWeight: 800, color: T.green, letterSpacing: '0.06em' }}>LIVE · ALL SYSTEMS ONLINE</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{ fontSize: 9, fontWeight: 900, color: T.sidebarMuted, textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 8px', marginBottom: 6 }}>Navigation</p>
        {NAV_ITEMS.map(item => {
          const Icon   = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                background: active ? T.brand  : 'transparent',
                color:      active ? T.white  : T.sidebarText,
                fontWeight: 800, fontSize: 13, textAlign: 'left',
                boxShadow:  active ? '0 2px 10px rgba(40,116,240,0.35)' : 'none',
                transition: 'all 0.12s ease',
              }}
            >
              <Icon size={17} />
              {item.label}
              {active && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom: admin info + logout */}
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${T.sidebarBd}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${T.brand}, ${T.purple})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: T.white, flexShrink: 0 }}>S</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: T.white, margin: 0 }}>Super Admin</p>
            <p style={{ fontSize: 10, color: T.sidebarMuted, margin: 0, fontWeight: 600 }}>Full Platform Access</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: `1px solid rgba(244,63,63,0.25)`, background: 'rgba(244,63,63,0.1)', color: T.red, fontWeight: 800, fontSize: 12, cursor: 'pointer', transition: 'all 0.12s' }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink, display: 'flex' }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .main-content { animation: fadeUp 0.3s ease both; }
        .stat-card    { transition: all 0.18s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(40,116,240,0.13) !important; }
        .data-row     { transition: background 0.1s ease; }
        .data-row:hover { background: #F7F9FF !important; }
        .prod-card    { transition: all 0.15s ease; }
        .prod-card:hover { box-shadow: 0 4px 16px rgba(40,116,240,0.13) !important; transform: translateY(-1px); }
        .search-wrap:focus-within { border-color: ${T.brand} !important; box-shadow: 0 0 0 3px rgba(40,116,240,0.12) !important; }
        .mobile-overlay { animation: fadeUp 0.2s ease both; }
        .mobile-sidebar { animation: slideIn 0.25s ease both; }
      `}</style>

      {/* ══ DESKTOP SIDEBAR ══ */}
      <aside style={{ width: 240, background: T.sidebarBg, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40, flexShrink: 0, display: 'none' }} className="desktop-sidebar">
        <style>{`.desktop-sidebar{display:block!important}@media(max-width:767px){.desktop-sidebar{display:none!important}}`}</style>
        <SidebarContent />
      </aside>

      {/* ══ MOBILE SIDEBAR OVERLAY ══ */}
      {sidebarOpen && (
        <>
          <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 60, backdropFilter: 'blur(3px)' }} />
          <aside className="mobile-sidebar" style={{ width: 240, background: T.sidebarBg, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 70 }}>
            <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 7, padding: '5px', cursor: 'pointer', color: T.sidebarText, display: 'flex' }}>
              <X size={17} />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ══ MAIN AREA ══ */}
      <div style={{ flex: 1, marginLeft: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }} className="main-area">
        <style>{`@media(min-width:768px){.main-area{margin-left:240px!important}}`}</style>

        {/* Top nav bar */}
        <header style={{ background: T.white, borderBottom: `1px solid ${T.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 30 }}>
          {/* Gradient top strip */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${T.brand}, ${T.purple} 50%, ${T.orange})` }} />
          <div style={{ padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: T.sub, display: 'flex', alignItems: 'center' }} className="mobile-menu-btn">
              <style>{`.mobile-menu-btn{display:flex!important}@media(min-width:768px){.mobile-menu-btn{display:none!important}}`}</style>
              <Menu size={18} />
            </button>

            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, color: T.ink, margin: 0, letterSpacing: '-0.3px', textTransform: 'capitalize' }}>
                {NAV_ITEMS.find(n => n.key === activeTab)?.label} Dashboard
              </h2>
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => window.location.reload()} style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: T.sub, display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}>
                <RefreshCw size={13} /><span style={{ display: 'none' }} className="refresh-label">Refresh</span>
                <style>{`@media(min-width:640px){.refresh-label{display:inline!important}}`}</style>
              </button>
              <button style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: T.sub, display: 'none', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }} className="export-btn">
                <style>{`@media(min-width:640px){.export-btn{display:flex!important}}`}</style>
                <Download size={13} /> Export
              </button>
            </div>
          </div>
        </header>

        {/* Page body */}
        <div className="main-content" style={{ flex: 1, padding: '18px 16px 48px', maxWidth: 1100, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

          {/* ══════════════════════════════════
              VIEW 1 — OVERVIEW
          ══════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="stat-grid">
                <style>{`@media(min-width:640px){.stat-grid{grid-template-columns:repeat(3,1fr)!important}}`}</style>

                {[
                  { icon: DollarSign, color: T.green,  bg: T.greenBg,  label: 'Total Revenue',   value: `₹${stats.revenue.toLocaleString('en-IN')}`, delta: 'All time'        },
                  { icon: ShoppingBag,color: T.brand,  bg: T.brandLt,  label: 'Total Orders',    value: stats.orders,                                  delta: 'All orders'      },
                  { icon: Package,    color: T.purple, bg: T.purpleBg, label: 'Total Products',  value: stats.products,                                delta: 'Listed SKUs'     },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="stat-card" style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 13, padding: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <p style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{s.label}</p>
                        <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={15} color={s.color} />
                        </div>
                      </div>
                      <p style={{ fontSize: 26, fontWeight: 900, color: T.ink, margin: '0 0 3px', letterSpacing: '-0.5px', lineHeight: 1 }}>{String(s.value)}</p>
                      <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>{s.delta}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent activity table */}
              <div style={{ background: T.white, borderRadius: 13, border: `1px solid ${T.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ padding: '13px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: T.white }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 900, color: T.ink, margin: 0 }}>Recent Activity</p>
                    <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>Latest 5 orders</p>
                  </div>
                  <button onClick={() => setActiveTab('orders')} style={{ background: T.brandLt, border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 800, color: T.brand, cursor: 'pointer' }}>
                    View All →
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA', borderBottom: `1px solid ${T.border}` }}>
                        {['Customer', 'Amount', 'Status'].map(h => (
                          <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.slice(0, 5).map((order, i) => {
                        const st = getStatus(order.status);
                        return (
                          <tr key={order._id} className="data-row" style={{ borderBottom: i < 4 ? `1px solid ${T.border}` : 'none', background: T.white }}>
                            <td style={{ padding: '11px 16px' }}>
                              <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: '0 0 1px' }}>{order.customerName}</p>
                              <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>{order.mobile}</p>
                            </td>
                            <td style={{ padding: '11px 16px', fontSize: 14, fontWeight: 900, color: T.green }}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</td>
                            <td style={{ padding: '11px 16px' }}>
                              <span style={{ fontSize: 10, fontWeight: 900, background: st.bg, color: st.text, border: `1.5px solid ${st.bd}`, padding: '3px 9px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.text, display: 'inline-block' }} />
                                {order.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {allOrders.length === 0 && (
                        <tr><td colSpan={3} style={{ padding: '36px', textAlign: 'center', color: T.muted, fontSize: 13, fontWeight: 600 }}>No orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System health row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="health-grid">
                <style>{`@media(min-width:640px){.health-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>
                {[
                  { icon: '🟢', label: 'API Server',     status: 'Operational',  color: T.green  },
                  { icon: '🟢', label: 'Database',        status: 'Connected',    color: T.green  },
                  { icon: '🟡', label: 'Delivery API',    status: 'Degraded',     color: T.orange },
                  { icon: '🟢', label: 'Payment Gateway', status: 'Operational',  color: T.green  },
                ].map(h => (
                  <div key={h.label} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 11, padding: '12px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                      <span style={{ fontSize: 12 }}>{h.icon}</span>
                      <span style={{ fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h.label}</span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 900, color: h.color, margin: 0 }}>{h.status}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════
              VIEW 2 — ALL ORDERS
          ══════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div style={{ background: T.white, borderRadius: 13, border: `1px solid ${T.border}`, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: T.ink, margin: 0 }}>All Orders</p>
                  <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>{allOrders.length} total orders</p>
                </div>
                {/* Search */}
                <div className="search-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bg, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: '7px 12px', transition: 'all 0.15s', minWidth: 200 }}>
                  <Search size={13} color={T.muted} style={{ flexShrink: 0 }} />
                  <input style={{ outline: 'none', border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: T.ink, width: '100%' }} placeholder="Search orders…" value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                </div>
              </div>

              {/* Col headers */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                  <thead>
                    <tr style={{ background: '#FAFAFA', borderBottom: `1px solid ${T.border}` }}>
                      {['Date', 'Customer', 'Items', 'Amount', 'Status'].map(h => (
                        <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 10, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => {
                      const st = getStatus(order.status);
                      return (
                        <tr key={order._id} className="data-row" style={{ borderBottom: i < filteredOrders.length - 1 ? `1px solid ${T.border}` : 'none', background: T.white }}>
                          <td style={{ padding: '11px 16px', fontSize: 12, color: T.muted, fontWeight: 600, whiteSpace: 'nowrap' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <p style={{ fontSize: 13, fontWeight: 800, color: T.ink, margin: '0 0 1px', whiteSpace: 'nowrap' }}>{order.customerName}</p>
                            <p style={{ fontSize: 10, color: T.muted, margin: 0, fontWeight: 600 }}>{order.mobile}</p>
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ fontSize: 11, fontWeight: 900, background: T.brandLt, color: T.brand, padding: '2px 9px', borderRadius: 20 }}>
                              {order.items ? order.items.length : 0} items
                            </span>
                          </td>
                          <td style={{ padding: '11px 16px', fontSize: 14, fontWeight: 900, color: T.green, whiteSpace: 'nowrap' }}>
                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '11px 16px' }}>
                            <span style={{ fontSize: 10, fontWeight: 900, background: st.bg, color: st.text, border: `1.5px solid ${st.bd}`, padding: '3px 9px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.text, display: 'inline-block' }} />
                              {order.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: T.muted, fontSize: 13, fontWeight: 600 }}>
                        {orderSearch ? 'No orders match your search.' : 'No orders yet.'}
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              {filteredOrders.length > 0 && (
                <div style={{ padding: '10px 18px', borderTop: `1px solid ${T.border}`, background: '#FAFAFA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 11, color: T.muted, margin: 0, fontWeight: 600 }}>
                    Showing {filteredOrders.length} of {allOrders.length} orders
                  </p>
                  <span style={{ fontSize: 12, fontWeight: 900, color: T.green }}>
                    ₹{filteredOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0).toLocaleString('en-IN')} total
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════
              VIEW 3 — INVENTORY
          ══════════════════════════════════ */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Search bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div className="search-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 9, padding: '8px 13px', transition: 'all 0.15s', flex: 1, minWidth: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <Search size={14} color={T.muted} style={{ flexShrink: 0 }} />
                  <input style={{ outline: 'none', border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: T.ink, width: '100%' }} placeholder="Search products, brands…" value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, background: T.brandLt, color: T.brand, padding: '5px 12px', borderRadius: 20 }}>
                  {filteredProducts.length} products
                </span>
              </div>

              {/* Product grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }} className="prod-grid">
                <style>{`@media(min-width:480px){.prod-grid{grid-template-columns:repeat(3,1fr)!important}}@media(min-width:900px){.prod-grid{grid-template-columns:repeat(4,1fr)!important}}`}</style>

                {filteredProducts.map(p => (
                  <div key={p._id} className="prod-card" style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <div style={{ aspectRatio: '1', background: '#F9FAFF', overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transition: 'transform 0.4s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div style={{ padding: '10px 10px 12px' }}>
                      <p style={{ fontSize: 9, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{p.brand || 'Instaware'}</p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: T.ink, margin: '0 0 6px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{p.name}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: T.ink }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: 9, fontWeight: 900, background: T.greenBg, color: T.green, padding: '2px 7px', borderRadius: 20 }}>Active</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div style={{ gridColumn: '1/-1', padding: '48px', textAlign: 'center' }}>
                    <Package size={38} color={T.muted} style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 14, fontWeight: 800, color: T.sub, margin: '0 0 4px' }}>No products found</p>
                    <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', fontSize: 11, color: T.muted, marginTop: 28, fontWeight: 600 }}>
            ⚡ Instaware Super Admin Console · Restricted Access · © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}