function fileSave(data) {
    const link = document.createElement('a')
    const content = JSON.stringify(data)
    const file = new Blob([content], { type: 'application/json' });
    link.href = URL.createObjectURL(file);
    link.download = 'zaptales_backup.json';
    link.click();
}
function fileType(type) {
    if (type == 'text/plain') return 'whatsapp';
    if (type == 'text/html') return 'messenger';
    if (type == 'text/xml') return 'sms';
    if (type == 'application/json') return 'messenger';
    return 'error'
}
function fileSize(bytes) {
    if (bytes > 1000000) return (bytes / 1000000).toFixed(1) + 'MB';
    if (bytes > 1000) return (bytes / 1000).toFixed(0) + 'KB';
    return bytes + 'B';
}

export { fileSave, fileType, fileSize }