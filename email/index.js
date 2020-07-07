const path = require('path')
const ejs = require('ejs');

module.exports = ({ EMAIL_SERVICE_API_ROOT, FRONTEND_HOST_NAME, FRONTEND_HOST_PROTOCOL, VIDEOWIKI_WHATSAPP_NUMBER }) => {
    const emailVendor = require('./vendor')(EMAIL_SERVICE_API_ROOT);

    const inviteUserToOrganization = ({ from, to, organization, inviteToken }) => {
        return new Promise((resolve, reject) => {
            const renderData = {
                acceptURL: `${FRONTEND_HOST_PROTOCOL}://${organization.name.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/invitations/${organization._id}?s=accepted&t=${inviteToken}&email=${to.email}`,
                organizationName: organization.name,
                fromUser: from.email,
                toUser: to.email,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'organization_user_invite_email.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject: `Invitation to join Videowiki with ${organization.name}`,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const inviteUserToLeadTranslation = ({ from, to, organizationName, videoTitle, articleId, fromLang, toLang, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {

            const subject = `${organizationName}: Invitation to lead a translation for the video (${videoTitle})`

            const targetURL = `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/translation/article/${articleId}`)}`;

            const renderData = {
                title: 'VideoWiki Invitation To Lead Translation',
                content: `"${from.email}" from "${organizationName}" assigned you to lead the translation of ${videoTitle} from ${fromLang} to ${toLang}.`,
                note: `This invitation was intended for "${to.email}". If you were not expecting this invitation, you can ignore this email.`,
                targetURL,
                extraContent: '',
                buttonTitle: 'Go to translation'
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const inviteUserToTranslateText = ({ from, to, organizationName, videoTitle, articleId, fromLang, toLang, whatsappUrl, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {

            const subject = `${organizationName}: Invitation to translate a video (${videoTitle})`

            const acceptURL = `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/invitations/translateText?t=${inviteToken}&o=${organizationId}&aid=${articleId}&s=accepted&email=${to.email}`

            const declineURL = `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/invitations/translateText?t=${inviteToken}&o=${organizationId}&aid=${articleId}&s=declined&email=${to.email}`
            const renderData = {
                title: 'VideoWiki Invitation To Translate',
                content: `"${from.email}" from "${organizationName}" invited you to translate the video's text "${videoTitle}" from ${fromLang} to ${toLang}.`,
                note: `This invitation was intended for "${to.email}". If you were not expecting this invitation, you can ignore this email.`,
                acceptURL,
                declineURL,
                whatsappUrl,
                whatsappButtonTitle: 'Translate Text on WhatsApp',
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'accept_decline.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const inviteUserToTranslate = ({ from, to, organizationName, videoTitle, articleId, fromLang, toLang, whatsappUrl, extraContent, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {

            const subject = `${organizationName}: Invitation to translate a video (${videoTitle})`

            const acceptURL = `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/invitations/translate?t=${inviteToken}&o=${organizationId}&aid=${articleId}&s=accepted&email=${to.email}`

            const declineURL = `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/invitations/translate?t=${inviteToken}&o=${organizationId}&aid=${articleId}&s=declined&email=${to.email}`
            const renderData = {
                title: 'VideoWiki Invitation To Translate',
                content: `"${from.email}" from "${organizationName}" invited you to translate the video "${videoTitle}" from ${fromLang} to ${toLang}.`,
                note: `This invitation was intended for "${to.email}". If you were not expecting this invitation, you can ignore this email.`,
                acceptURL,
                declineURL,
                whatsappUrl,
                whatsappButtonTitle: 'Translate on WhatsApp',
                extraContent,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'accept_decline.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const inviteUserToVerifyTranslation = ({ from, to, organizationName, videoTitle, articleId, fromLang, toLang, toLangCode, extraContent, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {

            const subject = `${organizationName}: Invitation to verify a translation for video (${videoTitle})`

            const targetURL = `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/translation/article/${articleId}`)}`;

            const renderData = {
                title: 'VideoWiki Invitation To Verify',
                content: `"${from.email}" from "${organizationName}" assigned you to verify the translation of ${videoTitle} from ${fromLang} to ${toLang}.`,
                note: `This invitation was intended for "${to.email}". If you were not expecting this invitation, you can ignore this email.`,
                targetURL,
                extraContent,
                buttonTitle: 'Go to translation'
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const inviteUserToReview = ({ from, to, organizationName, videoTitle, videoId, whatsappUrl, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: Invitation to proofread a video (${videoTitle})`

            const renderData = {
                title: 'VideoWiki Invitation To Transcribe Email',
                content: `"${from.email}" from "${organizationName}" invited you to Transcribe the video "${videoTitle}"`,
                buttonTitle: `Go to video`,
                whatsappUrl,
                whatsappButtonTitle: 'Transcribe on WhatsApp',
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert?video=${videoId}`)}`,
                note: `This invitation was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const inviteUserToVerifyVideo = ({ from, to, organizationName, videoTitle, videoId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: Invitation to verify a video (${videoTitle})`

            const renderData = {
                acceptURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert?video=${videoId}`)}`,
                organizationName,
                fromUser: from.email,
                toUser: to.email,
                videoTitle,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'review_verify_invite.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const resetUserPassord = ({ to, resetCode }) => {
        return new Promise((resolve, reject) => {
            const subject = `Videowiki: Reset Password`

            const renderData = {
                resetPasswordUrl: `${FRONTEND_HOST_PROTOCOL}://${FRONTEND_HOST_NAME}/rp?rc=${resetCode}&email=${to.email}`,
                userName: `${to.firstname} ${to.lastname}`,
                userEmail: to.email,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'reset_password.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const notifyUserReviewMarkedDone = ({ from, to, organizationName, videoTitle, videoId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) review was marked as done`

            const renderData = {
                title: 'VideoWiki: Review verify',
                content: `"${from.email}" from "${organizationName}" marked the video "${videoTitle}" as done and ready to be verified`,
                buttonTitle: `Go to video`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert?video=${videoId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }
      const notifyUserVideoProofreadingReady = ({ to, organizationName, videoTitle, videoId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) is now ready for proofreading`

            const renderData = {
                title: 'VideoWiki: Video ready for proofreading',
                content: `${organizationName}: the video (${videoTitle}) is now ready for proofreading`,
                buttonTitle: `Go to video`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert?video=${videoId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const notifyUserAITranscriptionFinish = ({ to, organizationName, videoTitle, videoId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) AI Transcription is finished`

            const renderData = {
                title: 'VideoWiki: Video AI Transcription finished',
                content: `${organizationName}: the video (${videoTitle}) AI Transcription is finished`,
                buttonTitle: `Go to video`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert?video=${videoId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const sendVideoContributionUploadedMessage = ({ to, content }) => {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from: 'Videowiki <help@videowiki.org>',
                to,
                subject: 'New video tutorial contribution uploaded',
                text: content,
            };

            emailVendor.send(mailOptions, function (error, body) {
                console.log(error, body);
                if (error) return reject(error);
                return resolve(body);
            })
        })
    }

    const notifyUserSignlanguageTranslationStageDone = ({ to, organizationName, videoTitle, articleId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) sign language translation is completed`

            const renderData = {
                title: 'VideoWiki: Sign language Translation completed',
                content: `${organizationName}: the video (${videoTitle}) sign language translation is completed`,
                extraContent: 'Start Reviewing the translation to approve it by clicking on the button below',
                buttonTitle: `Go to translation`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/translation/article/${articleId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const notifyUserTextTranslationStageDone = ({ to, organizationName, videoTitle, articleId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) text translation is completed`

            const renderData = {
                title: 'VideoWiki: Text Translation completed',
                content: `${organizationName}: the video (${videoTitle}) text translation is completed`,
                extraContent: 'Start Reviewing the translation to approve it by clicking on the button below',
                buttonTitle: `Go to translation`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/translation/article/${articleId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }
    
    const notifyUserVoiceoverTranslationStageReady = ({ to, organizationName, videoTitle, articleId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) text translation is completed`

            const renderData = {
                title: 'VideoWiki: Text Translation completed',
                content: `${organizationName}: the video (${videoTitle}) text translation is completed`,
                extraContent: 'Start adding voice over to it by clicking on the button below',
                buttonTitle: `Go to translation`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/translation/article/${articleId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const notifyUserVoiceoverTranslationStageDone = ({ to, organizationName, videoTitle, articleId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: the video (${videoTitle}) Voiceover translation is completed`

            const renderData = {
                title: 'VideoWiki: Voiceover Translation completed',
                content: `${organizationName}: the video (${videoTitle}) Voiceover translation is completed`,
                extraContent: 'Start Reviewing the translation to approve it by clicking on the button below',
                buttonTitle: `Go to translation`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/translation/article/${articleId}`)}`,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }

    const sendBulkExportTranslationsZipFile = ({ to, organizationName, zipUrl }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: Bulk export is completed and ready for download`

            const renderData = {
                title: 'VideoWiki: Bulk export is completed and ready for download',
                content: `${organizationName}: Bulk export is completed and ready for download`,
                buttonTitle: `Download Videos Zip file`,
                targetURL: zipUrl,
                note: `This email was intended for ${to.email}. If you were not expecting this invitation, you can ignore this email.`,
            }
            ejs.renderFile(path.join(__dirname, 'templates', 'single_action.ejs'), renderData, (err, htmlToSend) => {
                if (err) return reject(err);
                // setup e-mail data, even with unicode symbols
                const mailOptions = {
                    from: 'Videowiki <help@videowiki.org>',
                    to: to.email,
                    subject,
                    html: htmlToSend
                };

                emailVendor.send(mailOptions, function (error, body) {
                    console.log(error, body);
                    if (err) return reject(err);
                    return resolve(body);
                })
            })
        })
    }
    
    return {
        inviteUserToOrganization,
        inviteUserToTranslateText,
        inviteUserToTranslate,
        inviteUserToReview,
        inviteUserToVerifyVideo,
        inviteUserToVerifyTranslation,
        notifyUserReviewMarkedDone,
        resetUserPassord,
        sendVideoContributionUploadedMessage,
        notifyUserVideoProofreadingReady,
        notifyUserAITranscriptionFinish,
        notifyUserSignlanguageTranslationStageDone,
        notifyUserTextTranslationStageDone,
        notifyUserVoiceoverTranslationStageReady,
        notifyUserVoiceoverTranslationStageDone,
        sendBulkExportTranslationsZipFile,
        inviteUserToLeadTranslation,
    }
}