const btn = document.getElementById('getMediaList')
const mediaList = document.getElementById('mediaList')

// 设置媒体列表内容
function setMediaListContent(folderNames) {
    // 清空之前的内容
    mediaList.innerHTML = '';

    // 将媒体名添加到列表中
    folderNames.forEach(folderName => {
        const folderItem = document.createElement('li');
        folderItem.textContent = folderName.name;
        mediaList.appendChild(folderItem);
    });
}


btn.addEventListener('click', async () => {
    const folderNames = await window.electronAPI.getFolderContent();
    setMediaListContent(folderNames);
})


window.electronAPI.initFolderContent((_event, value) => {
    console.log('------------')
    console.log(value)
})