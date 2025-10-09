// File handling utilities

export function handleFileInput(fileInput, callback) {
    if (!fileInput) return;
    
    fileInput.addEventListener("change", (e) => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                callback(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}