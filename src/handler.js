const { QueryParameters } = require('./entity');
const { ImageDownloader, Movie } = require('./tmdb');

async function startScrap(_event, media) {
    const imageDownloader = new ImageDownloader();
    const movieClass = new Movie();

    const folderPath = media.fullPath;
    const mediaName = media.name;
    const params = new QueryParameters(mediaName);

    console.log(media)
    console.log(params.getParameters())

    imageDownloader.setFolder(folderPath);

    try {
        // TODO 连接失败
        const movies = await movieClass.byName(params);

        if (movies.length > 0) {
            const movie = movies[0]
            console.log(movie);

            imageDownloader.poster(movie.poster_path);
            imageDownloader.background(movie.backdrop_path);

        } else {
            console.log('未找到与查询匹配的电影。');
        }
    } catch (error) {
        console.error('查询电影失败');
    }

}

export { startScrap }