import {BarcodeDetector} from "https://fastly.jsdelivr.net/npm/barcode-detector@2/dist/es/pure.min.js";
	
const video = document.querySelector('#video');
const resultNode = document.querySelector('#result');
const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
const barcodeDetector = new BarcodeDetector({
    formats: ["qr_code", "code_128", "code_39"],
});

video.srcObject = stream;
video.onloadedmetadata = () => {
    video.play();
    requestAnimationFrame(scanBarcode);
};

async function scanBarcode() {
    const barcodes = await barcodeDetector.detect(video);
    if(barcodes.length > 0) {
        resultNode.innerText = `Stregkode fundet: ${barcodes[0].rawValue}`;
        video.pause(); // Stop scanning
    } else {
        requestAnimationFrame(scanBarcode);
    }
}

    console.log('barcode')