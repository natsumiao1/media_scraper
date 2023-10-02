const btn = document.getElementById('getMediaList')
const mediaList = document.getElementById('mediaList')

// 设置媒体列表内容
function setMediaListContent(medias) {
    // 清空之前的内容
    mediaList.innerHTML = '';

    // 将媒体名添加到列表中
    medias.forEach(media => {
        const folderItem = document.createElement('li');
        folderItem.textContent = media.name;
        mediaList.appendChild(folderItem);
    });
}

// 页面加载完成时初始化媒体列表
window.addEventListener('DOMContentLoaded', async () => {
    const folderNames = await window.electronAPI.initMediaList();
    setMediaListContent(folderNames);
});

btn.addEventListener('click', async () => {
    const folderNames = await window.electronAPI.getFolderContent();
    setMediaListContent(folderNames);
})

