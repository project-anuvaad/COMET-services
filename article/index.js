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
    
    generateTranslatableArticle({ articleId, signLang, lang, langName, tts, createdBy }) {
        return new Promise((resolve, reject) => {
            let originalArticle;
            let clonedArticle;
            this.findById(articleId)
                .then((originalArticleDoc) => {
                    if (!originalArticleDoc) throw new Error('Invalid article id');
                    originalArticle = originalArticleDoc.toObject();
    
                    const query = {
                        originalArticle: originalArticle._id,
                        langCode: lang,
                        archived: false,
                    }
                    if (signLang) {
                        query.signLangCode = lang;
                        query.signLang = true;
                    } else {
                        query.langCode = lang;
                    }
                    if (langName) {
                        query.langName = langName;
                    }
                    if (tts) {
                        query.tts = true;
                    } else {
                        query.tts = false;
                    }
                    return this.find(query)
                })
                .then((articleDoc) => {
                    if (articleDoc && articleDoc.length > 0) return resolve({ article: articleDoc[0].toObject(), originalArticle });
                    this.cloneArticle(articleId)
                        .then((clonedArticleDoc) => {
                            clonedArticle = clonedArticleDoc;
                            if (clonedArticle.toObject) {
                                clonedArticle = clonedArticle.toObject();
                            }
                            clonedArticle.slides.forEach(slide => {
                                slide.content.forEach((subslide) => {
                                    if (subslide.speakerProfile && subslide.speakerProfile.speakerNumber === -1) {
                                        console.log('')
                                    } else {
                                        subslide.audio = '';
                                    }
                                    // For TTS translations make the audio speed 0.8
                                    if (tts) {
                                        subslide.audioSpeed = 0.80;
                                    }
                                })
                            });
                            const newArticleUpdate = { articleType: 'translation', langName, slides: clonedArticle.slides, archived: false };
                            if (signLang) {
                                newArticleUpdate.signLang = true;
                                newArticleUpdate.langName = ''
                                // newArticleUpdate.stage = 'signlanguage_translation';
                                // clonedArticle.stage = 'signlanguage_translation';
                                clonedArticle.signLang = true;
                                clonedArticle.langName = '';
                            } else {
                                newArticleUpdate.stage = 'text_translation';
                                clonedArticle.stage = 'text_translation';
                            }
                            if (createdBy) {
                                clonedArticle.createdBy = createdBy; 
                                newArticleUpdate.createdBy = createdBy;
                            }
                            clonedArticle.langCode = lang
                            newArticleUpdate.langCode = lang;
                            if (tts) {
                                newArticleUpdate.tts = true;
                            }
                            return this.update({ _id: clonedArticle._id }, newArticleUpdate);
                        })
                        .then(() => {
                            return new Promise((resolve, reject) => {
                                // if ()
                                clonedArticle.langCode = lang;
                                if (tts) {
                                    clonedArticle.tts = true;
                                }
                                if (!clonedArticle.signLang && clonedArticle.langCode !== originalArticle.langCode && originalArticle.langCode.indexOf(clonedArticle.langCode) !== 0) {
                                    return resolve(clonedArticle);
                                } else {
                                    this.update({ _id: clonedArticle._id }, { translationProgress: 100 })
                                        .then(() => {
                                            clonedArticle.translationProgress = 100;
                                            return resolve(clonedArticle);
                                        })
                                        .catch(reject)
                                }
                            })
                        })
                        .then((article) => {
                            console.log('Created Article');
                            return resolve({ article: this.cleanArticleSilentAndBackgroundMusicSlides(article), originalArticle, created: true });
                        })
                })
                .catch(err => {
                    return reject(err);
                })
        })
    }
}



module.exports = (API_ROOT) => new ArticleService(API_ROOT);