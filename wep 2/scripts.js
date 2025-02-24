const albumImages = {
    // Định nghĩa danh sách ảnh cho từng album
    "1": ["1 (1)", "1 (2)", "1 (3)", "1 (4)", "1 (5)", "1 (6)", "1 (7)", "1 (8)", "1 (9)", "1 (10)"],
    "2": ["2 (1)", "2 (2)", "2 (3)", "2 (4)", "2 (5)", "2 (6)", "2 (7)", "2 (8)", "2 (9)", "2 (10)"],
    "3": ["3 (1)", "3 (2)", "3 (3)", "3 (4)", "3 (5)", "3 (6)", "3 (7)", "3 (8)", "3 (9)", "3 (10)"],
    "4": ["4 (1)", "4 (2)", "4 (3)", "4 (4)", "4 (5)", "4 (6)", "4 (7)", "4 (8)", "4 (9)", "4 (10)"],
    "5": ["3 (1)", "3 (2)", "3 (3)", "3 (4)", "3 (5)", "3 (6)", "3 (7)", "3 (8)", "3 (9)", "3 (10)"],
    "6": ["3 (1)", "3 (2)", "3 (3)", "3 (4)", "3 (5)", "3 (6)", "3 (7)", "3 (8)", "3 (9)", "3 (10)"],
    "7": ["3 (1)", "3 (2)", "3 (3)", "3 (4)", "3 (5)", "3 (6)", "3 (7)", "3 (8)", "3 (9)", "3 (10)"],
    "8": ["3 (1)", "3 (2)", "3 (3)", "3 (4)", "3 (5)", "3 (6)", "3 (7)", "3 (8)", "3 (9)", "3 (10)"]
};

const supportedFormats = ["png", "jpg", "jpeg", "webp"];

const sections = {
    home: document.getElementById("homeSection"),
    album: document.getElementById("albumSection"),
    abot: document.getElementById("aboutSection"),
    albumView: document.getElementById("albumView"),
    tainguyen: document.getElementById("tainguyenSection"), // Thêm khu vực tainguyen
};

// Hàm thay đổi hiển thị của các khu vực
function toggleSectionVisibility(home, album, abot, albumView, tainguyen) {
    sections.home.style.display = home;
    sections.album.style.display = album;
    sections.abot.style.display = abot;
    sections.albumView.style.display = albumView;
    sections.tainguyen.style.display = tainguyen; // Hiển thị khu vực tainguyen
}

// Hàm tìm kiếm ảnh hợp lệ theo định dạng và gọi callback khi tìm thấy
function findValidImage(albumId, imageName, callback) {
    let found = false;

    supportedFormats.forEach((format) => {
        if (found) return;
        const imagePath = `img/${albumId}/${imageName}.${format}`;
        const testImg = new Image();
        testImg.src = imagePath;

        testImg.onload = () => {
            if (!found) {
                found = true;
                callback(imagePath);
            }
        };

        testImg.onerror = () => {
            if (!found) {
                console.warn(`Ảnh không tồn tại: ${imagePath}`);
            }
        };
    });
}

// Hàm tạo nút album với thumbnail
function createAlbumButton(albumId) {
    const albumButton = document.createElement("button");
    albumButton.classList.add("album-button");

    const firstImageName = albumImages[albumId][0];
    findValidImage(albumId, firstImageName, (thumbnailPath) => {
        const imgElement = document.createElement("img");
        imgElement.src = thumbnailPath;
        imgElement.alt = `Thumbnail của album ${albumId}`;
        imgElement.classList.add("album-thumbnail");
        albumButton.appendChild(imgElement);
    });

    const albumLabel = document.createElement("span");
    albumLabel.textContent = `Album ${albumId}`;
    albumButton.appendChild(albumLabel);

    albumButton.onclick = function () {
        openAlbum(albumId);
    };

    return albumButton;
}

// Hàm tạo phần tử ảnh trong album
function createImageElement(imageName, albumId) {
    const imgElement = document.createElement("img");
    imgElement.alt = `${albumId} - ${imageName}`;

    findValidImage(albumId, imageName, (imagePath) => {
        imgElement.src = imagePath;
    });

    return imgElement;
}

// Hàm mở album và hiển thị danh sách ảnh
function openAlbum(albumId) {
    toggleSectionVisibility("none", "none", "none", "block", "none");

    const images = albumImages[albumId];
    const albumContainer = document.getElementById("albumImages");
    if (!albumContainer) return;

    albumContainer.innerHTML = "";
    images.map((imageName) => createImageElement(imageName, albumId))
          .forEach((img) => albumContainer.appendChild(img));
}

// Hàm khởi tạo danh sách album
function initializeAlbumList() {
    const albumListContainer = document.getElementById("albumList");
    if (albumListContainer) {
        albumListContainer.innerHTML = "";

        Object.keys(albumImages).forEach((albumId) => {
            const albumButton = createAlbumButton(albumId);
            albumListContainer.appendChild(albumButton);
        });
    }
}

// Gán sự kiện cho các tab điều hướng
document.getElementById("homeTab").addEventListener("click", function () {
    toggleSectionVisibility("block", "none", "none", "none", "none");
});
document.getElementById("tainguyenTab").addEventListener("click", function () {
    toggleSectionVisibility("none", "none", "none", "none", "block"); // Hiển thị khu vực tainguyen
});
document.getElementById("aboutTab").addEventListener("click", function () {
    toggleSectionVisibility("none", "none", "block", "none", "none");
});
document.getElementById("albumTab").addEventListener("click", function () {
    toggleSectionVisibility("none", "block", "none", "none", "none");
    initializeAlbumList();
});

// Hàm preload các ảnh để tối ưu tải
function preloadImages() {
    Object.entries(albumImages).forEach(([albumId, images]) => {
        images.forEach((imageName) => {
            supportedFormats.forEach((format) => {
                const img = new Image();
                img.src = `img/${albumId}/${imageName}.${format}`;
            });
        });
    });
}

// Gọi hàm preload ảnh
preloadImages();
