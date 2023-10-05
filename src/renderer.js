const btn = document.getElementById('getMediaList')
const mediaList = document.getElementById('mediaList')

// 设置媒体列表内容
function setMediaListContent(medias) {
    // 清空之前的内容
    mediaList.innerHTML = '';

    // 将媒体名添加到列表中
    medias.forEach(media => {
        const oneMediaLi = document.createElement('li');
        oneMediaLi.textContent = media.name;
        mediaList.appendChild(oneMediaLi);
    });
}

// 打开APP时初始化媒体列表
window.electronAPI.initMediaList((_event, medias) => {
    setMediaListContent(medias);
})

// 设定媒体库
btn.addEventListener('click', async () => {
    const medias = await window.electronAPI.getFolderContent();
    setMediaListContent(medias);
})

