import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Navigation
document.getElementById('invoiceBtn').addEventListener('click', () => showSection('invoice'));
document.getElementById('paymentBtn').addEventListener('click', () => showSection('payment'));
document.getElementById('reportsBtn').addEventListener('click', () => showSection('reports'));

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    if (section === 'invoice') {
        document.getElementById('invoiceSection').classList.add('active');
        document.getElementById('invoiceBtn').classList.add('active');
    } else if (section === 'payment') {
        document.getElementById('paymentSection').classList.add('active');
        document.getElementById('paymentBtn').classList.add('active');
    } else if (section === 'reports') {
        document.getElementById('reportsSection').classList.add('active');
        document.getElementById('reportsBtn').classList.add('active');
    }
}

// Invoice Form Handler
let currentInvoiceData = null;

document.getElementById('invoiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const clientName = document.getElementById('clientName').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const amount = document.getElementById('amount').value;
    const invoiceDate = document.getElementById('invoiceDate').value;

    // Store invoice data
    currentInvoiceData = {
        invoiceNumber,
        clientName,
        clientEmail,
        amount,
        invoiceDate,
        createdAt: new Date().toLocaleString('he-IL')
    };

    // Generate QR Code
    const qrData = `Invoice: ${invoiceNumber}, Client: ${clientName}, Amount: ${amount}`;
    
    try {
        const canvas = document.getElementById('qrCanvas');
        await QRCode.toCanvas(canvas, qrData, { width: 300 });
        document.getElementById('qrCode').style.display = 'block';
        document.getElementById('downloadBtn').style.display = 'inline-block';
        
        alert(`✅ חשבונית ${invoiceNumber} נוצרה בהצלחה!\nQR Code הוצר בהצלחה.`);
    } catch (error) {
        console.error('QR Code error:', error);
        alert('שגיאה ביצירת QR Code');
    }
});

// Download PDF
document.getElementById('downloadBtn').addEventListener('click', async () => {
    if (!currentInvoiceData) return;

    try {
        const doc = new jsPDF();
        
        // Set direction to RTL for Hebrew
        doc.setLanguage('he');
        
        // Add title
        doc.setFontSize(20);
        doc.text('חשבונית', 190, 20, { align: 'right' });
        
        // Add invoice details
        doc.setFontSize(12);
        const rightX = 190;
        let y = 40;
        const lineHeight = 10;
        
        doc.text(`מספר חשבונית: ${currentInvoiceData.invoiceNumber}`, rightX, y, { align: 'right' });
        y += lineHeight;
        
        doc.text(`שם לקוח: ${currentInvoiceData.clientName}`, rightX, y, { align: 'right' });
        y += lineHeight;
        
        doc.text(`דוא"ל: ${currentInvoiceData.clientEmail}`, rightX, y, { align: 'right' });
        y += lineHeight;
        
        doc.text(`תאריך: ${currentInvoiceData.invoiceDate}`, rightX, y, { align: 'right' });
        y += lineHeight;
        
        doc.setFontSize(14);
        doc.text(`סכום: ₪${parseFloat(currentInvoiceData.amount).toFixed(2)}`, rightX, y + 5, { align: 'right' });
        
        // Add QR Code to PDF
        const qrCanvas = document.getElementById('qrCanvas');
        if (qrCanvas && qrCanvas.toDataURL) {
            const qrImage = qrCanvas.toDataURL('image/png');
            doc.addImage(qrImage, 'PNG', 20, 100, 50, 50);
        }
        
        // Save PDF
        doc.save(`invoice_${currentInvoiceData.invoiceNumber}.pdf`);
        alert('✅ PDF הורד בהצלחה!');
    } catch (error) {
        console.error('PDF error:', error);
        alert('שגיאה בייצוא PDF');
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    console.log('P.A.P.I App Loaded');
    document.getElementById('invoiceDate').valueAsDate = new Date();
});
