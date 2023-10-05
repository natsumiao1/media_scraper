const btn = document.getElementById('getMediaList')
const mediaList = document.getElementById('mediaList')

// 设置媒体列表内容
function setMediaListContent(medias) {
    // 清空之前的内容
    mediaList.innerHTML = '';

    // 将媒体名添加到列表中
    medias.forEach(media => {
        const mediaItem = document.createElement('div');

        const mediaTitle = document.createElement('div');
        mediaTitle.textContent = media.name;

        const nfoStatus = document.createElement('div');
        nfoStatus.textContent = `NFO文件: ${media.hasNFO ? '是' : '否'}`;

        const button = document.createElement('button');
        button.textContent = '开始刮削';
        button.addEventListener('click', () => {
            window.electronAPI.startScrap(media);
        });

        mediaItem.appendChild(mediaTitle);
        mediaItem.appendChild(nfoStatus);
        mediaItem.appendChild(button);

        mediaList.appendChild(mediaItem);
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

