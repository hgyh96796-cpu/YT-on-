let currentHdUrl = "";
let currentMqUrl = "";

function extractVideoId(url) {
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function getThumbnail() {
  const url = document.getElementById("videoUrl").value.trim();
  const result = document.getElementById("result");
  const error = document.getElementById("error");
  const thumbnailImg = document.getElementById("thumbnailImg");

  error.textContent = "";
  result.classList.add("hidden");

  if (!url) {
    error.textContent = "Please enter a YouTube video URL.";
    return;
  }

  const videoId = extractVideoId(url);

  if (!videoId) {
    error.textContent = "Invalid YouTube URL. Please paste a valid video link.";
    return;
  }

  currentHdUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  currentMqUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

  thumbnailImg.src = currentHdUrl;
  thumbnailImg.onerror = () => {
    thumbnailImg.src = currentMqUrl;
  };

  result.classList.remove("hidden");
}

async function saveThumbnail(type) {
  const error = document.getElementById("error");
  error.textContent = "";

  let imageUrl = type === "hd" ? currentHdUrl : currentMqUrl;

  if (!imageUrl) {
    error.textContent = "Please generate a thumbnail first.";
    return;
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileName = type === "hd"
      ? "youtube-thumbnail-hd.jpg"
      : "youtube-thumbnail-medium.jpg";

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    error.textContent = "Thumbnail saved successfully.";
    error.style.color = "#86efac";
  } catch (err) {
    error.textContent = "Download failed. Please try again.";
    error.style.color = "#fecaca";
  }
}