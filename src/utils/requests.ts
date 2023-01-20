
async function fetchFileList() {
    const res = await fetch("/getFiles");
    if (res.ok && res.status === 200) {
        const data = await res.json();
        return data;
    }

    return null;
}

async function uploadFile(file: FormData,) {
    const res = await fetch('/upload', {
        method: 'POST',
        body: file,
    })
    if (res.ok && res.status === 200) {
        return true;
    }
    return false;
}

export { fetchFileList, uploadFile }