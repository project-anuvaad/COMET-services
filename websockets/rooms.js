module.exports = {
    getOrganizationRoom: orgId => `ORGANIZATION/${orgId}`,
    getAITranscribeFinishRoom: (videoId) => `AI_TRANSCRIBE_FINISH/${videoId}`,
}