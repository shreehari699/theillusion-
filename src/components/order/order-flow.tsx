"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/order-actions";
import { bookConfig, siteConfig } from "@/config/site";
import { Check, Upload, QrCode } from "lucide-react";

type Method = "UPI" | "PICKUP";
type Step = "details" | "payment";

/**
 * Two-step order flow:
 * 1) DETAILS — customer info + delivery method
 * 2) PAYMENT — for UPI: show real QR, customer pays from phone, uploads
 *    screenshot, clicks "Yes, I've Paid". For pickup: just confirm.
 * The whole thing posts to the createOrder server action.
 */
export function OrderFlow({
  userEmail,
  userName,
}: {
  userEmail: string;
  userName: string;
}) {
  const [step, setStep] = useState<Step>("details");
  const [method, setMethod] = useState<Method>("UPI");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // hold form field values across steps
  const [fields, setFields] = useState({
    fullName: userName,
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = bookConfig.price * qty;

  function goToPayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    // basic validation before showing payment
    if (!fields.fullName || !fields.phone) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (
      method === "UPI" &&
      (!fields.address || !fields.city || !fields.state || !fields.pincode)
    ) {
      setError("Please complete your delivery address.");
      return;
    }
    setStep("payment");
  }

  function submitOrder(formData: FormData) {
    setError(null);
    // inject held values + method + qty
    formData.set("fullName", fields.fullName);
    formData.set("email", userEmail);
    formData.set("phone", fields.phone);
    formData.set("address", fields.address);
    formData.set("city", fields.city);
    formData.set("state", fields.state);
    formData.set("pincode", fields.pincode);
    formData.set("quantity", String(qty));
    formData.set("paymentMethod", method);

    startTransition(async () => {
      const res = await createOrder(formData);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <Container className="max-w-4xl pb-section">
      {/* progress */}
      <div className="mb-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]">
        <span className={step === "details" ? "text-gold" : "text-paper/40"}>
          1 · Details
        </span>
        <span className="text-paper/20">—</span>
        <span className={step === "payment" ? "text-gold" : "text-paper/40"}>
          2 · Payment
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step === "details" ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <form onSubmit={goToPayment} className="grid gap-8 md:grid-cols-[1fr_320px]">
              {/* left: fields */}
              <div className="space-y-5">
                <h2 className="font-display text-2xl text-paper">Your details</h2>

                <Field label="Full name" value={fields.fullName}
                  onChange={(v) => setFields({ ...fields, fullName: v })} required />
                <Field label="Phone number" value={fields.phone} type="tel"
                  onChange={(v) => setFields({ ...fields, phone: v })} required />

                {/* delivery method */}
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-paper/50">
                    Delivery method
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <MethodCard active={method === "UPI"} onClick={() => setMethod("UPI")}
                      title="Pay online" sub="UPI · ships to you" />
                    <MethodCard active={method === "PICKUP"} onClick={() => setMethod("PICKUP")}
                      title="Reserve" sub="Pay on pickup" />
                  </div>
                </div>

                {method === "UPI" && (
                  <div className="space-y-5">
                    <Field label="Address" value={fields.address}
                      onChange={(v) => setFields({ ...fields, address: v })} required />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="City" value={fields.city}
                        onChange={(v) => setFields({ ...fields, city: v })} required />
                      <Field label="State" value={fields.state}
                        onChange={(v) => setFields({ ...fields, state: v })} required />
                    </div>
                    <Field label="Pincode" value={fields.pincode}
                      onChange={(v) => setFields({ ...fields, pincode: v })} required />
                  </div>
                )}
              </div>

              {/* right: summary */}
              <div className="h-fit rounded-2xl border border-paper/10 bg-ink-soft/60 p-6">
                <h3 className="mb-4 font-display text-lg text-paper">Order summary</h3>
                <SummaryRow label={siteConfig.name} value={`${bookConfig.currencySymbol}${bookConfig.price}`} />
                <div className="my-3 flex items-center justify-between">
                  <span className="text-sm text-paper/60">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}
                      className="grid h-7 w-7 place-items-center rounded-full border border-paper/20 text-paper">−</button>
                    <span className="w-4 text-center text-paper">{qty}</span>
                    <button type="button" onClick={() => setQty(qty + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full border border-paper/20 text-paper">+</button>
                  </div>
                </div>
                <div className="my-4 h-px bg-paper/10" />
                <SummaryRow label="Total" value={`${bookConfig.currencySymbol}${total}`} bold />
                {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
                <Button type="submit" size="lg" className="mt-6 w-full">Continue to payment</Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            {method === "UPI" ? (
              <form action={submitOrder} className="grid gap-8 md:grid-cols-2">
                {/* QR side */}
                <div className="rounded-2xl border border-paper/10 bg-paper p-6 text-center">
                  <div className="mb-3 flex items-center justify-center gap-2 text-ink">
                    <QrCode className="h-5 w-5" />
                    <span className="font-body text-sm font-semibold uppercase tracking-wider">Scan to pay</span>
                  </div>
                  <div className="mx-auto max-w-[280px]">
                    <Image src={bookConfig.qrImage} alt="UPI QR code"
                      width={280} height={360} className="w-full rounded-lg" />
                  </div>
                  <p className="mt-4 font-body text-sm text-ink/70">
                    Pay <strong>{bookConfig.currencySymbol}{total}</strong> to
                  </p>
                  <p className="font-mono text-sm font-semibold text-ink">{bookConfig.upiId}</p>
                </div>

                {/* upload + confirm side */}
                <div className="flex flex-col">
                  <h2 className="font-display text-2xl text-paper">Confirm your payment</h2>
                  <ol className="mt-4 space-y-2 text-sm text-paper/70">
                    <li>1. Scan the QR with any UPI app (GPay, PhonePe, Paytm).</li>
                    <li>2. Pay {bookConfig.currencySymbol}{total}.</li>
                    <li>3. Take a screenshot of the success screen.</li>
                    <li>4. Upload it below and confirm.</li>
                  </ol>

                  <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-paper/25 bg-ink-soft/40 px-4 py-8 text-center transition-colors hover:border-gold">
                    <Upload className="mb-2 h-6 w-6 text-gold" />
                    <span className="text-sm text-paper/70">
                      {fileName ?? "Upload payment screenshot"}
                    </span>
                    <input
                      type="file"
                      name="screenshot"
                      accept="image/*"
                      required
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>

                  {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

                  <div className="mt-6 flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep("details")}>Back</Button>
                    <Button type="submit" size="lg" className="flex-1" disabled={pending}>
                      {pending ? "Saving…" : "Yes, I've paid"}
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              // pickup: no payment now
              <form action={submitOrder} className="mx-auto max-w-lg text-center">
                <Check className="mx-auto mb-4 h-10 w-10 text-gold" />
                <h2 className="font-display text-2xl text-paper">Reserve your copy</h2>
                <p className="mt-3 text-paper/70">
                  Your copy will be held for you. Pay {bookConfig.currencySymbol}{total} when
                  you collect it. We&apos;ll be in touch to arrange pickup.
                </p>
                {error && <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
                <div className="mt-6 flex justify-center gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep("details")}>Back</Button>
                  <Button type="submit" size="lg" disabled={pending}>
                    {pending ? "Saving…" : "Confirm reservation"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wider text-paper/50">{label}</label>
      <input type={type} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-paper/15 bg-ink px-4 py-3 text-paper placeholder-paper/30 focus:border-gold focus:outline-none" />
    </div>
  );
}

function MethodCard({ active, onClick, title, sub }: {
  active: boolean; onClick: () => void; title: string; sub: string;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-xl border p-4 text-left transition-colors ${
        active ? "border-gold bg-gold/10" : "border-paper/15 hover:border-paper/30"
      }`}>
      <p className="font-display text-base text-paper">{title}</p>
      <p className="text-xs text-paper/50">{sub}</p>
    </button>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-display text-lg text-paper" : "text-sm text-paper/70"}>{label}</span>
      <span className={bold ? "font-display text-lg text-gold" : "text-sm text-paper"}>{value}</span>
    </div>
  );
}
