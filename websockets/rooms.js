module.exports = {
    getOrganizationRoom: orgId => `ORGANIZATION/${orgId}`,
    getAITranscribeFinishRoom: (articleId) => `AI_TRANSCRIBE_FINISH/${articleId}`,
}