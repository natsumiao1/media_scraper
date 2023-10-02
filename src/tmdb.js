const axios = require('axios');
const fs = require('fs');
const path = require('path');


// 创建一个用于TMDB API的Axios实例
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZTk0YmFhZGJiZGMzMTdjZDJjNmJiZTA0YjA0NTBiNCIsInN1YiI6IjY0YTkyYzM4YjY4NmI5MDBhZjlkNmNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.U7Z_Hd-q974lHR94b4hNGYT4-XXvmkHyz2IZMZMXkBI'


class Movie {
    constructor(api) {
        this.api = api || this._createDefaultApi();
    }

    // 创建默认的 tmdbApi
    _createDefaultApi() {
        return axios.create({
            baseURL: 'https://api.themoviedb.org/3',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'accept': 'application/json',
            },
            params: {
                language: 'zh-CN',
            },
        });
    }

    async byName(params) {

        try {
            const apiUrl = `search/movie`
            const response = await this.api.get(apiUrl, { params });
            return response.data.results;
        } catch (error) {
            console.error('搜索电影名出错: ', error);
            throw error;
        }
    }

    async byId(movieId) {
        try {
            const apiUrl = `movie/${movieId}`
            const result = await this.api.get('movie/634649');
            return result.data;
        } catch (error) {
            console.error('搜索电影id出错: ', error);
            throw error;
        }
    }
}



/**
 * 通过TMDB的api下载各种图片
 */
class ImageDownloader {

    constructor() {
        // 配置TMDB下载图片的API
        const config_imageDownload = {
            baseURL: 'https://image.tmdb.org/t/p/original',
            headers: {
                'Authorization': `Bearer ${token}`,
                'timeout': '10',
            },
            responseType: 'stream',
            params: {
                language: 'en-US',
            },
        }

        this.downloaderApi = axios.create(config_imageDownload);
    }

    // 设置文件夹, 默认将图片放到这里
    setFolder(folderPath) {
        this.folderPath = folderPath;
    }


    // 下载海报
    poster(posterUrl, saveFolder = this.folderPath) {
        const savePath = path.posix.join(saveFolder, 'poster.jpg');
        console.log(`下载海报到${savePath}`)
        return this._image(posterUrl, savePath, '下载海报');
    }

    // 下载背景图
    background(backgroundUrl, saveFolder = this.folderPath) {
        const savePath = path.posix.join(saveFolder, 'background.jpg');
        return this._image(backgroundUrl, savePath, '下载背景图');
    }

    // TODO 下载banner


    // 下载图片
    async _image(imageUrl, savePath, taskDescription) {
        try {
            const response = await this.downloaderApi.get(imageUrl, {
                onDownloadProgress: (progressEvent) => {
                    const totalLength = progressEvent.total;
                    const downloadedLength = progressEvent.loaded;
                    const progress = (downloadedLength / totalLength) * 100;
                    this._printProgress(progress, taskDescription);
                },
            });

            const writer = fs.createWriteStream(savePath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    console.log(`${taskDescription}成功`);
                    resolve(true)
                });
                writer.on('error', () => {
                    console.log(`${taskDescription}失败`);
                    reject(false)
                });
            });
        } catch (error) {
            console.error('图片下载出错:', error);
            return false;
        }
    }

    // 打印进度条
    _printProgress(progress, taskDescription) {
        const progressBarLength = 50;
        const completedLength = Math.floor((progress / 100) * progressBarLength);
        const progressBar = '█'.repeat(completedLength) + ' '.repeat(progressBarLength - completedLength);

        // 使用 \r 回车符，将光标移动到行首
        process.stdout.write(`\r${taskDescription}: [${progressBar}] ${progress.toFixed(2)}%`);

        // 如果任务完成，输出换行符
        if (progress === 100) {
            process.stdout.write('\n');
        }
    }
}

module.exports = { ImageDownloader, Movie };