import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDFReport(containerId: string, candidateName: string = 'Candidate') {
    // Find all elements with class 'pdf-slide' inside the container
    const container = document.getElementById(containerId);
    if (!container) return;

    const slides = container.getElementsByClassName('pdf-slide');
    if (slides.length === 0) {
        console.warn('No slides found');
        return;
    }

    // Create PDF instance (Landscape, A4)
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    try {
        // Show hidden container temporarily if needed (assumed handled by CSS)

        for (let i = 0; i < slides.length; i++) {
            const slide = slides[i] as HTMLElement;

            // Capture the element as a canvas
            const canvas = await html2canvas(slide, {
                scale: 2, // Improve quality
                useCORS: true,
                logging: false,
                width: 1123, // A4 width in px at 96dpi approx (297mm)
                height: 794, // A4 height in px at 96dpi approx (210mm)
                windowWidth: 1123,
                windowHeight: 794
            });

            const imgData = canvas.toDataURL('image/png');

            // Add new page if not first slide
            if (i > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        }

        // Save
        pdf.save(`TRB_Alchemy_Report_${candidateName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
        console.error('PDF Generation failed:', error);
    }
}
