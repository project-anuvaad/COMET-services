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

    const inviteUserToTranslate = ({ from, to, organizationName, videoTitle, articleId, fromLang, toLang, toLangCode, extraContent, inviteToken, organizationId }) => {
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

    const inviteUserToReview = ({ from, to, organizationName, videoTitle, videoId, inviteToken, organizationId }) => {
        return new Promise((resolve, reject) => {
            const subject = `${organizationName}: Invitation to proofread a video (${videoTitle})`

            const renderData = {
                title: 'VideoWiki Invitation To reviw Email',
                content: `"${from.email}" from "${organizationName}" invited you to review the video "${videoTitle}"`,
                buttonTitle: `Go to video`,
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert/v2/${videoId}`)}`,
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
                acceptURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert/v2/${videoId}`)}`,
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
                resetPasswordUrl: `${FRONTEND_HOST_PROTOCOL}://www.${FRONTEND_HOST_NAME}/rp?rc=${resetCode}&email=${to.email}`,
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
                targetURL: `${FRONTEND_HOST_PROTOCOL}://${organizationName.replace(/\s/g, '-')}.${FRONTEND_HOST_NAME}/lr?t=${inviteToken}&o=${organizationId}&redirectTo=${encodeURIComponent(`/convert/v2/${videoId}`)}`,
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
    return {
        inviteUserToOrganization,
        inviteUserToTranslate,
        inviteUserToReview,
        inviteUserToVerifyVideo,
        inviteUserToVerifyTranslation,
        notifyUserReviewMarkedDone,
        resetUserPassord,
        sendVideoContributionUploadedMessage,
    }
}