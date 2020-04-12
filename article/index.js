const BaseServiceV2 = require('../BaseServiceV2');

class ArticleService extends BaseServiceV2 {
    constructor(API_ROOT) {
        super(API_ROOT);
    }

    addSubslide(articleId, slidePosition, subslidePosition, subslide) {
        return new Promise((resolve, reject) => {
            this.request.post(this.API_ROOT + `/${articleId}/slides/${slidePosition}/content/${subslidePosition}`, subslide)
            .then(res => resolve(res.body))
            .catch(reject);
        });
    }

    updateSubslideUsingPosition(articleId, slidePosition, subslidePosition, changes) {
        return new Promise((resolve, reject) => {
            this.request.patch(this.API_ROOT + `/${articleId}/slides/${slidePosition}/content/${subslidePosition}`, changes)
            .then(res => resolve(res.body))
            .catch(reject);
        })
    }

    splitSubslide(articleId, slidePosition, subslidePosition, wordIndex, time) {
        return new Promise((resolve, reject) => {
           this.request.post(this.API_ROOT + `/${articleId}/slides/${slidePosition}/content/${subslidePosition}/split`, { wordIndex, time })
           .then(res => resolve(res.body))
           .catch(reject);
        });
    }

    replaceArticleSlidesText(articleId, { find, replace } = {}) {
        return new Promise((resolve, reject) => {
            this.request.post(this.API_ROOT + `/${articleId}/find_and_replace`, { find, replace })
            .then(res => resolve(res.body))
            .catch(reject);
        })
    }

    removeSubslide(articleId, slidePosition, subslidePosition) {
        return new Promise((resolve, reject) => {
            this.request.delete(this.API_ROOT + `/${articleId}/slides/${slidePosition}/content/${subslidePosition}`)
            .then(res => resolve(res.body))
            .catch(reject);
        })
    }

    cloneArticle(articleId) {
        return new Promise((resolve, reject) => {
            this.request.post(`${this.API_ROOT}/${articleId}/clone`)
            .then((res) => {
                resolve(res.body);
            })
            .catch(reject)
        })
    }

    formatSubslideToSubtitle(subslide) {
        return ({ ...subslide, startTime: subslide.startTime * 1000, endTime: subslide.endTime * 1000, text: subslide.text, speakerNumber: subslide.speakerProfile.speakerNumber })
    }


    cleanArticleSilentSlides(article) {
        let clonedArticle;
        if (article.toObject) {
            clonedArticle = article.toObject();
        } else {
            clonedArticle = { ...article };
        }
        clonedArticle.slides.forEach(slide => {
            slide.content = slide.content.filter((s) => !s.silent);
        });
        clonedArticle.slides = clonedArticle.slides.filter((s) => s.content.length > 0);;
        return clonedArticle;
    }

    cleanArticleBackgroundMusicSlides(article) {
        let clonedArticle;
        if (article.toObject) {
            clonedArticle = article.toObject();
        } else {
            clonedArticle = { ...article };
        }
        clonedArticle.slides.forEach(slide => {
            slide.content = slide.content.filter((s) => s.speakerProfile.speakerNumber !== -1);
        });
        clonedArticle.slides = clonedArticle.slides.filter((s) => s.content.length > 0);;
        return clonedArticle;
    }

    cleanArticleSilentAndBackgroundMusicSlides(article) {
        let clonedArticle;
        if (article.toObject) {
            clonedArticle = article.toObject();
        } else {
            clonedArticle = { ...article };
        }
        return this.cleanArticleBackgroundMusicSlides(this.cleanArticleSilentSlides(clonedArticle));
    }
   
}



module.exports = (API_ROOT) => new ArticleService(API_ROOT);