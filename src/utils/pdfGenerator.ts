import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDFReport(elementId: string, candidateName: string = 'Candidate') {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create PDF instance (Landscape, A4)
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    try {
        // Capture the element as a canvas
        const canvas = await html2canvas(element, {
            scale: 2, // Improve quality
            useCORS: true,
            logging: false,
        });

        const imgData = canvas.toDataURL('image/png');

        // Add slide to PDF
        // Note: In a real implementation, we would iterate through multiple "Slide" elements
        // For MVP, we assume the elementId contains the entire scrollable report or a specific view
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);

        // Save
        pdf.save(`TRB_Alchemy_Report_${candidateName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('PDF Generation failed:', error);
    }
}
