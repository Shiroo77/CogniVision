const video = document.querySelector("video");
const textElement = document.querySelector("[data-text");

async function setup() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  // Here, we're setting the video src to stream
  video.srcObject = stream;

  video.addEventListener("playing", async () => {
    const worker = Tesseract.createWorker();
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    // To make the worker recognize the images
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Now get the image from your video
    document.addEventListener("keypress", async key => {
        if(key.code != "Space") return

        // This will draw our video onto the canvas
        canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height);

        // Take this canvas image & recognize the text within that image 
        const {
            data: { text },
          } = await worker.recognize(canvas)

          // Read the text out 
          speechSynthesis.speak(
            new SpeechSynthesisUtterance(text.replace(/\s/g, " "))
          )
          // We're printing the text onto the screen 
          textElement.textContent = text;
    })
  });
}

setup();
