import QRCode from 'qrcode';

export async function generateQRCode(tenantId: string): Promise<string> {
    try {
        const url = `https://your-app-domain.com/tenant/${tenantId}`;
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300,
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}