'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, ShoppingBag, MapPin, ChevronRight, Zap, Star } from 'lucide-react';

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
  greenBd:  '#B2DFC1',
  purple:   '#7C3AED',
  purpleBg: '#F3EEFF',
  red:      '#F43F3F',
  redBg:    '#FFF0F0',
  bg:       '#F1F3F6',
  white:    '#FFFFFF',
  ink:      '#212121',
  sub:      '#535665',
  muted:    '#9E9E9E',
  border:   '#E0E0E0',
};

/* Status config */
const STATUS_MAP = {
  'Delivered':        { bg: T.greenBg,  bd: T.greenBd,          text: T.green,  icon: CheckCircle, label: 'Delivered',        dot: T.green  },
  'Out for Delivery': { bg: T.purpleBg, bd: 'rgba(124,58,237,.3)', text: T.purple, icon: Truck,       label: 'Out for Delivery', dot: T.purple },
  'Packed':           { bg: T.brandLt,  bd: 'rgba(40,116,240,.25)',text: T.brand,  icon: Package,     label: 'Packed',           dot: T.brand  },
  'Pending':          { bg: T.orangeBg, bd: 'rgba(255,107,0,.25)', text: T.orange, icon: Clock,       label: 'Pending',          dot: T.orange },
};

const getStatus = (s) => STATUS_MAP[s] || STATUS_MAP['Pending'];

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [userMobile, setUserMobile] = useState('');

  useEffect(() => {
    const mobile = localStorage.getItem('userMobile');

    if (!mobile) {
      alert('Please login to view orders');
      router.push('/login');
      return;
    }

    setUserMobile(mobile);

    fetch(`https://instaware-prototype.onrender.com/api/orders/user/${mobile}`)
      .then(res => res.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':        return 'text-green-600 bg-green-50 border-green-100';
      case 'Out for Delivery': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'Packed':           return 'text-blue-600 bg-blue-50 border-blue-100';
      default:                 return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Delivered')        return <CheckCircle size={16} />;
    if (status === 'Out for Delivery') return <Truck size={16} />;
    return <Clock size={16} />;
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI','Helvetica Neue',sans-serif", color: T.ink, paddingBottom: 40 }}>
      <style>{`
        @keyframes slideUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes shimmer   { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes floatBag  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .order-card   { animation: slideUp 0.25s ease both; }
        .float-anim   { animation: floatBag 2.4s ease-in-out infinite; }
        .skeleton     { background: linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%); background-size:800px 100%; animation: shimmer 1.4s infinite; }
        .shop-btn:hover  { filter:brightness(1.07); }
        .shop-btn:active { transform:scale(0.97); }
        .track-btn:hover { background:${T.brandLt} !important; }
      `}</style>

      {/* ══ HEADER ══ */}
      <div style={{
        background: `linear-gradient(135deg, ${T.brandDk} 0%, ${T.brand} 100%)`,
        boxShadow: '0 2px 10px rgba(40,116,240,0.4)',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        {/* Promo strip */}
        <div style={{ background: T.yellow, color: T.brandDk, textAlign: 'center', padding: '3px 12px', fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          ⚡ FREE Delivery on orders ₹499+ &nbsp;·&nbsp; <span style={{ textDecoration: 'underline' }}>INSTA20</span> → 20% off
        </div>

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 14px', height: 52, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'rgba(255,255,255,0.14)', border: 'none', borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={19} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 17, margin: 0, letterSpacing: '-0.3px' }}>My Orders</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, margin: 0, fontWeight: 700 }}>
              {userMobile ? `📞 ${userMobile}` : 'Loading…'}
            </p>
          </div>
          {/* Order count badge */}
          {!loading && orders.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 900, color: '#fff' }}>
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 10px 0' }}>

        {/* ── LOADING SKELETONS ── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: T.white, borderRadius: 12, border: `1px solid ${T.border}`, overflow: 'hidden', padding: 16 }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div className="skeleton" style={{ width: 90, height: 10, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 20 }} />
                </div>
                {/* Item row */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div className="skeleton" style={{ width: '80%', height: 10, borderRadius: 6 }} />
                    <div className="skeleton" style={{ width: '50%', height: 10, borderRadius: 6 }} />
                  </div>
                  <div className="skeleton" style={{ width: 48, height: 16, borderRadius: 6 }} />
                </div>
                {/* Footer row */}
                <div className="skeleton" style={{ width: '100%', height: 1, marginBottom: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: 80, height: 10, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: 60, height: 18, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>

        ) : orders.length > 0 ? (

          /* ── ORDER CARDS ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map((order, cardIdx) => {
              const st = getStatus(order.status);
              const StatusIcon = st.icon;
              const date = new Date(order.createdAt);
              const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
              const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={order._id}
                  className="order-card"
                  style={{
                    animationDelay: `${cardIdx * 0.06}s`,
                    background: T.white,
                    borderRadius: 12,
                    border: `1px solid ${T.border}`,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Colored top accent stripe keyed to status */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${st.dot}, ${st.dot}88)` }} />

                  <div style={{ padding: '12px 14px' }}>

                    {/* ── CARD HEADER ── */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 900, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 2px' }}>Order ID</p>
                        <p style={{ fontSize: 13, fontWeight: 900, fontFamily: 'monospace', color: T.ink, margin: 0 }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p style={{ fontSize: 10, color: T.muted, fontWeight: 600, margin: '2px 0 0' }}>
                          {dateStr} · {timeStr}
                        </p>
                      </div>

                      {/* Status pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: st.bg, border: `1.5px solid ${st.bd}`,
                        borderRadius: 20, padding: '4px 10px',
                        fontSize: 10, fontWeight: 900, color: st.text, letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                      }}>
                        {/* Pulsing dot */}
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%', background: st.dot, flexShrink: 0,
                          boxShadow: order.status !== 'Delivered' ? `0 0 0 3px ${st.dot}33` : 'none',
                        }} />
                        <StatusIcon size={12} />
                        {order.status || 'Pending'}
                      </div>
                    </div>

                    {/* ── ITEMS LIST ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {/* Product thumb */}
                          <div style={{ width: 52, height: 52, borderRadius: 8, background: '#F9FAFF', border: `1px solid ${T.border}`, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                            <img
                              src={item.image || 'https://via.placeholder.com/100'}
                              alt={item.productName || item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                            {/* Qty bubble */}
                            <div style={{ position: 'absolute', bottom: 0, right: 0, background: T.ink, color: '#fff', fontSize: 8, fontWeight: 900, padding: '2px 4px', borderTopLeftRadius: 6, lineHeight: 1 }}>
                              ×{item.quantity || 1}
                            </div>
                          </div>

                          {/* Name + size */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: '0 0 2px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                              {item.productName || item.name}
                            </p>
                            <p style={{ fontSize: 10, color: T.muted, fontWeight: 600, margin: 0 }}>
                              {item.size ? `Size: ${item.size}` : ''}
                            </p>
                          </div>

                          {/* Price */}
                          <span style={{ fontSize: 14, fontWeight: 900, color: T.ink, flexShrink: 0 }}>
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ── BILL FOOTER ── */}
                    <div style={{ borderTop: `1.5px dashed ${T.border}`, paddingTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontSize: 10, color: T.muted, fontWeight: 700, margin: '0 0 1px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Paid</p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: T.ink, margin: 0, letterSpacing: '-0.4px' }}>
                            ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                          </p>
                        </div>

                        {/* Track / Reorder CTA */}
                        <button
                          className="track-btn"
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            background: T.brandLt, border: `1.5px solid rgba(40,116,240,0.25)`,
                            borderRadius: 8, padding: '7px 12px',
                            fontSize: 11, fontWeight: 900, color: T.brand, cursor: 'pointer',
                            transition: 'background 0.15s',
                          }}
                        >
                          {order.status === 'Delivered' ? (
                            <><Star size={12} /> Rate Order</>
                          ) : (
                            <><Truck size={12} /> Track Order</>
                          )}
                          <ChevronRight size={12} />
                        </button>
                      </div>

                      {/* Delivery address row */}
                      {order.address && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 5, padding: '6px 8px', background: T.bg, borderRadius: 7 }}>
                          <MapPin size={12} color={T.muted} style={{ flexShrink: 0, marginTop: 1 }} />
                          <p style={{ fontSize: 11, color: T.sub, fontWeight: 600, margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* ── EMPTY STATE ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingBottom: 40 }}>

            {/* Floating bag */}
            <div className="float-anim" style={{ width: 120, height: 120, borderRadius: '50%', background: T.brandLt, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 8px 32px rgba(40,116,240,0.18)' }}>
              <Package size={54} color={T.brand} strokeWidth={1.5} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 900, color: T.ink, margin: '0 0 8px', textAlign: 'center' }}>No orders yet!</h2>
            <p style={{ fontSize: 14, color: T.muted, margin: '0 0 28px', textAlign: 'center', maxWidth: 260, lineHeight: 1.5, fontWeight: 600 }}>
              You haven't placed any orders. Start shopping and your orders will appear here.
            </p>

            {/* Perks strip */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { icon: '🚚', text: 'Free delivery ₹499+' },
                { icon: '↩️', text: 'Easy returns'        },
                { icon: '⭐', text: '100% genuine'        },
              ].map(p => (
                <div key={p.text} style={{ display: 'flex', alignItems: 'center', gap: 5, background: T.white, borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 700, color: T.sub, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: `1px solid ${T.border}` }}>
                  <span>{p.icon}</span>{p.text}
                </div>
              ))}
            </div>

            <button
              className="shop-btn"
              onClick={() => router.push('/')}
              style={{
                background: `linear-gradient(90deg, ${T.brand} 0%, #1a7fe8 100%)`,
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '13px 36px', fontWeight: 900, fontSize: 15,
                cursor: 'pointer', boxShadow: '0 4px 18px rgba(40,116,240,0.38)',
                transition: 'all 0.15s ease', letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <ShoppingBag size={18} />
              Start Shopping →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}