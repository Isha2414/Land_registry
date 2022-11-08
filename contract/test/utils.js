async function shouldRevert(promise) {
    try {
        await promise;
        assert(true);
    }
    catch (error) {
        return;
    }
    assert(false, "The contract did not revert");
    
}
    
module.exports = {
    shouldRevert,
};