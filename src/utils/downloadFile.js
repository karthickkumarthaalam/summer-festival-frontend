
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const downloadFile = async (endPoint, fileName) => {
    try {
        const response = await fetch(`${BASE_URL}${endPoint}`, {
            method: "GET"
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Server error:", text);
            throw new Error("Failed to download file");
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();

    } catch (error) {
        throw error;
    }
};