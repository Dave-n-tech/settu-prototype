import React, { useState, useEffect } from "react";
import {
  Home, Receipt, Plus, User, ChevronLeft, ChevronRight, Share2,
  Download, MoreHorizontal, Check, Copy, ShieldCheck, X, Trash2,
  MessageCircle, Mail, MessagesSquare, Search, CheckCheck, Link2,
  Phone, Video, MoreVertical, Smile, Mic, Paperclip,
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

const naira = (n: number): string =>
  "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });

// ---------- Types ----------
type InvoiceStatus = "paid" | "pending" | "sent" | "expired" | "draft";

interface LineItem {
  d: string;
  q: number;
  p: number;
}

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  items?: LineItem[];
  phone?: string;
  quick?: boolean;
}

type Screen =
  | "home"
  | "invoices"
  | "create"
  | "quickpay"
  | "preview"
  | "requestpay"
  | "share"
  | "buyerview"
  | "profile"
  | "waoverlay"
  | "wacontacts"
  | "wachat";

type NavigateFn = (screen: Screen, data?: Invoice | null) => void;

interface ScreenProps {
  go: NavigateFn;
}

interface InvoiceScreenProps extends ScreenProps {
  invoice: Invoice | null;
}

// ---------- Seed data ----------
const seed: { business: { name: string; cat: string; initials: string }; invoices: Invoice[] } = {
  business: { name: "Jessy's Cuisine", cat: "Catering & Events", initials: "JC" },
  invoices: [
    {
      id: "INV-004", client: "Bimpe Adigun", amount: 68000, status: "paid", date: "Aug 9",
      items: [
        { d: "Small chops platter (40 pax)", q: 40, p: 1200 },
        { d: "Delivery & setup", q: 1, p: 20000 },
      ],
    },
    {
      id: "INV-003", client: "Tunde Bakare", amount: 145000, status: "pending", date: "Aug 8",
      items: [
        { d: "Jollof rice & grilled chicken (150 pax)", q: 150, p: 700 },
        { d: "Delivery & setup", q: 1, p: 40000 },
      ],
    },
    {
      id: "INV-002", client: "Chioma Eze", amount: 32500, status: "sent", date: "Aug 5",
      items: [
        { d: "Birthday cake (2-tier, vanilla)", q: 1, p: 28000 },
        { d: "Delivery", q: 1, p: 4500 },
      ],
    },
    {
      id: "INV-001", client: "Kunle Oyebanji", amount: 96000, status: "expired", date: "Jul 29",
      items: [
        { d: "Small chops platter (60 pax)", q: 60, p: 1200 },
        { d: "Delivery & setup", q: 1, p: 24000 },
      ],
    },
  ],
};

const statusStyle: Record<InvoiceStatus, { bg: string; fg: string; label: string }> = {
  paid: { bg: "#E7F3EC", fg: "#1F8A5F", label: "Paid" },
  pending: { bg: "#FDF2E2", fg: "#B9781F", label: "Pending" },
  sent: { bg: "#EDEBFB", fg: "#5B4FC2", label: "Sent" },
  expired: { bg: "#F6E9E7", fg: "#C1483D", label: "Expired" },
  draft: { bg: "#EFEAE0", fg: "#8A8578", label: "Draft" },
};

// ---------- Shared UI ----------
function StatusPill({ s }: { s: InvoiceStatus }) {
  const st = statusStyle[s] || statusStyle.draft;
  return (
    <span
      style={{ background: st.bg, color: st.fg }}
      className="text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded-full"
    >
      {st.label}
    </span>
  );
}

function TopBar({ title, onBack, right }: { title: string; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-3">
      <div className="w-8">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1 rounded-full active:bg-black/5">
            <ChevronLeft size={22} color="#10261F" />
          </button>
        )}
      </div>
      <div
        className="text-[15px] font-semibold tracking-tight"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}
      >
        {title}
      </div>
      <div className="w-8 flex justify-end">{right}</div>
    </div>
  );
}

function Eyebrow({ children, color = "#8A8578" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{ fontFamily: "'IBM Plex Mono', monospace", color, letterSpacing: "0.08em" }}
      className="text-[10px] uppercase font-medium"
    >
      {children}
    </div>
  );
}

// ---------- Dashboard ----------
function Dashboard({ go }: ScreenProps) {
  const totalToday = 68000;
  const totalWeek = 341500;
  return (
    <div className="pb-28">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <Eyebrow>Good afternoon</Eyebrow>
          <div
            className="text-[19px] font-semibold mt-0.5"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}
          >
            {seed.business.name}
          </div>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold"
          style={{ background: "#10261F", color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {seed.business.initials}
        </div>
      </div>

      {/* Cash flow card */}
      <div className="mx-5 rounded-2xl p-5 relative overflow-hidden" style={{ background: "#10261F" }}>
        <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full" style={{ background: "#17392C" }} />
        <div className="absolute -right-2 top-10 w-16 h-16 rounded-full" style={{ background: "#1A3F30" }} />
        <div className="relative">
          <Eyebrow color="#9FB8AC">Received this week</Eyebrow>
          <div
            className="mt-1 text-[32px] leading-none font-semibold tabular-nums"
            style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#FBF7EF" }}
          >
            {naira(totalWeek)}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #1F4636" }}>
            <div>
              <Eyebrow color="#9FB8AC">Today</Eyebrow>
              <div className="text-[14px] font-medium mt-0.5" style={{ color: "#FBF7EF", fontFamily: "'IBM Plex Mono', monospace" }}>
                {naira(totalToday)}
              </div>
            </div>
            <div className="w-px h-8" style={{ background: "#1F4636" }} />
            <div>
              <Eyebrow color="#9FB8AC">Outstanding</Eyebrow>
              <div className="text-[14px] font-medium mt-0.5" style={{ color: "#E7A33E", fontFamily: "'IBM Plex Mono', monospace" }}>
                {naira(177500)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-5">
        <button
          onClick={() => go("create")}
          className="rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
          style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: "#E7A33E22" }}>
            <Receipt size={16} color="#B9781F" />
          </div>
          <div className="text-[13px] font-semibold" style={{ color: "#10261F" }}>New invoice</div>
          <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>Add line items & bill a client</div>
        </button>
        <button
          onClick={() => go("quickpay")}
          className="rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
          style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: "#1F8A5F22" }}>
            <Share2 size={16} color="#1F8A5F" />
          </div>
          <div className="text-[13px] font-semibold" style={{ color: "#10261F" }}>Quick payment link</div>
          <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>No invoice needed</div>
        </button>
      </div>

      {/* Recent */}
      <div className="px-5 mt-7 flex items-center justify-between">
        <Eyebrow>Recent invoices</Eyebrow>
        <button onClick={() => go("invoices")} className="text-[11px] font-semibold" style={{ color: "#B9781F" }}>
          See all
        </button>
      </div>
      <div className="px-5 mt-3 space-y-2.5">
        {seed.invoices.map((inv) => (
          <button
            key={inv.id}
            onClick={() => go("preview", inv)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl active:scale-[0.99] transition-transform"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
          >
            <div className="text-left">
              <div className="text-[13.5px] font-semibold" style={{ color: "#10261F" }}>{inv.client}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8578" }} className="text-[10.5px]">
                  {inv.id}
                </span>
                <span className="text-[10px]" style={{ color: "#C4BDA9" }}>·</span>
                <span className="text-[10.5px]" style={{ color: "#8A8578" }}>{inv.date}</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[13px] font-medium tabular-nums">
                {naira(inv.amount)}
              </span>
              <StatusPill s={inv.status} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Invoices list ----------
function InvoicesList({ go }: ScreenProps) {
  return (
    <div className="pb-28">
      <TopBar title="Invoices" />
      <div className="px-5 mt-2 space-y-2.5">
        {seed.invoices.map((inv) => (
          <button
            key={inv.id}
            onClick={() => go("preview", inv)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl active:scale-[0.99] transition-transform"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
          >
            <div className="text-left">
              <div className="text-[13.5px] font-semibold" style={{ color: "#10261F" }}>{inv.client}</div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8578" }} className="text-[10.5px]">
                {inv.id} · {inv.date}
              </span>
            </div>
            <div className="text-right flex flex-col items-end gap-1.5">
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[13px] font-medium tabular-nums">
                {naira(inv.amount)}
              </span>
              <StatusPill s={inv.status} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Create Invoice ----------
interface DraftItem {
  desc: string;
  qty: number | string;
  price: number | string;
}

function CreateInvoice({ go }: ScreenProps) {
  const [client, setClient] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [items, setItems] = useState<DraftItem[]>([{ desc: "", qty: 1, price: "" }]);

  const total = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);

  const updateItem = <K extends keyof DraftItem>(i: number, key: K, val: DraftItem[K]) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: val };
    setItems(copy);
  };
  const addItem = () => setItems([...items, { desc: "", qty: 1, price: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <div className="pb-32">
      <TopBar title="New invoice" onBack={() => go("home")} />

      <div className="px-5 mt-2 space-y-5">
        <div>
          <Eyebrow>Client</Eyebrow>
          <input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Client name"
            className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp number"
            className="w-full mt-2.5 px-3.5 py-3 rounded-xl text-[13.5px] outline-none"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Eyebrow>Line items</Eyebrow>
            <button onClick={addItem} className="text-[11px] font-semibold flex items-center gap-1" style={{ color: "#B9781F" }}>
              <Plus size={12} /> Add item
            </button>
          </div>
          <div className="mt-2.5 space-y-2.5">
            {items.map((it, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
                <div className="flex items-center gap-2">
                  <input
                    value={it.desc}
                    onChange={(e) => updateItem(i, "desc", e.target.value)}
                    placeholder="Description (e.g. Small chops, 50 pax)"
                    className="flex-1 text-[13px] outline-none bg-transparent"
                    style={{ color: "#10261F" }}
                  />
                  {items.length > 1 && (
                    <button onClick={() => removeItem(i)}>
                      <Trash2 size={13} color="#C1483D" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2.5">
                  <input
                    type="number"
                    value={it.qty}
                    onChange={(e) => updateItem(i, "qty", e.target.value)}
                    placeholder="Qty"
                    className="w-16 px-2 py-1.5 rounded-lg text-[12.5px] outline-none tabular-nums"
                    style={{ background: "#FFFDF9", border: "1px solid #E4DCC8", fontFamily: "'IBM Plex Mono', monospace" }}
                  />
                  <span className="text-[12px]" style={{ color: "#8A8578" }}>×</span>
                  <input
                    type="number"
                    value={it.price}
                    onChange={(e) => updateItem(i, "price", e.target.value)}
                    placeholder="Unit price"
                    className="flex-1 px-2 py-1.5 rounded-lg text-[12.5px] outline-none tabular-nums"
                    style={{ background: "#FFFDF9", border: "1px solid #E4DCC8", fontFamily: "'IBM Plex Mono', monospace" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: "#10261F" }}>
          <Eyebrow color="#9FB8AC">Subtotal</Eyebrow>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#FBF7EF" }} className="text-[16px] font-semibold tabular-nums">
            {naira(total)}
          </span>
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          onClick={() => {
            const cleanItems: LineItem[] = items
              .filter((it) => it.desc.trim() !== "" && Number(it.price) > 0)
              .map((it) => ({ d: it.desc, q: Number(it.qty) || 1, p: Number(it.price) || 0 }));
            go("preview", {
              id: "INV-005",
              client: client || "New client",
              amount: total,
              status: "draft",
              date: "Today",
              items: cleanItems.length ? cleanItems : [{ d: "Item", q: 1, p: total }],
            });
          }}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] active:scale-[0.98] transition-transform"
          style={{ background: "#10261F", color: "#FFFFFF" }}
        >
          Preview invoice
        </button>
      </div>
    </div>
  );
}

// ---------- Quick Payment Link (no invoice) ----------
function QuickPayment({ go }: ScreenProps) {
  const [buyer, setBuyer] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const amount = Number(price) || 0;
  const canContinue = desc.trim() !== "" && amount > 0;

  return (
    <div className="pb-32">
      <TopBar title="Quick payment link" onBack={() => go("home")} />

      <div className="px-5 mt-2 space-y-5">
        <div>
          <Eyebrow>What's it for?</Eyebrow>
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. Small chops, 30 pax"
            className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
          />
        </div>

        <div>
          <Eyebrow>Amount</Eyebrow>
          <div
            className="w-full mt-2 flex items-center px-3.5 rounded-xl"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
          >
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8578" }} className="text-[14px] pr-1.5">₦</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full py-3 text-[14px] outline-none bg-transparent tabular-nums"
              style={{ color: "#10261F", fontFamily: "'IBM Plex Mono', monospace" }}
            />
          </div>
        </div>

        <div>
          <Eyebrow>Buyer name (optional)</Eyebrow>
          <input
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            placeholder="Who's paying?"
            className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
          />
        </div>

        <div>
          <Eyebrow>WhatsApp number (optional)</Eyebrow>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 080xxxxxxxx"
            className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
          />
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          disabled={!canContinue}
          onClick={() =>
            go("requestpay", {
              id: "PAY-" + Math.floor(1000 + Math.random() * 9000),
              client: buyer || "Buyer",
              phone,
              amount,
              status: "pending",
              date: "Today",
              items: [{ d: desc, q: 1, p: amount }],
              quick: true,
            })
          }
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] active:scale-[0.98] transition-transform"
          style={{
            background: canContinue ? "#10261F" : "#D9D2BF",
            color: canContinue ? "#FBF7EF" : "#8A8578",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ---------- Invoice Preview ----------
function InvoicePreview({ go, invoice }: InvoiceScreenProps) {
  const inv = invoice || seed.invoices[0];
  const lineItems: LineItem[] = inv.items && inv.items.length ? inv.items : [{ d: "Invoice total", q: 1, p: inv.amount }];
  const subtotal = lineItems.reduce((s, it) => s + it.q * it.p, 0);

  return (
    <div className="pb-32">
      <TopBar title={inv.id} onBack={() => go("home")} right={<MoreHorizontal size={18} color="#10261F" />} />

      <div className="px-5 mt-2">
        <div className="rounded-2xl overflow-hidden" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
          <div className="p-5" style={{ borderBottom: "1px dashed #D9CEB3" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
                  {seed.business.name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>{seed.business.cat}</div>
              </div>
              <StatusPill s={inv.status} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <Eyebrow>Billed to</Eyebrow>
                <div className="text-[13px] font-medium mt-0.5" style={{ color: "#10261F" }}>{inv.client}</div>
              </div>
              <div className="text-right">
                <Eyebrow>Invoice</Eyebrow>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[13px] font-medium mt-0.5">
                  {inv.id}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {lineItems.map((it, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="text-[12.5px] pr-3" style={{ color: "#3A362E" }}>
                  {it.d} <span style={{ color: "#8A8578" }}>× {it.q}</span>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[12.5px] tabular-nums whitespace-nowrap">
                  {naira(it.q * it.p)}
                </div>
              </div>
            ))}
            <div className="pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #E4DCC8" }}>
              <div className="text-[13px] font-semibold" style={{ color: "#10261F" }}>Total</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[16px] font-semibold tabular-nums">
                {naira(subtotal)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 p-3 rounded-xl" style={{ background: "#EDF6F1" }}>
          <ShieldCheck size={15} color="#1F8A5F" />
          <span className="text-[11px]" style={{ color: "#1F8A5F" }}>Bank details are shown on the client's view for direct transfer.</span>
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4 flex gap-2.5" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          className="flex-1 px-3 py-3.5 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] transition-transform"
          style={{ background: "#FFFFFF", border: "1px solid #10261F", color: "#10261F" }}
        >
          <Download size={14} /> PDF
        </button>
        <button
          onClick={() => go("requestpay", inv)}
          className="flex-[1.6] px-3 py-3.5 rounded-xl font-semibold text-[12.5px] flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98] transition-transform"
          style={{ background: "#10261F", color: "#FFFFFF" }}
        >
          <Share2 size={14} /> Request payment
        </button>
      </div>
    </div>
  );
}

// ---------- Request Payment (fee split + share) ----------
function RequestPayment({ go, invoice }: InvoiceScreenProps) {
  const inv = invoice || seed.invoices[0];
  const amount = inv.items && inv.items.length
    ? inv.items.reduce((s, it) => s + it.q * it.p, 0)
    : inv.amount;
  const [buyerPays, setBuyerPays] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const fee = Math.min(Math.round(amount * 0.015) + 100, 2000);
  const link = "settu.app/pay/" + inv.id.toLowerCase().replace(/[^a-z0-9]/g, "") + "x9k";

  return (
    <div className="pb-32">
      <TopBar title="Request payment" onBack={() => go(inv.quick ? "quickpay" : "preview", inv.quick ? null : inv)} />

      <div className="px-5 mt-3">
        <Eyebrow>Who covers the processing fee?</Eyebrow>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setBuyerPays(true)}
            className="p-3.5 rounded-xl text-left"
            style={{
              background: buyerPays ? "#10261F" : "#FFFFFF",
              border: `1px solid ${buyerPays ? "#10261F" : "#E4DCC8"}`,
            }}
          >
            <div className="text-[12.5px] font-semibold" style={{ color: buyerPays ? "#FBF7EF" : "#10261F" }}>Client pays fee</div>
            <div className="text-[10.5px] mt-1" style={{ color: buyerPays ? "#9FB8AC" : "#8A8578" }}>You get the full amount</div>
          </button>
          <button
            onClick={() => setBuyerPays(false)}
            className="p-3.5 rounded-xl text-left"
            style={{
              background: !buyerPays ? "#10261F" : "#FFFFFF",
              border: `1px solid ${!buyerPays ? "#10261F" : "#E4DCC8"}`,
            }}
          >
            <div className="text-[12.5px] font-semibold" style={{ color: !buyerPays ? "#FBF7EF" : "#10261F" }}>You absorb it</div>
            <div className="text-[10.5px] mt-1" style={{ color: !buyerPays ? "#9FB8AC" : "#8A8578" }}>Client pays exact price</div>
          </button>
        </div>

        <div className="mt-5 rounded-xl p-4 space-y-2.5" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
          <div className="flex items-center justify-between text-[12.5px]">
            <span style={{ color: "#8A8578" }}>Invoice total</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(amount)}</span>
          </div>
          <div className="flex items-center justify-between text-[12.5px]">
            <span style={{ color: "#8A8578" }}>Processing fee</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(fee)}</span>
          </div>
          <div className="pt-2.5 flex items-center justify-between" style={{ borderTop: "1px dashed #D9CEB3" }}>
            <span className="text-[12.5px] font-semibold" style={{ color: "#10261F" }}>Client pays</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[15px] font-semibold tabular-nums">
              {naira(buyerPays ? amount + fee : amount)}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span style={{ color: "#8A8578" }}>You receive</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1F8A5F" }} className="tabular-nums font-medium">
              {naira(buyerPays ? amount : amount - fee)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: "#FDF2E2" }}>
          <Eyebrow color="#B9781F">Note</Eyebrow>
          <span className="text-[11px]" style={{ color: "#B9781F" }}>
            Link expires in 24 hours. {inv.quick ? "Details lock once sent." : "Invoice locks once sent."}
          </span>
        </div>

        <div className="mt-4">
          <Eyebrow>Payment link</Eyebrow>
          <div
            className="mt-2 w-full flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
          >
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8578" }} className="text-[11px] truncate pr-2">
              {link}
            </span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(link);
                setCopied(true);
              }}
              className="flex items-center gap-1 text-[11px] font-semibold shrink-0"
              style={{ color: copied ? "#1F8A5F" : "#10261F" }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          onClick={() => go("waoverlay", inv)}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: "#25D366", color: "#08210F" }}
        >
          Share to WhatsApp
        </button>
      </div>
    </div>
  );
}

// ---------- Mock: native share sheet ----------
interface ShareApp {
  label: string;
  icon: any;
  bg: string;
  isTarget?: boolean;
}

function ShareSheetOverlay({ go, invoice }: InvoiceScreenProps) {
  const [tapped, setTapped] = useState<boolean>(false);

  useEffect(() => {
    if (!tapped) return;
    const t = setTimeout(() => go("wacontacts", invoice), 550);
    return () => clearTimeout(t);
  }, [tapped]);

  const apps: ShareApp[] = [
    { label: "Messages", icon: MessagesSquare, bg: "#34C759" },
    { label: "Mail", icon: Mail, bg: "#5B9DF9" },
    { label: "WhatsApp", icon: MessageCircle, bg: "#25D366", isTarget: true },
    { label: "Copy Link", icon: Link2, bg: "#8A8578" },
    { label: "More", icon: MoreHorizontal, bg: "#B4AC98" },
  ];

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end" style={{ background: "rgba(16,38,31,0.45)" }}>
      <div
        className="rounded-t-3xl px-5 pt-5 pb-8 transition-transform duration-300"
        style={{ background: "#FFFFFF" }}
      >
        <div className="w-9 h-1 rounded-full mx-auto mb-4" style={{ background: "#E4DCC8" }} />
        <div className="flex items-center gap-2.5 pb-4" style={{ borderBottom: "1px solid #EFEAE0" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#10261F" }}>
            <Link2 size={14} color="#FBF7EF" />
          </div>
          <div className="text-[11.5px] truncate" style={{ color: "#8A8578" }}>settu.app/pay/inv005x9k</div>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-5">
          {apps.map((a) => {
            const Icon = a.icon;
            const active = tapped && a.isTarget;
            return (
              <button
                key={a.label}
                onClick={() => a.isTarget && setTapped(true)}
                className="flex flex-col items-center gap-1.5"
                style={{ opacity: tapped && !a.isTarget ? 0.35 : 1, transition: "opacity 0.2s" }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform"
                  style={{ background: a.bg, transform: active ? "scale(1.12)" : "scale(1)" }}
                >
                  <Icon size={20} color="#FFFFFF" />
                </div>
                <span className="text-[9.5px] font-medium" style={{ color: "#3A362E" }}>{a.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <span className="text-[10px]" style={{ color: "#B4AC98" }}>Tap WhatsApp to continue</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Mock: WhatsApp contact picker ----------
interface MockContact {
  name: string;
  sub: string;
  target?: boolean;
}

function WhatsAppContacts({ go, invoice }: InvoiceScreenProps) {
  const contacts: MockContact[] = [
    { name: invoice?.client || "Buyer", sub: "online", target: true },
    { name: "Adaeze Okonkwo", sub: "last seen today at 11:42" },
    { name: "Catering Suppliers NG", sub: "12 messages" },
    { name: "Emeka (Rider)", sub: "yesterday" },
    { name: "Mum", sub: "Tuesday" },
  ];

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: "#FFFFFF" }}>
      <div className="px-5 pt-6 pb-4" style={{ background: "#075E54" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => go("requestpay", invoice)}>
            <ChevronLeft size={20} color="#FFFFFF" />
          </button>
          <div className="text-[15px] font-semibold" style={{ color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}>
            Share via
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-xl" style={{ background: "#0C6B5D" }}>
          <Search size={14} color="#B7DED4" />
          <span className="text-[12px]" style={{ color: "#B7DED4" }}>Search contacts and chats</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((c, i) => (
          <button
            key={i}
            onClick={() => c.target && go("wachat", invoice)}
            className="w-full flex items-center gap-3 px-5 py-3"
            style={{ borderBottom: "1px solid #F2EFE6", opacity: c.target ? 1 : 0.55 }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0"
              style={{ background: c.target ? "#25D366" : "#D9D2BF", color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="text-left flex-1">
              <div className="text-[13.5px] font-medium" style={{ color: "#10261F" }}>{c.name}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>{c.sub}</div>
            </div>
            {c.target && (
              <span className="text-[9.5px] font-semibold px-2 py-1 rounded-full" style={{ background: "#E7F3EC", color: "#1F8A5F" }}>
                Tap to send
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Mock: WhatsApp chat thread ----------
function WhatsAppChat({ go, invoice }: InvoiceScreenProps) {
  const [sent, setSent] = useState<boolean>(false);
  const clientName = invoice?.client || "Buyer";
  const amount = invoice?.items && invoice.items.length
    ? invoice.items.reduce((s, it) => s + it.q * it.p, 0)
    : invoice?.amount || 0;

  useEffect(() => {
    const t = setTimeout(() => setSent(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: "#ECE5DD" }}>
      <div className="px-5 pt-6 pb-3 flex items-center gap-3" style={{ background: "#075E54" }}>
        <button onClick={() => go("wacontacts", invoice)}>
          <ChevronLeft size={20} color="#FFFFFF" />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold"
          style={{ background: "#25D366", color: "#FFFFFF" }}
        >
          {clientName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </div>
        <div>
          <div className="text-[13.5px] font-semibold" style={{ color: "#FFFFFF" }}>{clientName}</div>
          <div className="text-[10.5px]" style={{ color: "#B7DED4" }}>online</div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col justify-end">
        {sent && (
          <div className="self-end max-w-[78%] rounded-xl rounded-tr-sm p-2.5" style={{ background: "#DCF8C6" }}>
            <div className="rounded-lg overflow-hidden" style={{ background: "#FFFFFF" }}>
              <div className="p-3">
                <div className="text-[12px] font-semibold" style={{ color: "#10261F" }}>Payment request from {seed.business.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#1F8A5F" }} className="text-[13px] font-semibold mt-1">
                  {naira(amount)}
                </div>
                <div className="text-[10.5px] mt-1" style={{ color: "#8A8578" }}>settu.app/pay/inv005x9k</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-1.5 pr-0.5">
              <span className="text-[10px]" style={{ color: "#5A6B5F" }}>11:47 AM</span>
              <CheckCheck size={13} color="#34B7F1" />
            </div>
          </div>
        )}
      </div>

      <div className="px-3 pb-4 flex items-center gap-2">
        <div className="flex-1 px-4 py-2.5 rounded-full text-[12px]" style={{ background: "#FFFFFF", color: "#B4AC98" }}>
          Message
        </div>
      </div>

      <button
        onClick={() => go("share", invoice)}
        className="mx-4 mb-4 py-3 rounded-xl font-semibold text-[12px]"
        style={{ background: "#10261F", color: "#FBF7EF" }}
      >
        Continue prototype →
      </button>
    </div>
  );
}

// ---------- Share confirmation ----------
function ShareSheet({ go, invoice }: InvoiceScreenProps) {
  const [copied, setCopied] = useState<boolean>(false);
  return (
    <div className="pb-28 flex flex-col items-center px-6 pt-16 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#E7F3EC" }}>
        <Check size={26} color="#1F8A5F" />
      </div>
      <div className="text-[17px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
        Payment link sent
      </div>
      <div className="text-[12.5px] mt-2 max-w-[240px]" style={{ color: "#8A8578" }}>
        {invoice?.client || "Your client"} will get a WhatsApp message with the link. You'll be notified the moment they pay.
      </div>

      <div
        className="mt-6 w-full flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
      >
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#8A8578" }} className="text-[11px] truncate">
          settu.app/pay/inv005x9k
        </span>
        <button onClick={() => setCopied(true)}>
          {copied ? <Check size={14} color="#1F8A5F" /> : <Copy size={14} color="#10261F" />}
        </button>
      </div>

      <button
        onClick={() => go("buyerview", invoice)}
        className="mt-4 text-[11.5px] font-semibold underline"
        style={{ color: "#B9781F" }}
      >
        Preview what your client sees →
      </button>

      <button
        onClick={() => go("home")}
        className="mt-8 w-full py-3.5 rounded-xl font-semibold text-[13.5px]"
        style={{ background: "#10261F", color: "#FFFFFF" }}
      >
        Back to dashboard
      </button>
    </div>
  );
}

// ---------- Buyer-facing pay page ----------
function BuyerView({ go, invoice }: InvoiceScreenProps) {
  const inv = invoice || seed.invoices[0];
  const lineItems: LineItem[] = inv.items && inv.items.length ? inv.items : [{ d: "Invoice total", q: 1, p: inv.amount }];
  const [paid, setPaid] = useState<boolean>(false);
  const amount = lineItems.reduce((s, it) => s + it.q * it.p, 0);
  const fee = Math.min(Math.round(amount * 0.015) + 100, 2000);

  if (paid) {
    return (
      <div className="pb-28 flex flex-col items-center px-6 pt-20 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#E7F3EC" }}>
          <Check size={26} color="#1F8A5F" />
        </div>
        <div className="text-[17px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
          Payment successful
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[26px] font-semibold mt-3 tabular-nums">
          {naira(amount + fee)}
        </div>
        <div className="text-[12px] mt-2" style={{ color: "#8A8578" }}>
          Paid to {seed.business.name} · Receipt sent to your email
        </div>
        <button
          onClick={() => go("home")}
          className="mt-10 w-full py-3.5 rounded-xl font-semibold text-[13px]"
          style={{ background: "#10261F", color: "#FFFFFF" }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="pb-32">
      <TopBar title="" onBack={() => go("share", invoice)} />
      <div className="px-5 -mt-2 flex flex-col items-center text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-semibold mb-3"
          style={{ background: "#10261F", color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {seed.business.initials}
        </div>
        <div className="text-[15px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
          {seed.business.name}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>{inv.quick ? "Payment request" : `Invoice ${inv.id}`}</div>
      </div>

      <div className="mx-5 mt-5 rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
        {lineItems.map((it, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 text-[12px]">
            <span style={{ color: "#3A362E" }}>{it.d} {it.q > 1 && <span style={{ color: "#8A8578" }}>× {it.q}</span>}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(it.q * it.p)}</span>
          </div>
        ))}
        <div className="mt-1 pt-2 flex items-center justify-between text-[12px]" style={{ borderTop: "1px dashed #D9CEB3" }}>
          <span style={{ color: "#8A8578" }}>Subtotal</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(amount)}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span style={{ color: "#8A8578" }}>Processing fee</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(fee)}</span>
        </div>
        <div className="mt-1.5 pt-2.5 flex items-center justify-between" style={{ borderTop: "1px solid #E4DCC8" }}>
          <span className="text-[13px] font-semibold" style={{ color: "#10261F" }}>Total payable</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[16px] font-semibold tabular-nums">
            {naira(amount + fee)}
          </span>
        </div>
      </div>

      <div className="px-5 mt-4">
        <Eyebrow>Your email</Eyebrow>
        <input
          placeholder="you@email.com"
          className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13px] outline-none"
          style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
        />
      </div>

      <div className="px-5 mt-4">
        <Eyebrow>Pay with</Eyebrow>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {["Card", "Transfer", "USSD"].map((m, i) => (
            <button
              key={m}
              className="py-2.5 rounded-lg text-[11.5px] font-medium"
              style={{
                background: i === 0 ? "#10261F" : "#FFFFFF",
                color: i === 0 ? "#FBF7EF" : "#10261F",
                border: "1px solid #E4DCC8",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          onClick={() => setPaid(true)}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          style={{ background: "#E7A33E", color: "#10261F" }}
        >
          Pay {naira(amount + fee)}
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          <ShieldCheck size={11} color="#8A8578" />
          <span className="text-[10px]" style={{ color: "#8A8578" }}>Secured checkout via Paystack</span>
        </div>
      </div>
    </div>
  );
}

// ---------- Profile ----------
function Profile() {
  const rows: [string, string][] = [
    ["Payout account", "GTBank •••• 4471"],
    ["WhatsApp number", "+234 803 xxx xx11"],
    ["Category", "Catering & Events"],
  ];

  return (
    <div className="pb-28">
      <TopBar title="Business profile" />
      <div className="px-5 mt-3 flex flex-col items-center text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-[16px] font-semibold mb-3"
          style={{ background: "#10261F", color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {seed.business.initials}
        </div>
        <div className="text-[15px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
          {seed.business.name}
        </div>
        <div className="text-[11.5px] mt-0.5" style={{ color: "#8A8578" }}>{seed.business.cat}</div>
      </div>

      <div className="px-5 mt-6 space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between p-3.5 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
            <span className="text-[12px]" style={{ color: "#8A8578" }}>{label}</span>
            <span className="text-[12.5px] font-medium" style={{ color: "#10261F" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Root ----------
const OVERLAY_SCREENS: Screen[] = ["waoverlay", "wacontacts", "wachat"];

interface TabDef {
  id: Screen;
  label: string;
  icon: any;
}

export default function SettuPrototype() {
  const [screen, setScreen] = useState<Screen>("home");
  const [overlay, setOverlay] = useState<Screen | null>(null);
  const [ctx, setCtx] = useState<Invoice | null>(null);

  const go: NavigateFn = (s, data) => {
    if (OVERLAY_SCREENS.includes(s)) {
      setOverlay(s);
    } else {
      setOverlay(null);
      setScreen(s);
    }
    if (data !== undefined) setCtx(data);
    window.scrollTo?.(0, 0);
  };

  const tabs: TabDef[] = [
    { id: "home", label: "Home", icon: Home },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "profile", label: "Profile", icon: User },
  ];

  const showNav = (["home", "invoices", "profile"] as Screen[]).includes(screen);

  let body: React.ReactNode;
  if (screen === "home") body = <Dashboard go={go} />;
  else if (screen === "invoices") body = <InvoicesList go={go} />;
  else if (screen === "create") body = <CreateInvoice go={go} />;
  else if (screen === "quickpay") body = <QuickPayment go={go} />;
  else if (screen === "preview") body = <InvoicePreview go={go} invoice={ctx} />;
  else if (screen === "requestpay") body = <RequestPayment go={go} invoice={ctx} />;
  else if (screen === "share") body = <ShareSheet go={go} invoice={ctx} />;
  else if (screen === "buyerview") body = <BuyerView go={go} invoice={ctx} />;
  else if (screen === "profile") body = <Profile />;

  return (
    <div className="w-full min-h-screen flex items-center justify-center md:py-8" style={{ background: "#EFE9DC" }}>
      <style>{`
        ${FONT_IMPORT}
        .settu-frame {
          width: 100%;
          min-height: 100vh;
          background: #F5F4F0;
        }
        .settu-nav {
          max-width: 100%;
        }
        @media (min-width: 768px) {
          .settu-frame {
            width: 390px;
            height: 844px;
            min-height: 0;
            border-radius: 2.5rem;
            border: 10px solid #10261F;
            box-shadow: 0 25px 60px -15px rgba(16,38,31,0.45);
            overflow: hidden;
          }
          .settu-nav {
            max-width: 390px;
          }
          .settu-notch {
            display: block !important;
          }
        }
      `}</style>
      <div className="relative settu-frame">
        {/* Notch (mockup only, hidden on real mobile viewports) */}
        <div className="settu-notch absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 rounded-b-2xl z-20" style={{ background: "#10261F", display: "none" }} />
        <div className="relative h-full overflow-y-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          {body}
        </div>

        {overlay === "waoverlay" && <ShareSheetOverlay go={go} invoice={ctx} />}
        {overlay === "wacontacts" && <WhatsAppContacts go={go} invoice={ctx} />}
        {overlay === "wachat" && <WhatsAppChat go={go} invoice={ctx} />}

        {showNav && !overlay && (
          <div
            className="settu-nav fixed bottom-0 left-0 right-0 mx-auto flex items-center justify-around py-3 px-6"
            style={{ background: "#FFFFFFEE", backdropFilter: "blur(8px)", borderTop: "1px solid #E4DCC8" }}
          >
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = screen === t.id;
              return (
                <button key={t.id} onClick={() => go(t.id)} className="flex flex-col items-center gap-1">
                  <Icon size={19} color={active ? "#10261F" : "#B4AC98"} strokeWidth={active ? 2.4 : 2} />
                  <span className="text-[9.5px] font-medium" style={{ color: active ? "#10261F" : "#B4AC98" }}>
                    {t.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => go("create")}
              className="w-11 h-11 rounded-full flex items-center justify-center -mt-1"
              style={{ background: "#E7A33E" }}
            >
              <Plus size={19} color="#10261F" strokeWidth={2.6} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}