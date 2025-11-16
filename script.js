// Image to PDF conversion using jsPDF

const { jsPDF } = window.jspdf;

const input = document.getElementById("imageInput");
const button = document.getElementById("convertBtn");

button.addEventListener("click", async () => {
    const files = input.files;

    if (files.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    const pdf = new jsPDF();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imgData = await readFileAsDataURL(file);

        const img = new Image();
        img.src = imgData;

        await new Promise(resolve => {
            img.onload = () => {
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (img.height * imgWidth) / img.width;

                if (i !== 0) pdf.addPage();
                pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

                resolve();
            };
        });
    }

    pdf.save("converted.pdf");
});

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}