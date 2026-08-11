import React, { useState, useEffect } from "react";
import {
  ChevronLeft, ShieldCheck, Check, Copy, CreditCard, Landmark, Smartphone,
  Loader2, Clock, Download, ArrowRight
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

const naira = (n: number | string): string =>
  "₦" + Number(n).toLocaleString("en-NG", { maximumFractionDigits: 0 });

const seller = { name: "Jessy's Cuisine", cat: "Catering & Events", initials: "JC" };
const lineItems = [
  { d: "Jollof rice & grilled chicken (80 pax)", q: 80, p: 700 },
  { d: "Small chops platter", q: 5, p: 3200 },
  { d: "Delivery & setup", q: 1, p: 4000 },
];
const subtotal = lineItems.reduce((s, it) => s + it.q * it.p, 0);
const fee = Math.min(Math.round(subtotal * 0.015) + 100, 2000);
const total = subtotal + fee;

interface EyebrowProps {
  children: React.ReactNode;
  color?: string;
}

function Eyebrow({ children, color = "#8A8578" }: EyebrowProps) {
  return (
    <div
      style={{ fontFamily: "'IBM Plex Mono', monospace", color, letterSpacing: "0.08em" }}
      className="text-[10px] uppercase font-medium"
    >
      {children}
    </div>
  );
}

interface TopBarProps {
  title: string;
  onBack?: () => void;
}

function TopBar({ title, onBack }: TopBarProps) {
  return (
    <div className="flex items-center px-5 pt-5 pb-3">
      <div className="w-8">
        {onBack && (
          <button onClick={onBack} className="p-1 -ml-1 rounded-full active:bg-black/5">
            <ChevronLeft size={22} color="#10261F" />
          </button>
        )}
      </div>
      <div
        className="text-[14px] font-semibold tracking-tight mx-auto -ml-8"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}
      >
        {title}
      </div>
    </div>
  );
}

interface SellerHeaderProps {
  small?: boolean;
}

function SellerHeader({ small }: SellerHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`${small ? "w-11 h-11 text-[12px]" : "w-14 h-14 text-[14px]"} rounded-full flex items-center justify-center font-semibold mb-2.5`}
        style={{ background: "#10261F", color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {seller.initials}
      </div>
      <div className="text-[15px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
        {seller.name}
      </div>
      <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>{seller.cat}</div>
    </div>
  );
}

interface InvoiceViewProps {
  go: (screen: string, ctx?: any) => void;
}

// ---------- 1. Invoice / pay landing ----------
function InvoiceView({ go }: InvoiceViewProps) {
  const [email, setEmail] = useState("");
  const valid = /\S+@\S+\.\S+/.test(email);

  return (
    <div className="pb-32">
      <TopBar title="Payment request" />
      <div className="px-5 -mt-1">
        <SellerHeader />
        <div className="text-[11px] mt-1 text-center" style={{ color: "#8A8578" }}>Invoice INV-005</div>
      </div>

      <div className="mx-5 mt-5 rounded-2xl p-4" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
        {lineItems.map((it, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 text-[12px]">
            <span style={{ color: "#3A362E" }} className="pr-3">{it.d} <span style={{ color: "#8A8578" }}>× {it.q}</span></span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums whitespace-nowrap">{naira(it.q * it.p)}</span>
          </div>
        ))}
        <div className="mt-1 pt-2 flex items-center justify-between text-[12px]" style={{ borderTop: "1px dashed #D9CEB3" }}>
          <span style={{ color: "#8A8578" }}>Subtotal</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <span style={{ color: "#8A8578" }}>Processing fee</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="tabular-nums">{naira(fee)}</span>
        </div>
        <div className="mt-1.5 pt-2.5 flex items-center justify-between" style={{ borderTop: "1px solid #E4DCC8" }}>
          <span className="text-[13px] font-semibold" style={{ color: "#10261F" }}>Total payable</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[16px] font-semibold tabular-nums">
            {naira(total)}
          </span>
        </div>
      </div>

      <div className="px-5 mt-4">
        <Eyebrow>Your email</Eyebrow>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          type="email"
          className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13px] outline-none"
          style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
        />
        <div className="text-[10.5px] mt-1.5" style={{ color: "#8A8578" }}>Your receipt goes here after payment.</div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          disabled={!valid}
          onClick={() => go("method", { email })}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          style={{ background: valid ? "#10261F" : "#D9D2BF", color: valid ? "#FFFFFF" : "#8A8578" }}
        >
          Continue to pay {naira(total)}
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          <ShieldCheck size={11} color="#8A8578" />
          <span className="text-[10px]" style={{ color: "#8A8578" }}>Secured checkout via Paystack</span>
        </div>
      </div>
    </div>
  );
}

interface MethodSelectProps {
  go: (screen: string, ctx?: any) => void;
  ctx?: any;
}

// ---------- 2. Choose payment method ----------
function MethodSelect({ go, ctx }: MethodSelectProps) {
  const methods = [
    { id: "card", label: "Debit / credit card", sub: "Visa, Mastercard, Verve", icon: CreditCard },
    { id: "transfer", label: "Bank transfer", sub: "Pay from any bank app", icon: Landmark },
    { id: "ussd", label: "USSD", sub: "No internet or app needed", icon: Smartphone },
  ];
  return (
    <div className="pb-10">
      <TopBar title="Choose how to pay" onBack={() => go("invoice")} />
      <div className="px-5 -mt-1 text-center">
        <Eyebrow>Amount payable</Eyebrow>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[24px] font-semibold mt-1 tabular-nums">
          {naira(total)}
        </div>
      </div>

      <div className="px-5 mt-6 space-y-2.5">
        {methods.map((m: any) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => go(m.id, ctx)}
              className="w-full flex items-center gap-3.5 p-4 rounded-xl text-left active:scale-[0.98] transition-transform"
              style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#10261F10" }}>
                <Icon size={17} color="#10261F" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold" style={{ color: "#10261F" }}>{m.label}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "#8A8578" }}>{m.sub}</div>
              </div>
              <ArrowRight size={15} color="#B4AC98" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CardPayProps {
  go: (screen: string, ctx?: any) => void;
  ctx?: any;
}

// ---------- 3a. Card payment ----------
function CardPay({ go, ctx }: CardPayProps) {
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const formatCard = (v: string): string => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string): string => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  };

  const valid = number.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length === 3 && name.trim() !== "";

  return (
    <div className="pb-32">
      <TopBar title="Card payment" onBack={() => go("method", ctx)} />
      <div className="px-5 -mt-1 text-center mb-5">
        <Eyebrow>Amount</Eyebrow>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[20px] font-semibold mt-1 tabular-nums">
          {naira(total)}
        </div>
      </div>

      <div className="px-5 space-y-4">
        <div>
          <Eyebrow>Card number</Eyebrow>
          <input
            value={number}
            onChange={(e) => setNumber(formatCard(e.target.value))}
            placeholder="0000 0000 0000 0000"
            inputMode="numeric"
            className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none tabular-nums"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F", fontFamily: "'IBM Plex Mono', monospace" }}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Eyebrow>Expiry</Eyebrow>
            <input
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              inputMode="numeric"
              className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none tabular-nums"
              style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F", fontFamily: "'IBM Plex Mono', monospace" }}
            />
          </div>
          <div className="flex-1">
            <Eyebrow>CVV</Eyebrow>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
              placeholder="000"
              inputMode="numeric"
              className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none tabular-nums"
              style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F", fontFamily: "'IBM Plex Mono', monospace" }}
            />
          </div>
        </div>
        <div>
          <Eyebrow>Name on card</Eyebrow>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="As shown on card"
            className="w-full mt-2 px-3.5 py-3 rounded-xl text-[13.5px] outline-none"
            style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: "#10261F" }}
          />
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          disabled={!valid}
          onClick={() => go("processing", { ...ctx, method: "Card •••• " + number.slice(-4) })}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] active:scale-[0.98] transition-transform"
          style={{ background: valid ? "#E7A33E" : "#D9D2BF", color: valid ? "#10261F" : "#8A8578" }}
        >
          Pay {naira(total)}
        </button>
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          <ShieldCheck size={11} color="#8A8578" />
          <span className="text-[10px]" style={{ color: "#8A8578" }}>Encrypted & secured via Paystack</span>
        </div>
      </div>
    </div>
  );
}

interface TransferPayProps {
  go: (screen: string, ctx?: any) => void;
  ctx?: any;
}

// ---------- 3b. Bank transfer ----------
function TransferPay({ go, ctx }: TransferPayProps) {
  const [copied, setCopied] = useState(false);
  const acct = "9982017744";

  return (
    <div className="pb-32">
      <TopBar title="Bank transfer" onBack={() => go("method", ctx)} />
      <div className="px-5 -mt-1">
        <div className="text-center mb-4">
          <Eyebrow>Transfer exactly</Eyebrow>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[24px] font-semibold mt-1 tabular-nums">
            {naira(total)}
          </div>
          <div className="text-[11px] mt-1" style={{ color: "#8A8578" }}>to the account below, from any bank app or USSD</div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "#10261F" }}>
          <Eyebrow color="#9FB8AC">Account number</Eyebrow>
          <div className="flex items-center justify-between mt-1.5">
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#FBF7EF" }} className="text-[22px] font-semibold tracking-wider tabular-nums">
              {acct}
            </span>
            <button
              onClick={() => { navigator.clipboard?.writeText?.(acct); setCopied(true); }}
              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ background: copied ? "#1F8A5F22" : "#FFFFFF22", color: copied ? "#4ADE9C" : "#FFFFFF" }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid #1F4636" }}>
            <div>
              <Eyebrow color="#9FB8AC">Bank</Eyebrow>
              <div className="text-[13px] font-medium mt-0.5" style={{ color: "#FBF7EF" }}>Moniepoint MFB</div>
            </div>
            <div className="w-px h-8" style={{ background: "#1F4636" }} />
            <div>
              <Eyebrow color="#9FB8AC">Account name</Eyebrow>
              <div className="text-[13px] font-medium mt-0.5" style={{ color: "#FBF7EF" }}>SETTU-Jessys Cuisine</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: "#FDF2E2" }}>
          <Clock size={14} color="#B9781F" />
          <span className="text-[11px]" style={{ color: "#B9781F" }}>This account expires in 24 hours and is one-time use only.</span>
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          onClick={() => go("processing", { ...ctx, method: "Bank transfer" })}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] active:scale-[0.98] transition-transform"
          style={{ background: "#10261F", color: "#FFFFFF" }}
        >
          I've sent the money
        </button>
      </div>
    </div>
  );
}

interface UssdPayProps {
  go: (screen: string, ctx?: any) => void;
  ctx?: any;
}

// ---------- 3c. USSD ----------
function UssdPay({ go, ctx }: UssdPayProps) {
  const [copied, setCopied] = useState(false);
  const code = `*737*000*${total}#`;

  return (
    <div className="pb-32">
      <TopBar title="Pay with USSD" onBack={() => go("method", ctx)} />
      <div className="px-5 -mt-1">
        <div className="text-center mb-4">
          <Eyebrow>Dial this code</Eyebrow>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[26px] font-semibold mt-1 tabular-nums">
            {code}
          </div>
          <div className="text-[11px] mt-1" style={{ color: "#8A8578" }}>from the phone linked to your bank account</div>
        </div>

        <button
          onClick={() => { navigator.clipboard?.writeText?.(code); setCopied(true); }}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-[12.5px] font-semibold"
          style={{ background: "#FFFFFF", border: "1px solid #E4DCC8", color: copied ? "#1F8A5F" : "#10261F" }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied to clipboard" : "Copy code"}
        </button>

        <div className="mt-5 space-y-2.5">
          <Eyebrow>How it works</Eyebrow>
          {[
            "Dial the code on your phone's dial pad",
            "Follow the prompt to confirm the amount",
            "Enter your bank PIN to approve",
          ].map((s: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold mt-0.5"
                style={{ background: "#10261F", color: "#FFFFFF" }}
              >
                {i + 1}
              </div>
              <span className="text-[12px]" style={{ color: "#3A362E" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settu-nav fixed bottom-0 left-0 right-0 mx-auto p-4" style={{ background: "linear-gradient(transparent, #F5F4F0 30%)" }}>
        <button
          onClick={() => go("processing", { ...ctx, method: "USSD" })}
          className="w-full py-3.5 rounded-xl font-semibold text-[13.5px] active:scale-[0.98] transition-transform"
          style={{ background: "#10261F", color: "#FFFFFF" }}
        >
          I've completed the transfer
        </button>
      </div>
    </div>
  );
}

interface ProcessingProps {
  go: (screen: string, ctx?: any) => void;
  ctx?: any;
}

// ---------- 4. Processing ----------
function Processing({ go, ctx }: ProcessingProps) {
  useEffect(() => {
    const t = setTimeout(() => go("success", ctx), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="pb-10 flex flex-col items-center justify-center text-center" style={{ minHeight: "560px" }}>
      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: "#EFEAE0" }}>
        <Loader2 size={22} color="#10261F" className="animate-spin" />
      </div>
      <div className="text-[14.5px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
        Confirming your payment
      </div>
      <div className="text-[11.5px] mt-2 max-w-55" style={{ color: "#8A8578" }}>
        This usually takes a few seconds. Please don't close this page.
      </div>
    </div>
  );
}

interface SuccessProps {
  go: (screen: string, ctx?: any) => void;
  ctx?: any;
}

// ---------- 5. Success / receipt ----------
function Success({ go, ctx }: SuccessProps) {
  const ref = "SETTU-8X72KQ";
  return (
    <div className="pb-10 flex flex-col items-center px-6 pt-14 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#E7F3EC" }}>
        <Check size={26} color="#1F8A5F" />
      </div>
      <div className="text-[17px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
        Payment successful
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }} className="text-[28px] font-semibold mt-3 tabular-nums">
        {naira(total)}
      </div>
      <div className="text-[12px] mt-1.5" style={{ color: "#8A8578" }}>
        Paid to {seller.name} · {ctx?.method || "Card"}
      </div>

      <div className="mt-6 w-full rounded-xl p-4 space-y-2" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
        <div className="flex items-center justify-between text-[11.5px]">
          <span style={{ color: "#8A8578" }}>Reference</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }}>{ref}</span>
        </div>
        <div className="flex items-center justify-between text-[11.5px]">
          <span style={{ color: "#8A8578" }}>Invoice</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#10261F" }}>INV-005</span>
        </div>
        <div className="flex items-center justify-between text-[11.5px]">
          <span style={{ color: "#8A8578" }}>Receipt sent to</span>
          <span style={{ color: "#10261F" }}>{ctx?.email || "you@email.com"}</span>
        </div>
      </div>

      <button
        className="mt-3 w-full py-3 rounded-xl font-semibold text-[12.5px] flex items-center justify-center gap-1.5"
        style={{ background: "#FFFFFF", border: "1px solid #10261F", color: "#10261F" }}
      >
        <Download size={14} /> Download receipt
      </button>

      <button
        onClick={() => go("invoice")}
        className="mt-8 w-full py-3.5 rounded-xl font-semibold text-[13.5px]"
        style={{ background: "#10261F", color: "#FFFFFF" }}
      >
        Done
      </button>
    </div>
  );
}

// ---------- Edge cases ----------
function LinkExpired() {
  return (
    <div className="pb-10 flex flex-col items-center px-6 pt-20 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#F6E9E7" }}>
        <Clock size={24} color="#C1483D" />
      </div>
      <div className="text-[16px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
        This link has expired
      </div>
      <div className="text-[12px] mt-2 max-w-60" style={{ color: "#8A8578" }}>
        Payment links are valid for 24 hours. Ask {seller.name} to send you a new one.
      </div>
    </div>
  );
}

function AlreadyPaid() {
  return (
    <div className="pb-10 flex flex-col items-center px-6 pt-20 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#EDEBFB" }}>
        <ShieldCheck size={24} color="#5B4FC2" />
      </div>
      <div className="text-[16px] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#10261F" }}>
        This invoice is already paid
      </div>
      <div className="text-[12px] mt-2 max-w-60" style={{ color: "#8A8578" }}>
        A payment for INV-005 was already confirmed. Each link can only be used once.
      </div>
    </div>
  );
}

// ---------- Root ----------
export default function SettuBuyerPrototype() {
  const [screen, setScreen] = useState<string>("invoice");
  const [ctx, setCtx] = useState<any>(null);
  const [scenario, setScenario] = useState<string>("active");

  const go = (s: string, data?: any): void => {
    setScreen(s);
    if (data !== undefined) setCtx(data);
    window.scrollTo?.(0, 0);
  };

  let body: React.ReactNode;
  if (scenario === "expired") body = <LinkExpired />;
  else if (scenario === "paid") body = <AlreadyPaid />;
  else if (screen === "invoice") body = <InvoiceView go={go} />;
  else if (screen === "method") body = <MethodSelect go={go} ctx={ctx} />;
  else if (screen === "card") body = <CardPay go={go} ctx={ctx} />;
  else if (screen === "transfer") body = <TransferPay go={go} ctx={ctx} />;
  else if (screen === "ussd") body = <UssdPay go={go} ctx={ctx} />;
  else if (screen === "processing") body = <Processing go={go} ctx={ctx} />;
  else if (screen === "success") body = <Success go={go} ctx={ctx} />;

  const scenarios = [
    { id: "active", label: "Active link" },
    { id: "expired", label: "Expired" },
    { id: "paid", label: "Already paid" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center md:py-8 gap-4" style={{ background: "#EFE9DC" }}>
      <style>{`
        ${FONT_IMPORT}
        .settu-frame {
          width: 100%;
          min-height: 100vh;
          background: #F5F4F0;
        }
        .settu-nav { max-width: 100%; }
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
          .settu-nav { max-width: 390px; }
          .settu-notch { display: block !important; }
        }
      `}</style>

      {/* Demo scenario switcher — not part of the real product UI */}
      <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full" style={{ background: "#FFFFFF", border: "1px solid #E4DCC8" }}>
        {scenarios.map((s: any) => (
          <button
            key={s.id}
            onClick={() => { setScenario(s.id); go("invoice"); }}
            className="px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
            style={{
              background: scenario === s.id ? "#10261F" : "transparent",
              color: scenario === s.id ? "#FBF7EF" : "#8A8578",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="relative settu-frame">
        <div className="settu-notch absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 rounded-b-2xl z-20" style={{ background: "#10261F", display: "none" }} />
        <div className="relative h-full overflow-y-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          {body}
        </div>
      </div>
    </div>
  );
}
