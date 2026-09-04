"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  DollarSign, 
  Plus, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  Percent,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  AlertCircle,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Send,
  RotateCcw,
  Globe2,
  Calendar,
  User,
  Activity,
  Layers,
  Check,
  Ban,
  ArrowDownRight
} from "lucide-react";

interface BillItem {
  id: string;
  category: "Medical/Surgical" | "Hospital Room/Care" | "Consultation" | "Accommodation & Logistics" | "Taxes & Regulatory Fees" | "Other";
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNo: string;
  caseId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientCountry: string;
  hospital: string;
  treatment: string;
  currency: "USD" | "EUR" | "GBP" | "AED" | "SAR" | "INR";
  exchangeRateToINR: number;
  items: BillItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number; // in billing currency
  totalAmountINR: number;
  amountPaid: number;
  balanceDue: number;
  status: "Draft" | "Issued" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled" | "Refunded";
  issueDate: string;
  dueDate: string;
  notes: string;
  paymentMethod?: string;
  paymentReference?: string;
  escrowStatus: "Pending Deposit" | "Escrow Held" | "Disbursed to Hospital" | "Refunded";
  createdAt: string;
}

interface PaymentRecord {
  id: string;
  receiptNo: string;
  invoiceNo: string;
  patientName: string;
  amount: number;
  currency: "USD" | "EUR" | "GBP" | "AED" | "SAR" | "INR";
  exchangeRateToINR: number;
  amountINR: number;
  paymentMethod: "International Wire / SWIFT" | "Credit/Debit Card (Stripe)" | "Escrow Deposit" | "UPI / NetBanking" | "Cash at Hospital Desk";
  transactionRef: string;
  paymentDate: string;
  status: "Successful" | "Pending" | "Failed" | "Refunded" | "Cancelled";
  notes?: string;
  createdAt: string;
}

interface ForexRate {
  id: string;
  currency: "USD" | "EUR" | "GBP" | "AED" | "SAR";
  name: string;
  symbol: string;
  rateToINR: number;
  inverseRate: number;
  lastUpdated: string;
  effectiveDate: string;
  source: string;
  status: "Active" | "Inactive";
}

interface RefundRecord {
  id: string;
  refundNo: string;
  invoiceNo: string;
  patientName: string;
  originalAmount: number;
  refundAmount: number;
  currency: "USD" | "EUR" | "GBP" | "AED" | "SAR" | "INR";
  reason: string;
  status: "Approved" | "Pending Review" | "Processed" | "Rejected";
  requestedDate: string;
  processedDate?: string;
  transactionRef?: string;
  notes?: string;
}

const DEFAULT_FOREX_RATES: ForexRate[] = [
  { id: "fx-1", currency: "USD", name: "US Dollar", symbol: "$", rateToINR: 83.50, inverseRate: 0.01198, lastUpdated: "2026-09-04 09:00 IST", effectiveDate: "2026-09-04", source: "Reserve Bank of India Reference Rate", status: "Active" },
  { id: "fx-2", currency: "EUR", name: "Euro", symbol: "€", rateToINR: 90.25, inverseRate: 0.01108, lastUpdated: "2026-09-04 09:00 IST", effectiveDate: "2026-09-04", source: "European Central Bank Reference Rate", status: "Active" },
  { id: "fx-3", currency: "GBP", name: "British Pound", symbol: "£", rateToINR: 106.80, inverseRate: 0.00936, lastUpdated: "2026-09-04 09:00 IST", effectiveDate: "2026-09-04", source: "Bank of England Reference Rate", status: "Active" },
  { id: "fx-4", currency: "AED", name: "UAE Dirham", symbol: "AED", rateToINR: 22.74, inverseRate: 0.04398, lastUpdated: "2026-09-04 09:00 IST", effectiveDate: "2026-09-04", source: "Central Bank of UAE Peg", status: "Active" },
  { id: "fx-5", currency: "SAR", name: "Saudi Riyal", symbol: "SAR", rateToINR: 22.26, inverseRate: 0.04492, lastUpdated: "2026-09-04 09:00 IST", effectiveDate: "2026-09-04", source: "Saudi Central Bank Peg", status: "Active" },
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNo: "INV-2026-042",
    caseId: "CAS-2026-089",
    patientId: "pat-101",
    patientName: "Sarah Jenkins",
    patientEmail: "sarah.j@example.com",
    patientCountry: "United Kingdom",
    hospital: "Aster Medcity, Kochi",
    treatment: "Total Knee Replacement (Bilateral)",
    currency: "GBP",
    exchangeRateToINR: 106.80,
    items: [
      { id: "itm-1", category: "Medical/Surgical", description: "Bilateral Robotic Knee Arthroplasty (Implants Included)", amount: 3800 },
      { id: "itm-2", category: "Hospital Room/Care", description: "Deluxe Suite 5 Nights & 24/7 Nursing", amount: 650 },
      { id: "itm-3", category: "Consultation", description: "Pre-Op & Post-Op Orthopedic Surgeon Consultations", amount: 250 },
      { id: "itm-4", category: "Accommodation & Logistics", description: "Airport Chauffeur & 7-Day Recovery Resort Stay", amount: 450 },
      { id: "itm-5", category: "Taxes & Regulatory Fees", description: "Medical Visa Invitation & Statutory Levies", amount: 150 },
    ],
    subtotal: 5300,
    discount: 300,
    taxRate: 5,
    taxAmount: 250,
    totalAmount: 5250,
    totalAmountINR: 560700,
    amountPaid: 5250,
    balanceDue: 0,
    status: "Paid",
    issueDate: "2026-08-28",
    dueDate: "2026-09-02",
    notes: "Full payment secured in MAIDES Escrow account. Released to Aster Medcity post-surgery.",
    paymentMethod: "International Wire / SWIFT",
    paymentReference: "SWIFT-BARC-GB29-881923",
    escrowStatus: "Disbursed to Hospital",
    createdAt: "2026-08-28T10:00:00Z"
  },
  {
    id: "inv-2",
    invoiceNo: "INV-2026-041",
    caseId: "CAS-2026-088",
    patientId: "pat-102",
    patientName: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@uaebiz.ae",
    patientCountry: "United Arab Emirates",
    hospital: "Amrita Institute of Medical Sciences, Kochi",
    treatment: "Robotic Mitral Valve Surgery",
    currency: "AED",
    exchangeRateToINR: 22.74,
    items: [
      { id: "itm-6", category: "Medical/Surgical", description: "Robotic Minimally Invasive Mitral Valve Repair", amount: 34000 },
      { id: "itm-7", category: "Hospital Room/Care", description: "ICU 2 Days + Executive Suite 6 Days", amount: 6200 },
      { id: "itm-8", category: "Consultation", description: "Senior Cardiothoracic Consult & Tele-followups", amount: 1800 },
      { id: "itm-9", category: "Accommodation & Logistics", description: "VIP Airport Chauffeur (Mercedes V-Class) + Translator", amount: 2000 },
    ],
    subtotal: 44000,
    discount: 2000,
    taxRate: 0,
    taxAmount: 0,
    totalAmount: 42000,
    totalAmountINR: 955080,
    amountPaid: 21000,
    balanceDue: 21000,
    status: "Partially Paid",
    issueDate: "2026-09-01",
    dueDate: "2026-09-10",
    notes: "50% advance deposit received in escrow. Balance payable upon hospital admission.",
    paymentMethod: "Credit/Debit Card (Stripe)",
    paymentReference: "pi_3Mtw284kjas88923",
    escrowStatus: "Escrow Held",
    createdAt: "2026-09-01T14:30:00Z"
  },
  {
    id: "inv-3",
    invoiceNo: "INV-2026-040",
    caseId: "CAS-2026-085",
    patientId: "pat-103",
    patientName: "Elena Rostova",
    patientEmail: "elena.rostova@berlin-care.de",
    patientCountry: "Germany",
    hospital: "Somatheeram Ayurvedic Village, Kovalam",
    treatment: "Panchakarma Detox & Spine Rejuvenation (14 Days)",
    currency: "EUR",
    exchangeRateToINR: 90.25,
    items: [
      { id: "itm-10", category: "Medical/Surgical", description: "14-Day Ayurvedic Physician Supervised Panchakarma", amount: 2400 },
      { id: "itm-11", category: "Hospital Room/Care", description: "Sea-Facing Heritage Cottage Stay", amount: 1200 },
      { id: "itm-12", category: "Accommodation & Logistics", description: "Organic Ayurvedic Meal Plan & Airport Pickup", amount: 400 },
    ],
    subtotal: 4000,
    discount: 150,
    taxRate: 5,
    taxAmount: 192.5,
    totalAmount: 4042.5,
    totalAmountINR: 364835.6,
    amountPaid: 4042.5,
    balanceDue: 0,
    status: "Paid",
    issueDate: "2026-08-15",
    dueDate: "2026-08-20",
    notes: "Settled in full via Escrow. Treatment successfully concluded.",
    paymentMethod: "International Wire / SWIFT",
    paymentReference: "DEUT-EUR-8849102",
    escrowStatus: "Disbursed to Hospital",
    createdAt: "2026-08-15T09:15:00Z"
  },
  {
    id: "inv-4",
    invoiceNo: "INV-2026-039",
    caseId: "CAS-2026-082",
    patientId: "pat-104",
    patientName: "David Miller",
    patientEmail: "david.miller@austech.com.au",
    patientCountry: "Australia",
    hospital: "Rajagiri Hospital, Aluva",
    treatment: "Laser Spine Decompression",
    currency: "USD",
    exchangeRateToINR: 83.50,
    items: [
      { id: "itm-13", category: "Medical/Surgical", description: "Endoscopic Lumbar Spine Surgery", amount: 4500 },
      { id: "itm-14", category: "Hospital Room/Care", description: "Single Private Room 3 Days", amount: 400 },
      { id: "itm-15", category: "Consultation", description: "Neurosurgeon Consultation & Diagnostics", amount: 300 },
    ],
    subtotal: 5200,
    discount: 0,
    taxRate: 5,
    taxAmount: 260,
    totalAmount: 5460,
    totalAmountINR: 455910,
    amountPaid: 0,
    balanceDue: 5460,
    status: "Issued",
    issueDate: "2026-09-03",
    dueDate: "2026-09-12",
    notes: "Awaiting patient confirmation of travel dates and deposit transfer.",
    escrowStatus: "Pending Deposit",
    createdAt: "2026-09-03T11:00:00Z"
  }
];

const DEFAULT_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-1",
    receiptNo: "REC-2026-0091",
    invoiceNo: "INV-2026-042",
    patientName: "Sarah Jenkins",
    amount: 5250,
    currency: "GBP",
    exchangeRateToINR: 106.80,
    amountINR: 560700,
    paymentMethod: "International Wire / SWIFT",
    transactionRef: "SWIFT-BARC-GB29-881923",
    paymentDate: "2026-09-01",
    status: "Successful",
    notes: "Cleared in MAIDES London Escrow Vault. Converted at spot rate.",
    createdAt: "2026-09-01T12:00:00Z"
  },
  {
    id: "pay-2",
    receiptNo: "REC-2026-0090",
    invoiceNo: "INV-2026-041",
    patientName: "Mohammed Al-Maktoum",
    amount: 21000,
    currency: "AED",
    exchangeRateToINR: 22.74,
    amountINR: 477540,
    paymentMethod: "Credit/Debit Card (Stripe)",
    transactionRef: "pi_3Mtw284kjas88923",
    paymentDate: "2026-09-02",
    status: "Successful",
    notes: "Initial 50% commitment escrow deposit.",
    createdAt: "2026-09-02T16:20:00Z"
  },
  {
    id: "pay-3",
    receiptNo: "REC-2026-0089",
    invoiceNo: "INV-2026-040",
    patientName: "Elena Rostova",
    amount: 4042.5,
    currency: "EUR",
    exchangeRateToINR: 90.25,
    amountINR: 364835.6,
    paymentMethod: "International Wire / SWIFT",
    transactionRef: "DEUT-EUR-8849102",
    paymentDate: "2026-08-18",
    status: "Successful",
    notes: "Settled 100% upfront.",
    createdAt: "2026-08-18T10:10:00Z"
  }
];

const DEFAULT_REFUNDS: RefundRecord[] = [
  {
    id: "ref-1",
    refundNo: "REF-2026-0012",
    invoiceNo: "INV-2026-037",
    patientName: "John Henderson",
    originalAmount: 3200,
    refundAmount: 3200,
    currency: "USD",
    reason: "Patient visa denied by consulate prior to departure. Full escrow refundable per policy.",
    status: "Processed",
    requestedDate: "2026-08-20",
    processedDate: "2026-08-22",
    transactionRef: "STRIPE-REF-992140",
    notes: "100% funds released back to patient US bank account without penalty."
  }
];

export default function InvoicesAndPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "invoices" | "payments" | "forex" | "refunds">("dashboard");
  
  // Data State with LocalStorage
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [forexRates, setForexRates] = useState<ForexRate[]>([]);
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currencyFilter, setCurrencyFilter] = useState("ALL");

  // Modals
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isForexModalOpen, setIsForexModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // New Invoice Form State
  const [newInvoiceData, setNewInvoiceData] = useState<Partial<Invoice>>({
    invoiceNo: "",
    caseId: "",
    patientName: "",
    patientEmail: "",
    patientCountry: "United States",
    hospital: "Aster Medcity, Kochi",
    treatment: "",
    currency: "USD",
    exchangeRateToINR: 83.50,
    discount: 0,
    taxRate: 5,
    status: "Issued",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "Escrow funds protected by MAIDES Kerala Medical Tourism Guarantee.",
    escrowStatus: "Pending Deposit",
    items: [
      { id: "item-1", category: "Medical/Surgical", description: "Procedure / Surgery Package", amount: 4500 },
      { id: "item-2", category: "Hospital Room/Care", description: "In-patient Hospital Stay & Nursing", amount: 600 },
      { id: "item-3", category: "Consultation", description: "Specialist Pre & Post-op Consultations", amount: 200 },
    ]
  });

  // Record Payment Form State
  const [newPaymentData, setNewPaymentData] = useState<Partial<PaymentRecord>>({
    invoiceNo: "",
    patientName: "",
    amount: 0,
    currency: "USD",
    exchangeRateToINR: 83.50,
    paymentMethod: "Credit/Debit Card (Stripe)",
    transactionRef: "",
    paymentDate: new Date().toISOString().split("T")[0],
    status: "Successful",
    notes: ""
  });

  // Forex Form State
  const [forexEditData, setForexEditData] = useState<ForexRate | null>(null);

  // Refund Form State
  const [newRefundData, setNewRefundData] = useState<Partial<RefundRecord>>({
    invoiceNo: "",
    patientName: "",
    originalAmount: 0,
    refundAmount: 0,
    currency: "USD",
    reason: "",
    status: "Pending Review",
    requestedDate: new Date().toISOString().split("T")[0],
    notes: ""
  });

  // Initial Load from LocalStorage
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem("maides_admin_invoices_v3");
      const savedPayments = localStorage.getItem("maides_admin_payments_v3");
      const savedForex = localStorage.getItem("maides_admin_forex_v3");
      const savedRefunds = localStorage.getItem("maides_admin_refunds_v3");

      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));
      else {
        setInvoices(DEFAULT_INVOICES);
        localStorage.setItem("maides_admin_invoices_v3", JSON.stringify(DEFAULT_INVOICES));
      }

      if (savedPayments) setPayments(JSON.parse(savedPayments));
      else {
        setPayments(DEFAULT_PAYMENTS);
        localStorage.setItem("maides_admin_payments_v3", JSON.stringify(DEFAULT_PAYMENTS));
      }

      if (savedForex) setForexRates(JSON.parse(savedForex));
      else {
        setForexRates(DEFAULT_FOREX_RATES);
        localStorage.setItem("maides_admin_forex_v3", JSON.stringify(DEFAULT_FOREX_RATES));
      }

      if (savedRefunds) setRefunds(JSON.parse(savedRefunds));
      else {
        setRefunds(DEFAULT_REFUNDS);
        localStorage.setItem("maides_admin_refunds_v3", JSON.stringify(DEFAULT_REFUNDS));
      }
    } catch (e) {
      console.error("Failed to load financial state from localStorage", e);
      setInvoices(DEFAULT_INVOICES);
      setPayments(DEFAULT_PAYMENTS);
      setForexRates(DEFAULT_FOREX_RATES);
      setRefunds(DEFAULT_REFUNDS);
    }
  }, []);

  const saveInvoices = (data: Invoice[]) => {
    setInvoices(data);
    localStorage.setItem("maides_admin_invoices_v3", JSON.stringify(data));
  };

  const savePayments = (data: PaymentRecord[]) => {
    setPayments(data);
    localStorage.setItem("maides_admin_payments_v3", JSON.stringify(data));
  };

  const saveForexRates = (data: ForexRate[]) => {
    setForexRates(data);
    localStorage.setItem("maides_admin_forex_v3", JSON.stringify(data));
  };

  const saveRefunds = (data: RefundRecord[]) => {
    setRefunds(data);
    localStorage.setItem("maides_admin_refunds_v3", JSON.stringify(data));
  };

  // Helper Calculations
  const calculateInvoiceTotals = (items: BillItem[], discount: number, taxRate: number, rateToINR: number) => {
    const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const afterDiscount = Math.max(0, subtotal - (Number(discount) || 0));
    const taxAmount = (afterDiscount * (Number(taxRate) || 0)) / 100;
    const totalAmount = afterDiscount + taxAmount;
    const totalAmountINR = totalAmount * (rateToINR || 83.5);
    return { subtotal, taxAmount, totalAmount, totalAmountINR };
  };

  // Create or Update Invoice
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceData.patientName || !newInvoiceData.treatment) {
      alert("Please enter patient name and treatment details.");
      return;
    }

    const items = newInvoiceData.items || [];
    const discount = Number(newInvoiceData.discount) || 0;
    const taxRate = Number(newInvoiceData.taxRate) || 0;
    const rateToINR = Number(newInvoiceData.exchangeRateToINR) || 83.50;

    const { subtotal, taxAmount, totalAmount, totalAmountINR } = calculateInvoiceTotals(items, discount, taxRate, rateToINR);

    const paid = Number(newInvoiceData.amountPaid) || 0;
    const balanceDue = Math.max(0, totalAmount - paid);

    let calculatedStatus = newInvoiceData.status || "Issued";
    if (paid >= totalAmount && totalAmount > 0) calculatedStatus = "Paid";
    else if (paid > 0 && paid < totalAmount) calculatedStatus = "Partially Paid";

    if (editingInvoice) {
      const updated = invoices.map(inv => inv.id === editingInvoice.id ? {
        ...inv,
        ...newInvoiceData,
        items,
        subtotal,
        discount,
        taxRate,
        taxAmount,
        totalAmount,
        totalAmountINR,
        amountPaid: paid,
        balanceDue,
        status: calculatedStatus as Invoice["status"],
      } as Invoice : inv);
      saveInvoices(updated);
    } else {
      const newInv: Invoice = {
        id: "inv-" + Date.now(),
        invoiceNo: newInvoiceData.invoiceNo || `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        caseId: newInvoiceData.caseId || `CAS-2026-${Math.floor(100 + Math.random() * 900)}`,
        patientId: "pat-" + Math.floor(100 + Math.random() * 900),
        patientName: newInvoiceData.patientName || "",
        patientEmail: newInvoiceData.patientEmail || "",
        patientCountry: newInvoiceData.patientCountry || "United States",
        hospital: newInvoiceData.hospital || "Aster Medcity, Kochi",
        treatment: newInvoiceData.treatment || "",
        currency: (newInvoiceData.currency as Invoice["currency"]) || "USD",
        exchangeRateToINR: rateToINR,
        items,
        subtotal,
        discount,
        taxRate,
        taxAmount,
        totalAmount,
        totalAmountINR,
        amountPaid: paid,
        balanceDue,
        status: calculatedStatus as Invoice["status"],
        issueDate: newInvoiceData.issueDate || new Date().toISOString().split("T")[0],
        dueDate: newInvoiceData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: newInvoiceData.notes || "",
        escrowStatus: (newInvoiceData.escrowStatus as Invoice["escrowStatus"]) || "Pending Deposit",
        createdAt: new Date().toISOString()
      };
      saveInvoices([newInv, ...invoices]);
    }

    setIsInvoiceModalOpen(false);
    setEditingInvoice(null);
  };

  // Void / Cancel Invoice
  const handleVoidInvoice = (id: string) => {
    if (confirm("Are you sure you want to void/cancel this invoice? This will keep audit records intact.")) {
      const updated = invoices.map(inv => inv.id === id ? { ...inv, status: "Cancelled" as const, escrowStatus: "Refunded" as const } : inv);
      saveInvoices(updated);
    }
  };

  // Add Item to New Invoice Form
  const handleAddItem = () => {
    const newItem: BillItem = {
      id: "itm-" + Date.now(),
      category: "Medical/Surgical",
      description: "Additional Medical Item",
      amount: 500
    };
    setNewInvoiceData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setNewInvoiceData(prev => ({
      ...prev,
      items: (prev.items || []).filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: any) => {
    const updatedItems = [...(newInvoiceData.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewInvoiceData(prev => ({ ...prev, items: updatedItems }));
  };

  // Record New Payment
  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentData.invoiceNo || !newPaymentData.amount || Number(newPaymentData.amount) <= 0) {
      alert("Please select an invoice and enter a valid payment amount.");
      return;
    }

    const matchedInvoice = invoices.find(inv => inv.invoiceNo === newPaymentData.invoiceNo);
    const rateToINR = newPaymentData.exchangeRateToINR || (matchedInvoice ? matchedInvoice.exchangeRateToINR : 83.50);
    const amountINR = Number(newPaymentData.amount) * rateToINR;

    const newPayment: PaymentRecord = {
      id: "pay-" + Date.now(),
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNo: newPaymentData.invoiceNo || "",
      patientName: matchedInvoice ? matchedInvoice.patientName : (newPaymentData.patientName || "Patient"),
      amount: Number(newPaymentData.amount),
      currency: (newPaymentData.currency as PaymentRecord["currency"]) || "USD",
      exchangeRateToINR: rateToINR,
      amountINR: amountINR,
      paymentMethod: newPaymentData.paymentMethod as PaymentRecord["paymentMethod"] || "Credit/Debit Card (Stripe)",
      transactionRef: newPaymentData.transactionRef || `TXN-${Date.now().toString().slice(-8)}`,
      paymentDate: newPaymentData.paymentDate || new Date().toISOString().split("T")[0],
      status: "Successful",
      notes: newPaymentData.notes || "Recorded via MAIDES Admin Gateway",
      createdAt: new Date().toISOString()
    };

    savePayments([newPayment, ...payments]);

    // Update target invoice balance
    if (matchedInvoice) {
      const updatedPaid = (matchedInvoice.amountPaid || 0) + Number(newPaymentData.amount);
      const newBalance = Math.max(0, matchedInvoice.totalAmount - updatedPaid);
      let newStatus: Invoice["status"] = matchedInvoice.status;
      let newEscrow: Invoice["escrowStatus"] = matchedInvoice.escrowStatus;

      if (updatedPaid >= matchedInvoice.totalAmount) {
        newStatus = "Paid";
        newEscrow = "Escrow Held";
      } else if (updatedPaid > 0) {
        newStatus = "Partially Paid";
        newEscrow = "Escrow Held";
      }

      const updatedInvoices = invoices.map(inv => inv.id === matchedInvoice.id ? {
        ...inv,
        amountPaid: updatedPaid,
        balanceDue: newBalance,
        status: newStatus,
        escrowStatus: newEscrow
      } : inv);
      saveInvoices(updatedInvoices);
    }

    setIsPaymentModalOpen(false);
    setNewPaymentData({
      invoiceNo: "",
      patientName: "",
      amount: 0,
      currency: "USD",
      exchangeRateToINR: 83.50,
      paymentMethod: "Credit/Debit Card (Stripe)",
      transactionRef: "",
      paymentDate: new Date().toISOString().split("T")[0],
      status: "Successful",
      notes: ""
    });
  };

  // Update Forex Rate
  const handleSaveForexRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forexEditData) return;
    const rate = Number(forexEditData.rateToINR);
    if (!rate || rate <= 0) {
      alert("Please enter a valid exchange rate.");
      return;
    }
    const inverseRate = Number((1 / rate).toFixed(6));
    const updated = forexRates.map(fx => fx.id === forexEditData.id ? {
      ...forexEditData,
      rateToINR: rate,
      inverseRate: inverseRate,
      lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 16) + " IST"
    } : fx);
    saveForexRates(updated);
    setIsForexModalOpen(false);
    setForexEditData(null);
  };

  // Create Refund Request
  const handleSaveRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRefundData.invoiceNo || !newRefundData.refundAmount) {
      alert("Please select an invoice and enter the refund amount.");
      return;
    }
    const matchedInvoice = invoices.find(inv => inv.invoiceNo === newRefundData.invoiceNo);
    const newRef: RefundRecord = {
      id: "ref-" + Date.now(),
      refundNo: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNo: newRefundData.invoiceNo,
      patientName: matchedInvoice ? matchedInvoice.patientName : "Patient",
      originalAmount: matchedInvoice ? matchedInvoice.totalAmount : Number(newRefundData.originalAmount || 0),
      refundAmount: Number(newRefundData.refundAmount),
      currency: matchedInvoice ? matchedInvoice.currency : (newRefundData.currency || "USD"),
      reason: newRefundData.reason || "Patient requested travel/medical cancellation.",
      status: "Approved",
      requestedDate: newRefundData.requestedDate || new Date().toISOString().split("T")[0],
      processedDate: new Date().toISOString().split("T")[0],
      transactionRef: `REF-TXN-${Date.now().toString().slice(-6)}`,
      notes: newRefundData.notes || ""
    };
    saveRefunds([newRef, ...refunds]);

    // Update invoice if found
    if (matchedInvoice) {
      const updated = invoices.map(inv => inv.id === matchedInvoice.id ? {
        ...inv,
        status: "Refunded" as const,
        escrowStatus: "Refunded" as const,
        notes: (inv.notes ? inv.notes + " | " : "") + `Refund processed: ${newRef.currency} ${newRef.refundAmount}`
      } : inv);
      saveInvoices(updated);
    }

    setIsRefundModalOpen(false);
    setNewRefundData({
      invoiceNo: "",
      patientName: "",
      originalAmount: 0,
      refundAmount: 0,
      currency: "USD",
      reason: "",
      status: "Pending Review",
      requestedDate: new Date().toISOString().split("T")[0],
      notes: ""
    });
  };

  // Format Currency
  const formatMoney = (amount: number, curr: string = "USD") => {
    const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", AED: "AED ", SAR: "SAR ", INR: "₹" };
    const symbol = symbols[curr] || curr + " ";
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Filtered Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchSearch = 
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.treatment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || inv.status.toUpperCase() === statusFilter.toUpperCase();
    const matchCurrency = currencyFilter === "ALL" || inv.currency === currencyFilter;
    return matchSearch && matchStatus && matchCurrency;
  });

  // KPI Computations
  const totalInvoicedINR = invoices.reduce((sum, inv) => sum + (inv.status !== "Cancelled" ? inv.totalAmountINR : 0), 0);
  const totalPaidINR = payments.reduce((sum, pay) => sum + (pay.status === "Successful" ? pay.amountINR : 0), 0);
  const totalOutstandingINR = invoices.reduce((sum, inv) => sum + (inv.status !== "Cancelled" && inv.status !== "Refunded" ? (inv.balanceDue * inv.exchangeRateToINR) : 0), 0);
  const totalRefundsProcessed = refunds.filter(r => r.status === "Processed" || r.status === "Approved").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            MAIDES Financial Administration & Treasury
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Multi-Currency Billing, Invoices & Forex
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live international billing across USD, EUR, GBP, AED & SAR. Zero-spread forex conversions to INR, escrow milestone releases, and patient receipts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => {
              setEditingInvoice(null);
              setNewInvoiceData({
                invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                caseId: `CAS-2026-${Math.floor(100 + Math.random() * 900)}`,
                patientName: "",
                patientEmail: "",
                patientCountry: "United States",
                hospital: "Aster Medcity, Kochi",
                treatment: "",
                currency: "USD",
                exchangeRateToINR: 83.50,
                discount: 0,
                taxRate: 5,
                status: "Issued",
                issueDate: new Date().toISOString().split("T")[0],
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                notes: "Funds held securely in MAIDES International Escrow until medical check-in.",
                escrowStatus: "Pending Deposit",
                items: [
                  { id: "item-1", category: "Medical/Surgical", description: "Surgery & Implant Package", amount: 4500 },
                  { id: "item-2", category: "Hospital Room/Care", description: "In-patient Private Room (5 Days)", amount: 600 },
                  { id: "item-3", category: "Consultation", description: "Pre-op Surgeon & Anesthesiologist Consult", amount: 200 },
                ]
              });
              setIsInvoiceModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Bill / Invoice
          </button>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <DollarSign className="w-4 h-4" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "dashboard"
              ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Financial Dashboard
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "invoices"
              ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <FileText className="w-4 h-4" />
          Invoices & Bills ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "payments"
              ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Payment Transactions ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab("forex")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "forex"
              ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Globe2 className="w-4 h-4" />
          Forex & Exchange Rates ({forexRates.length})
        </button>
        <button
          onClick={() => setActiveTab("refunds")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === "refunds"
              ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          Refunds & Adjustments ({refunds.length})
        </button>
      </div>

      {/* TAB 1: FINANCIAL DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Total Billed Volume</span>
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><FileText className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-bold text-white mt-3">₹{(totalInvoicedINR / 100000).toFixed(2)} Lakhs</div>
              <div className="text-[11px] text-slate-400 mt-1">Across {invoices.length} international medical cases</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Escrow & Settled Revenue</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-3">₹{(totalPaidINR / 100000).toFixed(2)} Lakhs</div>
              <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% verified payments received
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Outstanding Receivables</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Clock className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-bold text-amber-400 mt-3">₹{(totalOutstandingINR / 100000).toFixed(2)} Lakhs</div>
              <div className="text-[11px] text-slate-400 mt-1">Pending admission deposits</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">Refunds Processed</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><RotateCcw className="w-4 h-4" /></span>
              </div>
              <div className="text-2xl font-bold text-purple-400 mt-3">{totalRefundsProcessed} Cases</div>
              <div className="text-[11px] text-slate-400 mt-1">Visa denials / travel rescheduling</div>
            </div>
          </div>

          {/* Revenue By Currency & Live Spot Forex Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Billed Breakdown by Currency</h3>
                  <p className="text-xs text-slate-400 mt-0.5">International patient currency distributions</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[11px] font-semibold rounded-lg border border-blue-500/20">
                  Real-time Valuation
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                {["USD", "EUR", "GBP", "AED", "SAR"].map(curr => {
                  const totalInCurr = invoices
                    .filter(inv => inv.currency === curr && inv.status !== "Cancelled")
                    .reduce((sum, inv) => sum + inv.totalAmount, 0);
                  const rate = forexRates.find(f => f.currency === curr)?.rateToINR || 1;
                  const inINR = totalInCurr * rate;

                  return (
                    <div key={curr} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
                      <div className="text-xs font-bold text-slate-300">{curr}</div>
                      <div className="text-sm font-bold text-white mt-1">{formatMoney(totalInCurr, curr)}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">≈ ₹{(inINR / 1000).toFixed(0)}k</div>
                    </div>
                  );
                })}
              </div>

              {/* Escrow Workflow Visualizer */}
              <div className="mt-6 pt-6 border-t border-slate-800/80">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  MAIDES 3-Stage Escrow Protection Model
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                    <div>
                      <div className="text-xs font-bold text-white">Patient Deposit</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Funds deposited in multi-currency escrow account upon visa issuance.</div>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                    <div>
                      <div className="text-xs font-bold text-white">Hospital Admission</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Identity verified upon arrival in Kochi; initial hospital care initiated.</div>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                    <div>
                      <div className="text-xs font-bold text-white">Discharge Settlement</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Automatic INR wire settlement to hospital within 24 hours of discharge.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Exchange Rate Widget */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-blue-400" />
                    Live RBI Pegged Rates
                  </h3>
                  <button 
                    onClick={() => setActiveTab("forex")}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-3">
                  {forexRates.map(fx => (
                    <div key={fx.id} className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{fx.currency}</span>
                        <span className="text-[10px] text-slate-400">({fx.name})</span>
                      </div>
                      <div className="font-bold text-emerald-400">
                        1 {fx.currency} = ₹{fx.rateToINR.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>0% Forex markup policy</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Recent Invoices Quick Table */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Recent Invoices & Payment Status</h3>
                <p className="text-xs text-slate-400 mt-0.5">Latest generated medical tourism invoices</p>
              </div>
              <button
                onClick={() => setActiveTab("invoices")}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                View All Invoices <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/70 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="p-3.5 pl-5">Invoice #</th>
                    <th className="p-3.5">Patient & Country</th>
                    <th className="p-3.5">Hospital & Procedure</th>
                    <th className="p-3.5">Billed Amount</th>
                    <th className="p-3.5">Converted (INR)</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right pr-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {invoices.slice(0, 4).map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 pl-5 font-mono font-semibold text-white">{inv.invoiceNo}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{inv.patientName}</div>
                        <div className="text-[11px] text-slate-400">{inv.patientCountry}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-white">{inv.treatment}</div>
                        <div className="text-[11px] text-slate-400">{inv.hospital}</div>
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        {formatMoney(inv.totalAmount, inv.currency)}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">
                        ₹{inv.totalAmountINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          inv.status === "Partially Paid" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          inv.status === "Cancelled" || inv.status === "Refunded" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right pr-5">
                        <button
                          onClick={() => setViewInvoice(inv)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICES & BILLS MANAGEMENT */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search invoice #, patient, hospital, procedure..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="ISSUED">Issued</option>
                <option value="PARTIALLY PAID">Partially Paid</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>

              <select
                value={currencyFilter}
                onChange={e => setCurrencyFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Currencies</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
                <option value="INR">INR (₹)</option>
              </select>

              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setNewInvoiceData({
                    invoiceNo: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
                    caseId: `CAS-2026-${Math.floor(100 + Math.random() * 900)}`,
                    patientName: "",
                    patientEmail: "",
                    patientCountry: "United States",
                    hospital: "Aster Medcity, Kochi",
                    treatment: "",
                    currency: "USD",
                    exchangeRateToINR: 83.50,
                    discount: 0,
                    taxRate: 5,
                    status: "Issued",
                    issueDate: new Date().toISOString().split("T")[0],
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    notes: "Escrow guarantee under Kerala Medical Tourism Board.",
                    escrowStatus: "Pending Deposit",
                    items: [
                      { id: "item-1", category: "Medical/Surgical", description: "Surgery / Treatment Package", amount: 4500 },
                      { id: "item-2", category: "Hospital Room/Care", description: "In-patient Private Room (5 Days)", amount: 600 },
                    ]
                  });
                  setIsInvoiceModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                New Invoice
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/70 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="p-3.5 pl-5">Invoice #</th>
                    <th className="p-3.5">Patient Details</th>
                    <th className="p-3.5">Hospital & Procedure</th>
                    <th className="p-3.5">Issued / Due Date</th>
                    <th className="p-3.5">Total Amount</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5">Balance Due</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        No invoices match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3.5 pl-5">
                          <div className="font-mono font-semibold text-white">{inv.invoiceNo}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{inv.caseId}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{inv.patientName}</div>
                          <div className="text-[11px] text-slate-400">{inv.patientCountry}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-white line-clamp-1 max-w-xs">{inv.treatment}</div>
                          <div className="text-[11px] text-slate-400">{inv.hospital}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-slate-300">{inv.issueDate}</div>
                          <div className="text-[10px] text-slate-500">Due: {inv.dueDate}</div>
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          <div>{formatMoney(inv.totalAmount, inv.currency)}</div>
                          <div className="text-[10px] font-mono text-slate-400 font-normal">
                            ₹{inv.totalAmountINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400">
                          {formatMoney(inv.amountPaid, inv.currency)}
                        </td>
                        <td className="p-3.5 font-bold text-amber-400">
                          {formatMoney(inv.balanceDue, inv.currency)}
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            inv.status === "Partially Paid" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            inv.status === "Cancelled" || inv.status === "Refunded" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewInvoice(inv)}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                              title="View Invoice Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingInvoice(inv);
                                setNewInvoiceData({ ...inv });
                                setIsInvoiceModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit Bill Items"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {inv.status !== "Cancelled" && (
                              <button
                                onClick={() => handleVoidInvoice(inv.id)}
                                className="p-1.5 text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                                title="Void / Cancel Invoice"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT TRANSACTIONS */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white">Payment Ledger & Receipts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Verified international patient remittance records</p>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Record Payment
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/70 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="p-3.5 pl-5">Receipt #</th>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Patient Name</th>
                    <th className="p-3.5">Payment Method</th>
                    <th className="p-3.5">Transaction Ref</th>
                    <th className="p-3.5">Amount Paid</th>
                    <th className="p-3.5">INR Converted</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right pr-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {payments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 pl-5 font-mono font-bold text-white">{pay.receiptNo}</td>
                      <td className="p-3.5 font-mono text-blue-400">{pay.invoiceNo}</td>
                      <td className="p-3.5 font-semibold text-white">{pay.patientName}</td>
                      <td className="p-3.5 text-slate-300">{pay.paymentMethod}</td>
                      <td className="p-3.5 font-mono text-slate-400">{pay.transactionRef}</td>
                      <td className="p-3.5 font-bold text-emerald-400">
                        {formatMoney(pay.amount, pay.currency)}
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">
                        ₹{pay.amountINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="p-3.5 text-slate-400">{pay.paymentDate}</td>
                      <td className="p-3.5 text-right pr-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Check className="w-3 h-3" />
                          {pay.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FOREX & EXCHANGE RATES */}
      {activeTab === "forex" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white">Foreign Exchange (Forex) Multi-Currency Rates</h3>
              <p className="text-xs text-slate-400 mt-0.5">Official pegged currency conversion rates applied at time of invoice creation</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Spread Guarantee
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forexRates.map(fx => (
              <div key={fx.id} className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 relative group hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{fx.currency}</span>
                    <span className="text-xs text-slate-400">/ INR</span>
                  </div>
                  <button
                    onClick={() => {
                      setForexEditData(fx);
                      setIsForexModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Exchange Rate"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-slate-400">{fx.name}</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                    1 {fx.currency} = ₹{fx.rateToINR.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    1 INR = {fx.inverseRate} {fx.currency}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1">
                  <div>Source: {fx.source}</div>
                  <div>Last Updated: {fx.lastUpdated}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REFUNDS & ADJUSTMENTS */}
      {activeTab === "refunds" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white">Refund Management & Adjustments</h3>
              <p className="text-xs text-slate-400 mt-0.5">Escrow release reversal and travel cancellation refunds</p>
            </div>
            <button
              onClick={() => setIsRefundModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Process Refund
            </button>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/70 text-slate-400 font-semibold border-b border-slate-800">
                    <th className="p-3.5 pl-5">Refund #</th>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Patient Name</th>
                    <th className="p-3.5">Original Amount</th>
                    <th className="p-3.5">Refunded Amount</th>
                    <th className="p-3.5">Reason</th>
                    <th className="p-3.5">Date Processed</th>
                    <th className="p-3.5 text-right pr-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {refunds.map(ref => (
                    <tr key={ref.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 pl-5 font-mono font-bold text-white">{ref.refundNo}</td>
                      <td className="p-3.5 font-mono text-blue-400">{ref.invoiceNo}</td>
                      <td className="p-3.5 font-semibold text-white">{ref.patientName}</td>
                      <td className="p-3.5 text-slate-400">
                        {formatMoney(ref.originalAmount, ref.currency)}
                      </td>
                      <td className="p-3.5 font-bold text-rose-400">
                        {formatMoney(ref.refundAmount, ref.currency)}
                      </td>
                      <td className="p-3.5 max-w-xs text-slate-300 line-clamp-1">{ref.reason}</td>
                      <td className="p-3.5 text-slate-400">{ref.processedDate || ref.requestedDate}</td>
                      <td className="p-3.5 text-right pr-5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW INVOICE DOSSIER / RECEIPT */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-[#0E82FD] flex items-center justify-center font-bold text-lg">
                  M
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">MAIDES Medical Tourism Invoice</h3>
                  <div className="text-xs text-slate-400">Invoice No: <span className="font-mono text-white font-bold">{viewInvoice.invoiceNo}</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Patient & Hospital Info */}
            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Billed To (Patient):</span>
                <div className="font-bold text-white text-sm mt-1">{viewInvoice.patientName}</div>
                <div className="text-slate-400">{viewInvoice.patientEmail}</div>
                <div className="text-slate-400">{viewInvoice.patientCountry}</div>
                <div className="text-slate-400 mt-1">Case: {viewInvoice.caseId}</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Medical Facility / Treatment:</span>
                <div className="font-bold text-white text-sm mt-1">{viewInvoice.hospital}</div>
                <div className="text-blue-400">{viewInvoice.treatment}</div>
                <div className="text-slate-400 mt-1">Issue Date: {viewInvoice.issueDate}</div>
                <div className="text-slate-400">Due Date: {viewInvoice.dueDate}</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 font-semibold">
                    <th className="p-3 pl-4">Category</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right pr-4">Amount ({viewInvoice.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {viewInvoice.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 pl-4 font-semibold text-white">{item.category}</td>
                      <td className="p-3 text-slate-300">{item.description}</td>
                      <td className="p-3 text-right pr-4 font-bold text-white">
                        {formatMoney(item.amount, viewInvoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Breakdown & Forex Conversion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl text-xs space-y-1.5">
                <div className="font-bold text-white text-xs mb-2 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-blue-400" />
                  Forex Rate Lock Details
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Billing Currency:</span>
                  <span className="text-white font-bold">{viewInvoice.currency}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Frozen Exchange Rate:</span>
                  <span className="text-white font-mono">1 {viewInvoice.currency} = ₹{viewInvoice.exchangeRateToINR.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Equivalent in INR:</span>
                  <span className="text-emerald-400 font-mono font-bold">₹{viewInvoice.totalAmountINR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Escrow Status:</span>
                  <span className="text-blue-400 font-semibold">{viewInvoice.escrowStatus}</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-semibold">{formatMoney(viewInvoice.subtotal, viewInvoice.currency)}</span>
                </div>
                {viewInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>- {formatMoney(viewInvoice.discount, viewInvoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Taxes & Levies ({viewInvoice.taxRate}%):</span>
                  <span>{formatMoney(viewInvoice.taxAmount, viewInvoice.currency)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount:</span>
                  <span>{formatMoney(viewInvoice.totalAmount, viewInvoice.currency)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                  <span>Amount Paid:</span>
                  <span>{formatMoney(viewInvoice.amountPaid, viewInvoice.currency)}</span>
                </div>
                <div className="flex justify-between text-xs text-amber-400 font-semibold">
                  <span>Balance Due:</span>
                  <span>{formatMoney(viewInvoice.balanceDue, viewInvoice.currency)}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-900/30 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-400">Payment Policy & Notes:</span> {viewInvoice.notes || "All charges are covered by MAIDES Medical Tourism Escrow Protection Guarantee."}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT INVOICE */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingInvoice ? "Edit Medical Invoice & Bill Items" : "Generate New Medical Tourism Invoice"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Create patient bill with line items, multi-currency conversion, and escrow rules.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsInvoiceModalOpen(false);
                  setEditingInvoice(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceData.invoiceNo || ""}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, invoiceNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Case Number</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceData.caseId || ""}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, caseId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={newInvoiceData.patientName || ""}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Patient Country</label>
                  <input
                    type="text"
                    value={newInvoiceData.patientCountry || ""}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, patientCountry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Hospital / Medical Center</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceData.hospital || ""}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Treatment / Surgery</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilateral Knee Replacement"
                    value={newInvoiceData.treatment || ""}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, treatment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Billing Currency</label>
                  <select
                    value={newInvoiceData.currency || "USD"}
                    onChange={e => {
                      const curr = e.target.value as Invoice["currency"];
                      const fx = forexRates.find(f => f.currency === curr);
                      setNewInvoiceData({ 
                        ...newInvoiceData, 
                        currency: curr,
                        exchangeRateToINR: fx ? fx.rateToINR : 83.50
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="AED">AED (UAE Dirham)</option>
                    <option value="SAR">SAR (Saudi Riyal)</option>
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Exchange Rate to INR</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoiceData.exchangeRateToINR || 83.50}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, exchangeRateToINR: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Escrow Status</label>
                  <select
                    value={newInvoiceData.escrowStatus || "Pending Deposit"}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, escrowStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                  >
                    <option value="Pending Deposit">Pending Deposit</option>
                    <option value="Escrow Held">Escrow Held (Safe)</option>
                    <option value="Disbursed to Hospital">Disbursed to Hospital</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Bill Items Management */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-xs uppercase tracking-wider">Bill Charges Breakdown</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Charge Item
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(newInvoiceData.items || []).map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                      <div className="col-span-4">
                        <select
                          value={item.category}
                          onChange={e => handleItemChange(index, "category", e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white"
                        >
                          <option value="Medical/Surgical">Medical/Surgical</option>
                          <option value="Hospital Room/Care">Hospital Room/Care</option>
                          <option value="Consultation">Consultation</option>
                          <option value="Accommodation & Logistics">Accommodation & Logistics</option>
                          <option value="Taxes & Regulatory Fees">Taxes & Fees</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={e => handleItemChange(index, "description", e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={item.amount}
                          onChange={e => handleItemChange(index, "amount", parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-white font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount & Tax */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Discount Amount ({newInvoiceData.currency})</label>
                  <input
                    type="number"
                    value={newInvoiceData.discount || 0}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Tax / Regulatory Levies (%)</label>
                  <input
                    type="number"
                    value={newInvoiceData.taxRate || 5}
                    onChange={e => setNewInvoiceData({ ...newInvoiceData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsInvoiceModalOpen(false);
                    setEditingInvoice(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  {editingInvoice ? "Save Changes" : "Generate Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD PAYMENT */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Record Inward Patient Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Select Invoice</label>
                <select
                  required
                  value={newPaymentData.invoiceNo || ""}
                  onChange={e => {
                    const inv = invoices.find(i => i.invoiceNo === e.target.value);
                    if (inv) {
                      setNewPaymentData({
                        ...newPaymentData,
                        invoiceNo: inv.invoiceNo,
                        patientName: inv.patientName,
                        currency: inv.currency,
                        exchangeRateToINR: inv.exchangeRateToINR,
                        amount: inv.balanceDue > 0 ? inv.balanceDue : inv.totalAmount
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-blue-500"
                >
                  <option value="">Select an outstanding invoice...</option>
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.invoiceNo}>
                      {inv.invoiceNo} - {inv.patientName} ({inv.currency} {inv.balanceDue > 0 ? `Due: ${inv.balanceDue}` : `Total: ${inv.totalAmount}`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Amount ({newPaymentData.currency || "USD"})</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPaymentData.amount || ""}
                    onChange={e => setNewPaymentData({ ...newPaymentData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Payment Method</label>
                  <select
                    value={newPaymentData.paymentMethod || "Credit/Debit Card (Stripe)"}
                    onChange={e => setNewPaymentData({ ...newPaymentData, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="International Wire / SWIFT">International Wire / SWIFT</option>
                    <option value="Credit/Debit Card (Stripe)">Credit/Debit Card (Stripe)</option>
                    <option value="Escrow Deposit">Escrow Deposit</option>
                    <option value="UPI / NetBanking">UPI / NetBanking</option>
                    <option value="Cash at Hospital Desk">Cash at Hospital Desk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Transaction / Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. SWIFT-BARC-889102 or Stripe PI"
                  value={newPaymentData.transactionRef || ""}
                  onChange={e => setNewPaymentData({ ...newPaymentData, transactionRef: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Payment Date</label>
                <input
                  type="date"
                  value={newPaymentData.paymentDate || new Date().toISOString().split("T")[0]}
                  onChange={e => setNewPaymentData({ ...newPaymentData, paymentDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl"
                >
                  Confirm & Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FOREX RATE */}
      {isForexModalOpen && forexEditData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Update Forex Rate ({forexEditData.currency} to INR)</h3>
              <button onClick={() => setIsForexModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForexRate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Currency Pair</label>
                <div className="font-bold text-white text-sm bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  1 {forexEditData.currency} ({forexEditData.name}) $	o$ INR (₹)
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">New Exchange Rate (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={forexEditData.rateToINR}
                  onChange={e => setForexEditData({ ...forexEditData, rateToINR: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Rate Source Reference</label>
                <input
                  type="text"
                  value={forexEditData.source}
                  onChange={e => setForexEditData({ ...forexEditData, source: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsForexModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl"
                >
                  Update Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PROCESS REFUND */}
      {isRefundModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Process Patient Escrow Refund</h3>
              <button onClick={() => setIsRefundModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRefund} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Select Invoice</label>
                <select
                  required
                  value={newRefundData.invoiceNo || ""}
                  onChange={e => {
                    const inv = invoices.find(i => i.invoiceNo === e.target.value);
                    if (inv) {
                      setNewRefundData({
                        ...newRefundData,
                        invoiceNo: inv.invoiceNo,
                        patientName: inv.patientName,
                        currency: inv.currency,
                        originalAmount: inv.totalAmount,
                        refundAmount: inv.amountPaid > 0 ? inv.amountPaid : inv.totalAmount
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                >
                  <option value="">Select paid or partially paid invoice...</option>
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.invoiceNo}>
                      {inv.invoiceNo} - {inv.patientName} ({inv.currency} {inv.totalAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Refund Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newRefundData.refundAmount || ""}
                  onChange={e => setNewRefundData({ ...newRefundData, refundAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Cancellation / Refund Reason</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Visa denial / medical rescheduling / patient withdrawal"
                  value={newRefundData.reason || ""}
                  onChange={e => setNewRefundData({ ...newRefundData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl"
                >
                  Authorize & Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
